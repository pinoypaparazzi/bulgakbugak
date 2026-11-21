import { useState } from 'react';
import { Icon, Brand, CONTACT } from '../shared.jsx';
import { Link } from '../router.jsx';
import { formatPhone } from '../auth.js';

/* Shown on /book once the user is logged in */
export default function BookingPage({ copy, session, onLogout }) {
  const [form, setForm] = useState({ service: '', date: '', details: '' });
  const [sent, setSent] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const body = [
      `CP number: ${formatPhone(session.phone)}`,
      `Email: ${session.email}`,
      `Service: ${form.service}`,
      `Preferred date: ${form.date || 'Flexible'}`,
      '',
      'Details:',
      form.details,
    ].join('\n');
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Booking request: ${form.service}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand"><Brand /></Link>
          <div className="nav-user">
            <span className="nav-user-phone">{formatPhone(session.phone)}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
              <Icon name="logout" size={16} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="section section-tint booking-page">
        <div className="container book-inner">
          <div className="book-intro">
            <p className="eyebrow">You're logged in</p>
            <h2>{copy.bookTitle}</h2>
            <p>{copy.bookSub}</p>
            <div className="book-alt">
              <p>Prefer to talk?</p>
              <a href={CONTACT.phoneHref} className="book-phone"><Icon name="phone" size={20} /> {CONTACT.phoneDisplay}</a>
            </div>
          </div>
          <form className="book-form" onSubmit={submit}>
            <div className="field-row">
              <label>
                CP number
                <input value={formatPhone(session.phone)} readOnly />
              </label>
              <label>
                Email
                <input value={session.email} readOnly />
              </label>
            </div>
            <div className="field-row">
              <label>
                Service
                <select required value={form.service} onChange={update('service')}>
                  <option value="" disabled>Choose a service</option>
                  {copy.services.map((s) => <option key={s.title}>{s.title}</option>)}
                  <option>Something else</option>
                </select>
              </label>
              <label>
                Preferred date
                <input type="date" value={form.date} onChange={update('date')} />
              </label>
            </div>
            <label>
              What do you need?
              <textarea rows="5" value={form.details} onChange={update('details')} placeholder="Tell us the errand, the location, and any special instructions." />
            </label>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              {copy.bookButton} <Icon name="arrow" size={18} />
            </button>
            {sent && <p className="form-note">Your email app should open with the request ready to send. If it didn't, email {CONTACT.email}.</p>}
          </form>
        </div>
      </main>
    </>
  );
}
