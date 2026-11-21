import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PriceTag from '../components/PriceTag.jsx';
import FinalCta from '../components/FinalCta.jsx';
import { PRICING_PRINCIPLES } from '../content/content.js';
import { publishedServices, publishedSpecialties, serviceUrl, bookUrl } from '../content/services.js';
import { PRICING_FORMATS } from '../lib/pricing.js';

function PriceTable({ caption, items }) {
  return (
    <div className="table-wrap">
      <table className="price-table">
        <caption>{caption}</caption>
        <thead>
          <tr><th scope="col">Service</th><th scope="col">Pricing</th><th scope="col"><span className="sr-only">Action</span></th></tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.slug}>
              <th scope="row"><a href={serviceUrl(s)}>{s.name}</a></th>
              <td><PriceTag pricing={s.pricing} availability={s.availability} compact /></td>
              <td><a className="table-quote" href={bookUrl(s)}>{s.availability === 'coming_soon' ? 'Request an inquiry' : 'Request a quote'}<span className="sr-only"> for {s.name}</span></a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PricingPage() {
  const P = PRICING_PRINCIPLES;
  return (
    <>
      <PageHeader crumbs={[{ label: 'Pricing', href: '/pricing/' }]} eyebrow="Pricing" title="Clear Pricing. No Unpleasant Surprises." lead={P.intro}>
        <div className="page-header-actions">
          <a className="btn btn-gold btn-lg" href="/book/">Request a Quote <Icon name="arrow" size={20} /></a>
        </div>
      </PageHeader>

      <section className="section section-tight" aria-labelledby="factors-title">
        <div className="container pricing-grid">
          <div>
            <h2 id="factors-title">What affects the price</h2>
            <ul className="factors-list">
              {P.factors.map((f) => <li key={f.label}><Icon name={f.icon} size={20} />{f.label}</li>)}
            </ul>
            <h2>What you might pay for</h2>
            <ul className="charge-list">
              {P.chargeTypes.map((c) => (
                <li key={c.title}><h3>{c.title}</h3><p>{c.text}</p></li>
              ))}
            </ul>
          </div>
          <div className="pricing-card">
            <h2 className="pricing-card-title">Our commitments</h2>
            <ul className="disclosures">
              {P.disclosures.map((d) => (
                <li key={d}><span className="disc-check"><Icon name="check" size={18} /></span><p>{d}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-soft" aria-labelledby="rates-title">
        <div className="container">
          <header className="section-head">
            <h2 id="rates-title">Service pricing</h2>
            <p className="section-lead">Published rates will appear here as they are finalized. Until then, every service is quoted individually, and nothing is confirmed until you approve the quotation.</p>
          </header>
          <PriceTable caption="Specialized services" items={publishedSpecialties()} />
          <PriceTable caption="Service categories" items={publishedServices()} />
        </div>
      </section>

      <section className="section" aria-labelledby="formats-title">
        <div className="container">
          <header className="section-head">
            <h2 id="formats-title">How prices may be shown</h2>
            <p className="section-lead">As rates are published, each service will use one of these formats.</p>
          </header>
          <dl className="format-list">
            {Object.entries(PRICING_FORMATS).map(([key, f]) => (
              <div key={key}><dt>{f.label}</dt><dd>{f.explain}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
