import { useCallback, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Pricing from './components/Pricing.jsx';
import Expectations from './components/Expectations.jsx';
import Coverage from './components/Coverage.jsx';
import About from './components/About.jsx';
import BookingForm from './components/BookingForm.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import FinalCta from './components/FinalCta.jsx';
import Footer from './components/Footer.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function App() {
  // The service chosen from a service card ("Inquire about this service")
  const [preselected, setPreselected] = useState({ service: '', nonce: 0 });

  /* Opens the booking form: optionally preselects a service, scrolls to the
     form and moves keyboard focus into it. Used by every "Book" button. */
  const openBooking = useCallback((service = '') => {
    if (service) setPreselected((p) => ({ service, nonce: p.nonce + 1 }));
    const section = document.getElementById('book');
    if (!section) return;
    section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (window.location.hash !== '#book') history.replaceState(null, '', '#book');
    window.setTimeout(() => {
      const target = document.getElementById('f-name');
      target?.focus({ preventScroll: true });
    }, prefersReducedMotion() ? 0 : 450);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header onBook={openBooking} />
      <main id="main" tabIndex={-1}>
        <Hero onBook={openBooking} />
        <Services onInquire={openBooking} />
        <HowItWorks />
        <Pricing onBook={openBooking} />
        <Expectations />
        <Coverage />
        <About />
        <BookingForm preselected={preselected} />
        <Faq />
        <Contact />
        <FinalCta onBook={openBooking} />
      </main>
      <Footer />
      <MobileActionBar onBook={openBooking} />
    </>
  );
}

