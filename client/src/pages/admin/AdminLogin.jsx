import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { token } = await api('/admin/login', { method: 'POST', body: { password } });
      sessionStorage.setItem('token', token);
      navigate('/admin');
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-brand-900 px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-6">
        <h1 className="text-2xl font-bold">Staff sign in</h1>
        <input type="password" autoFocus className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full py-2.5">Sign in</button>
        <Link to="/" className="block text-center text-sm text-brand-600 underline">Back to the menu</Link>
      </form>
    </div>
  );
}
