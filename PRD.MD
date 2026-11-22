AT YOUR SERVICE --- Product Requirements Document (PRD)
Document status: Living document --- working baseline
Version: 0.1
Last updated: 22 November 2026
Business: AT YOUR SERVICE
Tagline: "Your Time Matters. Let Us Handle the Rest."
Initial pilot area: Quezon City, Philippines
Primary owner / decision-maker: Founder / business owner
Product direction: Public website + backend + Admin Panel + booking
and service-coordination platform
Purpose of this document

This PRD is the central working reference for the AT YOUR SERVICE
business and its digital platform. It should guide ChatGPT's planning
and recommendations and Claude Code's implementation. It is a living
document: the owner may update it as decisions are made. Do not treat
assumptions or proposals as approved requirements.

1. How to Use This PRD
1.1 Source of truth
- Treat this document as the current consolidated requirements
  baseline.
- The owner discusses product, business, design, and technical
  decisions with ChatGPT before committing to them.
- ChatGPT helps evaluate options, ask clarifying questions, and
  prepare implementation prompts.
- Claude Code implements only the approved scope and should inspect
  the existing repository before changing it.
- Update this document when decisions change. Do not silently change
  established requirements.
- If a requirement is unclear, contradictory, expensive, risky, or
  technically consequential, stop and ask for clarification rather
  than inventing an answer.
- Keep a clear distinction between:
  - Confirmed: explicitly decided by the owner.
  - Proposed: a recommendation awaiting owner approval.
  - Assumption: a temporary working interpretation.
  - Open question: unresolved and requiring a decision.
- Do not claim a feature works unless it has been implemented and
  tested.
- Do not fabricate customer reviews, service providers, prices,
  availability, credentials, business addresses, awards, business
  statistics, or successful transactions.
1.2 Change control
For material changes: 1. Explain the proposed change and why it matters.
2. Identify impact on customer experience, business operations,
security, costs, SEO, data, and future maintenance. 3. Ask the owner for
a decision where needed. 4. Update this PRD after approval. 5. Prepare a
specific Claude Code implementation prompt. 6. Implement and test the
change. 7. Report changed files, migrations, configuration, tests, known
limitations, and deployment implications.

The owner may provide new requirements at any time. This document should
evolve rather than freeze the product.
2. Product Vision and Business Model
2.1 Vision
AT YOUR SERVICE is a professional, approachable personal concierge and
service-coordination company. It helps customers save time by handling
everyday errands and coordinating appropriate third-party providers for
selected services.

The business should grow from a founder-operated pilot into a scalable
company that can delegate work to internal staff, coordinators, and
service providers. The platform must not assume that the founder will
personally perform every task indefinitely.
2.2 Positioning
- Brand: AT YOUR SERVICE
- Tagline: "Your Time Matters. Let Us Handle the Rest."
- Initial pilot location: Quezon City, Philippines
- Style: professional, friendly, trustworthy, approachable,
  modern, and corporate without feeling cold or impersonal.
- Business type: personal assistance, concierge, errands, and
  service coordination.
- Primary customer promise: help customers arrange practical
  services and everyday assistance through a clear, reliable point of
  contact.
AT YOUR SERVICE must clearly distinguish between work it performs
directly and services it coordinates through external providers.
2.3 Business principles
1. Be transparent about what is available and what still requires
   confirmation.
2. Do not promise instant availability when a provider or coordinator
   has not confirmed it.
3. Show pricing and additional costs clearly once approved pricing
   rules are established.
4. Protect customer information and only collect information necessary
   to fulfil a request.
5. Build a system that can be operated by a team, not just the founder.
6. Prefer reusable, data-driven features over hardcoded content.
7. Avoid unnecessary complexity before it provides business value.
8. Do not launch a service publicly as available until the owner
   approves its operational readiness.
9. Do not use paid advertising or initiate advertising spend without
   explicit owner approval.
10. Do not add massage to the public website, service catalogue, or
    public marketing while the owner's non-compete restriction remains
    in effect. The owner has said approximately 19 months remain as of
    the current discussion; re-check the status and obtain appropriate
    legal guidance before reconsidering it.
2.4 Business goals
- Establish a credible public presence for the Quezon City pilot.
- Help customers discover services through search engines and clear
  service pages.
- Convert website visitors into inquiries and, where appropriate,
  confirmed bookings.
- Coordinate third-party services without falsely representing
  providers as employees or confirmed partners.
- Centralize service descriptions, pricing, coverage, FAQs, blog
  posts, and website content.
- Reduce manual administrative work over time.
- Build a platform that can expand into additional service areas and
  operational roles after the pilot is validated.
2.5 Success measures --- proposed, not yet approved
Potential metrics include: - Qualified inquiries received. -
Inquiry-to-confirmed-booking conversion rate. - Completed jobs and
cancellation rate. - Response time and time to confirm a provider. -
Customer satisfaction and repeat usage. - Revenue, gross margin,
coordination fees, and third-party costs where applicable. - Provider
fulfilment rate and reliability. - Organic search impressions, clicks,
and qualified leads. - Blog readership and service-page conversion. -
Administrative time per request.

Open question: Set numeric targets only after baseline data and
business economics are understood.
3. Users and Roles
The product is intended to support four user groups. Their exact
permissions must be defined before implementation of the production
backend.
3.1 Customers
Customers should eventually be able to: - Browse service categories and
individual service pages. - Understand service scope, limitations,
availability status, and pricing format. - Submit inquiries or booking
requests. - Provide required task details and contact information. -
Receive acknowledgement and updates through approved channels. - Review
request status and relevant instructions, if a customer account or
secure tracking method is implemented. - Cancel or amend a request
according to approved policies. - Provide feedback after a completed
job, subject to anti-abuse controls.

