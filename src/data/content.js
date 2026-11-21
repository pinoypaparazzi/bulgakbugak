/* =========================================================
   PAGE CONTENT — How it works, pricing, expectations, FAQ.
   Plain text here is also used for the Google structured data
   (FAQ), so keep answers accurate and up to date.
   ========================================================= */

export const STEPS = [
  {
    icon: 'chat',
    title: 'Tell us what you need',
    text: 'Send a booking request with the service, location, preferred schedule and any details that help us understand the task.',
  },
  {
    icon: 'receipt',
    title: 'Receive a quotation',
    text: 'We review your request, confirm whether it’s feasible and available, and explain the service fee and any additional expenses.',
  },
  {
    icon: 'handshake',
    title: 'Confirm your booking',
    text: 'You approve the quotation and agree to the arrangements. Work begins only after you confirm.',
  },
  {
    icon: 'check-badge',
    title: 'Get it done',
    text: 'We do the task ourselves or coordinate with a suitable assistant or provider, then let you know how it went.',
  },
];

/* PRICING — no fixed rates yet. When rates are final, you can add a
   `rates` list here and show it in src/components/Pricing.jsx. */
export const PRICING = {
  factors: [
    { icon: 'tag', label: 'Type of service' },
    { icon: 'clock', label: 'Time required' },
    { icon: 'pin', label: 'Location' },
    { icon: 'layers', label: 'Complexity' },
    { icon: 'boxes', label: 'Resources needed' },
  ],
  disclosures: [
    {
      title: 'Your quotation comes first',
      text: 'You receive a quotation before you confirm. Submitting a request doesn’t commit you to anything.',
    },
    {
      title: 'Expenses disclosed up front',
      text: 'Transportation, fuel, parking, purchases and other third-party expenses are explained clearly and handled as agreed in your quotation.',
    },
    {
      title: 'Specialist charges shown separately',
      text: 'Services delivered by external specialists or partners may have their own provider charges, which we’ll point out.',
    },
    {
      title: 'No hidden fees',
      text: 'Any advance payment, reimbursement arrangement or handling fee is disclosed before you commit.',
    },
  ],
};

export const EXPECTATIONS = [
  {
    icon: 'chat',
    title: 'Clear communication',
    text: 'We confirm the details of your request and keep you informed about how it’s going.',
  },
  {
    icon: 'receipt',
    title: 'Transparent quotations',
    text: 'You’ll know the service fee and expected expenses before deciding to proceed.',
  },
  {
    icon: 'handshake',
    title: 'Confirmation before work begins',
    text: 'Nothing starts until you’ve reviewed and approved the arrangements.',
  },
  {
    icon: 'network',
    title: 'Dependable coordination',
    text: 'When a task needs a specialist, we coordinate with an appropriate provider and tell you who is involved.',
  },
  {
    icon: 'shield',
    title: 'Honest about what we can do',
    text: 'If a request isn’t feasible or isn’t something we can take on, we’ll tell you plainly.',
  },
  {
    icon: 'hand',
    title: 'Help that fits your day',
    text: 'Whether you need a hand for a few hours or a full day, tell us what you need and we’ll see how we can help.',
  },
];

export const FAQS = [
  {
    q: 'What is AT YOUR SERVICE?',
    a: 'AT YOUR SERVICE is a personal assistance and service-coordination company. We help individuals, families and small businesses with errands, everyday tasks and arranging services, so you don’t have to handle everything yourself.',
  },
  {
    q: 'What services can I request?',
    a: 'We currently offer 20 service categories, including errands and personal shopping, grocery shopping assistance, document errands, queueing, family and senior assistance, property visits, digital help and more. See the Services section for the full list.',
  },
  {
    q: 'Where do you currently operate?',
    a: 'We are running a pilot program in Quezon City, focused on the streets and areas listed in our coverage section. Please contact us to confirm availability for your specific location and requested service.',
  },
  {
    q: 'How do I book a service?',
    a: 'Fill in the booking form on this page, or call, Viber or email us. We’ll review your request and send a quotation. Your booking is confirmed only after you approve the quotation.',
  },
  {
    q: 'How much do services cost?',
    a: 'Pricing depends on the service, the time required, the location, the complexity and the resources needed. We provide a quotation before you confirm, so you know the costs before deciding.',
  },
  {
    q: 'Do you accept requests outside the listed categories?',
    a: 'You’re welcome to ask. Whether we can accept a request depends on feasibility, availability, and any professional or legal requirements that apply.',
  },
  {
    q: 'Can you arrange services through third-party providers?',
    a: 'Yes, for some needs. Specialist work such as technical repairs is coordinated with external providers, and property sales and rentals are handled through a partner real estate broker. These providers may charge separately, and we’ll explain this in your quotation.',
  },
  {
    q: 'Are bookings automatically confirmed?',
    a: 'No. Submitting a request or inquiry does not confirm a booking. We first check feasibility and availability, then send a quotation. The booking is confirmed only once you approve it.',
  },
  {
    q: 'How are transportation and other expenses handled?',
    a: 'Transportation, fuel, parking, purchases and other third-party expenses are disclosed in your quotation and handled as agreed with you. Any advance payment, reimbursement or handling fee is explained before you commit.',
  },
  {
    q: 'What happens if my requested service is unavailable?',
    a: 'We’ll let you know as soon as possible. Where it makes sense, we may suggest another schedule or a different way to get it done, but you are never obligated to proceed.',
  },
];
