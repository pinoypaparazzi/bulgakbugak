import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { SITE, CONTACT } from '../data/site.js';
import { SERVICES } from '../data/services.js';

const BUILD_YEAR = new Date().getFullYear();

const PAGE_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#coverage', label: 'Service area' },
  { href: '#about', label: 'About us' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
  { href: '#book', label: 'Book a service' },
];

export default function Footer() {
  // Year is set at build time, then refreshed in the browser so it never goes stale.
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="footer-logo"><Logo height={110} alt="AT YOUR SERVICE logo" /></span>
          <p className="footer-name">{SITE.name}</p>
          <p>
            Personal assistance, errands and service coordination for individuals, families and businesses.
          </p>
          <p className="footer-pilot">{SITE.pilotNotice}. Contact us to confirm availability.</p>
        </div>

        <nav aria-label="Footer">
          <p className="footer-h">Explore</p>
          <ul>
            {PAGE_LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </nav>

        <nav aria-label="Services" className="footer-services">
          <p className="footer-h">Services</p>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}><a href={`#service-${s.slug}`}>{s.name}</a></li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="footer-h">Get in touch</p>
          <ul className="footer-contact">
            <li>Mobile / Viber: <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a></li>
            <li>Email: <a href={CONTACT.emailHref}>{CONTACT.email}</a></li>
            <li>
              Facebook:{' '}
              <a href={CONTACT.facebookHref} target="_blank" rel="noopener noreferrer">
                {CONTACT.facebookDisplay}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>Website: <a href={CONTACT.websiteHref}>{CONTACT.websiteDisplay}</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {year} {SITE.name}. All rights reserved.</p>
        <p>Serving Quezon City, Metro Manila, Philippines</p>
      </div>
    </footer>
  );
}
