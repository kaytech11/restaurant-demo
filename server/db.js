import 'dotenv/config';
import pg from 'pg';

pg.types.setTypeParser(1700, parseFloat); // numeric -> number
pg.types.setTypeParser(20, parseInt);     // bigint (COUNT) -> number

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

export const q = (text, params) => pool.query(text, params);

export async function tx(fn) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const out = await fn(c);
    await c.query('COMMIT');
    return out;
  } catch (e) {
    await c.query('ROLLBACK');
    throw e;
  } finally {
    c.release();
  }
}

export async function init() {
  await q(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT DEFAULT '',
      price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      image_url TEXT DEFAULT '',
      available BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      order_type TEXT NOT NULL DEFAULT 'delivery',
      total NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_method TEXT NOT NULL DEFAULT 'card',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      menu_item_id INT,
      name TEXT NOT NULL,
      qty INT NOT NULL,
      price NUMERIC(10,2) NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at);
    CREATE INDEX IF NOT EXISTS idx_items_order ON order_items (order_id);
  `);
}
