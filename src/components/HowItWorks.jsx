import Icon from './Icon.jsx';
import { STEPS, STEPS_NOTE } from '../content/content.js';

export default function HowItWorks({ soft = true }) {
  return (
    <section id="how-it-works" className={`section${soft ? ' section-soft' : ''}`} aria-labelledby="how-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">Four simple steps from request to done</h2>
          <p className="section-lead">You stay in control at every stage. Work only starts once you’ve agreed the scope and pricing.</p>
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
          <span><strong>Good to know:</strong> {STEPS_NOTE}</span>
        </p>
      </div>
    </section>
  );
}