A customer account is not confirmed as mandatory for the initial
release.
3.2 Administrator
The administrator is responsible for business configuration and platform
oversight. An eventual secure Admin Panel should allow authorized
administrators to manage, as applicable: - Business settings and contact
details. - Website navigation and homepage content. - Service catalogue,
categories, descriptions, images, requirements, limitations, and
publication status. - Pricing formats and approved prices. - Service
areas and coverage notes. - Booking rules, availability rules, and
service status. - Inquiries, bookings, assignments, and customer
communications. - Provider records and provider status. - Blog articles,
categories, tags, images, and SEO fields. - FAQs, policies, legal
content, and genuine testimonials. - Media assets and promotional
content. - Staff accounts, roles, permissions, and audit history. -
Reporting and operational settings.

This list is a target capability, not a claim that the Admin Panel
currently exists.
3.3 Internal staff and coordinators
Authorized staff should eventually be able to: - View and manage
assigned inquiries and jobs. - Contact customers and providers using
approved workflows. - Confirm details, quotes, and provider
availability. - Assign or reassign a provider. - Update request status
and record relevant notes. - Escalate complaints, safety concerns,
disputes, and exceptions. - Access only the customer and operational
information needed for their role.
3.4 Service providers
A future provider experience may allow approved providers to: - Maintain
contact and service information. - Declare service areas and
availability. - Accept or decline job requests. - View assigned jobs and
relevant customer instructions. - Update job status. - Submit completion
information and agreed charges. - Review their work history.

The provider portal is a future capability. Initially, provider
coordination may be handled manually by the owner or internal staff.
3.5 Role-based access
- Apply least-privilege access.
- Do not expose administrator or staff functions through public pages.
- Enforce authorization on the server, not only by hiding interface
  elements.
- Restrict access to personal data and operational notes by role.
- Log sensitive administrative changes where appropriate.

3.6 Staff portal roles --- Confirmed and implemented (November 2026)
The staff portal (staff/ app + Express API + MongoDB) has five staff
roles. Full details, including the permission matrix, are in
docs/AUTH.md; the single source of truth in code is
server/src/auth/roles.js.
- Super Duper Admin (super_duper_admin): full access to every
  implemented module and all administration. Initial account username:
  bologacbogac, created once by a command-line bootstrap and required
  to change its password at first sign-in.
- Super Admin (super_admin): broad administration, currently the same
  permission list as Super Duper Admin. It can never assign the Super
  Duper Admin role, raise its own role, or change a Super Duper Admin
  account. Open question: the owner's specific restrictions for Super
  Admin are still to be decided.
- Admin (admin): customers (CRM) and bookings, read and update.
- Investor (investor): read-only accounting records, transactions and
  sales reports. No create, edit, delete, refund or reversal rights.
- HR (hr): employee records (read, create, update) and employee skills.
Implemented rules:
- Only Super Duper Admin and Super Admin can create staff accounts.
  There is no public registration. New accounts receive a one-time
  temporary password and must change it at first sign-in.
- Accounts are deactivated, never deleted, to preserve audit history.
- Role, status and password changes end the account's existing
  sessions.
- Security events (sign-ins, password changes, account changes) are
  recorded in an append-only audit log.
Implemented so far: sign-in, password change, staff account
management and the audit log. Not built yet: the CRM, bookings, HR,
accounting, reports and settings modules. Their permissions exist,
but the modules and their data do not.
4. Scope and Delivery Phases
The owner selected a full business and platform scope, a hybrid
booking model, a hybrid provider model, and a preference to
develop the backend alongside the website rather than postponing all
backend planning.

This does not mean every feature should launch at once. Use staged
releases with clear acceptance criteria.
Phase 0 --- Existing website and requirements baseline
- Inspect and preserve the current repository and Git history.
- Keep the current Netlify deployment available while development
  proceeds.
- Maintain a working build and responsive public website.
- Use the current Netlify preview domain during development until the
  owner purchases and verifies a production domain.
- Do not assume that www.atyourservice.com is registered or
  controlled by the owner.
- Confirm actual current routes, components, build tooling, and
  dependencies by inspecting the repository; do not infer them from a
  screenshot or earlier description alone.
Phase 1 --- Public website and content foundation
- Responsive homepage.
- Service catalogue and service-detail pages.
- About, coverage, contact, FAQs, and relevant policy pages.
- Blog listing and individual article pages.
- SEO metadata and technical SEO foundations.
- Clear contact and inquiry paths.
- Centralized, data-driven content that can migrate to a database
  later.
- Accessible design, performance, error handling, and production build
  validation.
Phase 2 --- Backend foundation and secure Admin Panel
Develop alongside the website where feasible: - Choose and document a
suitable backend/database architecture after checking repository needs,
budget, deployment environment, and owner preferences. - Define the data
model and migrations. - Authentication and server-enforced
authorization. - Admin Panel for editing approved website content. -
Service and pricing management. - Blog management and publishing. -
Media management. - Inquiry storage and management. - Audit logs,
backups, validation, and recovery procedures.

Do not commit to a specific database, framework, authentication vendor,
or paid service until the trade-offs and costs have been discussed and
approved.
Phase 3 --- Hybrid booking and coordination workflow
- Inquiry-first flow for services that need manual checks.
- Instant booking only for services whose availability, price,
  duration, coverage, and fulfilment rules can be reliably verified.
- Coordinator dashboard and request status management.
- Provider records and manual assignment.
- Customer notifications through approved channels.
- Cancellation, rescheduling, exception, and complaint workflows.
- Payment integration only after the owner approves the payment model,
  provider, fees, and reconciliation rules.
