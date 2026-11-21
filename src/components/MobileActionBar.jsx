import Icon from './Icon.jsx';
import { CONTACT } from '../data/site.js';
import { bookLinkProps } from '../lib/bookLink.js';

/* Small fixed bar on phones so calling or booking is always one tap away. */
export default function MobileActionBar({ onBook }) {
  return (
    <nav className="mobile-bar" aria-label="Quick actions">
      <a href={CONTACT.phoneHref}><Icon name="phone" size={20} /> Call</a>
      <a href={CONTACT.viberHref}><Icon name="viber" size={20} /> Viber</a>
      <a className="mobile-bar-book" {...bookLinkProps(onBook)}><Icon name="calendar" size={20} /> Book</a>
    </nav>
  );
}
