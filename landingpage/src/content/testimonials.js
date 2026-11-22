/* =========================================================
   TESTIMONIALS — intentionally empty.
   Only add GENUINE reviews, with the customer's permission.
   When at least one entry has `permission: true`, a testimonials
   block appears automatically in the "What you can expect" section.

   Shape (future "testimonials" table):
   { id: 't-001', name: 'First name or initials', context: 'Errand service, 2027',
     quote: 'Their words, unedited except for spelling.', permission: true, status: 'published' }
   ========================================================= */
export const TESTIMONIALS = [];

export const publishedTestimonials = () => TESTIMONIALS.filter((t) => t.permission && t.status === 'published');