Phase 4 --- Provider and operations expansion
Potential capabilities: - Provider portal. - Availability management. -
Provider acceptance and job assignment. - Service completion evidence
and customer feedback. - Operational reporting. - Automated reminders
and follow-ups. - More sophisticated matching, scheduling, and
service-area management.
Phase 5 --- Growth and optimization
Potential capabilities: - Additional geographic areas. - Additional
service categories and provider networks. - Search performance
improvements. - Repeat-customer workflows and loyalty mechanisms. -
Carefully controlled automation. - Customer accounts or mobile
experiences if validated by demand.

Phases may overlap. Any change to priority should be discussed with the
owner and reflected in this document.
5. Website Information Architecture
5.1 Main navigation
Target navigation: - Services - Pricing - Blog -
Contact - Book a Service

Include the approved brand logo on the navbar and footer and provide a
favicon. The logo is not considered finalized until the owner approves
the actual asset.

Navigation labels and destinations should be manageable centrally where
practical.
5.2 Homepage
The homepage should communicate: - What AT YOUR SERVICE does. - Who it
helps and where it operates. - The value proposition and tagline. - A
clear path to browse services. - A clear path to request assistance. -
Featured services. - A brief explanation of how the service-coordination
process works. - Coverage information. - Trust and transparency
information without fabricated proof. - Selected FAQs and/or blog
content where useful. - Contact options.

Do not crowd the homepage with every available service. The current
visual direction calls for a balanced grid of eight featured service
cards, with four columns on desktop where the viewport permits and
responsive layouts on smaller screens. A clear View All Services
link should lead to the full catalogue.

The exact eight featured services may change as the catalogue and
operational readiness evolve.
5.3 Services catalogue
- Provide a catalogue page with discoverable categories and service
  cards.
- Use dedicated SEO-friendly service-detail pages where a service
  warrants its own search intent and content.
- Keep service records in a centralized source or database rather than
  duplicating descriptions across components.
- Show a service's real status, including when it is coming soon or
  provider availability needs confirmation.
- Each service page should have a relevant contact or inquiry action.
- Never imply that a service is available simply because a page
  exists.
5.4 About, contact, FAQ, and policies
Include appropriate pages or sections explaining: - The business and its
service-coordination model. - Contact methods. - How inquiries and
confirmations work. - What customers can expect. - Service limitations
and provider dependencies. - Cancellations, refunds, liability, privacy,
and other policies once approved.

Do not invent company history, credentials, offices, awards, customer
counts, or testimonials.
5.5 Footer
Provide consistent access to: - Contact details. - Main service links. -
Blog. - Relevant policies. - Copyright and business identity.

Legal and policy content must be reviewed and approved by the owner and,
where appropriate, a qualified professional.
6. Brand, Visual Design, and UX
6.1 Direction
- Modern, clean, friendly, professional, corporate, and approachable.
- Use the owner-approved logo and its colors once finalized.
- Ensure legible typography, consistent spacing, clear hierarchy, and
  restrained visual effects.
- Avoid a generic template appearance where practical.
- Do not use imagery or icons that imply a provider, service,
  credential, or partnership that does not exist.
- Keep imagery appropriate to the actual service being described.
6.2 Responsive behavior
- Support desktop, tablet, and mobile layouts.
- Do not force desktop column counts onto narrow screens.
- Keep buttons and form controls usable on touchscreens.
- Avoid horizontal overflow and clipped content.
- Verify navigation, service cards, forms, blog cards, images, and
  footer at representative viewport sizes.
6.3 Accessibility
Target WCAG 2.2 AA practices where feasible: - Semantic structure and
meaningful headings. - Keyboard navigation and visible focus. -
Sufficient text and interface contrast. - Labels and useful error
messages for form controls. - Alternative text for informative images. -
Accessible link and button names. - Respect reduced-motion preferences
where applicable.
6.4 Content quality
- Write clear, natural, customer-focused copy.
- Avoid keyword stuffing, generic filler, and unsupported
  superlatives.
- Do not generate fabricated testimonials or present stock imagery as
  real customers or staff.
- Distinguish direct service delivery from third-party coordination.
7. Service Catalogue
The following 20 categories were previously established and should be
preserved in the full catalogue. Their precise relationship to
individual service records may be refined without silently deleting or
renaming the established categories.
1. Photography and Visual Reports
2. Pet-Related Errands and Coordination
3. Personal Shopping and Convenience
4. Moving, Organizing, and Decluttering
5. Travel, Transportation, and Accompaniment
6. Repair, Servicing, and Item Transport
7. Property Visits and Visual Documentation
8. Personal Assistant and Lifestyle Management
9. Personal Errands and Shopping
10. Family, Senior, and Personal Assistance
11. Business, Office, and Document Errands
12. Events, Gifts, and Special Occasions
13. Research, Sourcing, and Special Requests
14. Digital and Technology Assistance
15. Waiting, Queueing, and Physical Presence
16. Vehicle-Related Coordination
17. Relocation and Settling-In Assistance
18. Property Sales and Rentals --- Partner Real Estate Broker
19. Technical Repairs and Specialist Services --- External Providers
20. Other Outsourced Services and Professional Referrals
7.1 Explicit service offerings to represent
The catalogue should explicitly represent, where operationally
approved: - Drone photography and videography. - Government compliance
and document assistance. - Electrician service coordination through
qualified third-party providers. - Plumbing service coordination through
qualified third-party providers. - Website development coordination. -
AI video development coordination. - Digital content and technology
assistance. - Home automation and technology setup/troubleshooting. -
Property visits and visual documentation. - Property sales and rentals
through a partner real estate broker, with regulated activities handled
by appropriately licensed or authorized professionals. - Technical
repairs and specialist services through external providers.

