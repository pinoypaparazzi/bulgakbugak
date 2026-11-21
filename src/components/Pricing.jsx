import Icon from './Icon.jsx';
import { PRICING } from '../data/content.js';
import { bookLinkProps } from '../lib/bookLink.js';

/* No fixed rate card yet — this explains how quotations work.
   Edit the wording in src/data/content.js (PRICING). */
export default function Pricing({ onBook }) {
  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="container pricing-grid">
        <div className="pricing-intro">
          <p className="eyebrow">Pricing</p>
          <h2 id="pricing-title">Clear Pricing. No Unpleasant Surprises.</h2>
          <p className="section-lead">
            Every request is different. Tell us what you need, and we’ll review the details and provide a
            quotation before you decide to proceed.
          </p>

          <div className="factors">
            <p className="factors-title">Your quotation depends on</p>
            <ul>
              {PRICING.factors.map((f) => (
                <li key={f.label}><Icon name={f.icon} size={20} />{f.label}</li>
              ))}
            </ul>
          </div>

          <a className="btn btn-primary btn-lg" {...bookLinkProps(onBook)}>
            Request a Quote <Icon name="arrow" size={20} />
          </a>
        </div>

        <div className="pricing-card">
          <h3>What we’ll always tell you before you commit</h3>
          <ul className="disclosures">
            {PRICING.disclosures.map((d) => (
              <li key={d.title}>
                <span className="disc-check"><Icon name="check" size={18} /></span>
                <div>
                  <h4>{d.title}</h4>
                  <p>{d.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
