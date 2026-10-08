import { useCallback, useEffect, useState } from 'react';
import { api, money } from '../../lib/api.js';
import Badge from '../../components/Badge.jsx';

const STATUSES = ['pending', 'preparing', 'delivered', 'cancelled'];

export default function Orders() {
  const [rows, setRows] = useState([]);
  const load = useCallback(() => api('/orders', { auth: true }).then(setRows).catch(() => {}), []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000); // refresh every 15s so new orders show up
    return () => clearInterval(t);
  }, [load]);

  const setStatus = async (id, status) => {
    await api(`/orders/${id}`, { method: 'PATCH', body: { status }, auth: true });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-stone-200 text-stone-500">
            <tr>{['#', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Time'].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((o) => (
              <tr key={o.id} className="align-top">
                <td className="px-3 py-3">{o.id}</td>
                <td className="px-3 py-3">{o.customer_name}<br /><span className="text-xs text-stone-500">{o.phone} · {o.order_type}</span></td>
                <td className="px-3 py-3">{(o.items || []).map((i) => `${i.qty}× ${i.name}`).join(', ')}</td>
                <td className="px-3 py-3">{money(o.total)}</td>
                <td className="px-3 py-3"><Badge value={o.payment_status} /><br /><span className="text-xs text-stone-500">{o.payment_method}</span></td>
                <td className="px-3 py-3">
                  <select className="input w-auto py-1" value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3 text-xs text-stone-500">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
