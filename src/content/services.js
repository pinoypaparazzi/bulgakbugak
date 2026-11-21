/* =========================================================
   SERVICE CATALOGUE
   TEMPORARY CONTENT SOURCE for the future "services" table.
   Every page (cards, detail pages, pricing table, booking form,
   footer, structured data, sitemap) reads from this one file.

   Fields
   - id / slug      unique; slug becomes the URL /services/<slug>/
   - status         'published' | 'hidden'  (hidden = not shown anywhere)
   - order          display order
   - group          filter tab on /services/
   - featuredOnHome show on the homepage overview
   - delivery       'direct' | 'coordinated' | 'mixed'  (who performs the work)
   - pricing        see src/lib/pricing.js for supported formats.
                    NO PRICES HAVE BEEN APPROVED YET — all use 'quote'
                    or 'third_party'. Do not add amounts until approved.
   - formFields     extra questions shown in the booking form
   - availability   'available' (default) | 'coming_soon'  (see AVAILABILITY below)
   - useCases       optional list: "who this is for" on the detail page
   - faqs           optional list of { id, q, a } shown on the detail page
                    (also added to that page's FAQ structured data)
   ========================================================= */

export const SERVICE_GROUPS = [
  { id: 'all', label: 'All services' },
  { id: 'errands', label: 'Errands & shopping' },
  { id: 'personal', label: 'Personal & family' },
  { id: 'property', label: 'Home, property & vehicles' },
  { id: 'business', label: 'Business, documents & digital' },
  { id: 'partners', label: 'Specialists & partners' },
  { id: 'care', label: 'Personal care & laundry' },
];

/* AVAILABILITY (future "availability" column)
   - 'available'    normal service (default when the field is missing)
   - 'coming_soon'  shown with a "Coming Soon" badge and "Provider availability
                    to be confirmed"; the call to action becomes "Request an Inquiry".
   Switch to 'available' only once provider partnerships are actually in place. */
export const AVAILABILITY = {
  available: { label: null, notice: null },
  coming_soon: {
    label: 'Coming Soon',
    notice: 'Provider availability to be confirmed. We’re still arranging provider partnerships for this service, so we can’t confirm bookings yet. Send an inquiry and we’ll let you know when and where it becomes available.',
  },
};
export const availabilityOf = (s) => AVAILABILITY[s?.availability] || AVAILABILITY.available;
export const isComingSoon = (s) => s?.availability === 'coming_soon';

const QUOTE = { format: 'quote' };
const THIRD_PARTY = { format: 'third_party' };

/* Reusable booking-form questions */
const F = {
  propertyType: { name: 'propertyType', label: 'Property type', type: 'select', options: ['House', 'Condominium unit', 'Apartment', 'Vacant lot', 'Commercial space', 'Other'] },
  authorized: { name: 'authorized', label: 'Are you the owner or an authorized representative?', type: 'select', options: ['Yes, I am the owner', 'Yes, I am authorized by the owner', 'Not sure'] },
  whatToDocument: { name: 'whatToDocument', label: 'What should be photographed or documented?', type: 'textarea' },
  droneProject: { name: 'droneProject', label: 'Drone project type', type: 'select', options: ['Property or lot imagery', 'Construction or progress documentation', 'Event coverage', 'Other'] },
  droneSite: { name: 'droneSite', label: 'Describe the site (e.g. residential area, near an airport, open lot)', type: 'text', hint: 'Airspace rules depend on location, so this helps us check feasibility.' },
  agency: { name: 'agency', label: 'Office or agency involved (if known)', type: 'text' },
  transaction: { name: 'transaction', label: 'Type of document or transaction', type: 'text', hint: 'For example: business permit renewal, document request, appointment booking.' },
  issue: { name: 'issue', label: 'Describe the problem or work needed', type: 'textarea', hint: 'If there is an immediate safety risk (sparks, burning smell, flooding), turn off the supply if it is safe and contact a qualified professional or emergency services right away.' },
  realEstate: { name: 'realEstateGoal', label: 'What would you like to do?', type: 'select', options: ['Buy', 'Sell', 'Rent', 'Lease out my property', 'Just asking'] },
  vehicle: { name: 'vehicle', label: 'Vehicle make and model', type: 'text' },
  pet: { name: 'pet', label: 'Type of pet', type: 'text' },
  laundryLoad: { name: 'laundryLoad', label: 'Approximate laundry amount', type: 'select', options: ['1 bag / small load', '2–3 bags', 'Large load or linens', 'Regular weekly laundry', 'Not sure'] },
  specialCare: { name: 'specialCare', label: 'Any delicate or special-care items?', type: 'text' },
  nailService: { name: 'nailService', label: 'Service needed', type: 'select', options: ['Manicure', 'Pedicure', 'Manicure and pedicure'] },
  people: { name: 'people', label: 'Number of people', type: 'select', options: ['1', '2', '3', '4', '5 or more'] },
  groomingFor: { name: 'groomingFor', label: 'Who is the haircut or grooming for?', type: 'select', options: ['Adult', 'Child', 'Senior', 'Several family members'] },
  occasion: { name: 'occasion', label: 'Occasion and date', type: 'text', hint: 'For example: wedding guest, 14 February, morning.' },
  volume: { name: 'volume', label: 'Approximate size of the job', type: 'select', options: ['A few items', 'One room', 'Several rooms / whole unit', 'Office or business space', 'Not sure'] },
};

