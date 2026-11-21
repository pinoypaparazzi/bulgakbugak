import Icon from '../components/Icon.jsx';
import BlogCover from '../components/BlogCover.jsx';
import PostCard from '../components/PostCard.jsx';
import { findPost, relatedPosts, categoryById, categoryUrl, activeCategories, formatDate, isPublic } from '../lib/blog.js';
import { markdownToHtml } from '../lib/markdown.js';

/* One reusable template for every article. */
export default function BlogPostPage({ slug }) {
  const post = findPost(slug);
  const cat = categoryById(post.categoryId);
  const catLinked = cat && activeCategories().some((c) => c.id === cat.id);
  const related = relatedPosts(post);
  const showModified = post.modifiedAt && post.publishedAt && post.modifiedAt > post.publishedAt;

  return (
    <>
      <article className="article" aria-labelledby="article-title">
        <header className="article-header">
          <div className="container container-narrow">
            <nav aria-label="Breadcrumb" className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><span aria-current="page">{post.title}</span></li>
              </ol>
            </nav>
            {!isPublic(post) && (
              <p className="draft-banner"><Icon name="info" size={18} /> Draft preview: this article is not published and is not visible on the live website.</p>
            )}
            {cat && (
              <p className="eyebrow">{catLinked ? <a href={categoryUrl(cat)}>{cat.name}</a> : cat.name}</p>
            )}
            <h1 id="article-title">{post.title}</h1>
            <p className="article-excerpt">{post.excerpt}</p>
            <p className="article-meta">
              <span>By {post.author || 'AT YOUR SERVICE'}</span>
              {post.publishedAt && <span>Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></span>}
              {showModified && <span>Updated <time dateTime={post.modifiedAt}>{formatDate(post.modifiedAt)}</time></span>}
            </p>
          </div>
          <div className="container container-wide">
            <BlogCover image={post.coverImage} category={cat?.name} eager large />
          </div>
        </header>

        <div className="container container-narrow">
          {/* Article Markdown converted to HTML (content written by the site owner). */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />

          {post.tags?.length > 0 && (
            <ul className="tag-list" aria-label="Tags">
              {post.tags.map((t) => <li key={t}>#{t}</li>)}
            </ul>
          )}

          <aside className="article-cta" aria-labelledby="article-cta-title">
            <h2 id="article-cta-title">Need a hand with this?</h2>
            <p>AT YOUR SERVICE helps with errands, documents, property visits and specialist coordination in Quezon City.</p>
            <div className="article-cta-actions">
              <a className="btn btn-gold" href="/book/">Book a Service</a>
              <a className="btn btn-outline" href="/services/">View Services</a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section-soft" aria-labelledby="related-posts-title">
          <div className="container">
            <h2 id="related-posts-title" className="related-title">Related articles</h2>
            <ul className="post-grid">{related.map((p) => <PostCard key={p.id} post={p} />)}</ul>
          </div>
        </section>
      )}

      <p className="container container-narrow back-link"><a href="/blog/">← Back to all articles</a></p>
    </>
  );
}
