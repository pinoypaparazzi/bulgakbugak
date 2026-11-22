import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ContactChannels from '../components/ContactChannels.jsx';
import Coverage from '../components/Coverage.jsx';

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Contact', href: '/contact/' }]}
        eyebrow="Contact"
        title="Contact AT YOUR SERVICE"
        lead="Questions before you book? Reach us through any of these channels. We’re happy to help you work out what you need."
      />
      <section className="section section-tight" aria-labelledby="channels-title">
        <div className="container">
          <h2 id="channels-title" className="sr-only">Ways to reach us</h2>
          <ContactChannels />
          <div className="contact-book">
            <div>
              <h2>Want to send all the details at once?</h2>
              <p>Use our request form. It prepares a complete message you can send by email, SMS or Viber.</p>
            </div>
            <a className="btn btn-primary btn-lg" href="/book/">Book a Service <Icon name="arrow" size={20} /></a>
          </div>
        </div>
      </section>
      <Coverage soft />
    </>
  );
}