export const SERVICES = [
  {
    id: 'svc-01', order: 1, slug: 'photography-visual-reports', status: 'published', featuredOnHome: false,
    name: 'Photography and Visual Reports', icon: 'camera', group: 'property', delivery: 'mixed',
    summary: 'Photos, visual reports and documentation of places, items or events, including drone photography and videography through qualified operators.',
    intro: 'When you can’t be there in person, we can capture what you need to see: photos and short visual reports of a property, an item, or an occasion. For aerial views, we arrange drone photography and videography with qualified operators where it is permitted.',
    offerings: ['Photo documentation of places, items and situations', 'Visual reports with photos and written observations', 'Property documentation for owners, buyers and renters', 'Drone photography and videography (subject to regulations and permissions)'],
    notes: ['Drone work depends on location, weather, airspace restrictions, applicable Philippine aviation regulations, required permissions and operator availability.', 'Visual reports are observations only, not professional inspections, appraisals or certifications.'],
    deliveryNote: 'Basic photography and visual reports may be done directly. Drone work is carried out by qualified operators where required.',
    pricing: QUOTE, formFields: [F.whatToDocument],
  },
  {
    id: 'svc-02', order: 2, slug: 'pet-errands-coordination', status: 'published', featuredOnHome: false,
    name: 'Pet-Related Errands and Coordination', icon: 'paw', group: 'errands', delivery: 'mixed',
    summary: 'Pet food and supply runs, collecting orders, and coordinating grooming, vet and other pet service appointments.',
    intro: 'Keep your pets well supplied without the extra trips. We can buy and collect pet supplies and help arrange appointments with pet service providers.',
    offerings: ['Pet food and supply shopping', 'Collecting orders from pet shops', 'Booking and coordinating grooming or vet appointments', 'Other suitable pet-related errands'],
    notes: ['Animal handling, pet transport and specialized care are only arranged when it is safe and suitable, and may require a qualified provider.', 'We do not provide veterinary advice or treatment.'],
    deliveryNote: 'Errands may be done directly; grooming, veterinary and other animal care is provided by the relevant professionals.',
    pricing: QUOTE, formFields: [F.pet],
  },
  {
    id: 'svc-03', order: 3, slug: 'personal-shopping-convenience', status: 'published', featuredOnHome: true,
    name: 'Personal Shopping and Convenience', icon: 'bag', group: 'errands', delivery: 'direct',
    summary: 'Pabili and shopping assistance: we buy and collect the things you need, following your list and instructions.',
    intro: 'Tell us what you need and where to get it. We shop according to your list and instructions, agree any substitutions with you, and collect or deliver your purchases.',
    offerings: ['Shopping from your list', 'Collecting purchases and pre-ordered items', 'Sourcing everyday items', 'Other convenience requests'],
    notes: ['Purchases and related expenses are handled as agreed in your quotation.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-04', order: 4, slug: 'moving-organizing-decluttering', status: 'published', featuredOnHome: false,
    name: 'Moving, Organizing, and Decluttering', icon: 'boxes', group: 'property', delivery: 'mixed',
    summary: 'Help organizing, decluttering and preparing for a move: sorting, packing, labelling and coordinating the next steps.',
    intro: 'An extra pair of hands to get a room, home or small office in order, or to prepare for a move.',
    offerings: ['Sorting, organizing and labelling', 'Decluttering coordination (donate, sell, dispose)', 'Packing and moving preparation', 'Coordinating with movers or haulers'],
    notes: ['Heavy moving, hauling and specialist work are not included unless separately confirmed, and may be handled by third-party providers.'],
    deliveryNote: 'Organizing help may be done directly; heavy moving and hauling is arranged with suitable providers.',
    pricing: QUOTE, formFields: [F.volume],
  },
  {
    id: 'svc-05', order: 5, slug: 'travel-transportation-accompaniment', status: 'published', featuredOnHome: false,
    name: 'Travel, Transportation, and Accompaniment', icon: 'route', group: 'personal', delivery: 'mixed',
    summary: 'Travel and itinerary coordination, help arranging transport, and someone to accompany you to appointments.',
    intro: 'We help you plan and coordinate trips and appointments, arrange suitable transport, and can accompany you or a family member where agreed.',
    offerings: ['Itinerary and travel coordination', 'Arranging transport with suitable providers', 'Accompaniment to appointments and errands', 'Travel-related errands'],
    notes: ['Coordinating transport is different from providing it. Any transportation is arranged in line with applicable laws, licensing and insurance requirements.'],
    deliveryNote: 'Coordination and accompaniment may be done directly; transportation is provided by appropriately licensed operators.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-06', order: 6, slug: 'repair-servicing-item-transport', status: 'published', featuredOnHome: true,
    name: 'Repair, Servicing, and Item Transport', icon: 'wrench', group: 'property', delivery: 'coordinated',
    summary: 'We coordinate repairs, maintenance, technician appointments, and the safe drop-off and collection of items for servicing. Electrical and plumbing services may be arranged through qualified third-party providers.',
    intro: 'Skip the back-and-forth with repair shops. We arrange servicing appointments, follow up on progress, and transport suitable items to and from the shop where feasible.',
    offerings: ['Booking repair and servicing appointments', 'Bringing items to and from service shops', 'Following up on repair status', 'Comparing service options'],
    notes: ['Repairs are performed by the service shop or provider. Item transport depends on size, weight and value.'],
    deliveryNote: 'Coordination and item transport may be done directly; repairs are performed by third-party providers.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-07', order: 7, slug: 'property-visits-documentation', status: 'published', featuredOnHome: true,
    name: 'Property Visits and Visual Documentation', icon: 'house', group: 'property', delivery: 'direct',
    summary: 'Visits to a house, unit or lot on your behalf, with photos and a visual condition report.',
    intro: 'For owners, buyers and families who can’t easily get there: we visit the property, document what we see, and send you photos and notes. We can also coordinate with owners or authorized representatives.',
    offerings: ['Property visits on your behalf', 'Visual condition reports with photos', 'Photo documentation before or after a tenancy or repair', 'Coordinating access with owners or authorized representatives'],
    notes: ['A visual report is not a professional engineering inspection, a formal appraisal or a legal certification.', 'Access requires the permission of the owner or an authorized representative.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [F.propertyType, F.authorized, F.whatToDocument],
  },
  {
    id: 'svc-08', order: 8, slug: 'personal-assistant-lifestyle', status: 'published', featuredOnHome: false,
    name: 'Personal Assistant and Lifestyle Management', icon: 'calendar', group: 'personal', delivery: 'direct',
    summary: 'Scheduling help, reminders, bookings and personal administration for people whose to-do lists keep growing.',
    intro: 'Practical, on-call help with the small things that take up your time: bookings, reminders, follow-ups and everyday coordination.',
    offerings: ['Scheduling and appointment booking', 'Reservations and reminders', 'Personal administration and follow-ups', 'Everyday coordination'],
    notes: [],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-09', order: 9, slug: 'personal-errands-shopping', status: 'published', featuredOnHome: true,
    name: 'Personal Errands and Shopping', icon: 'cart', group: 'errands', delivery: 'direct',
    summary: 'Pabili requests, grocery shopping assistance, pick-ups, drop-offs and the everyday errands that fill your day.',
    intro: 'From grocery runs to dropping off and collecting items, we handle everyday errands so you don’t have to.',
    offerings: ['Pabili and grocery shopping assistance', 'Collecting purchases and orders', 'Delivering or collecting suitable items', 'Everyday errands'],
    notes: ['We can’t handle prohibited goods, restricted transactions, or requests that are unsafe or unsuitable.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-10', order: 10, slug: 'family-senior-personal-assistance', status: 'published', featuredOnHome: true,
    name: 'Family, Senior, and Personal Assistance', icon: 'heart', group: 'personal', delivery: 'direct',
    summary: 'Non-medical, practical support for families and senior citizens: errands, appointment coordination and other agreed help.',
    intro: 'Practical help for families and older relatives: errands, appointment coordination, and other everyday support you agree with us.',
    offerings: ['Errands for seniors and families', 'Appointment coordination and accompaniment', 'Check-ins and practical everyday help'],
    notes: ['This is non-medical assistance. We do not provide medical treatment, nursing or regulated care services.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-11', order: 11, slug: 'business-office-document-errands', status: 'published', featuredOnHome: true,
    name: 'Business, Office, and Document Errands', icon: 'document', group: 'business', delivery: 'direct',
    summary: 'Office errands, document collection and delivery, administrative coordination and government compliance-related errands.',
    intro: 'Support for individuals and small businesses: we collect and deliver documents, run office errands and help with administrative and compliance-related tasks.',
    offerings: ['Document collection and delivery', 'Office errands and supply runs', 'Administrative coordination', 'Government compliance and document assistance'],
    notes: ['See Government Compliance and Document Assistance for what that service includes and its limits.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-12', order: 12, slug: 'events-gifts-special-occasions', status: 'published', featuredOnHome: false,
    name: 'Events, Gifts, and Special Occasions', icon: 'gift', group: 'errands', delivery: 'mixed',
    summary: 'Gift sourcing and purchasing, delivery coordination, and errands and preparation for events and special occasions.',
    intro: 'Make occasions easier: we help find and buy gifts, coordinate deliveries, and run errands to get ready for your event.',
    offerings: ['Gift sourcing and purchasing', 'Delivery coordination', 'Picking up cakes, flowers and orders', 'Event errands and preparation support'],
    notes: [],
    deliveryNote: 'Errands may be done directly; event services such as catering are provided by third-party suppliers.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-13', order: 13, slug: 'research-sourcing-special-requests', status: 'published', featuredOnHome: false,
    name: 'Research, Sourcing, and Special Requests', icon: 'search', group: 'business', delivery: 'direct',
    summary: 'Finding hard-to-find products, comparing options, locating service providers and researching what you need.',
    intro: 'Short on time to look around? We find products, compare options and prices, and locate suitable service providers so you can decide.',
    offerings: ['Finding and sourcing products', 'Comparing options and prices', 'Locating service providers', 'Researching your requirements'],
    notes: ['Specialist advice or formal professional assessments may require a qualified third party.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-14', order: 14, slug: 'digital-technology-assistance', status: 'published', featuredOnHome: true,
    name: 'Digital and Technology Assistance', icon: 'laptop', group: 'business', delivery: 'mixed',
    summary: 'From website development and AI video production to digital content, home automation, and technology troubleshooting, we help coordinate practical technology solutions.',
    intro: 'Help with everyday technology and digital projects. Some work we handle directly; larger or specialist projects are referred to suitable technical providers, and we’ll tell you which is which.',
    offerings: ['Basic technology setup and troubleshooting', 'Website development coordination', 'AI-assisted video production', 'Digital content assistance', 'Home automation assistance', 'Coordination with specialist technical providers'],
    notes: ['We will tell you clearly whether a task is done directly or referred to an external specialist.'],
    deliveryNote: 'A mix: basic setup and assistance may be done directly; specialist work is referred to external providers.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-15', order: 15, slug: 'waiting-queueing-presence', status: 'published', featuredOnHome: true,
    name: 'Waiting, Queueing, and Physical Presence', icon: 'clock', group: 'errands', delivery: 'direct',
    summary: 'Someone to queue, wait, attend an appointment or be present for a delivery or technician, where allowed.',
    intro: 'Save hours of waiting. We can queue, hold your place, or be present to receive a delivery or visiting technician, where the establishment’s rules allow it.',
    offerings: ['Queueing and waiting on your behalf', 'Being present for deliveries or technicians', 'Authorized in-person assistance'],
    notes: ['Availability and eligibility depend on the establishment’s policies and applicable rules. Some transactions require you to appear in person.'],
    deliveryNote: 'Usually carried out directly by AT YOUR SERVICE.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-16', order: 16, slug: 'vehicle-coordination', status: 'published', featuredOnHome: false,
    name: 'Vehicle-Related Coordination', icon: 'car', group: 'property', delivery: 'coordinated',
    summary: 'Booking vehicle servicing, coordinating repairs, vehicle-related errands and connecting you with suitable providers.',
    intro: 'We take care of the coordination around your vehicle: booking servicing, following up on repairs and running related errands.',
    offerings: ['Booking servicing and maintenance appointments', 'Repair coordination and follow-ups', 'Vehicle-related errands', 'Connecting you with suitable providers'],
    notes: ['AT YOUR SERVICE does not perform automotive repairs. Repairs are carried out by appropriately qualified providers.'],
    deliveryNote: 'Coordination by AT YOUR SERVICE; repairs by third-party providers.',
    pricing: QUOTE, formFields: [F.vehicle],
  },
  {
    id: 'svc-17', order: 17, slug: 'relocation-settling-in', status: 'published', featuredOnHome: false,
    name: 'Relocation and Settling-In Assistance', icon: 'key', group: 'personal', delivery: 'mixed',
    summary: 'Practical help moving into Quezon City: coordinating the move, sourcing household essentials and settling-in errands.',
    intro: 'New to the area? We help with the practical side of settling in, from household essentials to coordinating with the providers you’ll need.',
    offerings: ['Moving coordination', 'Sourcing household necessities', 'Settling-in errands', 'Coordinating with utility and service providers'],
    notes: [],
    deliveryNote: 'Errands may be done directly; moving and utilities are handled by the relevant providers.',
    pricing: QUOTE, formFields: [],
  },
  {
    id: 'svc-18', order: 18, slug: 'property-sales-rentals', status: 'published', featuredOnHome: false,
    name: 'Property Sales and Rentals — Partner Real Estate Broker', icon: 'building', group: 'partners', delivery: 'coordinated',
    summary: 'Help with property inquiries, viewings, sales and rentals, coordinated with our partner real estate broker.',
    intro: 'Looking to buy, sell, rent or lease out a property? We help coordinate your inquiry and viewings, and connect you with our partner real estate broker.',
    offerings: ['Coordinating property inquiries', 'Arranging viewings', 'Connecting you with our partner real estate broker'],
    notes: ['AT YOUR SERVICE is not a licensed real estate broker. Regulated real estate activities are handled by our partner broker or other appropriately licensed professionals, as required by Philippine law.'],
    deliveryNote: 'Coordination by AT YOUR SERVICE; regulated real estate services by the partner broker.',
    pricing: THIRD_PARTY, formFields: [F.realEstate, F.propertyType],
  },
  {
    id: 'svc-19', order: 19, slug: 'technical-repairs-specialists', status: 'published', featuredOnHome: false,
    name: 'Technical Repairs and Specialist Services — External Providers', icon: 'tools', group: 'partners', delivery: 'coordinated',
    summary: 'Electrician services, plumbing services and other specialist repairs, arranged through qualified external providers.',
    intro: 'For work that needs a specialist, we coordinate with qualified external providers, including electricians and plumbers, and help you through scheduling, access and follow-up.',
    offerings: ['Electrician services (through qualified providers)', 'Plumbing services (through qualified providers)', 'Appropriate specialist repairs', 'Technical inspections or servicing through qualified providers'],
    notes: ['Electrical, plumbing and specialist work is performed by third-party providers, not by AT YOUR SERVICE.', 'Final costs often depend on the provider’s own inspection and quotation.'],
    deliveryNote: 'Coordination by AT YOUR SERVICE; the work itself is performed by qualified or licensed third-party providers.',
    pricing: THIRD_PARTY, formFields: [F.issue],
  },
  {
    id: 'svc-20', order: 20, slug: 'other-services-referrals', status: 'published', featuredOnHome: false,
    name: 'Other Outsourced Services and Professional Referrals', icon: 'sparkle', group: 'partners', delivery: 'coordinated',
    summary: 'Requests outside our main categories that can be coordinated through legitimate external providers.',
    intro: 'Have a need that doesn’t fit the categories above? Tell us. We review each request individually and, where suitable, coordinate it through legitimate external providers.',
    offerings: ['Individually reviewed special requests', 'Referrals to appropriate professionals', 'Coordination with legitimate external providers'],
    notes: ['Every request is reviewed individually and is subject to feasibility, availability, safety and legal requirements.'],
    deliveryNote: 'Usually coordinated with external providers.',
    pricing: QUOTE, formFields: [],
  },

  /* ---------- Personal care & laundry: COMING SOON (no provider partnerships yet) ---------- */
  {
    id: 'svc-21', order: 21, slug: 'laundry-pickup-delivery', status: 'published', availability: 'coming_soon', featuredOnHome: false,
    name: 'Laundry Pickup and Delivery', icon: 'shirt', group: 'care', delivery: 'coordinated',
    summary: 'Laundry collected from your home or office, taken to a laundry provider, and returned to you, so you don’t have to make the trip.',
    intro: 'We plan to collect your laundry, bring it to a laundry provider for washing, drying and folding or pressing, and return it to your door. This service is being prepared, and provider availability is still to be confirmed.',
    offerings: ['Pickup of laundry from your home or office', 'Drop-off at a laundry provider', 'Return delivery of finished laundry', 'Coordinating special instructions with the provider'],
    useCases: ['Busy professionals with no time for laundry runs', 'Families with a large weekly load', 'Seniors who would rather not carry heavy bags', 'Small offices and rental units needing linens handled'],
    notes: ['Washing, drying and pressing are done by a third-party laundry provider, not by AT YOUR SERVICE.', 'Please point out delicate, special-care or high-value items. How they are handled depends on the provider’s terms, which we’ll explain before you confirm.'],
    deliveryNote: 'Pickup and delivery coordinated by AT YOUR SERVICE; laundering by a third-party laundry provider (to be confirmed).',
    faqs: [
      { id: 'faq-laundry-available', q: 'Is laundry pickup available now?', a: 'Not yet. We are still arranging provider partnerships, so availability has not been confirmed. You can send an inquiry and we’ll let you know when the service is available in your area.' },
      { id: 'faq-laundry-who', q: 'Who washes the laundry?', a: 'A third-party laundry provider. AT YOUR SERVICE coordinates the pickup, drop-off and return delivery.' },
      { id: 'faq-laundry-cost', q: 'How much will it cost?', a: 'Pricing hasn’t been set. When the service launches, costs (including the provider’s laundry charges and any pickup and delivery fees) will be explained before you confirm.' },
    ],
    pricing: THIRD_PARTY, formFields: [F.laundryLoad, F.specialCare],
  },
  {
    id: 'svc-22', order: 22, slug: 'home-service-manicure-pedicure', status: 'published', availability: 'coming_soon', featuredOnHome: false,
    name: 'Home Service Manicure and Pedicure', icon: 'hand', group: 'care', delivery: 'coordinated',
    summary: 'Manicure and pedicure at home, arranged with an independent nail care provider, for when getting to a salon isn’t convenient.',
    intro: 'We plan to arrange home service manicures and pedicures with independent nail care providers, so you can be pampered without leaving the house. This service is coming soon, and provider availability is still to be confirmed.',
    offerings: ['Home service manicure', 'Home service pedicure', 'Manicure and pedicure together', 'Arrangements for more than one person'],
    useCases: ['Relaxing at home after a busy week', 'Seniors or family members who find it hard to travel', 'Getting ready for an event or occasion', 'Small groups at home'],
    notes: ['Services will be performed by independent third-party providers, not by AT YOUR SERVICE.', 'This is a cosmetic service, not a medical or podiatry treatment. Please mention any skin, nail or health concerns in your inquiry.'],
    deliveryNote: 'Arranged by AT YOUR SERVICE; performed by an independent nail care provider (to be confirmed).',
    faqs: [
      { id: 'faq-nails-available', q: 'Can I book a home service manicure or pedicure now?', a: 'Not yet. Provider availability hasn’t been confirmed. Send an inquiry and we’ll contact you once we can arrange it in your area.' },
      { id: 'faq-nails-who', q: 'Who will do the manicure and pedicure?', a: 'An independent third-party provider. We’ll share who is providing the service before you confirm anything.' },
      { id: 'faq-nails-cost', q: 'What will it cost?', a: 'Pricing hasn’t been set. Costs will be explained clearly before you confirm a booking.' },
    ],
    pricing: THIRD_PARTY, formFields: [F.nailService, F.people],
  },
  {
    id: 'svc-23', order: 23, slug: 'haircuts-personal-grooming', status: 'published', availability: 'coming_soon', featuredOnHome: false,
    name: 'Haircuts and Personal Grooming', icon: 'scissors', group: 'care', delivery: 'coordinated',
    summary: 'Home service haircuts and basic personal grooming for adults, children and seniors, arranged with independent providers.',
    intro: 'We plan to arrange home service haircuts and basic grooming with independent barbers and hairdressers, which is especially helpful for those who find it hard to get to a shop. This service is coming soon, and provider availability is still to be confirmed.',
    offerings: ['Home service haircuts', 'Haircuts for children and seniors', 'Basic personal grooming, such as beard trims', 'Arrangements for more than one person'],
    useCases: ['Seniors or family members with limited mobility', 'Children who are more comfortable at home', 'Busy professionals short on time', 'Households wanting several haircuts in one visit'],
    notes: ['Services will be performed by independent third-party providers, not by AT YOUR SERVICE.', 'Please mention any scalp or skin concerns, or mobility needs, in your inquiry.'],
    deliveryNote: 'Arranged by AT YOUR SERVICE; performed by an independent barber or hairdresser (to be confirmed).',
    faqs: [
      { id: 'faq-hair-available', q: 'Is home service haircut available now?', a: 'Not yet. We’re still arranging provider partnerships, so availability hasn’t been confirmed. Send an inquiry and we’ll let you know when we can help.' },
      { id: 'faq-hair-seniors', q: 'Can you arrange a haircut for an elderly family member at home?', a: 'That’s one of the main reasons we’re preparing this service. Tell us about any mobility needs in your inquiry so we can plan for them once providers are available.' },
      { id: 'faq-hair-cost', q: 'How much will it cost?', a: 'Pricing hasn’t been set. Costs will be explained before you confirm anything.' },
    ],
    pricing: THIRD_PARTY, formFields: [F.groomingFor, F.people],
  },
  {
    id: 'svc-24', order: 24, slug: 'hair-makeup-services', status: 'published', availability: 'coming_soon', featuredOnHome: false,
    name: 'Hair and Makeup Services', icon: 'brush', group: 'care', delivery: 'coordinated',
    summary: 'Hair styling and makeup for events and special occasions, arranged with independent hair and makeup artists.',
    intro: 'We plan to help you find and schedule independent hair and makeup artists for occasions such as parties, photo shoots and formal events. This service is coming soon, and provider availability is still to be confirmed.',
    offerings: ['Event and special-occasion makeup', 'Hair styling', 'Hair and makeup for small groups', 'Coordinating schedules and location with the artist'],
    useCases: ['Birthdays, debuts and family celebrations', 'Graduations and formal events', 'Photo or video shoots', 'Business events and presentations'],
    notes: ['Services will be performed by independent third-party artists, not by AT YOUR SERVICE.', 'Please mention any allergies or skin sensitivities in your inquiry.'],
    deliveryNote: 'Arranged by AT YOUR SERVICE; performed by an independent hair and makeup artist (to be confirmed).',
    faqs: [
      { id: 'faq-hmu-available', q: 'Can I book hair and makeup for my event now?', a: 'Not yet. Provider availability hasn’t been confirmed. Send an inquiry with your event date and we’ll let you know whether we can help.' },
      { id: 'faq-hmu-who', q: 'Who are the artists?', a: 'Independent third-party hair and makeup artists. We’ll tell you who is providing the service before you confirm anything.' },
      { id: 'faq-hmu-cost', q: 'What will it cost?', a: 'Pricing hasn’t been set. It will depend on the services, number of people and location, and will be explained before you confirm.' },
    ],
    pricing: THIRD_PARTY, formFields: [F.occasion, F.people],
  },
];

/* =========================================================
   SPECIALTY SERVICES — explicitly visible offerings that also
   belong to a parent category. Each gets its own page.
   ========================================================= */
export const SPECIALTIES = [
  {
    id: 'spc-gov', order: 1, slug: 'government-compliance-document-assistance', status: 'published', parentId: 'svc-11',
    name: 'Government Compliance and Document Assistance', shortName: 'Government compliance & documents', icon: 'stamp', delivery: 'mixed',
    summary: 'Help organizing requirements, preparing documents, scheduling appointments and handling authorized document collection and submission.',
    intro: 'Paperwork for permits, registrations and other requirements can take a lot of time. We help you understand what is needed, get your documents in order, and handle authorized errands such as collection, submission and appointment scheduling.',
    offerings: ['Organizing administrative requirements', 'Helping you identify the relevant documents', 'Coordinating document preparation', 'Authorized document collection and submission', 'Scheduling appointments', 'Coordinating with relevant offices or qualified professionals', 'Compliance-related errands for businesses'],
    notes: ['The scope of what we can do depends on the agency, the transaction and the applicable rules. Some transactions require the applicant to appear personally.', 'We cannot guarantee approvals or outcomes, and we do not offer special access.', 'Activities reserved for lawyers, accountants or other licensed professionals are referred to qualified professionals.', 'AT YOUR SERVICE is a private business and is not affiliated with, endorsed by, or connected to any government agency.'],
    deliveryNote: 'Errands and coordination by AT YOUR SERVICE; professional services by qualified professionals where required.',
    pricing: QUOTE, formFields: [F.agency, F.transaction],
  },
  {
    id: 'spc-drone', order: 2, slug: 'drone-photography-videography', status: 'published', parentId: 'svc-01',
    name: 'Drone Photography and Videography', shortName: 'Drone photography & video', icon: 'drone', delivery: 'coordinated',
    summary: 'Aerial photos and video for properties, approved documentation and other suitable projects, through qualified operators.',
    intro: 'Aerial imagery can show a property or project in a way ground photos can’t. We coordinate drone photography and videography with qualified operators for suitable projects.',
    offerings: ['Property and lot imagery', 'Approved aerial documentation (e.g. construction progress)', 'Other suitable aerial photo and video projects'],
    notes: ['Availability depends on location, weather, airspace restrictions, applicable Philippine aviation regulations, any required permissions and operator availability.', 'Drone operations are not permitted everywhere. We check feasibility before confirming.', 'Flights are carried out by qualified operators where required.'],
    deliveryNote: 'Coordinated by AT YOUR SERVICE; flown by qualified drone operators.',
    pricing: QUOTE, formFields: [F.droneProject, F.droneSite],
  },
  {
    id: 'spc-electrician', order: 3, slug: 'electrician-services', status: 'published', parentId: 'svc-19',
    name: 'Electrician Services', shortName: 'Electrician services', icon: 'bolt', delivery: 'coordinated',
    summary: 'Electrical repairs, installations and checks arranged with qualified third-party electricians.',
    intro: 'We help you find and schedule a qualified electrician, coordinate access to your home or office, and follow up until the job is done.',
    offerings: ['Arranging qualified electricians', 'Scheduling and access coordination', 'Following up on quotations and completion'],
    notes: ['Electrical work is performed by qualified third-party electricians, not by AT YOUR SERVICE.', 'The final cost depends on the electrician’s own inspection and quotation.', 'For immediate dangers such as sparks or a burning smell, switch off the power if it is safe and contact a qualified professional or emergency services right away.'],
    deliveryNote: 'Coordinated by AT YOUR SERVICE; performed by qualified third-party electricians.',
    pricing: THIRD_PARTY, formFields: [F.issue, F.propertyType],
  },
  {
    id: 'spc-plumbing', order: 4, slug: 'plumbing-services', status: 'published', parentId: 'svc-19',
    name: 'Plumbing Services', shortName: 'Plumbing services', icon: 'droplet', delivery: 'coordinated',
    summary: 'Leaks, clogs, fixture installation and other plumbing work arranged with qualified third-party plumbers.',
    intro: 'We help you get a qualified plumber scheduled, coordinate access, and keep track of the quotation and the work.',
    offerings: ['Arranging qualified plumbers', 'Scheduling and access coordination', 'Following up on quotations and completion'],
    notes: ['Plumbing work is performed by qualified third-party plumbers, not by AT YOUR SERVICE.', 'The final cost depends on the plumber’s own inspection and quotation.', 'For major leaks or flooding, shut off the water supply if it is safe and contact a professional right away.'],
    deliveryNote: 'Coordinated by AT YOUR SERVICE; performed by qualified third-party plumbers.',
    pricing: THIRD_PARTY, formFields: [F.issue, F.propertyType],
  },
];

export const NOT_SURE = { slug: 'not-sure', name: 'Not sure — please help me choose' };

/* ---------- helpers (keep pages simple) ---------- */
const byOrder = (a, b) => a.order - b.order;
export const publishedServices = () => SERVICES.filter((s) => s.status === 'published').sort(byOrder);
export const publishedSpecialties = () => SPECIALTIES.filter((s) => s.status === 'published').sort(byOrder);
export const allServicePages = () => [...publishedServices(), ...publishedSpecialties()];
export const findService = (slug) => allServicePages().find((s) => s.slug === slug);
export const findById = (id) => [...SERVICES, ...SPECIALTIES].find((s) => s.id === id);
export const childrenOf = (id) => publishedSpecialties().filter((s) => s.parentId === id);
export const serviceUrl = (s) => `/services/${s.slug}/`;
export const bookUrl = (s) => (s ? `/book/?service=${s.slug}` : '/book/');