Drone work must be described as subject to applicable aviation
regulations, airspace restrictions, permissions, weather, and operator
availability.

Government and document assistance must not promise government approval
or imply unauthorized representation, professional legal advice, or an
ability to bypass official requirements.

Electrician, plumbing, repair, real estate, and other specialist work
must be performed by suitably qualified or authorized providers where
required. AT YOUR SERVICE should describe its role accurately as
coordinator or referrer when it does not directly provide the regulated
work.
7.2 New service ideas under consideration
The owner has proposed adding: - Laundry Pickup and Delivery. - Home
Service Manicure and Pedicure. - Haircuts and Personal Grooming. - Hair
and Makeup Services. - Home cleaning coordination. - Parcel and document
delivery. - Home maintenance coordination. - Appointment and queue
assistance. - Event and party assistance. - Pet-care coordination.

Laundry and the three beauty/grooming service groups have been approved
for addition to the planned catalogue, with provider availability
clearly marked as unconfirmed until real providers and operating
processes are established. Other listed ideas are suggestions for
consideration, not confirmed launch commitments.
7.3 Massage restriction
Do not include massage in the public website, service catalogue, public
SEO content, social media marketing, or booking flow at this time. Do
not mention or link to any other massage business. Reconsider only after
the owner confirms the restriction has ended or obtains appropriate
legal clearance.
7.4 Service record requirements
Each service record should support fields such as: - Stable ID. - Name
and slug. - Category. - Short and long description. - Customer use cases
and inclusions. - Exclusions, requirements, and safety notes. -
Direct-delivery versus third-party-coordination designation. - Service
status: draft, coming soon, available, temporarily unavailable, or
archived (final statuses to be approved). - Geographic coverage. -
Pricing format and approved pricing data. - Images, icons, and alt
text. - SEO title, meta description, canonical configuration, and social
metadata as needed. - Related services and FAQs. - Publication status
and timestamps.

Do not make every field mandatory if it does not apply. Define
validation and editorial rules before implementing the production
schema.
8. Service Coverage
8.1 Initial area
The initial pilot is Quezon City, Philippines.

The following areas, roads, or corridors were previously supplied as
potential coverage references: - 15th Avenue - 20th Avenue - Anonas -
Aurora Boulevard - Balete Drive - Betty Go-Belmonte - Bonny Serrano
Avenue - Broadway Avenue - Don A. Roces Avenue - Dona Hemady Avenue - E.
Rodriguez Avenue - East Avenue - Ermin Garcia Street - Esteban Abada
Street - Gilmore Avenue - J. P. Rizal Street - Kalantiao Street -
Kalayaan Avenue - Kamias - Kamuning - Katipunan Avenue - Maginhawa
Street - Main Avenue - Mother Ignacia Avenue - N. Domingo Street - P.
Tuazon Boulevard - Quezon Avenue - Santolan Road - Scout Chuatoco
Street - Timog Avenue - Tomas Morato Avenue - Victoria Avenue -
Xavierville Avenue

Important: This is a list of potential coverage references, not a
guarantee that every address on or near these roads is serviceable.
Coverage must be confirmed operationally and may vary by service and
provider.
8.2 Map requirements
- Use a recognizable map of Quezon City when a map materially helps
  customers.
- Prefer an approach such as OpenStreetMap that does not require a
  paid API key, subject to usage terms and attribution.
- Do not draw fake precision polygons, claim exact boundaries that
  have not been validated, or add arbitrary markers that imply real
  offices.
- Provide a readable written coverage description as an alternative to
  the map.
- Make coverage configurable centrally where practical.
9. Pricing and Commercial Rules
9.1 Current status
Pricing is not finalized as a complete AT YOUR SERVICE pricing
model. Do not invent prices.

The system should support different pricing formats without requiring
source-code edits: - Fixed price. - Starting price. - Hourly rate. -
Price range. - Package price. - Quote required. - Third-party quote
required. - Other approved formats as needed.

These are supported formats, not an approval to use any particular
price.
9.2 Pricing display
For a service without an approved price, display an appropriate phrase
such as Request a Quote or Pricing to Be Confirmed.

Where applicable, clearly distinguish: - AT YOUR SERVICE's coordination
or service fee. - Third-party provider charges. - Transport, parking,
materials, delivery, or other extra charges. - Taxes or payment
processing fees, if applicable and approved. - Conditions that can
change the final quote.

Do not show hidden charges or present an indicative quote as a final
confirmed amount.
9.3 Unconfirmed commercial policies
Do not adopt prior ideas about separate fuel/parking charges, advances
for customer purchases, handling-fee percentages, commissions,
subscriptions, deposits, refunds, or payment terms as AT YOUR SERVICE
policy unless the owner explicitly approves them.
9.4 Open decisions
- Revenue model and whether AT YOUR SERVICE charges customers,
  providers, or both.
