import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { SITE, CONTACT, FOOTER } from '../content/site.js';
import { publishedServices, publishedSpecialties, serviceUrl } from '../content/services.js';

const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  // Year is set at build time, then refreshed in the browser so it never goes stale.
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="/" className="footer-logo" aria-label="AT YOUR SERVICE home"><Logo height={110} alt="AT YOUR SERVICE logo" /></a>
          <p className="footer-name">{SITE.name}</p>
          <p>{FOOTER.blurb}</p>
          <p className="footer-pilot">{SITE.pilotNotice}. Availability confirmed per request.</p>
        </div>

        <nav aria-label="Footer">
          <p className="footer-h">Explore</p>
          <ul>{FOOTER.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
          <p className="footer-h footer-h-gap">Specialized</p>
          <ul>{publishedSpecialties().map((s) => <li key={s.slug}><a href={serviceUrl(s)}>{s.shortName}</a></li>)}</ul>
        </nav>

        <nav aria-label="Service categories" className="footer-services">
          <p className="footer-h">Service categories</p>
          <ul>{publishedServices().map((s) => <li key={s.slug}><a href={serviceUrl(s)}>{s.name}</a></li>)}</ul>
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
