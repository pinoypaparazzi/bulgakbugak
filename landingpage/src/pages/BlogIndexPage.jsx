import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PostCard from '../components/PostCard.jsx';
import { BLOG_CATEGORIES } from '../content/blog.js';
import { visiblePosts, activeCategories, categoryById, categoryUrl, blogPageUrl, BLOG_PAGE_SIZE } from '../lib/blog.js';

/* Blog listing: /blog/, /blog/page/N/ and /blog/category/<slug>/ all use this page. */
export default function BlogIndexPage({ page = 1, categoryId }) {
  const category = categoryId ? categoryById(categoryId) : null;
  const all = visiblePosts().filter((p) => !category || p.categoryId === category.id);
  const totalPages = Math.max(1, Math.ceil(all.length / BLOG_PAGE_SIZE));
  const posts = all.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);
  const featured = !category && page === 1 ? posts.find((p) => p.featured) : null;
  const rest = featured ? posts.filter((p) => p !== featured) : posts;
  const active = activeCategories();

  const crumbs = [{ label: 'Blog', href: '/blog/' }];
  if (category) crumbs.push({ label: category.name, href: categoryUrl(category) });
  if (page > 1) crumbs.push({ label: `Page ${page}`, href: blogPageUrl(page) });

  return (
    <>
      <PageHeader
        crumbs={crumbs}
        eyebrow="Blog"
        title={category ? category.name : 'Practical guides for getting things done'}
        lead={category ? `Articles about ${category.name.toLowerCase()}.` : 'Tips and practical guides on errands, pabili and grocery shopping, document assistance, property help, technology and service coordination in Quezon City.'}
      />

      <section className="section section-tight" aria-label="Articles">
        <div className="container">
          {active.length > 0 && (
            <nav className="topic-nav" aria-label="Blog categories">
              <ul>
                <li><a href="/blog/" aria-current={!category ? 'page' : undefined}>All articles</a></li>
                {active.map((c) => (
                  <li key={c.id}><a href={categoryUrl(c)} aria-current={category?.id === c.id ? 'page' : undefined}>{c.name}</a></li>
                ))}
              </ul>
            </nav>
          )}

          {all.length === 0 ? (
            <div className="empty-state empty-state-lg">
              <Icon name="document" size={36} />
              <div>
                <h2>Our first articles are on the way</h2>
                <p>We’re preparing practical, honest guides to help you get everyday things done. Topics we plan to cover include:</p>
                <ul className="topic-chips">
                  {BLOG_CATEGORIES.map((c) => <li key={c.id}>{c.name}</li>)}
                </ul>
                <p>Need help now? <a href="/services/">Browse our services</a> or <a href="/book/">request a service</a>.</p>
              </div>
            </div>
          ) : (
            <>
              {featured && (
                <div className="featured-post">
                  <p className="featured-label">Featured</p>
                  <ul className="post-grid post-grid-featured"><PostCard post={featured} headingLevel={2} /></ul>
                </div>
              )}
              {rest.length > 0 && (
                <>
                  <h2 className="sr-only">{featured ? 'More articles' : 'Articles'}</h2>
                  <ul className="post-grid">{rest.map((p) => <PostCard key={p.id} post={p} />)}</ul>
                </>
              )}
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Blog pages">
                  {page > 1 && <a href={blogPageUrl(page - 1)} rel="prev">← Newer articles</a>}
                  <span>Page {page} of {totalPages}</span>
                  {page < totalPages && <a href={blogPageUrl(page + 1)} rel="next">Older articles →</a>}
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section section-soft section-tight" aria-labelledby="blog-cta-title">
        <div className="container blog-cta">
          <div>
            <h2 id="blog-cta-title">Need a hand with something today?</h2>
            <p>Tell us what you need and we’ll confirm availability, scope and pricing.</p>
          </div>
          <div className="blog-cta-actions">
            <a className="btn btn-primary" href="/book/">Book a Service</a>
            <a className="btn btn-outline" href="/services/">View Services</a>
          </div>
        </div>
      </section>
    </>
  );
}
