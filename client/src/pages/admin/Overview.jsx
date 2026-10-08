import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, money } from '../../lib/api.js';
import StatCard from '../../components/StatCard.jsx';

function MiniTable({ title, rows, empty }) {
  return (
    <div className="card p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {rows.length ? (
        <table className="w-full text-sm"><tbody className="divide-y divide-stone-100">
          {rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`py-2 ${i === r.length - 1 ? 'text-right font-medium' : ''}`}>{c}</td>)}</tr>)}
        </tbody></table>
      ) : <p className="text-sm text-stone-500">{empty}</p>}
    </div>
  );
}

export default function Overview() {
  const [range, setRange] = useState('day');
  const [stats, setStats] = useState(null);
  useEffect(() => { api(`/stats?range=${range}`, { auth: true }).then(setStats).catch(() => {}); }, [range]);

  if (!stats) return <p className="text-stone-500">Loading dashboard…</p>;
  const m = stats.summary;
  const when = range === 'day' ? 'today' : 'this month';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Revenue today" value={money(m.revenue_today)} />
        <StatCard label="Revenue this month" value={money(m.revenue_month)} />
        <StatCard label="Orders today" value={m.orders_today} />
        <StatCard label="Orders this month" value={m.orders_month} />
        <StatCard label="Open orders" value={m.open_orders} />
        <StatCard label="Awaiting payment" value={money(m.unpaid)} />
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Revenue, {range === 'day' ? 'last 30 days' : 'last 12 months'}</h2>
          <div className="flex gap-2">
            <button className={range === 'day' ? 'pill-on' : 'pill-off'} onClick={() => setRange('day')}>Daily</button>
            <button className={range === 'month' ? 'pill-on' : 'pill-off'} onClick={() => setRange('month')}>Monthly</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats.series}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} interval="preserveStartEnd" />
            <YAxis fontSize={11} width={50} tickFormatter={(v) => '₦' + v / 1000 + 'k'} />
            <Tooltip formatter={(v) => money(v)} />
            <Bar dataKey="revenue" fill="#1d5c3f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MiniTable title={`Most ordered ${when}`} empty={`No orders yet ${when}.`}
          rows={stats.top.map((t) => [t.name, `${t.qty} sold`, money(t.revenue)])} />
        <MiniTable title={`Payments ${when}`} empty={`No payments yet ${when}.`}
          rows={stats.payments.map((p) => [p.method, `${p.orders} orders`, money(p.amount)])} />
      </div>
    </div>
  );
}
