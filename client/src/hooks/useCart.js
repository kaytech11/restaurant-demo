import { useMemo, useState } from 'react';

export default function useCart(menu) {
  const [cart, setCart] = useState({}); // menu id -> quantity

  const change = (id, delta) =>
    setCart((c) => {
      const qty = (c[id] || 0) + delta;
      const next = { ...c };
      if (qty > 0) next[id] = qty; else delete next[id];
      return next;
    });

  const lines = useMemo(() => menu.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })), [menu, cart]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);

  return { cart, lines, count, total, change, clear: () => setCart({}) };
}
