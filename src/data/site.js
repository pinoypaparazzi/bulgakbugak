/* =========================================================
   SITE SETTINGS — edit this file to change business details.
   Everything on the page (and the SEO tags) reads from here.
   ========================================================= */

export const SITE = {
  name: 'AT YOUR SERVICE',
  tagline: 'Your Time Matters. Let Us Handle the Rest.',
  // Production domain, used for canonical URL, Open Graph, sitemap and structured data.
  // No trailing slash.
  url: 'https://www.atyourservice.com',
  title: 'AT YOUR SERVICE | Errand & Personal Assistance Services in Quezon City',
  description:
    'Errands, pabili and grocery shopping, document runs, personal assistance and service coordination in Quezon City. Request a quotation from AT YOUR SERVICE — pilot program now open.',
  city: 'Quezon City',
  region: 'Metro Manila',
  country: 'PH',
  pilotNotice: 'Now Serving Quezon City — Pilot Program',
};

export const CONTACT = {
  phoneDisplay: '0917-504-5959',
  phoneE164: '+639175045959',
  phoneHref: 'tel:+639175045959',
  smsHref: 'sms:+639175045959',
  // Opens a Viber chat on phones/computers with Viber installed.
  viberHref: 'viber://chat?number=%2B639175045959',
  email: 'hello@atyourservice.com',
  emailHref: 'mailto:hello@atyourservice.com',
  facebookHref: 'https://www.facebook.com/atyourservice888/',
  facebookDisplay: 'facebook.com/atyourservice888',
  websiteHref: 'https://www.atyourservice.com/',
  websiteDisplay: 'www.atyourservice.com',
};

/* Streets, avenues and local areas in the pilot coverage (alphabetical). */
export const COVERAGE = [
  '15th Ave.',
  '20th Ave.',
  'Anonas',
  'Aurora Blvd.',
  'Balete Drive',
  'Betty Go Belmonte',
  'Bonny Serrano',
  'Broadway Ave.',
  'Don A. Roces Ave.',
  'Dona Hemady Ave.',
  'E. Rodriguez Ave.',
  'East Ave.',
  'Ermin Garcia',
  'Esteban Abada',
  'Gilmore Ave.',
  'JP Rizal St.',
  'Kalantiao',
  'Kalayaan Ave.',
  'Kamias',
  'Kamuning',
  'Katipunan Ave.',
  'Maginhawa St.',
  'Main Ave.',
  'Mother Ignacia',
  'N. Domingo',
  'P. Tuazon',
  'Quezon Ave.',
  'Santolan Road',
  'Sct. Chuatoco',
  'Timog Ave.',
  'Tomas Morato',
  'Victoria Ave.',
  'Xavierville Ave.',
];

/* Map view (OpenStreetMap, no API key). This is only the area the map
   opens on — it is NOT drawn as a service boundary. */
export const MAP_VIEW = {
  // minLon, minLat, maxLon, maxLat
  bbox: [121.015, 14.597, 121.09, 14.662],
  center: [14.63, 121.052],
  zoom: 14,
};

export const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];
