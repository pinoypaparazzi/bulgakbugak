import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PriceTag from '../components/PriceTag.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import Faq from '../components/Faq.jsx';
import FinalCta from '../components/FinalCta.jsx';
import { findService, findById, childrenOf, publishedServices, serviceUrl, bookUrl, isComingSoon, availabilityOf } from '../content/services.js';
import { STEPS } from '../content/content.js';
import { CONTACT } from '../content/site.js';
import { PRICING_FORMATS, describePrice } from '../lib/pricing.js';

const DELIVERY_LABEL = {
  direct: 'Usually done directly by AT YOUR SERVICE',
  coordinated: 'Coordinated by us, performed by a third-party provider',
  mixed: 'A mix of direct help and provider coordination',
};

/* One reusable template for every service page. */
export default function ServiceDetailPage({ slug }) {
  const s = findService(slug);
  const parent = s.parentId ? findById(s.parentId) : null;
  const children = childrenOf(s.id);
  const related = parent
    ? [parent]
    : publishedServices().filter((x) => x.group === s.group && x.id !== s.id).slice(0, 3);
  const price = describePrice(s.pricing);
  const soon = isComingSoon(s);
  const notice = availabilityOf(s).notice;
  const cta = soon ? 'Request an Inquiry' : 'Request a Quote';

  const crumbs = [{ label: 'Services', href: '/services/' }];
  if (parent) crumbs.push({ label: parent.name, href: serviceUrl(parent) });
  crumbs.push({ label: s.name, href: serviceUrl(s) });

  return (
    <>
      <PageHeader
        crumbs={crumbs}
        eyebrow={soon ? 'Coming soon' : parent ? 'Specialized service' : 'Service category'}
        title={s.name}
        lead={s.intro}
      >
        {notice && (
          <p className="availability-notice">
            <Icon name="clock" size={20} />
            <span><strong>Coming Soon: </strong>{notice}</span>
          </p>
        )}
        <div className="page-header-actions">
          <a className="btn btn-gold btn-lg" href={bookUrl(s)}>{cta} <Icon name="arrow" size={20} /></a>
          <a className="btn btn-outline btn-lg" href={CONTACT.phoneHref}><Icon name="phone" size={20} /> Call {CONTACT.phoneDisplay}</a>
        </div>
      </PageHeader>

      <section className="section section-tight">
        <div className="container detail-grid">
          <div className="detail-main">
            <h2>{soon ? 'What this service will include' : 'How we can help'}</h2>
            <ul className="check-list">
              {s.offerings.map((o) => <li key={o}><Icon name="check" size={18} /> {o}</li>)}
            </ul>

            {s.useCases?.length > 0 && (
              <>
                <h2>Who it’s for</h2>
                <ul className="use-cases">
                  {s.useCases.map((u) => <li key={u}><Icon name="hand" size={18} /> {u}</li>)}
                </ul>
              </>
            )}

            {children.length > 0 && (
              <>
                <h2>Specialized services in this category</h2>
                <ul className="mini-links">
                  {children.map((c) => (
                    <li key={c.slug}>
                      <a href={serviceUrl(c)}><Icon name={c.icon} size={20} /> {c.name}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {s.notes.length > 0 && (
              <>
                <h2>Important to know</h2>
                <ul className="notes-list">
                  {s.notes.map((n) => <li key={n}><Icon name="info" size={18} /> <span>{n}</span></li>)}
                </ul>
              </>
            )}

            <h2>{soon ? 'How it will work' : 'How booking works'}</h2>
            <ol className="mini-steps">
              {STEPS.map((st, i) => (
                <li key={st.title}><span className="mini-step-num">{i + 1}</span><div><strong>{st.title}.</strong> {st.text}</div></li>
              ))}
            </ol>

            {s.faqs?.length > 0 && (
              <>
                <h2>Questions about this service</h2>
                <Faq faqs={s.faqs} headingLevel={3} />
              </>
            )}
          </div>

          <aside className="detail-side" aria-label="Service summary">
            <div className="side-card">
              <h2 className="side-title">{soon ? 'Availability & pricing' : 'Pricing'}</h2>
              <PriceTag pricing={s.pricing} availability={s.availability} />
              <p className="side-small">
                {soon
                  ? 'No prices have been set yet. When the service launches, all charges will be explained before you confirm.'
                  : PRICING_FORMATS[price.format].explain}
              </p>
              <a className="side-link" href="/pricing/">How pricing works</a>
            </div>
            <div className="side-card">
              <h2 className="side-title">Who does the work</h2>
              <p className="side-strong">{DELIVERY_LABEL[s.delivery]}</p>
              <p className="side-small">{s.deliveryNote}</p>
            </div>
            <div className="side-card side-card-cta">
              <h2 className="side-title">{soon ? 'Interested?' : 'Ready to ask?'}</h2>
              <p className="side-small">
                {soon
                  ? 'Send an inquiry and we’ll let you know when this service becomes available. Sending an inquiry is not a booking.'
                  : 'Tell us what you need and we’ll confirm availability, scope and pricing.'}
              </p>
              <a className="btn btn-primary btn-block" href={bookUrl(s)}>{cta}</a>
              <a className="side-link" href="/contact/">Other ways to contact us</a>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-soft" aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className="related-title">{parent ? 'Main category' : 'Related services'}</h2>
            <ul className="service-grid">
              {related.map((r) => <ServiceCard key={r.slug} service={r} />)}
            </ul>
            <p className="section-more"><a className="link-arrow" href="/services/">View All Services <Icon name="arrow" size={18} /></a></p>
          </div>
        </section>
      )}

      <FinalCta bookHref={bookUrl(s)} />
    </>
  );
}
