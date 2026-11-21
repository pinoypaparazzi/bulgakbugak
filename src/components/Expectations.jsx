import Icon from './Icon.jsx';
import { EXPECTATIONS } from '../data/content.js';

/* Trust section. When genuine customer reviews are available (with the
   customers' permission), a testimonials block can be added here. */
export default function Expectations() {
  return (
    <section id="what-to-expect" className="section section-navy" aria-labelledby="expect-title">
      <div className="container">
        <header className="section-head section-head-light">
          <p className="eyebrow">What you can expect</p>
          <h2 id="expect-title">Dependable help, clearly communicated</h2>
          <p className="section-lead">
            We’re new, and we want to earn your trust the right way: by being clear, upfront and reliable
            on every request.
          </p>
        </header>
        <ul className="expect-grid">
          {EXPECTATIONS.map((e) => (
            <li key={e.title} className="expect-item">
              <span className="expect-icon"><Icon name={e.icon} size={26} /></span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
