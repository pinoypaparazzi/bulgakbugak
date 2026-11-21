import Icon from './Icon.jsx';
import { STEPS } from '../data/content.js';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section section-soft" aria-labelledby="how-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">Four simple steps from request to done</h2>
          <p className="section-lead">
            You stay in control at every stage. We only start once you’ve seen the quotation and said yes.
          </p>
        </header>

        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="step">
              <div className="step-icon">
                <Icon name={step.icon} size={28} />
                <span className="step-num" aria-hidden="true">{i + 1}</span>
              </div>
              <p className="step-label">Step {i + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <p className="note">
          <Icon name="info" size={20} />
          <span>
            <strong>Good to know:</strong> sending an inquiry does not automatically confirm a booking.
            Your booking is confirmed only after you approve our quotation.
          </span>
        </p>
      </div>
    </section>
  );
}
