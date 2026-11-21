import Icon from '../components/Icon.jsx';
import Hero from '../components/Hero.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import SpecialtyStrip from '../components/SpecialtyStrip.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Expectations from '../components/Expectations.jsx';
import Coverage from '../components/Coverage.jsx';
import PostCard from '../components/PostCard.jsx';
import FinalCta from '../components/FinalCta.jsx';
import { HOME } from '../content/site.js';
import { publishedServices } from '../content/services.js';
import { visiblePosts } from '../lib/blog.js';

export default function HomePage() {
  const featured = publishedServices().filter((s) => s.featuredOnHome);
  const posts = visiblePosts();
  const featuredPosts = [...posts.filter((p) => p.featured), ...posts.filter((p) => !p.featured)].slice(0, 3);

  return (
    <>
      <Hero />

      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Services</p>
            <h2 id="services-title">Practical help for everyday life and business</h2>
            <p className="section-lead">{HOME.servicesIntro}</p>
          </header>
          <ul className="service-grid service-grid-home">
            {featured.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </ul>
          <SpecialtyStrip headingLevel={3} title="Also available: specialized services" />
          <p className="section-more">
            <a className="btn btn-primary btn-lg" href="/services/">See all 20 service categories <Icon name="arrow" size={20} /></a>
          </p>
        </div>
      </section>

      <HowItWorks />

      <section id="why-us" className="section" aria-labelledby="why-title">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Why AT YOUR SERVICE</p>
            <h2 id="why-title">Why choose AT YOUR SERVICE?</h2>
          </header>
          <ul className="why-grid">
            {HOME.whyChoose.map((w) => (
              <li key={w.title} className="why-item">
                <span className="why-icon"><Icon name={w.icon} size={24} /></span>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Expectations />
      <Coverage />

      <section id="blog" className="section section-soft" aria-labelledby="home-blog-title">
        <div className="container">
          <header className="section-head section-head-row">
            <div>
              <p className="eyebrow">From the blog</p>
              <h2 id="home-blog-title">Practical guides and tips</h2>
            </div>
            <a className="link-arrow" href="/blog/">Visit the blog <Icon name="arrow" size={18} /></a>
          </header>
          {featuredPosts.length > 0 ? (
            <ul className="post-grid">{featuredPosts.map((p) => <PostCard key={p.id} post={p} />)}</ul>
          ) : (
            <div className="empty-state">
              <Icon name="document" size={32} />
              <div>
                <h3>Our first articles are on the way</h3>
                <p>We’re preparing practical guides on errands, document assistance, property help and getting things done in Quezon City. In the meantime, browse our services or ask us a question.</p>
                <p className="empty-actions">
                  <a href="/services/">Browse services</a>
                  <a href="/contact/">Contact us</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
