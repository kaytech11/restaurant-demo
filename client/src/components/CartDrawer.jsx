import { useState } from 'react';
import { api, money } from '../lib/api.js';

export default function CartDrawer({ lines, total, change, onClose, onPlaced }) {
  const [form, setForm] = useState({ customer_name: '', phone: '', order_type: 'delivery', payment_method: 'card' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const order = await api('/orders', { method: 'POST', body: { ...form, items: lines.map((l) => ({ id: l.id, qty: l.qty })) } });
      onPlaced(order);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your order</h2>
          <button className="text-sm text-brand-600 underline" onClick={onClose}>Close</button>
        </div>

        {!lines.length ? (
          <p className="mt-6 text-stone-500">Your order is empty. Add a dish to get started.</p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <ul className="divide-y divide-stone-200">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span className="flex-1">{l.name}</span>
                  <span className="flex items-center gap-2">
                    <button type="button" className="h-6 w-6 rounded-full border border-stone-300" onClick={() => change(l.id, -1)}>−</button>
                    {l.qty}
                    <button type="button" className="h-6 w-6 rounded-full border border-stone-300" onClick={() => change(l.id, 1)}>+</button>
                  </span>
                  <span className="w-20 text-right">{money(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between py-2 text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>

            <input required className="input" placeholder="Your name" value={form.customer_name} onChange={set('customer_name')} />
            <input required className="input" placeholder="Phone number" value={form.phone} onChange={set('phone')} />
            <select className="input" value={form.order_type} onChange={set('order_type')}>
              <option value="delivery">Delivery</option><option value="pickup">Pickup</option><option value="dine-in">Dine in</option>
            </select>
            <select className="input" value={form.payment_method} onChange={set('payment_method')}>
              <option value="card">Pay by card</option><option value="transfer">Pay by bank transfer</option><option value="cash">Pay with cash</option>
            </select>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Placing order…' : `Place order · ${money(total)}`}</button>
            <p className="text-center text-xs text-stone-400">Demo checkout: no real payment is taken.</p>
          </form>
        )}
      </aside>
    </div>
  );
}
