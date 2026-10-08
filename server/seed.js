import { q } from './db.js';

const MENU = [
  ['Party Jollof Rice', 'Mains', 'Smoky jollof with fried plantain', 3500],
  ['Grilled Chicken & Rice', 'Mains', 'Half chicken, peppered sauce', 5500],
  ['Egusi Soup & Pounded Yam', 'Mains', 'Assorted meat, spinach', 6000],
  ['Ofada Rice & Ayamase', 'Mains', 'Spicy green pepper stew', 5000],
  ['Beef Suya', 'Starters', 'Yaji-spiced, onions, tomato', 3000],
  ['Peppered Gizzard', 'Starters', 'Slow-cooked, peppered', 2500],
  ['Moi Moi', 'Starters', 'Steamed bean pudding', 1500],
  ['Fried Plantain', 'Sides', 'Ripe, golden', 1200],
  ['Coleslaw', 'Sides', 'Creamy and crisp', 1000],
  ['Chapman', 'Drinks', 'House cocktail, non-alcoholic', 2000],
  ['Zobo', 'Drinks', 'Hibiscus, ginger, pineapple', 1500],
  ['Chilled Water', 'Drinks', '75cl', 500],
  ['Puff Puff', 'Desserts', 'Warm, dusted with sugar', 1500],
  ['Coconut Ice Cream', 'Desserts', 'Two scoops', 2200],
];

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const NAMES = ['Ada', 'Tunde', 'Zainab', 'Chinedu', 'Bola', 'Ife', 'Kemi', 'Musa', 'Ngozi', 'Seyi', 'Amaka', 'Dayo'];

export async function seed(force = false) {
  const { rows } = await q('SELECT COUNT(*)::int AS n FROM menu_items');
  if (rows[0].n > 0 && !force) return;
  await q('TRUNCATE order_items, orders, menu_items RESTART IDENTITY CASCADE');

  const ins = await q(
    `INSERT INTO menu_items (name, category, description, price)
     SELECT * FROM unnest($1::text[], $2::text[], $3::text[], $4::numeric[]) RETURNING id, name, price`,
    [0, 1, 2, 3].map((c) => MENU.map((m) => m[c]))
  );
  const items = ins.rows;

  // 120 days of fake history so the charts look real
  const orders = [];
  const lines = [];
  const now = Date.now();
  const minsToday = Math.max(30, (now % 86400000) / 60000);
  for (let d = 119; d >= 0; d--) {
    const count = Math.round(rnd(4, 10) * (1 + (119 - d) / 200)); // gentle growth
    for (let i = 0; i < count; i++) {
      const ts = d === 0
        ? new Date(now - Math.random() * minsToday * 60000)
        : new Date(now - d * 86400000 - rnd(0, 10) * 3600000);
      const picked = Array.from({ length: Math.ceil(rnd(1, 4)) }, () => ({ ...pick(items), qty: Math.ceil(rnd(0, 3)) }));
      const total = picked.reduce((s, l) => s + l.price * l.qty, 0);
      const method = pick(['card', 'card', 'transfer', 'cash']);
      const recent = d === 0;
      orders.push([pick(NAMES), '0803' + Math.floor(rnd(1000000, 9999999)), pick(['delivery', 'delivery', 'pickup', 'dine-in']),
        total, recent ? pick(['pending', 'preparing', 'delivered']) : 'delivered', method,
        method === 'cash' && recent ? 'pending' : 'paid', ts]);
      lines.push(picked);
    }
  }

  const cols = ['customer_name', 'phone', 'order_type', 'total', 'status', 'payment_method', 'payment_status', 'created_at'];
  const values = orders.map((_, i) => `(${cols.map((__, j) => `$${i * cols.length + j + 1}`).join(',')})`).join(',');
  const res = await q(`INSERT INTO orders (${cols.join(',')}) VALUES ${values} RETURNING id`, orders.flat());

  const oi = [];
  res.rows.forEach((r, i) => lines[i].forEach((l) => oi.push([r.id, l.id, l.name, l.qty, l.price])));
  await q(
    `INSERT INTO order_items (order_id, menu_item_id, name, qty, price)
     SELECT * FROM unnest($1::int[], $2::int[], $3::text[], $4::int[], $5::numeric[])`,
    [0, 1, 2, 3, 4].map((c) => oi.map((r) => r[c]))
  );
  console.log(`Seeded ${items.length} menu items and ${orders.length} orders`);
}
