import Icon from '../components/Icon.jsx';

export default function NotFoundPage() {
  return (
    <section className="section not-found" aria-labelledby="nf-title">
      <div className="container container-narrow">
        <p className="eyebrow">Error 404</p>
        <h1 id="nf-title">Sorry, we couldn’t find that page.</h1>
        <p className="page-lead">The page may have moved, or the link may be mistyped. These links may help:</p>
        <ul className="nf-links">
          <li><a href="/"><Icon name="house" size={20} /> Home</a></li>
          <li><a href="/services/"><Icon name="layers" size={20} /> Services</a></li>
          <li><a href="/blog/"><Icon name="document" size={20} /> Blog</a></li>
          <li><a href="/book/"><Icon name="calendar" size={20} /> Book a service</a></li>
          <li><a href="/contact/"><Icon name="phone" size={20} /> Contact us</a></li>
        </ul>
      </div>
    </section>
  );
}
