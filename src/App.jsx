import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import BlogIndexPage from './pages/BlogIndexPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import BookPage from './pages/BookPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { matchRoute } from './routes.js';

const PAGES = {
  home: HomePage,
  services: ServicesPage,
  service: ServiceDetailPage,
  pricing: PricingPage,
  blog: BlogIndexPage,
  post: BlogPostPage,
  about: AboutPage,
  faq: FaqPage,
  contact: ContactPage,
  book: BookPage,
  notfound: NotFoundPage,
};

/* Each page is a separate pre-built HTML file; `path` tells React which one this is. */
export default function App({ path }) {
  const route = matchRoute(path);
  const Page = PAGES[route.page];

  // Keeps the tab title right in `npm run dev` (production pages already have it in the HTML).
  useEffect(() => {
    if (route.head?.title) document.title = route.head.title;
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header path={route.path} />
      <main id="main" tabIndex={-1}>
        <Page {...(route.params || {})} />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
