import { describePrice } from '../lib/pricing.js';

/* Shows a service's price from its `pricing` data. Never invents an amount.
   Coming-soon services show availability instead of a price. */
export default function PriceTag({ pricing, availability, compact = false }) {
  const p = availability === 'coming_soon'
    ? { format: 'coming_soon', headline: 'Coming Soon', detail: 'Provider availability to be confirmed' }
    : describePrice(pricing);
  return (
    <p className={`price-tag price-${p.format}${compact ? ' price-compact' : ''}`}>
      <span className="price-headline">{p.headline}</span>
      <span className="price-detail">{p.detail}</span>
    </p>
  );
}
