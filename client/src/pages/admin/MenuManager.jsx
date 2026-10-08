import { useCallback, useEffect, useState } from 'react';
import { api, money } from '../../lib/api.js';
import { foodImage } from '../../lib/foodImages.js';

const EMPTY = { name: '', category: '', description: '', price: '', image_url: '' };

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => api('/menu').then(setItems), []);
  useEffect(() => { load(); }, [load]);

  const field = (key, placeholder, type = 'text') => (
    <input className="input" type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
  );

  async function save(e) {
    e.preventDefault(); setError('');
    try {
      await api(editing ? `/menu/${editing}` : '/menu', { method: editing ? 'PATCH' : 'POST', body: form, auth: true });
      setForm(EMPTY); setEditing(null); load();
    } catch (err) { setError(err.message); }
  }
  const startEdit = (m) => {
    setEditing(m.id);
    setForm({ name: m.name, category: m.category, description: m.description || '', price: m.price, image_url: m.image_url || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggle = (m) => api(`/menu/${m.id}`, { method: 'PATCH', body: { available: !m.available }, auth: true }).then(load);
  const remove = (m) => confirm(`Delete ${m.name}?`) && api(`/menu/${m.id}`, { method: 'DELETE', auth: true }).then(load);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menu</h1>

      <form onSubmit={save} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {field('name', 'Dish name')}
        {field('category', 'Category (e.g. Mains)')}
        {field('price', 'Price (₦)', 'number')}
        {field('image_url', 'Photo link (optional)')}
        <div className="sm:col-span-2">{field('description', 'Short description')}</div>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
          <button className="btn-primary">{editing ? 'Save changes' : 'Add dish'}</button>
          {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          {error && <span className="text-sm text-red-700">{error}</span>}
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <tbody className="divide-y divide-stone-100">
            {items.map((m) => (
              <tr key={m.id}>
                <td className="w-16 px-3 py-2"><img src={foodImage(m)} alt="" className="h-12 w-12 rounded-lg bg-stone-100 object-cover" /></td>
                <td className="px-3 py-2 font-medium">{m.name}<br /><span className="text-xs font-normal text-stone-500">{m.category}</span></td>
                <td className="px-3 py-2">{money(m.price)}</td>
                <td className="px-3 py-2"><button className="text-brand-600 underline" onClick={() => toggle(m)}>{m.available ? 'Available' : 'Sold out'}</button></td>
                <td className="px-3 py-2 text-right">
                  <button className="mr-3 text-brand-600 underline" onClick={() => startEdit(m)}>Edit</button>
                  <button className="text-red-700 underline" onClick={() => remove(m)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
