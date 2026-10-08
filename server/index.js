import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { q, tx, init } from './db.js';
import { seed } from './seed.js';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const STATUSES = ['pending', 'preparing', 'delivered', 'cancelled'];
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);
const requireAdmin = (req, res, next) => {
  try { jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET); next(); }
  catch { res.status(401).json({ error: 'Please sign in again' }); }
};

// ---- Auth
app.post('/api/admin/login', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong password' });
  res.json({ token: jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '12h' }) });
});

// ---- Menu (public read, admin write)
app.get('/api/menu', wrap(async (req, res) => {
  const { rows } = await q('SELECT * FROM menu_items ORDER BY category, name');
  res.json(rows);
}));

app.post('/api/menu', requireAdmin, wrap(async (req, res) => {
  const { name, category, description = '', price, image_url = '' } = req.body;
  if (!name?.trim() || !category?.trim() || !(Number(price) >= 0) || price === '') return res.status(400).json({ error: 'Name, category and price are required' });
  const { rows } = await q(
    'INSERT INTO menu_items (name, category, description, price, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name.trim(), category.trim(), description, price, image_url]);
  res.status(201).json(rows[0]);
}));

app.patch('/api/menu/:id', requireAdmin, wrap(async (req, res) => {
  const { name, category, description, price, image_url, available } = req.body;
  const { rows } = await q(
    `UPDATE menu_items SET name=COALESCE($2,name), category=COALESCE($3,category), description=COALESCE($4,description),
     price=COALESCE($5,price), image_url=COALESCE($6,image_url), available=COALESCE($7,available) WHERE id=$1 RETURNING *`,
    [req.params.id, name, category, description, price, image_url, available]);
  rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Item not found' });
}));

app.delete('/api/menu/:id', requireAdmin, wrap(async (req, res) => {
  await q('DELETE FROM menu_items WHERE id=$1', [req.params.id]);
  res.status(204).end();
}));

// ---- Orders
app.post('/api/orders', wrap(async (req, res) => {
  const { customer_name, phone, order_type = 'delivery', payment_method = 'card', items } = req.body;
  if (!customer_name?.trim() || !phone?.trim() || !Array.isArray(items) || !items.length)
    return res.status(400).json({ error: 'Name, phone and at least one item are required' });

  // Prices always come from the database, never from the client
  const { rows: menu } = await q('SELECT id, name, price FROM menu_items WHERE id = ANY($1) AND available', [items.map((i) => i.id)]);
  const lines = items.map((i) => {
    const m = menu.find((x) => x.id === i.id);
    return m && { ...m, qty: Math.min(20, Math.max(1, parseInt(i.qty) || 1)) };
  });
  if (lines.some((l) => !l)) return res.status(400).json({ error: 'Some items are no longer available' });

  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  // Demo: card/transfer are marked paid immediately. Swap in Paystack/Flutterwave here for real payments.
  const paymentStatus = payment_method === 'cash' ? 'pending' : 'paid';

  const order = await tx(async (c) => {
    const { rows: [o] } = await c.query(
      `INSERT INTO orders (customer_name, phone, order_type, total, payment_method, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, total`,
      [customer_name.trim(), phone.trim(), order_type, total, payment_method, paymentStatus]);
    await c.query(
      `INSERT INTO order_items (order_id, menu_item_id, name, qty, price)
       SELECT $1, * FROM unnest($2::int[], $3::text[], $4::int[], $5::numeric[])`,
      [o.id, lines.map((l) => l.id), lines.map((l) => l.name), lines.map((l) => l.qty), lines.map((l) => l.price)]);
    return o;
  });
  res.status(201).json(order);
}));

app.get('/api/orders', requireAdmin, wrap(async (req, res) => {
  const { rows } = await q(
    `SELECT o.*, (SELECT json_agg(json_build_object('name', name, 'qty', qty)) FROM order_items WHERE order_id = o.id) AS items
     FROM orders o ORDER BY created_at DESC LIMIT 100`);
  res.json(rows);
}));

app.patch('/api/orders/:id', requireAdmin, wrap(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const { rows } = await q(
    `UPDATE orders SET status=$2::text,
     payment_status = CASE WHEN $2::text='delivered' AND payment_status='pending' THEN 'paid' ELSE payment_status END
     WHERE id=$1 RETURNING *`, [req.params.id, status]);
  rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Order not found' });
}));

// ---- Dashboard stats. range=day: last 30 days + today's items | range=month: last 12 months + this month's items
app.get('/api/stats', requireAdmin, wrap(async (req, res) => {
  const monthly = req.query.range === 'month';
  const since = monthly ? "date_trunc('month', now())" : 'CURRENT_DATE';
  const [summary, series, top, payments] = await Promise.all([
    q(`SELECT
        COALESCE(SUM(total) FILTER (WHERE payment_status='paid' AND created_at >= CURRENT_DATE),0) AS revenue_today,
        COALESCE(SUM(total) FILTER (WHERE payment_status='paid' AND created_at >= date_trunc('month', now())),0) AS revenue_month,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS orders_today,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now())) AS orders_month,
        COUNT(*) FILTER (WHERE status IN ('pending','preparing')) AS open_orders,
        COALESCE(SUM(total) FILTER (WHERE payment_status='pending' AND status<>'cancelled'),0) AS unpaid
       FROM orders`),
    q(monthly
      ? `SELECT to_char(d,'Mon YY') AS label, COALESCE(SUM(o.total),0) AS revenue, COUNT(o.id) AS orders
         FROM generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') d
         LEFT JOIN orders o ON date_trunc('month', o.created_at) = d AND o.payment_status='paid' GROUP BY d ORDER BY d`
      : `SELECT to_char(d,'DD Mon') AS label, COALESCE(SUM(o.total),0) AS revenue, COUNT(o.id) AS orders
         FROM generate_series(CURRENT_DATE - 29, CURRENT_DATE, interval '1 day') d
         LEFT JOIN orders o ON o.created_at::date = d::date AND o.payment_status='paid' GROUP BY d ORDER BY d`),
    q(`SELECT oi.name, SUM(oi.qty) AS qty, SUM(oi.qty * oi.price) AS revenue
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       WHERE o.created_at >= ${since} AND o.status <> 'cancelled' GROUP BY oi.name ORDER BY qty DESC LIMIT 6`),
    q(`SELECT payment_method AS method, COUNT(*) AS orders, COALESCE(SUM(total),0) AS amount
       FROM orders WHERE created_at >= ${since} AND payment_status='paid' GROUP BY payment_method ORDER BY amount DESC`),
  ]);
  res.json({ summary: summary.rows[0], series: series.rows, top: top.rows, payments: payments.rows });
}));

// ---- Serve the built React app in production
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
app.use(express.static(dist));
app.get('*', (req, res, next) => (req.path.startsWith('/api') ? next() : res.sendFile(path.join(dist, 'index.html'))));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Something went wrong' }); });

const port = process.env.PORT || 4000;
init().then(() => seed()).then(() => app.listen(port, () => console.log(`Server running on :${port}`)))
  .catch((e) => { console.error('Startup failed:', e.message); process.exit(1); });
