// 

import { Link } from 'react-router-dom';

export default function Navbar({ count, onCart }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-4">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-extrabold text-brand-600 sm:text-xl"
        >
          Mama's Kitchen
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/admin"
            className="rounded-lg px-2 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-100 hover:text-brand-600 sm:px-3 sm:text-sm"
          >
            Staff login
          </Link>

          <button
            onClick={onCart}
            className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95 sm:px-4 sm:text-sm"
          >
            Orders ({count})
          </button>
        </nav>
      </div>
    </header>
  );
}