import Icon from './Icon.jsx';
import Logo from './Logo.jsx';

const VALUES = [
  { icon: 'shield', label: 'Dependable assistance' },
  { icon: 'chat', label: 'Clear communication' },
  { icon: 'network', label: 'Convenient service arrangements' },
];

export default function About() {
  return (
    <section id="about" className="section section-soft" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-logo">
          <Logo height={220} alt="AT YOUR SERVICE logo" />
        </div>
        <div>
          <p className="eyebrow">About us</p>
          <h2 id="about-title">Making everyday life and business a little easier</h2>
          <p>
            AT YOUR SERVICE exists to make everyday life and business operations easier by helping customers
            handle tasks, coordinate services and find practical solutions when they need an extra hand.
          </p>
          <p>
            We aim to offer dependable assistance, clear communication and convenient service arrangements.
            We handle many requests ourselves. Where a task calls for it, and as we grow, we coordinate with
            assistants, contractors and qualified partner providers.
          </p>
          <p>
            We’re beginning with a pilot program in Quezon City and intend to grow gradually as we develop
            our service network.
          </p>
          <ul className="about-values">
            {VALUES.map((v) => (
              <li key={v.label}><Icon name={v.icon} size={20} />{v.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
