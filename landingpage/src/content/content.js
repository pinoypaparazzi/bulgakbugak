/* =========================================================
   GENERAL PAGE CONTENT — process steps, pricing principles,
   trust items and FAQ.
   TEMPORARY CONTENT SOURCE for future "settings"/"faqs" tables.
   FAQ answers are also used for Google structured data, so keep
   them accurate. Policies that are not yet decided (cancellations,
   payment methods, hours, guarantees) are deliberately NOT stated.
   ========================================================= */

export const STEPS = [
  { icon: 'chat', title: 'Tell us what you need', text: 'Send a request with the service, location, preferred schedule and any details that help us understand the task.' },
  { icon: 'search', title: 'We review and clarify', text: 'We look at your request and contact you to clarify the details, if needed.' },
  { icon: 'receipt', title: 'We confirm scope and pricing', text: 'We confirm availability, what’s included, and the pricing. Nothing starts until you approve.' },
  { icon: 'check-badge', title: 'We get it done', text: 'We carry out the agreed service, or coordinate it with an appropriate provider, and keep you informed.' },
];
export const STEPS_NOTE =
  'Submitting a request does not confirm a booking. Requests involving third-party providers (for example electricians, plumbers, drone operators or our partner broker) may need extra coordination and confirmation.';

export const PRICING_PRINCIPLES = {
  intro: 'Some services will have published prices. Others depend on the details, so we’ll give you a quotation first. Either way, you’ll know the costs before you commit.',
  factors: [
    { icon: 'tag', label: 'Type of service' },
    { icon: 'clock', label: 'Time required' },
    { icon: 'pin', label: 'Location' },
    { icon: 'layers', label: 'Complexity' },
    { icon: 'boxes', label: 'Materials & resources' },
  ],
  chargeTypes: [
    { title: 'AT YOUR SERVICE fees', text: 'Our fee for coordinating or carrying out the agreed task.' },
    { title: 'Third-party provider charges', text: 'What an external provider (for example an electrician, plumber, drone operator or broker) charges for their own work. These often depend on the provider’s inspection and quotation.' },
    { title: 'Additional expenses', text: 'Transportation, fuel, parking, materials, purchases and similar costs, handled as agreed in your quotation.' },
  ],
  disclosures: [
    'All applicable charges are disclosed before you commit.',
    'We don’t promise a fixed final cost for work that depends on an external provider’s inspection or quotation.',
    'Any advance payment, reimbursement or handling fee is explained in your quotation.',
  ],
};

export const EXPECTATIONS = [
  { icon: 'chat', title: 'Clear communication', text: 'We confirm the details of your request and keep you informed.' },
  { icon: 'handshake', title: 'Confirmation before work begins', text: 'Nothing starts until you’ve reviewed and approved the arrangements.' },
  { icon: 'receipt', title: 'Transparent quotations', text: 'You’ll see our fees, provider charges and expected expenses before deciding.' },
  { icon: 'network', title: 'Appropriate provider coordination', text: 'Specialist work goes to suitable providers, and we tell you who is involved.' },
  { icon: 'shield', title: 'Respect for your privacy', text: 'We use the details you share to handle your request, and ask you not to send sensitive information you don’t need to.' },
];

export const FAQS = [
  { id: 'faq-areas', q: 'What areas do you serve?', a: 'We are running a pilot program in selected areas of Quezon City. You can see the list of streets and areas on our Contact page. Availability for your exact location is confirmed when we review your request.' },
  { id: 'faq-request', q: 'How do I request a service?', a: 'Use the Book a Service form, or contact us by phone, Viber, email or Facebook. We’ll review your request, clarify details if needed, and confirm availability, scope and pricing.' },
  { id: 'faq-direct', q: 'Are all services performed directly by AT YOUR SERVICE?', a: 'No. Many errands and assistance tasks are handled directly. Specialist work such as electrical, plumbing, drone flights and real estate transactions is carried out by qualified third-party providers, which we coordinate. Each service page explains who performs the work.' },
  { id: 'faq-pricing', q: 'How is pricing determined?', a: 'Pricing depends on the service, time required, location, complexity and materials or resources needed. Where a published price isn’t available, we provide a quotation before you commit. Third-party charges and additional expenses are disclosed separately.' },
  { id: 'faq-unlisted', q: 'Can I request a service that is not listed?', a: 'Yes, you can ask. Each request is reviewed individually and is subject to feasibility, availability, safety and legal requirements.' },
  { id: 'faq-third-party', q: 'Are third-party services available?', a: 'Yes, for some needs. We coordinate with external providers such as electricians, plumbers, drone operators and our partner real estate broker. Their charges may be separate from ours, and we’ll explain this before you commit.' },
  { id: 'faq-confirmed', q: 'Is my request automatically confirmed when I submit it?', a: 'No. Submitting a request does not confirm a booking or guarantee availability. Your booking is confirmed only after we’ve agreed the scope and pricing and you’ve approved it.' },
  { id: 'faq-drone', q: 'How do drone service requests work?', a: 'Tell us about the project and the location. We check feasibility, including weather, airspace restrictions, applicable Philippine aviation regulations and any required permissions, and coordinate with a qualified operator. Drone flights are not possible everywhere.' },
  { id: 'faq-gov', q: 'Can you help with government compliance and documents?', a: 'Yes. We can help organize requirements, coordinate document preparation, schedule appointments and handle authorized collection and submission. What we can do depends on the agency, the transaction and the rules. We can’t guarantee approvals, and we are not affiliated with any government agency.' },
  { id: 'faq-electric-plumbing', q: 'How are electrician and plumbing services arranged?', a: 'We coordinate with qualified third-party electricians and plumbers: arranging the visit, coordinating access and following up. The work itself is performed by the provider, and the final cost usually depends on their own inspection and quotation.' },
  { id: 'faq-contact', q: 'How do I contact the team?', a: 'Call or message us on Viber at 0917-504-5959, email hello@atyourservice.com, or message our Facebook Page.' },
];
