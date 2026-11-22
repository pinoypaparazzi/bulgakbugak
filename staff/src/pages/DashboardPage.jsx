import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../auth/context.js';
import { modulesFor } from '../lib/modules.js';
import Alert from '../components/Alert.jsx';
import Icon from '../components/Icon.jsx';

const ROLE_FOCUS = {
  super_duper_admin: 'You have full access to every part of the staff portal that has been built, including staff account administration.',
  super_admin: 'You have broad administrative access, including creating and managing staff accounts.',
  admin: 'Your role covers customers (CRM), bookings and routine operations.',
  investor: 'Your role gives read-only access to accounting records, transactions and financial reports.',
  hr: 'Your role covers employee records and employee skills.',
};

export default function DashboardPage() {
  const { me, can } = useAuth();
  const location = useLocation();
  const flash = location.state?.flash;
  const modules = modulesFor(me.permissions);

  useEffect(() => {
    document.title = 'Dashboard | AT YOUR SERVICE Staff';
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          {flash && <Alert tone="success" className="flash">{flash}</Alert>}
          <p className="eyebrow">{me.roleLabel}</p>
          <h1>Welcome, {me.user.displayName}</h1>
          <p className="page-lead">{ROLE_FOCUS[me.user.role]}</p>
        </div>
      </section>

      <section className="section section-soft section-tight" aria-labelledby="areas-title">
        <div className="container">
          <h2 id="areas-title" className="section-title">Your areas</h2>
          {modules.length === 0 ? (
            <p>No areas are assigned to your role yet.</p>
          ) : (
            <ul className="module-grid">
              {modules.map((m) => {
                const readOnly = m.readOnlyUnless && !can(m.readOnlyUnless);
                const body = (
                  <>
                    <div className="service-card-top">
                      <span className="service-icon"><Icon name={m.icon} size={24} /></span>
                      {m.available ? (
                        <span className="badge badge-available">Available</span>
                      ) : (
                        <span className="badge badge-unavailable">Not built yet</span>
                      )}
                    </div>
                    <h3>{m.title}</h3>
                    <p>{m.description}</p>
                    {readOnly && <p className="module-note">Your access will be read-only.</p>}
                    {!m.available && <p className="module-note">This module hasn’t been built yet, so there’s nothing to show here.</p>}
                    {m.available && (
                      <span className="service-cta">
                        Open <Icon name="arrow" size={18} />
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={m.id} className={`service-card module-card${m.available ? '' : ' is-unavailable'}`}>
                    {m.available ? (
                      <Link to={m.to} className="module-link">
                        <article>{body}</article>
                      </Link>
                    ) : (
                      <article aria-label={`${m.title} (not built yet)`}>{body}</article>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
