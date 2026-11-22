import Icon from './Icon.jsx';

/* Native <details> accordions: keyboard accessible without JavaScript,
   and answers stay in the HTML for search engines. */
export default function Faq({ faqs, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <div className="faq-list">
      {faqs.map((f) => (
        <details key={f.id} id={f.id} className="faq-item">
          <summary>
            <H>{f.q}</H>
            <span className="faq-icon"><Icon name="plus" size={20} /></span>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
