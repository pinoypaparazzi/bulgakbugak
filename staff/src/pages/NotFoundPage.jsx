import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Page not found</h1>
        <p className="section-lead">This page doesn’t exist in the staff portal.</p>
        <Link to="/" className="btn btn-primary">Go to dashboard</Link>
      </div>
    </section>
  );
}
