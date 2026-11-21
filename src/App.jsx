import { useEffect, useState } from 'react';
import badge from './assets/kuya-mark-badge.jpg';
import { Icon, Brand, CONTACT } from './shared.jsx';
import { Link, usePath } from './router.jsx';
import { getSession, logout } from './auth.js';
import AuthPage from './pages/AuthPage.jsx';
import BookingPage from './pages/BookingPage.jsx';

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
    bookCtaSub: 'Create a free account or log in with your CP number to send a booking request.',
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
    bookCtaSub: 'Make a quick account with your CP number (or log in) and send me your errand in a minute.',
    bookButton: 'Send to Kuya Mark',
    contactTitle: 'Say hello',
    footer: 'Kuya Mark Concierge. Your errands, handled.',
  },
};

/* ---------- Landing sections ---------- */
function Navbar({ copy }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="brand"><Brand /></a>
        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <Link to="/book" className="btn btn-primary btn-sm">{copy.cta}</Link>
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
            <Link to="/book" className="btn btn-primary btn-lg">
              {copy.cta} <Icon name="arrow" size={18} />
            </Link>
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

function BookCta({ copy }) {
  return (
    <section className="section section-tint" id="book">
      <div className="container">
        <div className="book-cta">
          <div>
            <h2>{copy.bookTitle}</h2>
            <p>{copy.bookCtaSub}</p>
          </div>
          <div className="book-cta-actions">
            <Link to="/book" className="btn btn-primary btn-lg">
              {copy.cta} <Icon name="arrow" size={18} />
            </Link>
            <a href={CONTACT.phoneHref} className="book-phone"><Icon name="phone" size={20} /> {CONTACT.phoneDisplay}</a>
          </div>
        </div>
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
        <Link to="/book" className="footer-link">Book now →</Link>
      </div>
    </footer>
  );
}

function Landing({ copy, variant }) {
  return (
    <>
      <Navbar copy={copy} />
      <main>
        <Hero copy={copy} variant={variant} />
        <Services copy={copy} />
        <Steps copy={copy} />
        <Pricing copy={copy} />
        <BookCta copy={copy} />
        <Contact copy={copy} />
      </main>
      <Footer copy={copy} />
    </>
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

/* ---------- App + routes ---------- */
function initialVariant() {
  const v = new URLSearchParams(window.location.search).get('style');
  return v === 'friendly' ? 'friendly' : 'corporate';
}

export default function App() {
  const [variant, setVariant] = useState(initialVariant);
  const [session, setSession] = useState(getSession);
  const path = usePath();
  const copy = COPY[variant];

  useEffect(() => {
    document.documentElement.dataset.variant = variant;
    const url = new URL(window.location.href);
    url.searchParams.set('style', variant);
    window.history.replaceState(null, '', url);
  }, [variant]);

  let page;
  if (path === '/book') {
    page = session ? (
      <BookingPage copy={copy} session={session} onLogout={() => { logout(); setSession(null); }} />
    ) : (
      <AuthPage key="book" onAuthed={setSession} />
    );
  } else if (path === '/reset-password') {
    page = <AuthPage key="reset" initialMode="reset" onAuthed={setSession} />;
  } else {
    page = <Landing copy={copy} variant={variant} />;
  }

  return (
    <>
      {page}
      <VariantSwitch variant={variant} setVariant={setVariant} />
    </>
  );
}
