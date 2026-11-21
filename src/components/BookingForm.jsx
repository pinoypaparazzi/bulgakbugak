import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { SERVICES, NOT_SURE_OPTION } from '../data/services.js';
import { CONTACT } from '../data/site.js';
import { EMPTY_INQUIRY, TIME_OPTIONS, validateInquiry, buildLinks } from '../lib/inquiry.js';

const FIELD_ORDER = ['name', 'mobile', 'email', 'service', 'task', 'location', 'date', 'time', 'consent'];

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/* Small helper so every field gets a label, hint and error wired up the same way. */
function Field({ id, label, optional, hint, error, children, className = '' }) {
  return (
    <div className={`field ${className}${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {optional ? <span className="optional">(optional)</span> : <span className="req" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="error" id={`${id}-error`}>
          <Icon name="info" size={16} /> {error}
        </p>
      )}
    </div>
  );
}

export default function BookingForm({ preselected }) {
  const [data, setData] = useState(EMPTY_INQUIRY);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(null); // prepared message + links after a valid submit
  const [copied, setCopied] = useState(false);
  const [minDate, setMinDate] = useState(undefined);
  const [announce, setAnnounce] = useState('');
  const summaryRef = useRef(null);
  const readyRef = useRef(null);

  useEffect(() => setMinDate(todayIso()), []);

  // A service card was clicked: preselect that service.
  useEffect(() => {
    if (!preselected.service) return;
    setData((d) => ({ ...d, service: preselected.service }));
    setErrors((e) => ({ ...e, service: undefined }));
    setReady(null);
    setAnnounce(`Service selected: ${preselected.service}`);
  }, [preselected]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    if (ready) setReady(null);
  };

  const describedBy = (id, hasHint) =>
    [hasHint && `f-${id}-hint`, errors[id] && `f-${id}-error`].filter(Boolean).join(' ') || undefined;

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validateInquiry(data);
    setErrors(found);
    const keys = FIELD_ORDER.filter((k) => found[k]);
    if (keys.length) {
      setReady(null);
      // Move focus to the error summary so screen-reader users hear what to fix.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setReady(buildLinks(data));
    setCopied(false);
    requestAnimationFrame(() => readyRef.current?.focus());
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(ready.body);
      setCopied(true);
    } catch {
      // Fallback: select the text so the customer can copy it manually.
      const ta = document.getElementById('f-preview');
      ta?.focus();
      ta?.select();
    }
  };

  const errorKeys = FIELD_ORDER.filter((k) => errors[k]);

  return (
    <section id="book" className="section booking" aria-labelledby="book-title">
      <div className="container booking-grid">
        <div className="booking-intro">
          <p className="eyebrow">Book a service</p>
          <h2 id="book-title">Tell us what you need</h2>
          <p className="section-lead">
            Fill in the details below and we’ll prepare your inquiry. We’ll review it and reply with a
            quotation. Nothing is confirmed until you approve it.
          </p>

          <div className="how-sent">
            <h3><Icon name="info" size={20} /> How your inquiry is sent</h3>
            <p>
              Our online booking system isn’t live yet, so this form doesn’t send or store your details by
              itself. When you press <strong>Prepare My Inquiry</strong>, we’ll format your request so you can
              send it to us in one tap by <strong>email</strong>, <strong>text message</strong> or{' '}
              <strong>Viber</strong>.
            </p>
          </div>

          <div className="direct-contact">
            <p>Prefer to reach us directly?</p>
            <a href={CONTACT.phoneHref} className="direct-link">
              <Icon name="phone" size={20} /> Call {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.viberHref} className="direct-link">
              <Icon name="viber" size={20} /> Viber {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.emailHref} className="direct-link">
              <Icon name="mail" size={20} /> {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="form-card">
          <p className="sr-only" aria-live="polite">{announce}</p>

          {errorKeys.length > 0 && (
            <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
              <h3>Please check {errorKeys.length === 1 ? '1 field' : `${errorKeys.length} fields`}:</h3>
              <ul>
                {errorKeys.map((k) => (
                  <li key={k}>
                    <a
                      href={`#f-${k}`}
                      onClick={(e) => { e.preventDefault(); document.getElementById(`f-${k}`)?.focus(); }}
                    >
                      {errors[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form noValidate onSubmit={onSubmit} aria-describedby="form-required-note" name="inquiry">
            <p id="form-required-note" className="required-note">
              Fields marked <span className="req" aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
            </p>

            <div className="form-grid">
              <Field id="f-name" label="Full name" error={errors.name}>
                <input
                  id="f-name" name="name" type="text" autoComplete="name"
                  value={data.name} onChange={set('name')}
                  required aria-required="true" aria-invalid={!!errors.name} aria-describedby={describedBy('name')}
                />
              </Field>

              <Field id="f-mobile" label="Mobile number" hint="We’ll call, text or Viber you about your request." error={errors.mobile}>
                <input
                  id="f-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567"
                  value={data.mobile} onChange={set('mobile')}
                  required aria-required="true" aria-invalid={!!errors.mobile} aria-describedby={describedBy('mobile', true)}
                />
              </Field>

              <Field id="f-email" label="Email address" optional error={errors.email} className="span-2">
                <input
                  id="f-email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                  value={data.email} onChange={set('email')}
                  aria-invalid={!!errors.email} aria-describedby={describedBy('email')}
                />
              </Field>

              <Field id="f-service" label="Service category" error={errors.service} className="span-2">
                <select
                  id="f-service" name="service"
                  value={data.service} onChange={set('service')}
                  required aria-required="true" aria-invalid={!!errors.service} aria-describedby={describedBy('service')}
                >
                  <option value="">Select a service…</option>
                  <option value={NOT_SURE_OPTION}>{NOT_SURE_OPTION}</option>
                  <optgroup label="Our services">
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                </select>
              </Field>

              <Field
                id="f-task" label="Brief description of the task" className="span-2" error={errors.task}
                hint="What do you need done? Include anything that affects time or cost, such as items to buy or places to go."
              >
                <textarea
                  id="f-task" name="task" rows={4}
                  value={data.task} onChange={set('task')}
                  required aria-required="true" aria-invalid={!!errors.task} aria-describedby={describedBy('task', true)}
                />
              </Field>

              <Field
                id="f-location" label="Service location or neighborhood" className="span-2" error={errors.location}
                hint="Street, area or landmark is enough for now, e.g. “Maginhawa St., Teachers Village”. No need for your full address yet."
              >
                <input
                  id="f-location" name="location" type="text" autoComplete="off"
                  value={data.location} onChange={set('location')}
                  required aria-required="true" aria-invalid={!!errors.location} aria-describedby={describedBy('location', true)}
                />
              </Field>

              <Field id="f-date" label="Preferred date" optional error={errors.date}>
                <input
                  id="f-date" name="date" type="date" min={minDate}
                  value={data.date} onChange={set('date')}
                  aria-invalid={!!errors.date} aria-describedby={describedBy('date')}
                />
              </Field>

              <Field id="f-time" label="Preferred time" optional>
                <select id="f-time" name="time" value={data.time} onChange={set('time')}>
                  <option value="">Flexible</option>
                  {TIME_OPTIONS.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field id="f-notes" label="Additional instructions" optional className="span-2">
                <textarea id="f-notes" name="notes" rows={3} value={data.notes} onChange={set('notes')} />
              </Field>
            </div>

            <div className={`consent${errors.consent ? ' has-error' : ''}`}>
              <input
                id="f-consent" name="consent" type="checkbox"
                checked={data.consent} onChange={set('consent')}
                aria-invalid={!!errors.consent}
                aria-describedby={['f-consent-text', errors.consent && 'f-consent-error'].filter(Boolean).join(' ')}
              />
              <label htmlFor="f-consent" id="f-consent-text">
                I agree that AT YOUR SERVICE may use the details I provide to respond to my inquiry and prepare a
                quotation. (Please don’t include passwords, bank or card details, or government ID numbers.)
              </label>
              {errors.consent && (
                <p className="error" id="f-consent-error"><Icon name="info" size={16} /> {errors.consent}</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block">
              Prepare My Inquiry <Icon name="arrow" size={20} />
            </button>
            <p className="form-footnote">
              This is an inquiry, not a confirmed booking. We’ll reply with a quotation for you to approve.
            </p>
          </form>

          {ready && (
            <div className="ready" tabIndex={-1} ref={readyRef} aria-labelledby="ready-title">
              <h3 id="ready-title"><Icon name="check-badge" size={24} /> Your inquiry is ready. Choose how to send it.</h3>
              <p className="ready-warn">
                <strong>It hasn’t been sent yet.</strong> Pick an option below, then press send in your email, messaging
                or Viber app.
              </p>
              <div className="ready-actions">
                <a className="btn btn-primary" href={ready.mailto}>
                  <Icon name="mail" size={20} /> Send by Email
                </a>
                <a className="btn btn-outline" href={ready.sms}>
                  <Icon name="chat" size={20} /> Send by Text (SMS)
                </a>
                <button type="button" className="btn btn-outline" onClick={copyMessage}>
                  <Icon name={copied ? 'check' : 'copy'} size={20} /> {copied ? 'Message copied' : 'Copy message'}
                </button>
                <a className="btn btn-outline" href={ready.viber}>
                  <Icon name="viber" size={20} /> Open Viber chat
                </a>
              </div>
              <p className="ready-tip" aria-live="polite">
                {copied
                  ? 'Copied! Now open Viber and paste the message into our chat.'
                  : `For Viber: copy the message first, then open our Viber chat (${CONTACT.phoneDisplay}) and paste it.`}
                {' '}If an option doesn’t open on your device, call or text {CONTACT.phoneDisplay} or email {CONTACT.email}.
              </p>
              <label htmlFor="f-preview" className="preview-label">Message preview</label>
              <textarea id="f-preview" className="preview" readOnly rows={9} value={ready.body} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
