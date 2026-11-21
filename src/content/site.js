/* =========================================================
   SITE SETTINGS — business details, navigation, page copy.
   TEMPORARY CONTENT SOURCE: this file stands in for the future
   database "settings" table (see docs/BACKEND-PLAN.md).
   ========================================================= */

export const SITE = {
  name: 'AT YOUR SERVICE',
  tagline: 'Your Time Matters. Let Us Handle the Rest.',
  // Production domain — used for canonical URLs, sitemap, Open Graph, structured data. No trailing slash.
  url: 'https://www.atyourservice.com',
  defaultTitle: 'AT YOUR SERVICE | Errand & Personal Assistance Services in Quezon City',
  defaultDescription:
    'Errands, pabili and grocery shopping, document and government compliance assistance, property visits and specialist service coordination in Quezon City. Request a quotation from AT YOUR SERVICE.',
  ogImage: '/og-image.jpg',
  ogImageAlt: 'AT YOUR SERVICE logo with the tagline Your Time Matters. Let Us Handle the Rest.',
  city: 'Quezon City',
  region: 'Metro Manila',
  country: 'PH',
  locale: 'en_PH',
  pilotNotice: 'Now Serving Quezon City — Pilot Program',
};

export const CONTACT = {
  phoneDisplay: '0917-504-5959',
  phoneE164: '+639175045959',
  phoneHref: 'tel:+639175045959',
  smsHref: 'sms:+639175045959',
  viberHref: 'viber://chat?number=%2B639175045959',
  email: 'hello@atyourservice.com',
  emailHref: 'mailto:hello@atyourservice.com',
  facebookHref: 'https://www.facebook.com/atyourservice888/',
  facebookDisplay: 'facebook.com/atyourservice888',
  websiteHref: 'https://www.atyourservice.com/',
  websiteDisplay: 'www.atyourservice.com',
};

export const NAV = [
  { href: '/services/', label: 'Services' },
  { href: '/pricing/', label: 'Pricing' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contact/', label: 'Contact' },
];
export const NAV_CTA = { href: '/book/', label: 'Book a Service' };

export const FOOTER = {
  blurb: 'Personal assistance, errands and service coordination for individuals, families, property owners and businesses.',
  links: [
    { href: '/services/', label: 'Services' },
    { href: '/pricing/', label: 'Pricing' },
    { href: '/blog/', label: 'Blog' },
    { href: '/about/', label: 'About us' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/contact/', label: 'Contact' },
    { href: '/book/', label: 'Book a service' },
  ],
};

/* Pilot coverage — streets, avenues and local areas (alphabetical). */
export const COVERAGE = {
  title: 'Serving Quezon City',
  intro:
    'AT YOUR SERVICE is currently running its pilot program in selected areas of Quezon City. Actual availability is confirmed when we review your request.',
  note: 'Being on this list doesn’t mean every address on every street is automatically covered. We confirm coverage, schedule and provider availability before booking. Nearby locations may be possible, so just ask.',
  areas: [
    '15th Avenue', '20th Avenue', 'Anonas', 'Aurora Boulevard', 'Balete Drive', 'Betty Go-Belmonte',
    'Bonny Serrano Avenue', 'Broadway Avenue', 'Don A. Roces Avenue', 'Dona Hemady Avenue',
    'E. Rodriguez Avenue', 'East Avenue', 'Ermin Garcia Street', 'Esteban Abada Street', 'Gilmore Avenue',
    'J. P. Rizal Street', 'Kalantiao Street', 'Kalayaan Avenue', 'Kamias', 'Kamuning', 'Katipunan Avenue',
    'Maginhawa Street', 'Main Avenue', 'Mother Ignacia Avenue', 'N. Domingo Street', 'P. Tuazon Boulevard',
    'Quezon Avenue', 'Santolan Road', 'Scout Chuatoco Street', 'Timog Avenue', 'Tomas Morato Avenue',
    'Victoria Avenue', 'Xavierville Avenue',
  ],
  // OpenStreetMap view only (no API key). NOT a service boundary — no polygon or markers are drawn.
  map: {
    bbox: [121.015, 14.597, 121.09, 14.662], // minLon, minLat, maxLon, maxLat
    center: [14.63, 121.052],
    zoom: 14,
  },
};

export const HOME = {
  hero: {
    eyebrow: 'Need an extra pair of hands?',
    title: 'Your Time Matters. Let Us Handle the Rest.',
    lead:
      'From everyday errands and grocery shopping to document assistance, property visits, and specialist service coordination, AT YOUR SERVICE helps make life easier.',
    points: ['Quotation before you commit', 'One point of contact for many needs', 'For individuals, families & businesses'],
  },
  servicesIntro:
    'A few of the ways we can help. From pabili and grocery shopping assistance to document runs and property visits, see the full catalogue for everything we offer.',
  whyChoose: [
    { icon: 'network', title: 'One point of contact', text: 'Errands, paperwork, property visits and specialist bookings through a single contact, instead of juggling several.' },
    { icon: 'chat', title: 'Clear communication', text: 'We confirm the details with you and keep you informed about how your request is going.' },
    { icon: 'receipt', title: 'Transparent pricing', text: 'Published prices where available, and a quotation before you commit for everything else.' },
    { icon: 'hand', title: 'Flexible assistance', text: 'Help for a few hours, a single task, or ongoing support, depending on what you need.' },
    { icon: 'handshake', title: 'Appropriate providers', text: 'When a job needs a specialist, we coordinate with suitable providers and tell you who is doing the work.' },
    { icon: 'phone', title: 'Easy to reach', text: 'Call, Viber, email or Facebook. Use whichever is most convenient for you.' },
  ],
  finalCta: {
    title: 'What Can We Help You With Today?',
    text: 'Tell us what you need, and we’ll help work out the best way to get it done.',
  },
};

export const ABOUT = {
  title: 'About AT YOUR SERVICE',
  paragraphs: [
    'AT YOUR SERVICE helps customers handle everyday errands, personal assistance, administrative tasks and selected specialist services through a single point of contact.',
    'Some requests we carry out directly. Others, such as electrical, plumbing, real estate or other specialist work, we coordinate with appropriate third-party providers, and we always make clear who is doing what.',
    'We focus on practical assistance, clear communication and transparency: you’ll know the scope and costs before anything begins.',
    'We are starting with a pilot program in Quezon City. The business is designed to grow through organized processes and a carefully built network of assistants and service providers.',
  ],
  values: [
    { icon: 'shield', label: 'Practical assistance' },
    { icon: 'chat', label: 'Clear communication' },
    { icon: 'receipt', label: 'Transparency' },
  ],
};