- Coordination fees, commissions, markups, and payment timing.
- Quote validity and approval process.
- Deposits, cancellation fees, refunds, and disputes.
- Tax and invoicing requirements.
- Supported payment methods and payment gateway.
- Rules for handling customer funds and provider payouts.
These require business and, where appropriate, professional advice
before implementation.
10. Hybrid Inquiry and Booking Model
The owner selected a hybrid model: - Inquiry-first for services
requiring manual provider, quote, or feasibility checks. - Instant
booking only for services where availability, price, coverage, duration,
and fulfilment can be reliably verified.
10.1 Inquiry-first flow
Target workflow: 1. Customer selects a service. 2. Customer sees the
service scope, requirements, coverage notes, pricing format, and
availability disclaimer. 3. Customer submits an inquiry with the minimum
required details. 4. The system validates the submission and stores it
securely once the backend is implemented. 5. The customer receives an
accurate acknowledgement. 6. The owner or coordinator reviews the
request. 7. The coordinator contacts the customer and, where necessary,
one or more providers. 8. Price, provider, timing, scope, and additional
charges are confirmed. 9. The customer explicitly accepts the proposed
arrangement. 10. The request becomes a confirmed booking only when the
relevant confirmation rules are satisfied. 11. Staff/provider records
status changes and completion. 12. Follow-up, feedback, complaint, or
cancellation handling occurs according to approved policies.

An acknowledgement of receipt must not be described as a confirmed
booking.
10.2 Instant booking flow
Only enable instant booking for services that have reliable, current
availability and defined fulfilment rules.

Required controls may include: - Valid availability inventory. - Correct
service area and duration. - Approved pricing and fee calculation. -
Conflict prevention for concurrent requests. - Clear booking
confirmation and cancellation terms. - Reliable notifications and audit
records. - Recovery behavior when a provider or system becomes
unavailable.

If these requirements cannot be met, route the customer to
inquiry-first.
10.3 Hybrid provider model
Initially, the owner or internal coordinator may manage providers
manually. A provider portal can be added later.

The data model should avoid making manual coordination impossible to
migrate into provider-managed workflows later.
10.4 Booking statuses
Proposed status lifecycle to refine before implementation: - New
inquiry. - Under review. - Awaiting customer information. - Sourcing
provider. - Awaiting provider confirmation. - Quote prepared. - Awaiting
customer approval. - Confirmed. - In progress. - Completed. -
Cancelled. - Unable to fulfil. - Disputed or escalated.

Not all services need every status. Final transitions, authorized roles,
notification rules, and audit requirements remain to be specified.
11. Contact and Customer Communications
11.1 Current contact details supplied by the owner
- Phone/Viber: 0917-504-5959
- Email: hello@atyourservice.com
- Facebook Page: https://www.facebook.com/atyourservice888/
- Website reference: www.atyourservice.com --- domain ownership
  and live status must be verified before it is treated as the
  production domain.
11.2 Communication requirements
- Provide clear contact options on the website.
- Use approved contact details consistently.
- Do not fabricate a message-sending or booking-success state.
- If a form is not connected to a functioning backend, explain its
  actual limitations or use a working contact route.
- Once the backend is implemented, store inquiries securely and show
  accurate submission outcomes.
- Define templates and rules for acknowledgement, quote, confirmation,
  changes, cancellation, completion, and escalation.
- Avoid sending promotional communications without appropriate consent
  and a compliant opt-out mechanism.
Open questions: Which channels will be used for automated messages
(email, SMS, Viber, or others), and which notification provider and
budget are acceptable?
12. Blog and Content Publishing
The blog is a required core feature, not an optional future addition.
12.1 Public blog
Required: - Public /blog/ listing. - Featured content where
configured. - Blog cards with cover image, title, excerpt, date, and
link to read more. - Categories and tags. - Pagination or load-more
behavior. - Responsive design. - Useful empty state when no posts are
published. - Individual SEO-friendly article pages using reusable
templates. - Related posts and relevant service links. - Appropriate
calls to action. - Internal linking and accessible media.
12.2 Article content model
Support fields such as: - Unique ID. - Title and unique slug. -
Excerpt. - Article body. - Cover image and alt text. - Author. -
Category and tags. - SEO title and meta description. - Canonical URL
where needed. - Social sharing metadata. - Draft/publication status. -
Created, modified, publication, and optional scheduled timestamps.
12.3 Admin publishing
The future Admin Panel should support: - Create, edit, preview, save
draft, publish, unpublish, and archive. - Image/media selection and alt
text. - Category and tag management. - SEO fields. - Publication dates
and, if implemented, scheduled publishing. - Validation for duplicate
slugs and missing required fields. - Public display of published
articles only. - Exclusion of drafts and unpublished articles from the
public sitemap and public listings.

Future blog publishing should not require the owner to edit source code
or GitHub manually. The final deployment mechanics depend on the
selected architecture and must be documented honestly.
12.4 Editorial themes
Potential themes include: - Everyday errands and personal assistance. -
Pabili and grocery assistance. - Government compliance and document
assistance. - Home, property, and relocation coordination. - Business
and office errands. - Technology, AI, and digital services. - Transport
and service coordination. - Drone photography, subject to legal and
operational constraints. - Electrician and plumbing coordination through
appropriate providers. - Quezon City guides and practical local
information. - Laundry and at-home beauty/grooming services once their
operational status is represented accurately.

Topic suggestions are not automatically approved for publication. Do not
publish inaccurate legal, government, health, safety, or
regulated-service claims.
13. SEO and Discoverability
13.1 Service-page strategy
Dedicated service pages are a core SEO strategy where each page
addresses a distinct customer need and has genuinely useful, unique
content.

Examples of target search intent may include: - Personal assistance in
Quezon City. - Pabili or grocery assistance in Quezon City. - Document
assistance in Quezon City. - Laundry pickup and delivery in Quezon
City. - Home service manicure and pedicure in Quezon City. - Hair and
makeup services in Quezon City. - Drone photography, where the service
is available and lawful.

