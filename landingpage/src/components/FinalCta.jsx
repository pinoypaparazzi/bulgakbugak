import Icon from './Icon.jsx';
import { CONTACT, HOME } from '../content/site.js';

export default function FinalCta({ bookHref = '/book/' }) {
  const c = HOME.finalCta;
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <div className="container final-inner">
        <svg className="final-swoosh" viewBox="0 0 800 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 62C220 20 560 14 800 50" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <h2 id="final-title">{c.title}</h2>
        <p>{c.text}</p>
        <div className="final-actions">
          <a className="btn btn-gold btn-lg" href={bookHref}>Book a Service <Icon name="arrow" size={20} /></a>
          <a className="btn btn-outline-light btn-lg" href="/contact/"><Icon name="chat" size={20} /> Contact Us</a>
        </div>
        <p className="final-small">
          Call or Viber <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> · Email <a href={CONTACT.emailHref}>{CONTACT.email}</a>
        </p>
      </div>
    </section>
  );
}
