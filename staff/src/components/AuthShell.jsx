import Logo from './Logo.jsx';

/* Centered card used by the sign-in and password-change pages. */
export default function AuthShell({ eyebrow = 'Staff portal', title, intro, children }) {
  return (
    <main className="auth-shell" id="main">
      <div className="auth-card form-card">
        <div className="auth-brand">
          <Logo height={88} eager alt="AT YOUR SERVICE" />
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {intro && <p className="auth-intro">{intro}</p>}
        </div>
        {children}
      </div>
      <p className="auth-tagline">Your Time Matters. Let Us Handle the Rest.</p>
    </main>
  );
}
