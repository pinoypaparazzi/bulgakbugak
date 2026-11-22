/* =========================================================
   STAFF API CLIENT
   Talks to the Express API at /api/staff on the same origin (the Vite
   dev server forwards /api to the API locally). The session lives in an
   httpOnly cookie the browser handles automatically; this file never
   sees or stores any token or password beyond the single request.
   ========================================================= */

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const listeners = new Set();

/* Lets the sign-in state react when the server says the session has ended. */
export function onUnauthorized(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const FALLBACK = {
  0: 'Can’t reach the server. Check your connection and try again.',
  401: 'Please sign in.',
  403: 'You don’t have permission to do this.',
  404: 'Not found.',
  429: 'Too many attempts. Please wait and try again.',
};

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  // Required by the server on every change request (CSRF protection).
  if (method !== 'GET') headers['X-AYS-CSRF'] = '1';
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`/api/staff${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'network', FALLBACK[0]);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new ApiError(res.status, data?.code || 'error', data?.error || FALLBACK[res.status] || 'Something went wrong. Please try again.');
    if (res.status === 401 && path !== '/auth/login') listeners.forEach((fn) => fn(err));
    throw err;
  }
  return data;
}
