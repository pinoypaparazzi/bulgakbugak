/* JSON-LD structured data for search engines, built from the content files.
   Deliberately NO street address, coordinates, opening hours, ratings or
   reviews: none have been established. */
import { SITE, CONTACT } from '../content/site.js';

const ORG_ID = `${SITE.url}/#organization`;
const abs = (p) => `${SITE.url}${p}`;

const areaServed = {
  '@type': 'City',
  name: SITE.city,
  containedInPlace: { '@type': 'AdministrativeArea', name: SITE.region },
};

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: abs('/images/logo-400.png'),
    slogan: SITE.tagline,
    description: SITE.defaultDescription,
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
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-PH',
  };
}

export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function serviceSchema(s, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.summary,
    url: abs(path),
    serviceType: s.name,
    provider: { '@id': ORG_ID, '@type': 'Organization', name: SITE.name },
    areaServed,
  };
}

export function serviceList(services) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE.name} services`,
    itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: abs(`/services/${s.slug}/`) })),
  };
}

export function faqPage(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function blogPosting(post, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    url: abs(path),
    mainEntityOfPage: abs(path),
    image: post.coverImage ? abs(post.coverImage.src) : abs(SITE.ogImage),
    datePublished: post.publishedAt || undefined,
    dateModified: post.modifiedAt || post.publishedAt || undefined,
    author: { '@type': 'Organization', name: post.author || SITE.name, url: `${SITE.url}/` },
    publisher: { '@id': ORG_ID, '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: abs('/images/logo-400.png') } },
    keywords: post.tags?.length ? post.tags.join(', ') : undefined,
  };
}
