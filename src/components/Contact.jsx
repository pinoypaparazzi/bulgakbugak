import Icon from './Icon.jsx';
import { CONTACT } from '../data/site.js';

const CHANNELS = [
  { icon: 'phone', label: 'Call us', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  {
    icon: 'viber',
    label: 'Viber',
    value: CONTACT.phoneDisplay,
    href: CONTACT.viberHref,
    note: 'Opens Viber if it’s installed. Otherwise, add this number to your Viber contacts.',
  },
  { icon: 'mail', label: 'Email', value: CONTACT.email, href: CONTACT.emailHref },
  { icon: 'facebook', label: 'Facebook Page', value: CONTACT.facebookDisplay, href: CONTACT.facebookHref, external: true },
  { icon: 'globe', label: 'Website', value: CONTACT.websiteDisplay, href: CONTACT.websiteHref },
];

export default function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Talk to us</h2>
          <p className="section-lead">
            Questions before you book? Reach us through any of these channels. We’re happy to help you figure
            out what you need.
          </p>
        </header>
        <ul className="contact-grid">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                className="contact-card"
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="contact-icon"><Icon name={c.icon} size={26} /></span>
                <span className="contact-label">{c.label}</span>
                <span className="contact-value">{c.value}</span>
                {c.external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
              {c.note && <p className="contact-note">{c.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
