import Icon from './Icon.jsx';
import { EXPECTATIONS } from '../content/content.js';
import { publishedTestimonials } from '../content/testimonials.js';

/* Trust section. Genuine testimonials (with permission) appear automatically
   once they are added to src/content/testimonials.js. */
export default function Expectations() {
  const testimonials = publishedTestimonials();
  return (
    <section id="what-to-expect" className="section section-navy" aria-labelledby="expect-title">
      <div className="container">
        <header className="section-head section-head-light">
          <p className="eyebrow">What you can expect</p>
          <h2 id="expect-title">Dependable help, clearly communicated</h2>
          <p className="section-lead">We’re new, and we want to earn your trust the right way: by being clear, upfront and reliable on every request.</p>
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
        {testimonials.length > 0 && (
          <div className="testimonials">
            <h3 className="testimonials-title">What customers say</h3>
            <ul>
              {testimonials.map((t) => (
                <li key={t.id}>
                  <blockquote>
                    <p>“{t.quote}”</p>
                    <footer>— {t.name}{t.context ? `, ${t.context}` : ''}</footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
