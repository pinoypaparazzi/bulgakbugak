import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Expectations from '../components/Expectations.jsx';
import FinalCta from '../components/FinalCta.jsx';
import { ABOUT } from '../content/site.js';

export default function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: 'About', href: '/about/' }]} eyebrow="About us" title={ABOUT.title} />
      <section className="section section-tight" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-logo"><Logo height={220} alt="AT YOUR SERVICE logo" /></div>
          <div>
            <h2 id="about-title">One point of contact for getting things done</h2>
            {ABOUT.paragraphs.map((p) => <p key={p}>{p}</p>)}
            <ul className="about-values">
              {ABOUT.values.map((v) => <li key={v.label}><Icon name={v.icon} size={20} />{v.label}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <Expectations />
      <FinalCta />
    </>
  );
}
