const BASE = import.meta.env.VITE_API_URL || '';

export const money = (n) => '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 });
export const isAuthed = () => !!sessionStorage.getItem('token');
export const signOut = () => sessionStorage.removeItem('token');

export async function api(path, { method = 'GET', body, auth } = {}) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(auth && token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) signOut();
    throw new Error(data.error || 'Request failed');
  }
  return data;
}
