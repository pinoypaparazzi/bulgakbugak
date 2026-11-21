import { useEffect, useState } from 'react';
import badge from './assets/kuya-mark-badge.jpg';

/* ---------- Contact details ---------- */
const CONTACT = {
  phoneDisplay: '0917-504-5959',
  phoneHref: 'tel:+639175045959',
  smsHref: 'sms:+639175045959',
  email: 'hello@kuyamark.com',
  facebookDisplay: 'facebook.com/kuyamark',
  facebookHref: 'https://www.facebook.com/kuyamark',
};

/* ---------- Icons (original line icons, inherit currentColor) ---------- */
const paths = {
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.8l2.5 11.7a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7.5H6.1" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  car: (
    <>
      <path d="M3.5 13 5.4 8.3A2 2 0 0 1 7.3 7h9.4a2 2 0 0 1 1.9 1.3l1.9 4.7" />
      <path d="M3 13h18v4a1 1 0 0 1-1 1h-1.5M5.5 18H4a1 1 0 0 1-1-1v-4" />
      <circle cx="7.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
      <path d="M9.3 18h5.4" />
    </>
  ),
  care: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 9.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M12 17.2s-3.2-1.9-3.2-3.9a1.7 1.7 0 0 1 3.2-.8 1.7 1.7 0 0 1 3.2.8c0 2-3.2 3.9-3.2 3.9z" />
    </>
  ),
  package: (
    <>
      <path d="M21 7.5 12 3 3 7.5v9L12 21l9-4.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9M7.5 5.2l9 4.6" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  chat: (
    <path d="M12 3.5c-4.7 0-8.5 3.5-8.5 7.8 0 2.4 1.2 4.6 3.1 6V21l3.3-1.8c.7.2 1.4.3 2.1.3 4.7 0 8.5-3.5 8.5-7.8S16.7 3.5 12 3.5z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
};

function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* ---------- Copy for each variation ---------- */
const COPY = {
  corporate: {
    eyebrow: 'Personal Concierge Services',
    sub: 'Dependable, discreet assistance with the tasks that fill your day, from groceries and paperwork to transport and family check-ins.',
    cta: 'Book a Service',
    secondary: 'View Services',
    trust: ['Clear quote before every task', 'Status updates as work progresses', 'Receipts for every purchase'],
    servicesTitle: 'Services',
    servicesSub: 'One trusted point of contact for everyday errands.',
    services: [
      { icon: 'cart', title: 'Grocery Runs', text: 'Market and supermarket shopping from your list, with substitutions confirmed before purchase.' },
      { icon: 'document', title: 'Document Assistance', text: 'Queuing, filing, follow-ups, and pick-up of permits, clearances, and government documents.' },
      { icon: 'car', title: 'Driving', text: 'Scheduled rides to appointments, airports, schools, and offices, with punctual pick-up.' },
      { icon: 'care', title: 'Elder Check-ins', text: 'Regular visits to parents and grandparents, with a short report sent to the family after each one.' },
      { icon: 'package', title: 'Package Pick-up', text: 'Collection and delivery of parcels, documents, and items across the city.' },
    ],
    stepsTitle: 'How it works',
    steps: [
      { title: 'Send your request', text: 'Book online, call, or message with the task details.' },
      { title: 'Confirm the quote', text: 'Receive a clear estimate covering fees and expected costs.' },
      { title: 'Consider it done', text: 'Get updates along the way and a summary when it is complete.' },
    ],
    pricingTitle: 'Pricing',
    pricing:
      'Service rates depend on the task. Transport costs (fuel, fares, tolls, and parking) and a handling fee are added to the cost of any items purchased on your behalf. All charges are quoted and confirmed before work begins.',
    bookTitle: 'Book a service',
    bookSub: 'Share the details and we will reply with a quote.',
    bookButton: 'Send Booking Request',
    contactTitle: 'Contact',
    footer: 'Kuya Mark Concierge. Personal concierge services.',
  },
  friendly: {
    eyebrow: "Hi, I'm Kuya Mark!",
    sub: "Think of me as the kuya who's always got your back. I'll do the grocery run, line up for your papers, drive you around, and check in on Lola while you're busy.",
    cta: 'Book Kuya Mark',
    secondary: 'See what I can do',
    trust: ['I tell you the cost first', 'Updates so you never wonder', 'Resibo for everything I buy'],
    servicesTitle: 'How I can help',
    servicesSub: 'Pick an errand and I’ll take it from there.',
    services: [
      { icon: 'cart', title: 'Grocery runs', text: 'Send me your list. I’ll shop it carefully and message you before swapping anything.' },
      { icon: 'document', title: 'Document help', text: 'Long lines, forms, follow-ups. I’ll handle the pila so you don’t have to.' },
      { icon: 'car', title: 'Driving', text: 'Check-ups, airport runs, school pick-ups. I’ll get you there safely and on time.' },
      { icon: 'care', title: 'Elder check-ins', text: 'I’ll visit Lolo and Lola, keep them company, and let you know how they’re doing.' },
      { icon: 'package', title: 'Package pick-up', text: 'Parcels, deliveries, or something left at a friend’s house. I’ll bring it to you.' },
    ],
    stepsTitle: 'Easy as 1, 2, 3',
    steps: [
      { title: 'Tell me what you need', text: 'Book here, call, text, or message me on Facebook.' },
      { title: 'I give you the cost', text: 'You’ll know the fees upfront, so there are no surprises.' },
      { title: 'Relax, it’s handled', text: 'I’ll keep you posted until the job is done.' },
    ],
    pricingTitle: 'A quick note on pricing',
    pricing:
      'Every errand is a little different, so my rate depends on the task. On top of the items I buy for you, I add transport costs (gas, fare, toll, parking) and a small handling fee. I’ll always tell you the total before I start.',
    bookTitle: 'Book an errand',
    bookSub: 'Tell me what you need and I’ll get back to you with a quote.',
    bookButton: 'Send to Kuya Mark',
    contactTitle: 'Say hello',
    footer: 'Kuya Mark Concierge. Your errands, handled.',
  },
};

/* ---------- Sections ---------- */
function Navbar({ copy }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="brand">
          <span className="brand-mark"><Icon name="check" size={16} /></span>
          <span>Kuya Mark <span className="brand-light">Concierge</span></span>
        </a>
        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#book" className="btn btn-primary btn-sm">{copy.cta}</a>
      </div>
    </header>
  );
}

