import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { publishedServices, publishedSpecialties, findService, NOT_SURE, serviceUrl } from '../content/services.js';
import { CONTACT } from '../content/site.js';
import { EMPTY_INQUIRY, TIME_OPTIONS, validateInquiry, buildLinks, extraFieldsFor } from '../lib/inquiry.js';

const FIELD_ORDER = ['name', 'mobile', 'email', 'service', 'task', 'location', 'date', 'consent'];

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/* Every field gets a label, optional hint and error message wired up the same way. */
function Field({ id, label, optional, hint, error, children, className = '' }) {
  return (
    <div className={`field ${className}${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {optional ? <span className="optional">(optional)</span> : <span className="req" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="error" id={`${id}-error`}><Icon name="info" size={16} /> {error}</p>}
    </div>
  );
}

export default function BookingForm() {
  const [data, setData] = useState(EMPTY_INQUIRY);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(null);
  const [copied, setCopied] = useState(false);
  const [minDate, setMinDate] = useState(undefined);
  const [announce, setAnnounce] = useState('');
  const summaryRef = useRef(null);
  const readyRef = useRef(null);

  // Runs in the browser only: set the earliest date, and preselect ?service=<slug>.
  useEffect(() => {
    setMinDate(todayIso());
    const slug = new URLSearchParams(window.location.search).get('service');
    const svc = slug && (slug === NOT_SURE.slug ? NOT_SURE : findService(slug));
    if (svc) {
      setData((d) => ({ ...d, service: svc.slug }));
      setAnnounce(`Service selected: ${svc.name}`);
    }
  }, []);

  const clearOnEdit = (key) => {
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    if (ready) setReady(null);
  };
  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setData((d) => ({ ...d, [key]: value }));
    clearOnEdit(key);
  };
  const setExtra = (name) => (e) => {
    const value = e.target.value;
    setData((d) => ({ ...d, extra: { ...d.extra, [name]: value } }));
    if (ready) setReady(null);
  };

  const describedBy = (key, hasHint) =>
    [hasHint && `f-${key}-hint`, errors[key] && `f-${key}-error`].filter(Boolean).join(' ') || undefined;

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validateInquiry(data);
    setErrors(found);
    if (FIELD_ORDER.some((k) => found[k])) {
      setReady(null);
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
      const ta = document.getElementById('f-preview');
      ta?.focus();
      ta?.select();
    }
  };

  const errorKeys = FIELD_ORDER.filter((k) => errors[k]);
  const selected = findService(data.service);
  const extras = extraFieldsFor(data.service);

  return (
    <div className="booking-grid">
      <aside className="booking-intro" aria-labelledby="how-sent-title">
        <div className="how-sent">
          <h2 id="how-sent-title"><Icon name="info" size={20} /> How your request is sent</h2>
          <p>
            Our online booking system isn’t live yet, so this form <strong>doesn’t send or store your details by itself</strong>.
            When you press <strong>Prepare My Request</strong>, we format your details so you can send them to us in one tap by
            email, text message or Viber.
          </p>
          <p>Submitting a request doesn’t guarantee availability or confirm a booking. We’ll reply to confirm scope and pricing first.</p>
        </div>

        <div className="direct-contact">
          <p>Prefer to reach us directly?</p>
          <a href={CONTACT.phoneHref} className="direct-link"><Icon name="phone" size={20} /> Call {CONTACT.phoneDisplay}</a>
          <a href={CONTACT.viberHref} className="direct-link"><Icon name="viber" size={20} /> Viber {CONTACT.phoneDisplay}</a>
          <a href={CONTACT.emailHref} className="direct-link"><Icon name="mail" size={20} /> {CONTACT.email}</a>
          <a href={CONTACT.facebookHref} className="direct-link" target="_blank" rel="noopener noreferrer">
            <Icon name="facebook" size={20} /> Message us on Facebook<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </aside>

      <div className="form-card">
        <p className="sr-only" aria-live="polite">{announce}</p>

        {errorKeys.length > 0 && (
          <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
            <h2>Please check {errorKeys.length === 1 ? '1 field' : `${errorKeys.length} fields`}:</h2>
            <ul>
              {errorKeys.map((k) => (
                <li key={k}>
                  <a href={`#f-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`f-${k}`)?.focus(); }}>{errors[k]}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form noValidate onSubmit={onSubmit} aria-describedby="form-required-note" name="service-request">
          <p id="form-required-note" className="required-note">
            Fields marked <span className="req" aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
          </p>

          <div className="form-grid">
            <Field id="f-name" label="Full name" error={errors.name}>
              <input id="f-name" name="name" type="text" autoComplete="name" value={data.name} onChange={set('name')}
                required aria-required="true" aria-invalid={!!errors.name} aria-describedby={describedBy('name')} />
            </Field>

            <Field id="f-mobile" label="Contact number" hint="Mobile number we can call, text or Viber." error={errors.mobile}>
              <input id="f-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567"
                value={data.mobile} onChange={set('mobile')}
                required aria-required="true" aria-invalid={!!errors.mobile} aria-describedby={describedBy('mobile', true)} />
            </Field>

            <Field id="f-email" label="Email address" optional error={errors.email} className="span-2">
              <input id="f-email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                value={data.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} />
            </Field>

            <Field id="f-service" label="Requested service" error={errors.service} className="span-2"
              hint={selected ? undefined : 'Choose the closest match, or “Not sure” and we’ll help.'}>
              <select id="f-service" name="service" value={data.service} onChange={set('service')}
                required aria-required="true" aria-invalid={!!errors.service} aria-describedby={describedBy('service', !selected)}>
                <option value="">Select a service…</option>
                <option value={NOT_SURE.slug}>{NOT_SURE.name}</option>
                <optgroup label="Specialized services">
                  {publishedSpecialties().map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                </optgroup>
                <optgroup label="Service categories">
                  {publishedServices().map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                </optgroup>
              </select>
            </Field>

            {selected && (
              <p className="selected-service span-2">
                <Icon name="info" size={18} />
                <span>
                  {selected.deliveryNote}{' '}
                  <a href={serviceUrl(selected)} target="_blank" rel="noopener noreferrer">
                    Service details<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </span>
              </p>
            )}

            {extras.length > 0 && (
              <fieldset className="extra-fields span-2">
                <legend>A few details about this service <span className="optional">(optional)</span></legend>
                <div className="form-grid">
                  {extras.map((f) => {
                    const id = `f-x-${f.name}`;
                    const val = data.extra[f.name] || '';
                    return (
                      <Field key={f.name} id={id} label={f.label} optional hint={f.hint} className={f.type === 'select' ? '' : 'span-2'}>
                        {f.type === 'select' ? (
                          <select id={id} value={val} onChange={setExtra(f.name)} aria-describedby={f.hint ? `${id}-hint` : undefined}>
                            <option value="">Select…</option>
                            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : f.type === 'textarea' ? (
                          <textarea id={id} rows={3} value={val} onChange={setExtra(f.name)} aria-describedby={f.hint ? `${id}-hint` : undefined} />
                        ) : (
                          <input id={id} type="text" value={val} onChange={setExtra(f.name)} aria-describedby={f.hint ? `${id}-hint` : undefined} />
                        )}
                      </Field>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <Field id="f-task" label="Description of your request" className="span-2" error={errors.task}
              hint="What do you need done? Include anything that affects time or cost, such as items to buy or places to go.">
              <textarea id="f-task" name="task" rows={4} value={data.task} onChange={set('task')}
                required aria-required="true" aria-invalid={!!errors.task} aria-describedby={describedBy('task', true)} />
            </Field>

            <Field id="f-location" label="General location or service address" className="span-2" error={errors.location}
              hint="A street, area or landmark is enough for now, e.g. “Maginhawa Street, Teachers Village”.">
              <input id="f-location" name="location" type="text" autoComplete="off" value={data.location} onChange={set('location')}
                required aria-required="true" aria-invalid={!!errors.location} aria-describedby={describedBy('location', true)} />
            </Field>

            <Field id="f-date" label="Preferred date" optional error={errors.date}>
              <input id="f-date" name="date" type="date" min={minDate} value={data.date} onChange={set('date')}
                aria-invalid={!!errors.date} aria-describedby={describedBy('date')} />
            </Field>

            <Field id="f-time" label="Preferred time" optional>
              <select id="f-time" name="time" value={data.time} onChange={set('time')}>
                <option value="">Flexible</option>
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field id="f-notes" label="Additional details" optional className="span-2">
              <textarea id="f-notes" name="notes" rows={3} value={data.notes} onChange={set('notes')} />
            </Field>
          </div>

          <div className={`consent${errors.consent ? ' has-error' : ''}`}>
            <input id="f-consent" name="consent" type="checkbox" checked={data.consent} onChange={set('consent')}
              aria-invalid={!!errors.consent}
              aria-describedby={['f-consent-text', errors.consent && 'f-consent-error'].filter(Boolean).join(' ')} />
            <label htmlFor="f-consent" id="f-consent-text">
              I agree that AT YOUR SERVICE may use the details I provide to respond to my request and prepare a quotation.
              (Please don’t include passwords, bank or card details, or government ID numbers.)
            </label>
            {errors.consent && <p className="error" id="f-consent-error"><Icon name="info" size={16} /> {errors.consent}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block">Prepare My Request <Icon name="arrow" size={20} /></button>
          <p className="form-footnote">This is a request, not a confirmed booking. We’ll reply to confirm availability, scope and pricing.</p>
        </form>

        {ready && (
          <div className="ready" tabIndex={-1} ref={readyRef} aria-labelledby="ready-title">
            <h2 id="ready-title"><Icon name="check-badge" size={24} /> Your request is ready. Choose how to send it.</h2>
            <p className="ready-warn"><strong>It hasn’t been sent yet.</strong> Pick an option below, then press send in your email, messaging or Viber app.</p>
            <div className="ready-actions">
              <a className="btn btn-primary" href={ready.mailto}><Icon name="mail" size={20} /> Send by Email</a>
              <a className="btn btn-outline" href={ready.sms}><Icon name="chat" size={20} /> Send by Text (SMS)</a>
              <button type="button" className="btn btn-outline" onClick={copyMessage}>
                <Icon name={copied ? 'check' : 'copy'} size={20} /> {copied ? 'Message copied' : 'Copy message'}
              </button>
              <a className="btn btn-outline" href={ready.viber}><Icon name="viber" size={20} /> Open Viber chat</a>
            </div>
            <p className="ready-tip" aria-live="polite">
              {copied ? 'Copied! Now open Viber and paste the message into our chat.' : `For Viber: copy the message first, then open our Viber chat (${CONTACT.phoneDisplay}) and paste it.`}
              {' '}If an option doesn’t open on your device, call or text {CONTACT.phoneDisplay} or email {CONTACT.email}.
            </p>
            <label htmlFor="f-preview" className="preview-label">Message preview</label>
            <textarea id="f-preview" className="preview" readOnly rows={9} value={ready.body} />
          </div>
        )}
      </div>
    </div>
  );
}
