import Icon from './Icon.jsx';
import { CONTACT } from '../data/site.js';
import { bookLinkProps } from '../lib/bookLink.js';

export default function FinalCta({ onBook }) {
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <div className="container final-inner">
        <svg className="final-swoosh" viewBox="0 0 800 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 62C220 20 560 14 800 50" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <h2 id="final-title">Whatever You Need a Hand With, Start Here.</h2>
        <p>Tell us what you need, and we’ll help determine the best way forward.</p>
        <div className="final-actions">
          <a className="btn btn-gold btn-lg" {...bookLinkProps(onBook)}>
            Book a Service <Icon name="arrow" size={20} />
          </a>
          <a className="btn btn-outline-light btn-lg" href={CONTACT.phoneHref}>
            <Icon name="phone" size={20} /> Call or Message Us
          </a>
        </div>
        <p className="final-small">
          Call, text or Viber <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> · Email{' '}
          <a href={CONTACT.emailHref}>{CONTACT.email}</a>
        </p>
      </div>
    </section>
  );
}
