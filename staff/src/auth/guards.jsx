import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './context.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

/* These guards decide what to SHOW. The API enforces the same rules on
   every request, so bypassing them in the browser reveals nothing. */

/* Signed in (a required password change is allowed through). */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <LoadingScreen />;
  if (status !== 'signedIn') {
    const next = location.pathname + location.search;
    return <Navigate to={next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`} replace />;
  }
  return <Outlet />;
}

/* Sends people who must change their password to that page first. */
export function RequirePasswordCurrent() {
  const { me } = useAuth();
  if (me?.user.mustChangePassword) return <Navigate to="/change-password" replace />;
  return <Outlet />;
}

export function RequirePermission({ permission, children }) {
  const { can } = useAuth();
  if (!can(permission)) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="page-title">No access</h1>
          <p className="section-lead">Your role doesn’t include this area. If you need it, ask an administrator.</p>
        </div>
      </section>
    );
  }
  return children;
}
