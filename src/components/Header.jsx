import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { NAV } from '../data/site.js';
import { bookLinkProps } from '../lib/bookLink.js';

export default function Header({ onBook }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu with Escape, and if the screen becomes wide.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 900px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`}>
      <div className="container header-inner">
        <a
          href="/"
          className="header-logo"
          aria-label="AT YOUR SERVICE home"
          onClick={(e) => {
            close();
            if (window.location.pathname === '/') {
              e.preventDefault();
              const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
              history.replaceState(null, '', '/');
            }
          }}
        >
          <Logo height={56} eager />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={26} />
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>

        <nav id="primary-nav" className="primary-nav" aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={close}>{item.label}</a>
              </li>
            ))}
            <li>
              <a
                className="btn btn-gold btn-sm nav-book"
                {...bookLinkProps((s) => { close(); onBook(s); })}
              >
                Book a Service
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
