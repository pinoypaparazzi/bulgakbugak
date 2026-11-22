import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import Alert from '../components/Alert.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

const ACTIONS = {
  'staff.login': 'Sign-in',
  'staff.logout': 'Sign-out',
  'staff.password.change': 'Password change',
  'staff.account.created': 'Account created',
  'staff.account.updated': 'Account changed',
  'staff.account.password_reset': 'Password reset',
  'staff.bootstrap': 'Initial admin set up',
  'access.denied': 'Access denied',
};

const OUTCOMES = { success: 'Success', failure: 'Failed', denied: 'Denied' };

function describe(details) {
  if (!details) return '';
  if (details.reason === 'deactivated') return 'Account is deactivated';
  if (details.path) return `${details.method} ${details.path}`;
  return Object.entries(details)
    .map(([key, value]) => (value && typeof value === 'object' && 'to' in value ? `${key}: ${value.from} → ${value.to}` : `${key}: ${value}`))
    .join(', ');
}

export default function AuditLogPage() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(
    () =>
      api('/audit?limit=100')
        .then((data) => {
          setEvents(data.events);
          setError('');
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    document.title = 'Audit Log | AT YOUR SERVICE Staff';
    fetchEvents();
  }, [fetchEvents]);

  const load = () => {
    setLoading(true);
    fetchEvents();
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">Administration</p>
          <h1>Audit log</h1>
          <p className="page-lead">The 100 most recent security events: sign-ins, password changes and account changes. Entries can’t be edited or deleted.</p>
        </div>
      </section>
      <section className="section section-soft section-tight">
        <div className="container">
          <div className="audit-toolbar">
            <button type="button" className="btn btn-outline btn-sm" onClick={load} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
          </div>
          {error && <Alert tone="error">{error}</Alert>}
          {!events && !error && <LoadingScreen label="Loading audit log…" />}
          {events && events.length === 0 && <p>No events yet.</p>}
          {events && events.length > 0 && (
            <div className="table-wrap" role="region" aria-label="Audit events" tabIndex={0}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Event</th>
                    <th scope="col">Result</th>
                    <th scope="col">By</th>
                    <th scope="col">Account</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td>{new Date(e.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'medium' })}</td>
                      <td>{ACTIONS[e.action] || e.action}</td>
                      <td><span className={`badge outcome-${e.outcome}`}>{OUTCOMES[e.outcome] || e.outcome}</span></td>
                      <td>{e.actor?.username || '—'}</td>
                      <td>{e.target?.username || '—'}</td>
                      <td className="details">{describe(e.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
