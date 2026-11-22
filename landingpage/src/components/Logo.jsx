/* The official AT YOUR SERVICE logo (unaltered, white background trimmed).
   Source file: src/At Your Service Bell Logo.png — optimized copies live in
   public/images/. Aspect ratio of the trimmed logo is 1150 × 1040. */
const RATIO = 1150 / 1040;

export default function Logo({ height = 56, eager = false, alt = 'AT YOUR SERVICE' }) {
  const width = Math.round(height * RATIO);
  return (
    <img
      src="/images/logo-120.webp"
      srcSet="/images/logo-120.webp 120w, /images/logo-200.webp 200w, /images/logo-400.webp 400w"
      sizes={`${width}px`}
      width={width}
      height={height}
      alt={alt}
      className="logo-img"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
