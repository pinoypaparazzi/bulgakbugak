import Icon from './Icon.jsx';
import PriceTag from './PriceTag.jsx';
import { serviceUrl, bookUrl } from '../content/services.js';

const DELIVERY_BADGE = { coordinated: 'Through providers', mixed: null, direct: null };

/* One card in a service grid. Reused for all categories and specialties. */
export default function ServiceCard({ service, hidden = false, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  const titleId = `card-${service.slug}`;
  const badge = DELIVERY_BADGE[service.delivery];
  return (
    <li id={`service-${service.slug}`} className="service-card" hidden={hidden}>
      <article aria-labelledby={titleId}>
        <div className="service-card-top">
          <span className="service-icon"><Icon name={service.icon} size={26} /></span>
          {badge && <span className="badge-partner">{badge}</span>}
        </div>
        <H id={titleId} className="service-card-title">
          <a href={serviceUrl(service)}>{service.name}</a>
        </H>
        <p>{service.summary}</p>
        <PriceTag pricing={service.pricing} compact />
        <div className="service-card-actions">
          <a className="service-cta" href={serviceUrl(service)}>
            View details<span className="sr-only">: {service.name}</span>
            <Icon name="arrow" size={18} />
          </a>
          <a className="service-quote" href={bookUrl(service)}>
            Request a quote<span className="sr-only"> for {service.name}</span>
          </a>
        </div>
      </article>
    </li>
  );
}