These are suggested keyword themes, not verified search-volume claims or
guaranteed rankings.
13.2 Per-page requirements
Where appropriate: - Unique title tag. - Useful meta description. - One
clear primary heading and logical heading hierarchy. - Descriptive,
stable URL slug. - Canonical URL. - Open Graph and social sharing
metadata. - Descriptive internal links. - Relevant image alt text. -
Appropriate structured data that accurately represents visible
content. - Inclusion in XML sitemap only when publicly indexable and
published. - Appropriate robots directives. - Useful page content, not
just a different keyword on a duplicated template.
13.3 Technical SEO
- Crawlable navigation and links.
- XML sitemap.
- Correct canonical behavior.
- Correct handling of redirects and broken URLs.
- Avoid indexing drafts, internal tools, duplicate pages, or private
  customer data.
- Add Search Console after the production domain is verified.
- Monitor indexing and search performance rather than promising
  rankings.
13.4 Local SEO
- Keep business identity, service area, contact details, and
  availability accurate.
- Do not invent a street address or physical office.
- Do not create misleading location pages for areas that are not
  actually served.
- Do not claim a business location that does not exist.
- Use structured data only when its requirements are genuinely
  satisfied.
13.5 Domain and hosting
- Current preview domain: bologakbukak.netlify.app.
- Netlify may remain the host after a custom domain is purchased.
- Do not assume the custom domain is registered until verified by the
  owner.
- When the owner selects a domain, configure DNS, HTTPS, canonical
  URLs, redirects, and Search Console as appropriate.
- Preserve the preview deployment during transition and test the
  production domain before announcing it.
14. Future Admin Panel
The Admin Panel is a core future capability and must be designed as a
real administrative interface, not a decorative mockup.
14.1 Content management
Authorized administrators should eventually be able to change, without
manually editing source code: - Business details and contact
information. - Navigation labels and destinations. - Homepage headings,
descriptions, calls to action, and featured services. - Service
categories and service records. - Service descriptions, features,
limitations, requirements, images, icons, and display order. - Service
publication and availability status. - Pricing format, prices, and
disclosures. - Coverage-area descriptions and map configuration. - About
content, FAQs, policies, and legal pages. - Blog articles, categories,
tags, media, and SEO fields. - Genuine testimonials, with appropriate
permission and verification. - Promotional content and banners. - SEO
settings and social metadata where appropriate. - Footer content.

Avoid hardcoding the same editable value in multiple places.
14.2 Operational management
Potential modules: - Inquiry and booking dashboard. - Customer
records. - Provider records and provider readiness. - Provider
assignment and job status. - Availability and coverage management. -
Quote and pricing approval. - Communications history. - Complaints and
escalations. - Reporting. - Staff accounts and permissions.
14.3 Admin security and reliability
- Authentication and secure session management.
- Server-enforced role-based authorization.
- Input validation and safe output rendering.
- CSRF protection where applicable.
- Rate limiting and abuse protection.
- Secure handling of credentials and secrets.
- Audit logs for sensitive changes.
- Backups and tested restore procedures.
- Secure media uploads and access rules.
- Error monitoring and operational documentation.
Do not expose secrets or privileged operations in client-side code.
15. Data Model and Backend Architecture
15.1 Architecture goals
- Centralized, structured content.
- Clear separation of presentation, business logic, and data.
- Reusable components and service templates.
- Support for manual operations at launch and increased automation
  later.
- Secure role-based access.
- Maintainable migrations and backups.
- Reasonable cost and complexity for a small pilot.
- Avoid unnecessary vendor lock-in where practical.
- Compatibility with the current repository and deployment approach.
15.2 Candidate entities
The eventual database may need entities such as: - Users and roles. -
Customers. - Staff/coordinators. - Providers and provider
capabilities. - Service categories and services. - Service coverage
rules. - Pricing rules and quotes. - Inquiries and bookings. - Booking
status history. - Provider assignments. - Customer communications. -
Blog articles, categories, tags, and media. - FAQs and policy/content
pages. - Reviews or testimonials with verification/consent. - Audit
events. - Notification records. - Payment transactions and
reconciliation records, if payments are implemented.

This is a candidate model, not a finalized schema. Define relationships,
data ownership, retention, indexes, validation, and migrations after the
architecture is selected.
15.3 Content migration
- Keep initial content data-driven even before a database exists.
- Create stable IDs and slugs where practical.
- Avoid scattering service and blog content across page components.
- Document how temporary content moves into the database or CMS.
- Preserve published URLs when possible; implement redirects if URLs
  must change.
- Test migration and rollback procedures before production data
  changes.
15.4 Technology selection
The existing project must be inspected before choosing a backend stack.

Do not choose or install a database, framework, auth vendor, payment
provider, or paid API solely by assumption. Compare suitable options
for: - Total cost. - Ease of maintenance for a beginner founder with
coding assistance. - Security. - Hosting and deployment compatibility. -
Backups and recovery. - Media storage. - Authentication. - Expected
growth. - Data export and migration.

Present recommendations and trade-offs to the owner before committing to
a consequential choice.
16. Payments and Financial Operations
Payment processing is not yet finalized.

Potential future requirements: - Display a quote and obtain customer
approval before charging. - Support approved payment methods. - Store
transaction references and payment status. - Distinguish authorization,
payment, refund, and provider payout states. - Reconcile customer
payments, fees, provider costs, and refunds. - Prevent duplicate payment
submissions. - Never store raw card details unless operating under the
applicable security and compliance requirements; use a suitable payment
provider. - Show truthful payment confirmations. - Keep financial audit
records.

Do not integrate a payment gateway or announce accepted payment methods
until the owner has approved the provider, commercial terms,
implementation plan, and operational workflow.

Open decisions: Payment methods, gateway, deposits, commissions,
payout mechanics, tax/invoicing requirements, and refund/cancellation
rules.
17. Social Media and Marketing
17.1 Social channels
The owner has identified these channels for potential social media
management: - Facebook. - LinkedIn. - YouTube. - TikTok. - Instagram. -
X.

