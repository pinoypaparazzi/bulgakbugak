/* =========================================================
   SERVICE CATALOGUE — all 20 categories.
   - `slug` is used for anchor links (#service-<slug>) and can become a
     future page URL, e.g. /services/<slug>
   - `icon` must match a name in src/components/Icon.jsx
   - `group` controls the filter tabs
   - `partner: true` shows the "Through partners" badge
   ========================================================= */

export const SERVICE_GROUPS = [
  { id: 'all', label: 'All services' },
  { id: 'errands', label: 'Errands & shopping' },
  { id: 'personal', label: 'Personal & family' },
  { id: 'property', label: 'Home, property & vehicles' },
  { id: 'business', label: 'Business & digital' },
  { id: 'partners', label: 'Partner & referral' },
];

export const SERVICES = [
  {
    slug: 'photography-visual-reports',
    name: 'Photography and Visual Reports',
    icon: 'camera',
    group: 'property',
    description:
      'Photos and short visual reports of a place, item or situation you can’t check in person — useful for remote owners, buyers and families.',
  },
  {
    slug: 'pet-errands-coordination',
    name: 'Pet-Related Errands and Coordination',
    icon: 'paw',
    group: 'errands',
    description:
      'Pet food and supply runs, help getting to grooming or vet appointments, and coordinating with pet service providers.',
  },
  {
    slug: 'personal-shopping-convenience',
    name: 'Personal Shopping and Convenience',
    icon: 'bag',
    group: 'errands',
    description:
      'Pabili for the things you need, bought according to your list and instructions, with any substitutions agreed with you.',
  },
  {
    slug: 'moving-organizing-decluttering',
    name: 'Moving, Organizing, and Decluttering',
    icon: 'boxes',
    group: 'property',
    description:
      'An extra pair of hands to pack, sort, label and tidy up a room, home or small office, and to help coordinate a move.',
  },
  {
    slug: 'travel-transportation-accompaniment',
    name: 'Travel, Transportation, and Accompaniment',
    icon: 'route',
    group: 'personal',
    description:
      'Help arranging transport and someone to accompany you or a family member to appointments, terminals and errands.',
  },
  {
    slug: 'repair-servicing-item-transport',
    name: 'Repair, Servicing, and Item Transport',
    icon: 'wrench',
    group: 'property',
    description:
      'Bringing items to repair and service shops, following up on their status, and picking them up when they’re ready.',
  },
  {
    slug: 'property-visits-documentation',
    name: 'Property Visits and Visual Documentation',
    icon: 'house',
    group: 'property',
    description:
      'Checking on a house, unit or lot on your behalf and sending back photos and notes on what we observed.',
  },
  {
    slug: 'personal-assistant-lifestyle',
    name: 'Personal Assistant and Lifestyle Management',
    icon: 'calendar',
    group: 'personal',
    description:
      'Help with reminders, bookings, reservations and the small to-dos that pile up when your schedule is full.',
  },
  {
    slug: 'personal-errands-shopping',
    name: 'Personal Errands and Shopping',
    icon: 'cart',
    group: 'errands',
    description:
      'Grocery shopping assistance, pick-ups, drop-offs, bill payments and the everyday errands that take up your day.',
  },
  {
    slug: 'family-senior-personal-assistance',
    name: 'Family, Senior, and Personal Assistance',
    icon: 'heart',
    group: 'personal',
    description:
      'Practical, non-medical support for families and senior citizens, such as errands, check-ins and accompaniment.',
  },
  {
    slug: 'business-office-document-errands',
    name: 'Business, Office, and Document Errands',
    icon: 'document',
    group: 'business',
    description:
      'Document assistance for individuals and small businesses: submissions, pick-ups, deliveries and follow-ups.',
  },
  {
    slug: 'events-gifts-special-occasions',
    name: 'Events, Gifts, and Special Occasions',
    icon: 'gift',
    group: 'errands',
    description:
      'Buying and delivering gifts, picking up cakes and flowers, and helping with small preparations for occasions.',
  },
  {
    slug: 'research-sourcing-special-requests',
    name: 'Research, Sourcing, and Special Requests',
    icon: 'search',
    group: 'business',
    description:
      'Looking for a hard-to-find item, comparing options and prices, or canvassing suppliers so you can decide.',
  },
  {
    slug: 'digital-technology-assistance',
    name: 'Digital and Technology Assistance',
    icon: 'laptop',
    group: 'business',
    description:
      'Help with everyday tech: setting up devices and apps, online forms and appointments, and basic troubleshooting.',
  },
  {
    slug: 'waiting-queueing-presence',
    name: 'Waiting, Queueing, and Physical Presence',
    icon: 'clock',
    group: 'errands',
    description:
      'Someone to wait in line, hold your place, or be present to receive a delivery or a visiting technician.',
  },
  {
    slug: 'vehicle-coordination',
    name: 'Vehicle-Related Coordination',
    icon: 'car',
    group: 'property',
    description:
      'Coordinating vehicle servicing, car wash and maintenance appointments, and related errands and follow-ups.',
  },
  {
    slug: 'relocation-settling-in',
    name: 'Relocation and Settling-In Assistance',
    icon: 'key',
    group: 'personal',
    description:
      'Help for people new to Quezon City: getting to know the area, setting up essentials and running first-week errands.',
  },
  {
    slug: 'property-sales-rentals',
    name: 'Property Sales and Rentals — Partner Real Estate Broker',
    icon: 'building',
    group: 'partners',
    partner: true,
    description:
      'We can connect you with a partner real estate broker. Property sales and rental transactions are handled by the broker, not by AT YOUR SERVICE.',
  },
  {
    slug: 'technical-repairs-specialists',
    name: 'Technical Repairs and Specialist Services — External Providers',
    icon: 'tools',
    group: 'partners',
    partner: true,
    description:
      'For work that needs a qualified specialist, we help coordinate with external providers, who carry out the work and may charge separately.',
  },
  {
    slug: 'other-services-referrals',
    name: 'Other Outsourced Services and Professional Referrals',
    icon: 'sparkle',
    group: 'partners',
    partner: true,
    description:
      'Need something not listed? Ask us. Acceptance depends on feasibility, availability, and any professional or legal requirements.',
  },
];

/* Option shown in the booking form for customers who aren't sure. */
export const NOT_SURE_OPTION = 'Not sure — please help me choose';
