/* Shared contact details and original line icons */
export const CONTACT = {
  phoneDisplay: '0917-504-5959',
  phoneHref: 'tel:+639175045959',
  smsHref: 'sms:+639175045959',
  email: 'hello@kuyamark.com',
  facebookDisplay: 'facebook.com/kuyamark',
  facebookHref: 'https://www.facebook.com/kuyamark',
};

const paths = {
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.8l2.5 11.7a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7.5H6.1" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  car: (
    <>
      <path d="M3.5 13 5.4 8.3A2 2 0 0 1 7.3 7h9.4a2 2 0 0 1 1.9 1.3l1.9 4.7" />
      <path d="M3 13h18v4a1 1 0 0 1-1 1h-1.5M5.5 18H4a1 1 0 0 1-1-1v-4" />
      <circle cx="7.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
      <path d="M9.3 18h5.4" />
    </>
  ),
  care: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 9.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M12 17.2s-3.2-1.9-3.2-3.9a1.7 1.7 0 0 1 3.2-.8 1.7 1.7 0 0 1 3.2.8c0 2-3.2 3.9-3.2 3.9z" />
    </>
  ),
  package: (
    <>
      <path d="M21 7.5 12 3 3 7.5v9L12 21l9-4.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9M7.5 5.2l9 4.6" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  chat: (
    <path d="M12 3.5c-4.7 0-8.5 3.5-8.5 7.8 0 2.4 1.2 4.6 3.1 6V21l3.3-1.8c.7.2 1.4.3 2.1.3 4.7 0 8.5-3.5 8.5-7.8S16.7 3.5 12 3.5z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1c.5-.1.9-.1 1.4-.1 6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18 12 18c1.6 0 3-.4 4.3-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 16l-4-4 4-4M6 12h10" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
};

export function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function Brand() {
  return (
    <>
      <span className="brand-mark"><Icon name="check" size={16} /></span>
      <span>Kuya Mark <span className="brand-light">Concierge</span></span>
    </>
  );
}