The initial social media workflow should be approval before
publishing.
17.2 Social media operating rules
- Prepare platform-specific content rather than copying the same post
  blindly across platforms.
- Draft captions, visual concepts, video scripts, titles,
  descriptions, hashtags, and proposed publication times.
- Show the complete content and intended channel for approval.
- Do not publish, schedule, queue, delete, or modify posts without
  explicit approval for the specific action.
- Approval of one post does not authorize other posts.
- Report actual outcomes accurately.
- Do not invent testimonials, prices, provider partnerships,
  availability, customer results, or business credentials.
- Do not spend on paid advertising without explicit owner approval.
- Do not publicly promote massage services under the current
  restriction.
17.3 Social media tool integrations
Third-party scheduling tools such as Metricool or Buffer may be
evaluated. Before adoption, verify current supported platforms,
connector availability, subscription limits, permissions, pricing, and
video-publishing constraints.

Do not store account passwords in prompts or source code. Use official
OAuth/authorization flows and secure credential storage.

Social media integrations are a separate operational toolset and should
not be built into the public website unless there is a clear approved
requirement.
18. Privacy, Legal, Safety, and Compliance
The platform may process names, contact details, home or service
addresses, task instructions, photos, and other potentially sensitive
operational information. Collect only what is necessary.

Requirements: - Provide a clear privacy notice and approved terms before
collecting production customer data. - Define lawful basis/consent and
retention practices with appropriate professional guidance. - Protect
data in transit and at rest using appropriate platform controls. -
Restrict staff access to customer data. - Avoid exposing addresses,
phone numbers, task details, or uploaded images publicly. - Define
procedures for access, correction, deletion, retention, and data
incidents as applicable. - Use secure file-upload validation and access
controls. - Establish provider conduct and customer safety processes
before launching services that involve entering homes, accompanying
people, transporting property, or handling valuable items. - Clarify the
company's role, provider relationship, liability, insurance, and dispute
processes with qualified professional advice. - Comply with applicable
Philippine laws and regulations, including relevant privacy, consumer,
tax, labor, licensing, transportation, aviation, and professional
requirements as applicable to the services actually offered.

Do not treat this PRD as legal advice. Legal terms, regulated service
boundaries, and business arrangements should be reviewed by qualified
Philippine professionals where needed.
19. Notifications and Automation
Potential future events: - Inquiry received. - More information
needed. - Quote prepared. - Quote accepted or declined. - Provider
confirmed. - Booking confirmed. - Reminder sent. - Schedule changed. -
Job started or completed. - Cancellation or refund status changed. -
Feedback requested.

For each event, define: - Trigger. - Recipient. - Channel. - Message
template. - Retry behavior. - Failure handling. - Consent
requirements. - Audit record. - Whether human approval is required.

Start with simple, reliable workflows. Do not introduce automation that
creates bookings, sends messages, charges money, or changes customer
commitments without approved rules and appropriate safeguards.
20. Analytics and Reporting
The platform should eventually provide useful business and operational
insight without exposing unnecessary personal data.

Potential reporting: - Inquiries by service, date, and source. -
Inquiry-to-booking conversion. - Confirmed, completed, cancelled, and
unfulfilled jobs. - Response and fulfilment times. - Provider acceptance
and completion rates. - Repeat customers. - Revenue and costs, if
financial data is implemented. - Service-page visits and inquiry
conversion. - Blog and organic search performance. - Staff workload and
operational bottlenecks.

Define the meaning of each metric before presenting it. Do not label
inquiries as sales or gross booking value as profit. Respect analytics
consent and privacy requirements.
21. Engineering and Repository Practices
21.1 Before editing
Claude Code should: 1. Inspect the repository, project instructions,
package scripts, existing routes, components, styles, data sources, and
deployment configuration. 2. Check Git status and avoid overwriting
unrelated user changes. 3. Identify existing implementations before
creating replacements. 4. Explain significant technical choices and ask
questions when necessary. 5. Implement only the approved scope.
21.2 Implementation standards
- Reuse existing patterns where sound.
- Keep content and presentation separated.
- Prefer reusable components and centralized configuration.
- Avoid unnecessary dependencies.
- Validate inputs and handle errors.
- Avoid hardcoded secrets.
- Do not add mock success messages for unimplemented features.
- Preserve existing routes or add redirects when necessary.
- Ensure drafts and private data are not exposed publicly.
- Document environment variables and configuration without revealing
  secret values.
21.3 Git and deployment
- Use Git for version control.
- Make meaningful commits.
- Review git status before staging changes.
- Do not commit .env files, API keys, passwords, tokens, or other
  secrets.
- Test locally before pushing when practical.
- Treat Netlify as the current deployment environment until changed by
  an approved decision.
- Do not assume a custom domain is purchased or configured.
- Verify the build and deployment result rather than claiming success
  based on an attempted command.
21.4 Testing
At minimum, test the relevant subset of: - Production build. - Main
navigation and internal links. - Service listing and detail routes. -
Inquiry form validation and submission behavior. - Blog listing and
article routes. - SEO metadata and sitemap behavior. - Responsive
layout. - Accessibility basics. - Authentication and role authorization
when backend features exist. - Draft/publication permissions. - Booking
status transitions. - Error and empty states. - Data migrations and
backup/restore when applicable.

Tests must reflect actual functionality. Report skipped tests and known
issues.
22. Acceptance Criteria
A feature is not complete merely because it looks correct in a
screenshot.

