import Icon from './Icon.jsx';
import { CONTACT, NAV_CTA } from '../content/site.js';

/* Small fixed bar on phones so calling or booking is always one tap away. */
export default function MobileActionBar() {
  return (
    <nav className="mobile-bar" aria-label="Quick actions">
      <a href={CONTACT.phoneHref}><Icon name="phone" size={20} /> Call</a>
      <a href={CONTACT.viberHref}><Icon name="viber" size={20} /> Viber</a>
      <a className="mobile-bar-book" href={NAV_CTA.href}><Icon name="calendar" size={20} /> Book</a>
    </nav>
  );
}
