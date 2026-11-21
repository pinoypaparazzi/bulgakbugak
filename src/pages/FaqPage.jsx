import PageHeader from '../components/PageHeader.jsx';
import Faq from '../components/Faq.jsx';
import FinalCta from '../components/FinalCta.jsx';
import { FAQS } from '../content/content.js';

export default function FaqPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'FAQ', href: '/faq/' }]}
        eyebrow="FAQ"
        title="Frequently asked questions"
        lead="Can’t find your answer? Contact us and we’ll be happy to help."
      />
      <section className="section section-tight" aria-label="Questions and answers">
        <div className="container faq-wrap">
          <Faq faqs={FAQS} headingLevel={2} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
