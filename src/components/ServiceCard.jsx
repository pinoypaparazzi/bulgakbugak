import Icon from './Icon.jsx';
import { bookLinkProps } from '../lib/bookLink.js';

/* One card in the services catalogue. Reused for all 20 services. */
export default function ServiceCard({ service, hidden = false, onInquire }) {
  const titleId = `service-title-${service.slug}`;
  return (
    <li id={`service-${service.slug}`} className="service-card" hidden={hidden}>
      <article aria-labelledby={titleId}>
        <div className="service-card-top">
          <span className="service-icon"><Icon name={service.icon} size={26} /></span>
          {service.partner && <span className="badge-partner">Through partners</span>}
        </div>
        <h3 id={titleId}>{service.name}</h3>
        <p>{service.description}</p>
        <a className="service-cta" {...bookLinkProps(onInquire, service.name)}>
          Inquire about this service<span className="sr-only">: {service.name}</span>
          <Icon name="arrow" size={18} />
        </a>
      </article>
    </li>
  );
}
