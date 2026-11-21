import { describePrice } from '../lib/pricing.js';

/* Shows a service's price from its `pricing` data. Never invents an amount. */
export default function PriceTag({ pricing, compact = false }) {
  const p = describePrice(pricing);
  return (
    <p className={`price-tag price-${p.format}${compact ? ' price-compact' : ''}`}>
      <span className="price-headline">{p.headline}</span>
      <span className="price-detail">{p.detail}</span>
    </p>
  );
}
