import BlogCover from './BlogCover.jsx';
import { postUrl, categoryById, formatDate, isPublic } from '../lib/blog.js';

export default function PostCard({ post, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  const cat = categoryById(post.categoryId);
  return (
    <li className="post-card">
      <article>
        <a href={postUrl(post)} className="post-card-cover" tabIndex={-1} aria-hidden="true">
          <BlogCover image={post.coverImage} category={cat?.name} />
        </a>
        <div className="post-card-body">
          <p className="post-meta">
            {!isPublic(post) && <span className="draft-pill">Draft preview</span>}
            {cat && <span>{cat.name}</span>}
          </p>
          <H className="post-card-title"><a href={postUrl(post)}>{post.title}</a></H>
          <p className="post-excerpt">{post.excerpt}</p>
          <p className="post-foot">
            {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> : <span>Not yet published</span>}
            <a href={postUrl(post)} className="post-more">Read more<span className="sr-only">: {post.title}</span></a>
          </p>
        </div>
      </article>
    </li>
  );
}
