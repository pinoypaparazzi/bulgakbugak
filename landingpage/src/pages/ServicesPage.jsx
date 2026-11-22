import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import SpecialtyStrip from '../components/SpecialtyStrip.jsx';
import FinalCta from '../components/FinalCta.jsx';
import { publishedServices, SERVICE_GROUPS, findService, bookUrl } from '../content/services.js';

export default function ServicesPage() {
  const [group, setGroup] = useState('all');
  const services = publishedServices();
  const visibleCount = services.filter((s) => group === 'all' || s.group === group).length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Services', href: '/services/' }]}
        eyebrow="Services"
        title="Our services in Quezon City"
        lead="Errands and pabili, grocery shopping assistance, document and government compliance help, property visits, and coordination with specialist providers. Choose a service for details, or request a quote."
      />

      <section className="section section-tight" aria-label="Specialized services">
        <div className="container">
          <SpecialtyStrip
            title="Specialized services"
            intro="These offerings sit within our wider categories, but have their own pages so they’re easy to find."
          />
        </div>
      </section>

      <section className="section section-soft" aria-labelledby="catalogue-title">
        <div className="container">
          <header className="section-head">
            <h2 id="catalogue-title">All {services.length} service categories</h2>
            <p className="section-lead">Each category explains what’s included, any limits, and whether we do the work directly or coordinate it with a provider.</p>
          </header>

          <div className="filter-bar" role="group" aria-label="Filter services by type">
            {SERVICE_GROUPS.map((g) => (
              <button key={g.id} type="button" className="filter-btn" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
                {g.label}
              </button>
            ))}
          </div>
          <p className="filter-status" aria-live="polite">Showing {visibleCount} of {services.length} categories</p>

          <ul className="service-grid">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} hidden={!(group === 'all' || s.group === group)} />
            ))}
          </ul>

          <aside className="something-else" aria-labelledby="else-title">
            <span className="something-else-icon"><Icon name="sparkle" size={28} /></span>
            <div>
              <h3 id="else-title">Have something else in mind?</h3>
              <p>If your request doesn’t fit a category, tell us anyway. We review each request individually and will let you know honestly whether we can help.</p>
            </div>
            <a className="btn btn-primary" href={bookUrl(findService('other-services-referrals'))}>Ask About Your Request</a>
          </aside>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
