import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import ServiceCard from './ServiceCard.jsx';
import { SERVICES, SERVICE_GROUPS } from '../data/services.js';
import { bookLinkProps } from '../lib/bookLink.js';

export default function Services({ onInquire }) {
  const [group, setGroup] = useState('all');

  // If someone follows a link to a specific service (e.g. from the footer),
  // make sure it isn't hidden by an active filter.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith('#service-')) setGroup('all');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const visible = SERVICES.filter((s) => group === 'all' || s.group === group);

  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Services</p>
          <h2 id="services-title">Practical help for everyday life and business</h2>
          <p className="section-lead">
            From pabili and grocery shopping assistance to document errands, queueing and personal
            assistance, here are the {SERVICES.length} kinds of requests we can help with in Quezon City.
            Choose one to send an inquiry.
          </p>
        </header>

        <div className="filter-bar" role="group" aria-label="Filter services by type">
          {SERVICE_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className="filter-btn"
              aria-pressed={group === g.id}
              onClick={() => setGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <p className="filter-status" aria-live="polite">
          Showing {visible.length} of {SERVICES.length} services
        </p>

        <ul className="service-grid">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.slug}
              service={s}
              hidden={!(group === 'all' || s.group === group)}
              onInquire={onInquire}
            />
          ))}
        </ul>

        <aside className="something-else" aria-labelledby="else-title">
          <span className="something-else-icon"><Icon name="sparkle" size={28} /></span>
          <div>
            <h3 id="else-title">Have something else in mind?</h3>
            <p>
              If your request doesn’t fit a category, tell us anyway. We’ll let you know honestly whether
              it’s something we can take on or help arrange.
            </p>
          </div>
          <a className="btn btn-primary" {...bookLinkProps(onInquire, 'Other Outsourced Services and Professional Referrals')}>
            Ask About Your Request
          </a>
        </aside>
      </div>
    </section>
  );
}
