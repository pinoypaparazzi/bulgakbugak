import { useRef, useState } from 'react';
import { login } from './api.js';

export default function LoginPage({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const errorRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setBusy(true);
    setError('');
    try {
      onSignedIn(await login(email.trim(), password));
    } catch (err) {
      setError(err.message);
      setPassword('');
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <img src="/images/logo-200.webp" width="89" height="80" alt="AT YOUR SERVICE" />
          <p className="eyebrow">Staff portal</p>
          <h1>Sign in</h1>
          <p className="muted">For AT YOUR SERVICE employees only.</p>
        </div>

        {error && (
          <div className="alert" role="alert" tabIndex={-1} ref={errorRef}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Work email</label>
            <input id="email" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false}
              value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="toggle" onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword} aria-controls="password">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="help">Forgot your password or locked out? Ask an administrator to reset it.</p>
      </div>
    </main>
  );
}
