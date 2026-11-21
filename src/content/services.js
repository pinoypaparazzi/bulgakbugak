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
   ========================================================= */

export const SERVICE_GROUPS = [
  { id: 'all', label: 'All services' },
  { id: 'errands', label: 'Errands & shopping' },
  { id: 'personal', label: 'Personal & family' },
  { id: 'property', label: 'Home, property & vehicles' },
  { id: 'business', label: 'Business, documents & digital' },
  { id: 'partners', label: 'Specialists & partners' },
];

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
    id: 'svc-06', order: 6, slug: 'repair-servicing-item-transport', status: 'published', featuredOnHome: false,
    name: 'Repair, Servicing, and Item Transport', icon: 'wrench', group: 'property', delivery: 'coordinated',
    summary: 'Arranging repairs and servicing appointments, following up with shops, and transporting suitable items where feasible.',
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
    id: 'svc-14', order: 14, slug: 'digital-technology-assistance', status: 'published', featuredOnHome: false,
    name: 'Digital and Technology Assistance', icon: 'laptop', group: 'business', delivery: 'mixed',
    summary: 'Practical tech help and digital coordination, from device setup and troubleshooting to websites, AI-assisted video and home automation.',
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
