/* Top of every inner page: breadcrumbs, eyebrow, the page's single H1, and intro. */
export default function PageHeader({ eyebrow, title, lead, crumbs = [], children }) {
  return (
    <header className="page-header">
      <div className="container">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              {crumbs.map((c, i) => (
                <li key={c.href || c.label}>
                  {i === crumbs.length - 1 ? <span aria-current="page">{c.label}</span> : <a href={c.href}>{c.label}</a>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
