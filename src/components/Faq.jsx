import Icon from './Icon.jsx';
import { FAQS } from '../data/content.js';

/* Native <details> accordions: keyboard accessible, no JavaScript needed,
   and the answers stay in the HTML for search engines. */
export default function Faq() {
  return (
    <section id="faq" className="section section-soft" aria-labelledby="faq-title">
      <div className="container faq-wrap">
        <header className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Frequently asked questions</h2>
        </header>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>
                <h3>{f.q}</h3>
                <span className="faq-icon"><Icon name="plus" size={20} /></span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
