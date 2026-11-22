/* Talks to the Express API. Requests go to /api on the same site:
   the Vite dev server (and the pogiako host in production) forwards them,
   so the login cookie stays first-party. */
async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Can’t reach the server. Check your connection and try again.');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const getMe = () => request('/auth/me').then((d) => d.employee);
export const login = (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }).then((d) => d.employee);
export const logout = () => request('/auth/logout', { method: 'POST' });
