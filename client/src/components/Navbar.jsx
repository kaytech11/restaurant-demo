import { Link } from 'react-router-dom';

export default function Navbar({ count, onCart }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-extrabold text-brand-600">Mama's Kitchen</Link>
        <nav className="flex items-center gap-4">
          <Link to="/admin" className="text-sm text-stone-600 hover:text-brand-600">Staff login</Link>
          <button className="btn-primary" onClick={onCart}>Your order for pickup/delivery({count})</button>
        </nav>
      </div>
    </header>
  );
}