For each feature: 1. Its approved user need and scope are documented. 2.
Its visible behavior matches the requirement. 3. Its data is stored and
retrieved correctly if applicable. 4. Authorization and validation are
implemented where required. 5. Error, empty, loading, and success states
are truthful. 6. It works responsively. 7. Links, forms, and buttons
perform the actions they advertise. 8. SEO behavior is correct where
relevant. 9. Relevant tests pass. 10. The owner receives a concise
report of what changed and what remains.
22.1 Website baseline acceptance
- Navigation and main pages load.
- The complete service catalogue is accessible.
- Eight featured cards display in a balanced responsive grid, with a
  link to all services.
- Service pages use consistent templates and appropriate unique
  content.
- Unconfirmed services are not represented as operationally
  guaranteed.
- Blog listing and article templates work.
- Contact routes are genuine and clearly explained.
- No fabricated claims, prices, testimonials, addresses, or
  partnerships appear.
- Production build passes, or any failure is reported accurately.
22.2 Backend acceptance
Before a backend feature is accepted: - Schema and migration are
documented. - Server-side validation and authorization are tested. -
Sensitive data is not exposed to unauthorized roles. - Errors are
handled safely. - Audit requirements are satisfied where applicable. -
Backup and recovery implications are documented. - Deployment
configuration and required secrets are documented securely.
22.3 Booking acceptance
- An inquiry acknowledgement is not confused with a confirmed booking.
- Instant booking is enabled only when fulfilment conditions are
  verifiable.
- Quotes and additional charges are transparent.
- Status transitions are authorized and recorded.
- Failed or unavailable provider cases have a clear resolution path.
- Notifications accurately reflect the real state.
23. Open Questions and Decisions Register
These are intentionally unresolved. Do not invent answers.
Business and commercial
- What is the approved revenue model: coordination fee, commission,
  markup, customer fee, provider fee, or a combination?
- What are the cancellation, refund, deposit, quote-validity, and
  dispute rules?
- Will AT YOUR SERVICE directly provide some services and coordinate
  others, and how will the distinction be communicated?
- Which proposed service categories are approved for public launch
  versus coming soon?
- What insurance, provider verification, and customer safety
  requirements are needed for each service type?
Technology and hosting
- What framework and architecture does the current repository use?
- Which backend/database and hosting arrangement best fit the project
  and budget?
- Which authentication method should be used? Resolved for staff:
  username + password in the existing Express API, Argon2id hashes,
  server-side sessions in MongoDB (see docs/AUTH.md). Still open:
  multi-factor authentication and a verified password-recovery channel.
- Where will the Express API be hosted, and at what monthly cost? It is
  not deployed yet; staff sign-in only works locally until it is.
- Where will uploaded media be stored?
- What are the acceptable monthly operating costs?
- What backup, monitoring, and recovery service levels are
  appropriate?
- Which production domain will be purchased and configured?
Booking and operations
- Which services, if any, will qualify for instant booking at launch?
- How will provider availability be maintained and verified?
- Will customers need accounts, or will secure guest inquiries be
  sufficient initially?
- Which staff roles need separate permissions? Resolved: five roles
  (section 3.6). Still open: Super Admin's specific restrictions.
- Which notification channels should be supported?
- How will provider identity, qualifications, reliability, and
  insurance be checked where relevant?
Payments
- Which payment methods and payment gateway are approved?
- Will payment be collected before, during, or after service?
- How will third-party provider charges and payouts be handled?
- What invoicing and tax workflows are required?
Content and marketing
- Which eight services should be featured on the homepage at launch?
- Which service pages are operationally ready for public promotion?
- What is the approved logo and final brand system?
- What blog publishing cadence is realistic?
- What analytics and consent approach should be used?
Legal and policy
- Which privacy notice, terms, cancellation policies, provider
  agreements, and customer safety terms require professional review?
- What is the status and exact scope of the non-compete restriction,
  and when may massage-related services be reconsidered? Do not
  include massage publicly until cleared.
Record answers here as the owner makes decisions, and update the
relevant sections rather than maintaining conflicting versions.
24. Recommended Immediate Next Steps
1. Inspect the current repository and document its actual framework,
   routes, data sources, dependencies, and deployment configuration.
2. Review the existing website against this PRD and create a gap list.
3. Keep the public website stable while adding approved service
   catalogue entries and improving the current experience.
4. Decide the backend/database architecture based on the actual
   codebase, costs, security, and maintainability.
5. Design the core data model for services, blog content, inquiries,
   roles, and providers.
6. Implement secure authentication and the first useful Admin Panel
   capabilities.
7. Connect inquiry forms to the backend only when submission, storage,
   error handling, and privacy behavior are real and tested.
8. Define which services can be fulfilled at launch and which must
   remain clearly marked as coming soon or awaiting provider
   confirmation.
9. Add hybrid booking capabilities in stages.
10. Test the system, document deployment, and keep this PRD updated as
    decisions are approved.
25. Final Instruction to AI Coding Assistants
You are helping implement AT YOUR SERVICE, a real business and evolving
product---not a one-off mockup.
- Read this PRD and the repository instructions before making
  substantial changes.
- Do not assume an unresolved question has been decided.
- Do not replace existing work without inspecting it.
- Do not build fake functionality to make a demo look complete.
- Do not invent commercial policies, providers, prices, testimonials,
  legal claims, or availability.
- Do not add public massage services while the current restriction
  remains uncleared.
- Prefer secure, maintainable, data-driven implementation.
- When a decision has meaningful business, legal, security, cost, or
  architectural consequences, explain the options and ask the owner
  before committing.
- After implementation, report what changed, tests and builds actually
  run, outcomes, known limitations, and the next recommended step.
The owner's approved decisions take precedence over proposals and
assumptions. Update this PRD as the product evolves.