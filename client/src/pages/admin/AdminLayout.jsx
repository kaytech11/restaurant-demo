import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/api.js';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/menu', label: 'Menu' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const link = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`;

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-stone-200 bg-white p-4 md:min-h-screen md:w-56 md:border-b-0 md:border-r">
        <p className="mb-4 text-lg font-extrabold text-brand-600">Mama's Kitchen</p>
        <nav className="flex gap-2 md:flex-col">
          {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={link}>{l.label}</NavLink>)}
        </nav>
        <div className="mt-4 flex gap-3 text-sm md:mt-8 md:flex-col md:gap-2">
          <NavLink to="/" className="text-stone-500 hover:text-brand-600">View menu</NavLink>
          <button className="text-left text-stone-500 hover:text-brand-600" onClick={() => { signOut(); navigate('/admin/login'); }}>Sign out</button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8"><Outlet /></main>
    </div>
  );
}
