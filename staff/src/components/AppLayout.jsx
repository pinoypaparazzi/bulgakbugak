import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '../auth/context.js';
import { MODULES } from '../lib/modules.js';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';

const YEAR = new Date().getFullYear();

/* Header (logo, role-aware navigation, account menu), page content, footer. */
export default function AppLayout() {
  const { me, can, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const nav = [{ to: '/', label: 'Dashboard', end: true }].concat(
    MODULES.filter((m) => m.available && can(m.permission)).map((m) => ({ to: m.to, label: m.title })),
  );

  // Close the account menu on outside click or Escape (menu links close it themselves).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [menuOpen]);

  const signOut = async () => {
    setSigningOut(true);
    await logout();
  };

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header is-scrolled">
        <div className="container header-inner staff-header">
          <Link to="/" className="header-logo header-brand" aria-label="Staff portal dashboard">
            <Logo height={48} eager alt="AT YOUR SERVICE" />
            <span className="staff-tag">Staff</span>
          </Link>

          <div className="account" ref={menuRef}>
            <button
              ref={buttonRef}
              type="button"
              className="account-button"
              aria-expanded={menuOpen}
              aria-controls="account-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="account-avatar" aria-hidden="true">{me.user.displayName.slice(0, 1).toUpperCase()}</span>
              <span className="account-text">
                <span className="account-name">{me.user.displayName}</span>
                <span className="account-role">{me.roleLabel}</span>
              </span>
              <span className="sr-only">: account menu</span>
            </button>
            {menuOpen && (
              <div className="account-menu" id="account-menu">
                <p className="account-menu-who">
                  Signed in as <strong>{me.user.username}</strong>
                  <br />
                  {me.roleLabel}
                </p>
                <Link to="/change-password" className="account-menu-item" onClick={() => setMenuOpen(false)}>
                  <Icon name="key" size={18} /> Change password
                </Link>
                <button type="button" className="account-menu-item" onClick={signOut} disabled={signingOut}>
                  <Icon name="arrow" size={18} /> {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
        <nav className="staff-nav" aria-label="Staff portal">
          <ul className="container">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="staff-footer">
        <div className="container footer-bottom">
          <p>© {YEAR} AT YOUR SERVICE · Staff portal</p>
          <p>For authorized staff only</p>
        </div>
      </footer>
    </div>
  );
}
