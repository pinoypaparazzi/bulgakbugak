/* =========================================================
   ROUTES — every page of the site, with its SEO details.
   The build (scripts/prerender.js) turns each route into a real
   HTML file, e.g. /services/plumbing-services/index.html, and
   builds sitemap.xml and the redirects file from this list.
   ========================================================= */
import { SITE } from './content/site.js';
import { FAQS } from './content/content.js';
import { allServicePages, publishedServices, findById, serviceUrl } from './content/services.js';
import { visiblePosts, postUrl, activeCategories, categoryUrl, blogPageUrl, BLOG_PAGE_SIZE, isPublic } from './lib/blog.js';
import { POSTS } from './content/blog.js';
import * as SD from './lib/structuredData.js';

const crumbs = (...items) => SD.breadcrumbs([{ name: 'Home', path: '/' }, ...items]);

export function getRoutes() {
  const routes = [
    {
      path: '/', page: 'home',
      head: { title: SITE.defaultTitle, description: SITE.defaultDescription, jsonLd: [SD.organization(), SD.website()] },
    },
    {
      path: '/services/', page: 'services',
      head: {
        title: 'Services in Quezon City | Errands, Assistance & Coordination | AT YOUR SERVICE',
        description: 'All 20 service categories: errands and pabili, grocery shopping, government compliance and document assistance, property visits, drone photography, electrician and plumbing coordination, and more.',
        jsonLd: [SD.serviceList(publishedServices()), crumbs({ name: 'Services', path: '/services/' })],
      },
    },
    {
      path: '/pricing/', page: 'pricing',
      head: {
        title: 'Pricing | How Quotations Work | AT YOUR SERVICE',
        description: 'How AT YOUR SERVICE prices errands and assistance in Quezon City: quotations before you commit, with our fees, third-party charges and expenses disclosed separately.',
        jsonLd: [crumbs({ name: 'Pricing', path: '/pricing/' })],
      },
    },
    {
      path: '/about/', page: 'about',
      head: {
        title: 'About Us | AT YOUR SERVICE',
        description: 'AT YOUR SERVICE helps people and businesses in Quezon City handle errands, personal assistance, administrative tasks and specialist service coordination through one point of contact.',
        jsonLd: [crumbs({ name: 'About', path: '/about/' })],
      },
    },
    {
      path: '/faq/', page: 'faq',
      head: {
        title: 'Frequently Asked Questions | AT YOUR SERVICE',
        description: 'Answers about our Quezon City service area, booking requests, pricing, third-party providers, drone services, government compliance assistance and electrician and plumbing coordination.',
        jsonLd: [SD.faqPage(FAQS), crumbs({ name: 'FAQ', path: '/faq/' })],
      },
    },
    {
      path: '/contact/', page: 'contact',
      head: {
        title: 'Contact Us | Call, Viber or Email | AT YOUR SERVICE Quezon City',
        description: 'Contact AT YOUR SERVICE by phone or Viber at 0917-504-5959, by email at hello@atyourservice.com, or on Facebook. See our Quezon City pilot coverage area.',
        jsonLd: [SD.organization(), crumbs({ name: 'Contact', path: '/contact/' })],
      },
    },
    {
      path: '/book/', page: 'book',
      head: {
        title: 'Book a Service | Request a Quote | AT YOUR SERVICE',
        description: 'Request errands, personal assistance, document help or specialist service coordination in Quezon City. Tell us what you need and we’ll confirm availability and pricing.',
        jsonLd: [crumbs({ name: 'Book a service', path: '/book/' })],
      },
    },
  ];

  // Service pages (20 categories + specialties)
  for (const s of allServicePages()) {
    const path = serviceUrl(s);
    const parent = s.parentId ? findById(s.parentId) : null;
    const trail = [{ name: 'Services', path: '/services/' }];
    if (parent) trail.push({ name: parent.name, path: serviceUrl(parent) });
    trail.push({ name: s.name, path });
    routes.push({
      path, page: 'service', params: { slug: s.slug },
      head: {
        title: `${s.name} in Quezon City | AT YOUR SERVICE`,
        description: s.summary,
        jsonLd: [SD.serviceSchema(s, path), crumbs(...trail)],
      },
    });
  }

  // Blog: listing pages, category pages, articles
  const posts = visiblePosts();
  const pages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  for (let n = 1; n <= pages; n += 1) {
    routes.push({
      path: blogPageUrl(n), page: 'blog', params: { page: n },
      head: {
        title: n === 1 ? 'Blog | Practical Guides for Errands & Everyday Assistance | AT YOUR SERVICE' : `Blog — Page ${n} | AT YOUR SERVICE`,
        description: 'Practical guides on errands, pabili and grocery shopping, document assistance, property help and service coordination in Quezon City.',
        jsonLd: [crumbs({ name: 'Blog', path: '/blog/' })],
      },
    });
  }
  for (const c of activeCategories()) {
    routes.push({
      path: categoryUrl(c), page: 'blog', params: { page: 1, categoryId: c.id },
      head: {
        title: `${c.name} | AT YOUR SERVICE Blog`,
        description: `Articles about ${c.name.toLowerCase()} from AT YOUR SERVICE.`,
        jsonLd: [crumbs({ name: 'Blog', path: '/blog/' }, { name: c.name, path: categoryUrl(c) })],
      },
    });
  }
  for (const p of posts) {
    const path = postUrl(p);
    const draft = !isPublic(p);
    routes.push({
      path, page: 'post', params: { slug: p.slug },
      sitemap: !draft, lastmod: p.modifiedAt || p.publishedAt,
      head: {
        title: `${p.seoTitle || p.title} | AT YOUR SERVICE`,
        description: p.seoDescription || p.excerpt,
        ogType: 'article',
        image: p.coverImage?.src,
        imageAlt: p.coverImage?.alt,
        noindex: draft,
        article: { publishedTime: p.publishedAt, modifiedTime: p.modifiedAt },
        jsonLd: [SD.blogPosting(p, path), crumbs({ name: 'Blog', path: '/blog/' }, { name: p.title, path })],
      },
    });
  }

  routes.push({ path: '/404/', page: 'notfound', sitemap: false, head: { title: 'Page Not Found | AT YOUR SERVICE', description: 'Sorry, this page could not be found. Browse our services, blog or contact AT YOUR SERVICE.', noindex: true } });
  return routes;
}

/* 301 redirects for articles whose URL (slug) changed. */
export function getRedirects() {
  return POSTS.filter(isPublic).flatMap((p) => (p.previousSlugs || []).map((old) => ({ from: `/blog/${old}/`, to: postUrl(p) })));
}

export function normalizePath(path) {
  const clean = (path || '/').split(/[?#]/)[0];
  return clean.endsWith('/') ? clean : `${clean}/`;
}

export function matchRoute(path, routes = getRoutes()) {
  const p = normalizePath(path);
  return routes.find((r) => r.path === p) || routes.find((r) => r.page === 'notfound');
}
