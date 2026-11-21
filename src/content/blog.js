/* =========================================================
   BLOG — categories and articles.
   TEMPORARY CONTENT SOURCE for the future "blog_posts" and
   "blog_categories" tables (see docs/BACKEND-PLAN.md).

   PUBLISHING RULES (enforced in src/lib/blog.js):
   - Only status 'published' with a publishedAt date that has
     passed appears on the public site and in the sitemap.
   - 'draft' and 'archived' never appear publicly.
   - If a slug changes, put the old one in previousSlugs so a
     301 redirect is created automatically.

   Article shape:
   { id, slug, previousSlugs: [], title, excerpt,
     content: 'Markdown text',
     coverImage: { src: '/images/blog/file.webp', alt: '...' } | null,
     author: 'AT YOUR SERVICE', categoryId, tags: [],
     seoTitle, seoDescription,
     status: 'draft' | 'published' | 'archived', featured: false,
     createdAt, modifiedAt, publishedAt, scheduledAt  // ISO dates 'YYYY-MM-DD'
   }
   ========================================================= */

export const BLOG_CATEGORIES = [
  { id: 'cat-errands', slug: 'everyday-errands-personal-assistance', name: 'Everyday Errands and Personal Assistance' },
  { id: 'cat-grocery', slug: 'grocery-shopping-pabili', name: 'Grocery Shopping and Pabili Services' },
  { id: 'cat-documents', slug: 'document-assistance-government-compliance', name: 'Document Assistance and Government Compliance' },
  { id: 'cat-property', slug: 'home-property-relocation', name: 'Home, Property, and Relocation Assistance' },
  { id: 'cat-business', slug: 'business-office-support', name: 'Business and Office Support' },
  { id: 'cat-tech', slug: 'technology-ai-digital', name: 'Technology, AI, and Digital Assistance' },
  { id: 'cat-transport', slug: 'transportation-service-coordination', name: 'Transportation and Service Coordination' },
  { id: 'cat-drone', slug: 'drone-photography-videography', name: 'Drone Photography and Videography' },
  { id: 'cat-trades', slug: 'electrician-plumbing-coordination', name: 'Electrician and Plumbing Service Coordination' },
  { id: 'cat-qc', slug: 'quezon-city-guides', name: 'Practical Guides for Quezon City Residents' },
];

export const POSTS = [
  {
    // DRAFT used only to test the article template locally (npm run build:preview).
    // It is never published. Replace or delete it when real articles are written.
    id: 'post-template-test',
    slug: 'article-template-test',
    previousSlugs: [],
    title: 'Article Template Test (Draft — Not Published)',
    excerpt: 'A draft used to check the layout of blog articles: headings, lists, links, quotes and images. It is never shown on the public website.',
    content: `This draft exists only so the article template can be checked before real articles are written. **It is not published** and is excluded from the live site and the sitemap.

## A second-level heading

Regular paragraphs use comfortable line lengths for reading on phones and desktops. Links look like this: [see our services](/services/).

### A third-level heading

- Bulleted lists are supported
- So are **bold** and *italic* text
- And links to [book a service](/book/)

1. Numbered lists work too
2. Each step on its own line

> Block quotes can highlight a key point.

## Final section

Articles end with a call to action and related articles when available.`,
    coverImage: null,
    author: 'AT YOUR SERVICE',
    categoryId: 'cat-errands',
    tags: ['template'],
    seoTitle: 'Article Template Test',
    seoDescription: 'Draft article used to test the blog template.',
    status: 'draft',
    featured: true,
    createdAt: '2026-11-22',
    modifiedAt: '2026-11-22',
    publishedAt: null,
    scheduledAt: null,
  },
];