function ErrandCard() {
  const items = [
    { icon: 'cart', label: 'Weekly grocery run', status: 'Done', done: true },
    { icon: 'document', label: 'Pick up NBI clearance', status: 'Done', done: true },
    { icon: 'car', label: 'Drive Tita to clinic', status: 'On the way' },
    { icon: 'care', label: 'Visit Lola', status: '4:00 PM' },
  ];
  return (
    <div className="errand-card" aria-label="Example list of errands for the day">
      <div className="errand-head">
        <div>
          <p className="errand-kicker">Today</p>
          <p className="errand-title">Your errands</p>
        </div>
        <span className="errand-progress">2 of 4</span>
      </div>
      <div className="errand-bar"><span style={{ width: '50%' }} /></div>
      <ul className="errand-list">
        {items.map((it) => (
          <li key={it.label} className={it.done ? 'is-done' : ''}>
            <span className="errand-icon"><Icon name={it.icon} size={18} /></span>
            <span className="errand-label">{it.label}</span>
            <span className="errand-status">
              {it.done ? <Icon name="check" size={14} /> : <Icon name="clock" size={14} />}
              {it.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Hero({ copy, variant }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>Your errands, <span className="accent">handled.</span></h1>
          <p className="hero-sub">{copy.sub}</p>
          <div className="hero-actions">
            <a href="#book" className="btn btn-primary btn-lg">
              {copy.cta} <Icon name="arrow" size={18} />
            </a>
            <a href="#services" className="btn btn-ghost btn-lg">{copy.secondary}</a>
          </div>
          <ul className="trust">
            {copy.trust.map((t) => (
              <li key={t}><Icon name="check" size={16} /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="hero-visual">
          {variant === 'friendly' && <img src={badge} alt="Kuya Mark, your personal concierge" className="hero-badge" />}
          <ErrandCard />
        </div>
      </div>
    </section>
  );
}

function Services({ copy }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <h2>{copy.servicesTitle}</h2>
          <p>{copy.servicesSub}</p>
        </div>
        <div className="service-grid">
          {copy.services.map((s, i) => (
            <article className="service-card" key={s.title}>
              <div className="service-top">
                <span className="service-icon"><Icon name={s.icon} size={26} /></span>
                <span className="service-num">0{i + 1}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps({ copy }) {
  return (
    <section className="section section-tint">
      <div className="container">
        <div className="section-head">
          <h2>{copy.stepsTitle}</h2>
        </div>
        <ol className="steps">
          {copy.steps.map((s, i) => (
            <li key={s.title}>
              <span className="step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing({ copy }) {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <div className="pricing-note">
          <span className="pricing-icon"><Icon name="info" size={26} /></span>
          <div>
            <h2>{copy.pricingTitle}</h2>
            <p>{copy.pricing}</p>
            <ul className="fee-tags">
              <li>Service rate</li>
              <li>Transport fees</li>
              <li>Handling fee</li>
              <li>Cost of items</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Booking({ copy }) {
  const [form, setForm] = useState({ name: '', phone: '', service: '', date: '', details: '' });
  const [sent, setSent] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${form.service}`,
      `Preferred date: ${form.date || 'Flexible'}`,
      '',
      'Details:',
      form.details,
    ].join('\n');
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Booking request: ${form.service}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="section section-tint" id="book">
      <div className="container book-inner">
        <div className="book-intro">
          <h2>{copy.bookTitle}</h2>
          <p>{copy.bookSub}</p>
          <div className="book-alt">
            <p>Prefer to talk?</p>
            <a href={CONTACT.phoneHref} className="book-phone"><Icon name="phone" size={20} /> {CONTACT.phoneDisplay}</a>
          </div>
        </div>
        <form className="book-form" onSubmit={submit}>
          <div className="field-row">
            <label>
              Your name
              <input required value={form.name} onChange={update('name')} placeholder="Juan Dela Cruz" />
            </label>
            <label>
              Mobile number
              <input required type="tel" value={form.phone} onChange={update('phone')} placeholder="09XX-XXX-XXXX" />
            </label>
          </div>
          <div className="field-row">
            <label>
              Service
              <select required value={form.service} onChange={update('service')}>
                <option value="" disabled>Choose a service</option>
                {copy.services.map((s) => <option key={s.title}>{s.title}</option>)}
                <option>Something else</option>
              </select>
            </label>
            <label>
              Preferred date
              <input type="date" value={form.date} onChange={update('date')} />
            </label>
          </div>
          <label>
            What do you need?
            <textarea rows="4" value={form.details} onChange={update('details')} placeholder="Tell us the errand, the location, and any special instructions." />
          </label>
          <button type="submit" className="btn btn-primary btn-lg btn-block">
            {copy.bookButton} <Icon name="arrow" size={18} />
          </button>
          {sent && <p className="form-note">Your email app should open with the request ready to send. If it didn't, email {CONTACT.email}.</p>}
        </form>
      </div>
    </section>
  );
}

function Contact({ copy }) {
  const items = [
    { icon: 'phone', label: 'Call or text', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
    { icon: 'mail', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: 'chat', label: 'Facebook', value: CONTACT.facebookDisplay, href: CONTACT.facebookHref, external: true },
  ];
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <h2>{copy.contactTitle}</h2>
        </div>
        <div className="contact-grid">
          {items.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="contact-card"
              {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="contact-icon"><Icon name={c.icon} size={22} /></span>
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ copy }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {copy.footer}</span>
        <a href="#book" className="footer-link">Book now →</a>
      </div>
    </footer>
  );
}

function VariantSwitch({ variant, setVariant }) {
  return (
    <div className="variant-switch" role="group" aria-label="Design variation">
      <span>Style</span>
      {['corporate', 'friendly'].map((v) => (
        <button
          key={v}
          type="button"
          className={variant === v ? 'active' : ''}
          aria-pressed={variant === v}
          onClick={() => setVariant(v)}
        >
          {v === 'corporate' ? 'Corporate' : 'Friendly'}
        </button>
      ))}
    </div>
  );
}

/* ---------- App ---------- */
function initialVariant() {
  const v = new URLSearchParams(window.location.search).get('style');
  return v === 'friendly' ? 'friendly' : 'corporate';
}

export default function App() {
  const [variant, setVariant] = useState(initialVariant);
  const copy = COPY[variant];

  useEffect(() => {
    document.documentElement.dataset.variant = variant;
    const url = new URL(window.location.href);
    url.searchParams.set('style', variant);
    window.history.replaceState(null, '', url);
  }, [variant]);

  return (
    <>
      <Navbar copy={copy} />
      <main>
        <Hero copy={copy} variant={variant} />
        <Services copy={copy} />
        <Steps copy={copy} />
        <Pricing copy={copy} />
        <Booking copy={copy} />
        <Contact copy={copy} />
      </main>
      <Footer copy={copy} />
      <VariantSwitch variant={variant} setVariant={setVariant} />
    </>
  );
}
