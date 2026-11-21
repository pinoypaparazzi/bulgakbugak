/* =========================================================
   INQUIRY HELPERS
   There is no backend yet, so the form does NOT store or send
   anything by itself. It validates the details and prepares a
   ready-to-send message for the customer's email, SMS or Viber app.

   LATER: to connect a real backend or form service (for example
   Netlify Forms), add a `submitInquiry(data)` function here that
   POSTs `data` and call it from BookingForm.jsx. The form fields
   and validation can stay exactly as they are.
   ========================================================= */
import { CONTACT, SITE } from '../data/site.js';

export const EMPTY_INQUIRY = {
  name: '',
  mobile: '',
  email: '',
  service: '',
  task: '',
  location: '',
  date: '',
  time: '',
  notes: '',
  consent: false,
};

export const TIME_OPTIONS = ['Flexible', 'Morning (8 AM – 12 NN)', 'Afternoon (12 NN – 5 PM)', 'Evening (5 PM onwards)'];

/* Philippine mobile: 09XXXXXXXXX or +639XXXXXXXXX (spaces/dashes allowed) */
export function isValidPhMobile(value) {
  const digits = value.replace(/[\s\-().]/g, '');
  return /^(\+?63|0)9\d{9}$/.test(digits);
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
  if (d.task.trim().length < 10) errors.task = 'Please describe the task in a few words (at least 10 characters).';
  if (!d.location.trim()) errors.location = 'Please tell us the street, area or neighborhood.';
  if (d.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${d.date}T00:00:00`) < today) errors.date = 'Please choose today or a future date.';
  }
  if (!d.consent) errors.consent = 'Please confirm that we may use these details to respond to your inquiry.';
  return errors;
}

function formatDate(iso) {
  if (!iso) return 'Flexible / not specified';
  const dt = new Date(`${iso}T00:00:00`);
  return dt.toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export function buildInquiryMessage(d) {
  const lines = [
    `Hello ${SITE.name}, I'd like to request a quotation.`,
    '',
    `Name: ${d.name.trim()}`,
    `Mobile: ${d.mobile.trim()}`,
    `Email: ${d.email.trim() || 'Not provided'}`,
    `Service: ${d.service}`,
    `Location: ${d.location.trim()}`,
    `Preferred date: ${formatDate(d.date)}`,
    `Preferred time: ${d.time || 'Flexible'}`,
    '',
    'Task:',
    d.task.trim(),
  ];
  if (d.notes.trim()) lines.push('', 'Additional instructions:', d.notes.trim());
  lines.push('', 'I understand this is an inquiry and not yet a confirmed booking.');
  return lines.join('\n');
}

export function buildLinks(d) {
  const body = buildInquiryMessage(d);
  const subject = `Service inquiry: ${d.service}`;
  return {
    body,
    mailto: `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    sms: `${CONTACT.smsHref}?body=${encodeURIComponent(body)}`,
    viber: CONTACT.viberHref,
  };
}
