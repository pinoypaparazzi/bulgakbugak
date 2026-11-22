import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, onUnauthorized } from '../lib/api.js';
import { AuthContext } from './context.js';

/* The page-load session check is shared, so React running the effect twice
   (StrictMode in development) can't turn "your session ended" into a second,
   plain "not signed in" answer. */
let initialCheck = null;
function checkInitialSession() {
  initialCheck ??= api('/auth/me').finally(() => {
    setTimeout(() => {
      initialCheck = null;
    }, 0);
  });
  return initialCheck;
}

/* Holds who is signed in, as reported by GET /api/staff/auth/me.
   `me` = { user, roleLabel, permissions, assignableRoles }. */
export default function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', me: null, notice: null });

  const refresh = useCallback(async () => {
    try {
      const me = await api('/auth/me');
      setState({ status: 'signedIn', me, notice: null });
      return me;
    } catch {
      setState((s) => ({ status: 'signedOut', me: null, notice: s.notice }));
      return null;
    }
  }, []);

  // On page load: ask the server whether this browser already has a session.
  useEffect(() => {
    let active = true;
    checkInitialSession()
      .then((me) => active && setState({ status: 'signedIn', me, notice: null }))
      .catch((err) =>
        active &&
        setState({
          status: 'signedOut',
          me: null,
          // The browser had a session, but it has ended (expired, signed out
          // elsewhere, password/role changed or account deactivated).
          notice: err.code === 'session_expired' ? 'Your session has ended. Please sign in again.' : null,
        }),
      );
    return () => {
      active = false;
    };
  }, []);

  // Any request that comes back 401 means the session has ended
  // (expired, signed out elsewhere, password/role changed, deactivated).
  useEffect(
    () =>
      onUnauthorized((err) =>
        setState((s) =>
          s.status === 'signedIn'
            ? {
                status: 'signedOut',
                me: null,
                notice: err.code === 'session_expired' ? 'Your session has ended. Please sign in again.' : 'Please sign in to continue.',
              }
            : s,
        ),
      ),
    [],
  );

  const login = useCallback(async (username, password) => {
    const me = await api('/auth/login', { method: 'POST', body: { username, password } });
    setState({ status: 'signedIn', me, notice: null });
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      setState({ status: 'signedOut', me: null, notice: 'You have signed out.' });
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const me = await api('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });
    setState({ status: 'signedIn', me, notice: null });
    return me;
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      changePassword,
      refresh,
      can: (permission) => Boolean(state.me?.permissions.includes(permission)),
    }),
    [state, login, logout, changePassword, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
