import Icon from './Icon.jsx';

/* Article cover image, or a branded placeholder when an article has no image yet. */
export default function BlogCover({ image, category, eager = false, large = false }) {
  if (image?.src) {
    return (
      <img
        className={`blog-cover${large ? ' blog-cover-lg' : ''}`}
        src={image.src}
        alt={image.alt || ''}
        width={large ? 1200 : 640}
        height={large ? 630 : 336}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  return (
    <div className={`blog-cover blog-cover-placeholder${large ? ' blog-cover-lg' : ''}`} aria-hidden="true">
      <Icon name="image" size={large ? 44 : 32} />
      {category && <span>{category}</span>}
    </div>
  );
}
