/* Builds the JSON-LD structured data (for Google and other search engines)
   from the same data the page uses. Injected into index.html at build time
   by the plugin in vite.config.js.
   Deliberately NO street address, coordinates, opening hours or ratings —
   none have been established yet. */
import { SITE, CONTACT } from '../data/site.js';
import { SERVICES } from '../data/services.js';
import { FAQS } from '../data/content.js';

export function buildStructuredData() {
  const orgId = `${SITE.url}/#organization`;
  const areaServed = {
    '@type': 'City',
    name: SITE.city,
    containedInPlace: { '@type': 'AdministrativeArea', name: SITE.region },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: SITE.name,
        url: `${SITE.url}/`,
        logo: `${SITE.url}/images/logo-400.png`,
        slogan: SITE.tagline,
        description: SITE.description,
        telephone: CONTACT.phoneE164,
        email: CONTACT.email,
        sameAs: [CONTACT.facebookHref],
        areaServed,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: CONTACT.phoneE164,
          email: CONTACT.email,
          areaServed: SITE.country,
          availableLanguage: ['English', 'Filipino'],
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Personal assistance and service-coordination services',
          itemListElement: SERVICES.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.name,
              description: s.description,
              url: `${SITE.url}/#service-${s.slug}`,
              provider: { '@id': orgId },
              areaServed,
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        publisher: { '@id': orgId },
        inLanguage: 'en-PH',
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE.url}/#faq`,
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}
