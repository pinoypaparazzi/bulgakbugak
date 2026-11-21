import Icon from './Icon.jsx';
import { SITE, CONTACT } from '../data/site.js';
import { bookLinkProps } from '../lib/bookLink.js';

const HELP_CHIPS = [
  { icon: 'cart', label: 'Pabili & groceries', cls: 'chip-a' },
  { icon: 'document', label: 'Document errands', cls: 'chip-b' },
  { icon: 'clock', label: 'Queueing & waiting', cls: 'chip-c' },
  { icon: 'heart', label: 'Senior assistance', cls: 'chip-d' },
];

export default function Hero({ onBook }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <svg className="hero-swoosh" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-40 80C300 20 760 20 1480 70" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M-40 90C420 40 900 40 1480 88" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
      </svg>

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="pill">
            <span className="pill-dot" aria-hidden="true" />
            {SITE.pilotNotice}
          </p>
          <p className="hero-tagline">{SITE.tagline}</p>
          <h1 id="hero-title">Need an Extra Pair of Hands?</h1>
          <p className="hero-lead">
            From everyday errands and personal assistance to business tasks and specialized services,
            {' '}<strong>AT YOUR SERVICE</strong> helps you get things done — without taking on everything yourself.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" {...bookLinkProps(onBook)}>
              Book a Service <Icon name="arrow" size={20} />
            </a>
            <a className="btn btn-outline btn-lg" href="#services">
              Explore Our Services
            </a>
          </div>

          <p className="hero-contact">
            <Icon name="phone" size={18} />
            <span>
              Prefer to talk? Call or Viber{' '}
              <a href={CONTACT.phoneHref} className="link-strong">{CONTACT.phoneDisplay}</a>
            </span>
          </p>

          <ul className="hero-points">
            <li><Icon name="check" size={18} /> Quotation before you commit</li>
            <li><Icon name="check" size={18} /> Expenses disclosed up front</li>
            <li><Icon name="check" size={18} /> For individuals, families &amp; businesses</li>
          </ul>
        </div>

        {/* Decorative illustration — the same information appears in text elsewhere */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hv-ring" />
          <div className="hv-card">
            <div className="hv-card-head">
              <span className="hv-bell"><Icon name="check-badge" size={22} /></span>
              <div>
                <span className="hv-kicker">Your request</span>
                <span className="hv-title">From to-do to done</span>
              </div>
            </div>
            <ol className="hv-steps">
              <li className="done"><span><Icon name="check" size={14} /></span>Tell us what you need</li>
              <li className="done"><span><Icon name="check" size={14} /></span>Receive a quotation</li>
              <li className="active"><span>3</span>Confirm your booking</li>
              <li><span>4</span>Get it done</li>
            </ol>
            <div className="hv-foot">
              <Icon name="pin" size={16} /> Quezon City pilot program
            </div>
          </div>
          {HELP_CHIPS.map((c) => (
            <div key={c.label} className={`hv-chip ${c.cls}`}>
              <span><Icon name={c.icon} size={18} /></span>
              {c.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
