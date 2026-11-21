import Icon from './Icon.jsx';
import { publishedSpecialties, serviceUrl } from '../content/services.js';

/* Highlights government compliance, drone, electrician and plumbing services
   so they are never hidden inside a broader category. */
export default function SpecialtyStrip({ title = 'Specialized services', headingLevel = 2, intro }) {
  const H = `h${headingLevel}`;
  return (
    <div className="specialty-strip">
      <H className="specialty-title">{title}</H>
      {intro && <p className="specialty-intro">{intro}</p>}
      <ul className="specialty-grid">
        {publishedSpecialties().map((s) => (
          <li key={s.slug}>
            <a className="specialty-card" href={serviceUrl(s)}>
              <span className="specialty-icon"><Icon name={s.icon} size={24} /></span>
              <span className="specialty-text">
                <strong>{s.name}</strong>
                <span>{s.summary}</span>
              </span>
              <Icon name="arrow" size={18} className="specialty-arrow" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
