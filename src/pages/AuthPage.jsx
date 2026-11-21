import { useEffect, useRef, useState } from 'react';
import { Icon, Brand, CONTACT } from '../shared.jsx';
import { Link, navigate } from '../router.jsx';
import {
  DEMO_MODE,
  MIN_PASSWORD,
  onDemoEmail,
  signUp,
  resendCode,
  verifyCode,
  login,
  requestPasswordReset,
  checkResetToken,
  resetPassword,
  isValidPhone,
  isValidEmail,
} from '../auth.js';

/* ---------- small form pieces ---------- */
function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function PasswordInput({ value, onChange, autoComplete, placeholder = 'At least 8 characters' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-wrap">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={MIN_PASSWORD}
        required
      />
      <button
        type="button"
        className="input-toggle"
        onClick={() => setShow(!show)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
      </button>
    </div>
  );
}

function CodeInput({ digits, setDigits, disabled }) {
  const refs = useRef([]);
  const fill = (start, text) => {
    const nums = text.replace(/\D/g, '').slice(0, 6 - start).split('');
    if (!nums.length) return;
    const next = [...digits];
    nums.forEach((n, k) => { next[start + k] = n; });
    setDigits(next);
    const target = refs.current[Math.min(start + nums.length, 5)];
    if (target) target.focus();
  };
  return (
    <div className="code-input">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1} of 6`}
          autoFocus={i === 0}
          onFocus={(e) => e.target.select()}
          onPaste={(e) => { e.preventDefault(); fill(i, e.clipboardData.getData('text')); }}
          onChange={(e) => {
            const nums = e.target.value.replace(/\D/g, '');
            if (!nums) {
              const next = [...digits];
              next[i] = '';
              setDigits(next);
              return;
            }
            fill(i, d && nums.length > 1 ? nums.replace(d, '') : nums);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i] && i > 0) {
              const next = [...digits];
              next[i - 1] = '';
              setDigits(next);
              refs.current[i - 1].focus();
            }
          }}
        />
      ))}
    </div>
  );
}

function DemoOutbox({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="demo-outbox" role="status">
      <div className="demo-outbox-head">
        <span className="demo-tag">Demo email</span>
        <button type="button" onClick={onClose} aria-label="Dismiss">×</button>
      </div>
      <p className="demo-to">To: {message.to}</p>
      {message.type === 'code' ? (
        <p>Your Kuya Mark verification code is <strong className="demo-code">{message.code}</strong></p>
      ) : (
        <p>
          Reset your password:{' '}
          <Link to={message.link.replace(window.location.origin, '')} onClick={onClose}>Open reset link</Link>
        </p>
      )}
      <p className="demo-note">No real email is sent in demo mode.</p>
    </div>
  );
}

/* ---------- page ---------- */
export default function AuthPage({ initialMode = 'login', onAuthed }) {
  const [mode, setMode] = useState(initialMode);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resetToken] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [demoMsg, setDemoMsg] = useState(null);

  useEffect(() => onDemoEmail(setDemoMsg), []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (mode === 'reset') {
      checkResetToken(resetToken).then((ok) => { if (!ok) setMode('reset-invalid'); });
    }
  }, [mode, resetToken]);

  const go = (m) => {
    setError('');
    setPassword('');
    setConfirm('');
    setMode(m);
  };

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  /* ----- handlers ----- */
  const handleLogin = (e) => {
    e.preventDefault();
    if (!isValidPhone(phone)) return setError('Enter a valid CP number, like 0917-123-4567.');
    return run(async () => onAuthed(await login({ phone, password })));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!isValidPhone(phone)) return setError('Enter a valid CP number, like 0917-123-4567.');
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (password.length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
    if (password !== confirm) return setError('Passwords do not match.');
    return run(async () => {
      const res = await signUp({ phone, email, password });
      setMaskedEmail(res.maskedEmail);
      setDigits(['', '', '', '', '', '']);
      setCooldown(30);
      setMode('verify');
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) return setError('Enter all 6 digits.');
    return run(async () => {
      const session = await verifyCode(phone, code);
      setDemoMsg(null);
      onAuthed(session);
    });
  };

  const handleResend = () =>
    run(async () => {
      await resendCode(phone);
      setDigits(['', '', '', '', '', '']);
      setCooldown(30);
    });

  const handleForgot = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    return run(async () => {
      await requestPasswordReset(email);
      setMode('forgot-sent');
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
    if (password !== confirm) return setError('Passwords do not match.');
    return run(async () => {
      await resetPassword(resetToken, password);
      setMode('reset-done');
    });
  };

  const backToLogin = () => {
    if (window.location.pathname !== '/book') navigate('/book');
    else go('login');
  };

  /* ----- views ----- */
  const errorBox = error && <p className="form-error" role="alert"><Icon name="info" size={18} /> {error}</p>;
  const submitBtn = (label) => (
    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
      {busy ? 'Please wait…' : label} {!busy && <Icon name="arrow" size={18} />}
    </button>
  );

  let view;
  if (mode === 'login') {
    view = (
      <>
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to book a service.</p>
        <form onSubmit={handleLogin} className="auth-form" noValidate>
          <Field label="CP number">
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="0917-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Field label="Password">
            <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" placeholder="Your password" />
          </Field>
          <div className="form-row-end">
            <button type="button" className="text-btn" onClick={() => go('forgot')}>Forgot password?</button>
          </div>
          {errorBox}
          {submitBtn('Log in')}
        </form>
        <p className="auth-switch">
          New here? <button type="button" className="text-btn" onClick={() => go('signup')}>Create an account</button>
        </p>
      </>
    );
  } else if (mode === 'signup') {
    view = (
      <>
        <h1>Create your account</h1>
        <p className="auth-sub">Your CP number will be your username.</p>
        <form onSubmit={handleSignup} className="auth-form" noValidate>
          <Field label="CP number" hint="This is what you'll use to log in.">
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="0917-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Field label="Email" hint="We'll send a 6-digit code here to verify it's you.">
            <input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password" hint={`At least ${MIN_PASSWORD} characters. Simple is fine.`}>
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password">
            <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Type it again" />
          </Field>
          {errorBox}
          {submitBtn('Send verification code')}
        </form>
        <p className="auth-switch">
          Already have an account? <button type="button" className="text-btn" onClick={() => go('login')}>Log in</button>
        </p>
      </>
    );
  } else if (mode === 'verify') {
    view = (
      <>
        <span className="auth-icon"><Icon name="mail" size={26} /></span>
        <h1>Check your email</h1>
        <p className="auth-sub">We sent a 6-digit code to <strong>{maskedEmail}</strong>. Enter it below to finish creating your account.</p>
        <form onSubmit={handleVerify} className="auth-form" noValidate>
          <CodeInput digits={digits} setDigits={setDigits} disabled={busy} />
          {errorBox}
          {submitBtn('Verify and continue')}
        </form>
        <p className="auth-switch">
          Didn't get it?{' '}
          <button type="button" className="text-btn" onClick={handleResend} disabled={busy || cooldown > 0}>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
          <br />
          <button type="button" className="text-btn text-btn-muted" onClick={() => go('signup')}>Use a different email</button>
        </p>
      </>
    );
  } else if (mode === 'forgot') {
    view = (
      <>
        <h1>Forgot your password?</h1>
        <p className="auth-sub">Enter the email on your account and we'll send you a link to set a new password.</p>
        <form onSubmit={handleForgot} className="auth-form" noValidate>
          <Field label="Email">
            <input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </Field>
          {errorBox}
          {submitBtn('Send reset link')}
        </form>
        <p className="auth-switch">
          <button type="button" className="text-btn" onClick={() => go('login')}><Icon name="arrowLeft" size={16} /> Back to log in</button>
        </p>
      </>
    );
  } else if (mode === 'forgot-sent') {
    view = (
      <>
        <span className="auth-icon"><Icon name="mail" size={26} /></span>
        <h1>Check your email</h1>
        <p className="auth-sub">
          If <strong>{email.trim()}</strong> belongs to an account, we've sent a link to reset your password. The link works for 30 minutes.
        </p>
        <button type="button" className="btn btn-ghost btn-lg btn-block" onClick={() => go('login')}>Back to log in</button>
        <p className="auth-switch">
          Wrong email? <button type="button" className="text-btn" onClick={() => go('forgot')}>Try again</button>
        </p>
      </>
    );
  } else if (mode === 'reset') {
    view = (
      <>
        <h1>Set a new password</h1>
        <p className="auth-sub">Choose a new password for your account.</p>
        <form onSubmit={handleReset} className="auth-form" noValidate>
          <Field label="New password" hint={`At least ${MIN_PASSWORD} characters.`}>
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Type it again" />
          </Field>
          {errorBox}
          {submitBtn('Save new password')}
        </form>
      </>
    );
  } else if (mode === 'reset-invalid') {
    view = (
      <>
        <span className="auth-icon auth-icon-warn"><Icon name="info" size={26} /></span>
        <h1>Link expired</h1>
        <p className="auth-sub">This password reset link is invalid or has already been used. Request a new one below.</p>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => { navigate('/book'); }}>
          Back to log in
        </button>
      </>
    );
  } else if (mode === 'reset-done') {
    view = (
      <>
        <span className="auth-icon auth-icon-ok"><Icon name="check" size={26} /></span>
        <h1>Password updated</h1>
        <p className="auth-sub">You can now log in with your CP number and new password.</p>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={backToLogin}>
          Log in <Icon name="arrow" size={18} />
        </button>
      </>
    );
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link to="/" className="brand brand-invert"><Brand /></Link>
        <div className="auth-aside-body">
          <h2>Your errands, handled.</h2>
          <ul>
            <li><Icon name="check" size={18} /> Book grocery runs, document help, driving, elder check-ins, and package pick-up</li>
            <li><Icon name="check" size={18} /> Get a clear quote before any work starts</li>
            <li><Icon name="shield" size={18} /> Your CP number is your username. Easy to remember.</li>
          </ul>
        </div>
        <p className="auth-aside-foot">
          Need help? Call or text <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
        </p>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <Link to="/" className="brand auth-brand-mobile"><Brand /></Link>
          <Link to="/" className="back-link"><Icon name="arrowLeft" size={16} /> Home</Link>
        </div>
        <div className="auth-card">
          {DEMO_MODE && <DemoOutbox message={demoMsg} onClose={() => setDemoMsg(null)} />}
          {view}
        </div>
      </main>
    </div>
  );
}
