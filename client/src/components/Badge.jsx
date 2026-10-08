const COLORS = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-stone-200 text-stone-600',
};

export default function Badge({ value }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[value] || 'bg-stone-100'}`}>{value}</span>;
}
