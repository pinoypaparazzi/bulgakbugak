/* =========================================================
   INQUIRY HELPERS
   There is NO backend yet. The form does not store or send anything
   by itself. It validates the details and prepares a message that the
   customer sends to us from their own email, SMS or Viber app.

   TOMORROW / LATER: add `submitInquiry(data)` here that POSTs `data`
   to a serverless function or form service, and call it from
   src/components/BookingForm.jsx. Fields and validation stay the same.
   ========================================================= */
import { CONTACT, SITE } from '../content/site.js';
import { findService, NOT_SURE } from '../content/services.js';

export const EMPTY_INQUIRY = {
  name: '', mobile: '', email: '', service: '', task: '', location: '', date: '', time: '', notes: '', consent: false, extra: {},
};

export const TIME_OPTIONS = ['Morning (8 AM – 12 NN)', 'Afternoon (12 NN – 5 PM)', 'Evening (5 PM onwards)'];

export const serviceName = (slug) => (slug === NOT_SURE.slug ? NOT_SURE.name : findService(slug)?.name || '');
export const extraFieldsFor = (slug) => findService(slug)?.formFields || [];

/* Philippine mobile: 09XXXXXXXXX or +639XXXXXXXXX (spaces/dashes allowed) */
export function isValidPhMobile(value) {
  return /^(\+?63|0)9\d{9}$/.test(value.replace(/[\s\-().]/g, ''));
}
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function validateInquiry(d) {
  const errors = {};
  if (d.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!d.mobile.trim()) errors.mobile = 'Please enter your mobile number so we can reach you.';
  else if (!isValidPhMobile(d.mobile)) errors.mobile = 'Please enter a valid PH mobile number, e.g. 0917 123 4567.';
  if (d.email.trim() && !isValidEmail(d.email)) errors.email = 'Please check your email address, or leave it blank.';
  if (!d.service) errors.service = 'Please choose a service, or “Not sure — please help me choose”.';
  if (d.task.trim().length < 10) errors.task = 'Please describe your request in a few words (at least 10 characters).';
  if (!d.location.trim()) errors.location = 'Please tell us the general location (street, area or neighborhood).';
  if (d.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${d.date}T00:00:00`) < today) errors.date = 'Please choose today or a future date.';
  }
  if (!d.consent) errors.consent = 'Please confirm that we may use these details to respond to your request.';
  return errors;
}

function formatDate(iso) {
  if (!iso) return 'Flexible / not specified';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export function buildInquiryMessage(d) {
  const lines = [
    `Hello ${SITE.name}, I'd like to request a service.`,
    '',
    `Name: ${d.name.trim()}`,
    `Mobile: ${d.mobile.trim()}`,
    `Email: ${d.email.trim() || 'Not provided'}`,
    `Service: ${serviceName(d.service)}`,
    `Location: ${d.location.trim()}`,
    `Preferred date: ${formatDate(d.date)}`,
    `Preferred time: ${d.time || 'Flexible'}`,
  ];
  for (const f of extraFieldsFor(d.service)) {
    const v = (d.extra[f.name] || '').trim();
    if (v) lines.push(`${f.label}: ${v}`);
  }
  lines.push('', 'Request:', d.task.trim());
  if (d.notes.trim()) lines.push('', 'Additional details:', d.notes.trim());
  lines.push('', 'I understand this is a request, not yet a confirmed booking.');
  return lines.join('\n');
}

export function buildLinks(d) {
  const body = buildInquiryMessage(d);
  const subject = `Service request: ${serviceName(d.service)}`;
  return {
    body,
    mailto: `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    sms: `${CONTACT.smsHref}?body=${encodeURIComponent(body)}`,
    viber: CONTACT.viberHref,
  };
}
