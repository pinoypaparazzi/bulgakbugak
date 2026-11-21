import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { NAV, NAV_CTA } from '../content/site.js';

export default function Header({ path }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu with Escape, or when the screen becomes wide.
  useEffect(() => {
    if (!open) return undefined;
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

  const isCurrent = (href) => (path === href || path.startsWith(href) ? 'page' : undefined);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`}>
      <div className="container header-inner">
        <a href="/" className="header-logo" aria-label="AT YOUR SERVICE home">
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
                <a href={item.href} aria-current={isCurrent(item.href)}>{item.label}</a>
              </li>
            ))}
            <li>
              <a className="btn btn-gold btn-sm nav-book" href={NAV_CTA.href} aria-current={isCurrent(NAV_CTA.href)}>
                {NAV_CTA.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
