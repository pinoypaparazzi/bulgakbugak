/* =========================================================
   PRICING FORMATS — how a service's `pricing` object is shown.
   These are SUPPORTED DISPLAY TYPES, not approved prices.
   Amounts are in Philippine pesos (numbers, no symbols).

   { format: 'fixed',       amount: 0 }
   { format: 'starting',    amount: 0 }
   { format: 'hourly',      amount: 0 }
   { format: 'range',       min: 0, max: 0 }
   { format: 'package',     packages: [{ name, amount, inclusions: [] }] }
   { format: 'quote' }                      // Request a Quote
   { format: 'third_party' }                // provider's own quotation
   Optional on any: inclusions: [], exclusions: [], notes: [], published: false
   If `published` is false, or an amount is missing, the service
   falls back to "Request a Quote" — nothing unapproved is shown.
   ========================================================= */

export const PRICING_FORMATS = {
  fixed: { label: 'Fixed price', explain: 'One set price for a clearly defined task.' },
  starting: { label: 'Starting price', explain: 'The lowest price for the service; the final price depends on the details.' },
  hourly: { label: 'Hourly rate', explain: 'Charged by the hour for time-based help.' },
  range: { label: 'Price range', explain: 'A typical price range; your quotation confirms the exact amount.' },
  package: { label: 'Package', explain: 'A bundle of services at a set price.' },
  quote: { label: 'Quote required', explain: 'We review your request and send a quotation before you commit.' },
  third_party: { label: 'Third-party quotation', explain: 'The provider sets the price for their work, usually after an inspection. Our coordination fee, if any, is shown separately.' },
};

const peso = (n) => `₱${Number(n).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;
const has = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;

/* Returns { headline, detail, format } for display. */
export function describePrice(pricing = { format: 'quote' }) {
  const p = pricing || { format: 'quote' };
  const quote = { format: 'quote', headline: 'Request a Quote', detail: 'Pricing confirmed before booking' };
  const published = p.published === true;

  switch (p.format) {
    case 'fixed':
      return published && has(p.amount) ? { format: 'fixed', headline: peso(p.amount), detail: 'Fixed price' } : quote;
    case 'starting':
      return published && has(p.amount) ? { format: 'starting', headline: `From ${peso(p.amount)}`, detail: 'Final price confirmed before booking' } : quote;
    case 'hourly':
      return published && has(p.amount) ? { format: 'hourly', headline: `${peso(p.amount)} / hour`, detail: 'Hourly rate' } : quote;
    case 'range':
      return published && has(p.min) && has(p.max) ? { format: 'range', headline: `${peso(p.min)} – ${peso(p.max)}`, detail: 'Exact amount confirmed in your quotation' } : quote;
    case 'package':
      return published && Array.isArray(p.packages) && p.packages.length
        ? { format: 'package', headline: `${p.packages.length} package${p.packages.length > 1 ? 's' : ''} available`, detail: 'See package details' }
        : quote;
    case 'third_party':
      return { format: 'third_party', headline: 'Provider quotation', detail: 'Provider charges confirmed before booking' };
    default:
      return quote;
  }
}
