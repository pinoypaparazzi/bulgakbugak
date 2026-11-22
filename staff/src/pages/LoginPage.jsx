import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../auth/context.js';
import AuthShell from '../components/AuthShell.jsx';
import Alert from '../components/Alert.jsx';
import Icon from '../components/Icon.jsx';
import PasswordField from '../components/PasswordField.jsx';

/* Only same-site paths are accepted as a return address (no open redirects). */
function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : '/';
}

export default function LoginPage() {
  const { status, me, notice, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const errorRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    document.title = 'Staff Sign In | AT YOUR SERVICE';
  }, []);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  if (status === 'signedIn' && !busy) {
    return <Navigate to={me.user.mustChangePassword ? '/change-password' : next} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const errs = {};
    if (!username.trim()) errs.username = 'Please enter your username.';
    if (!password) errs.password = 'Please enter your password.';
    setFieldErrors(errs);
    setError('');
    if (errs.username) return usernameRef.current?.focus();
    if (errs.password) return passwordRef.current?.focus();

    setBusy(true);
    try {
      const result = await login(username.trim(), password);
      navigate(result.user.mustChangePassword ? '/change-password' : next, { replace: true });
    } catch (err) {
      setPassword('');
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Sign in" intro="For AT YOUR SERVICE staff. Use the username and password given to you by an administrator.">
      {notice && !error && <Alert tone="info">{notice}</Alert>}
      {error && (
        <Alert tone="error" ref={errorRef}>
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate aria-busy={busy}>
        <div className={`field${fieldErrors.username ? ' has-error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            ref={usernameRef}
            type="text"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.username)}
            aria-describedby={fieldErrors.username ? 'username-error' : undefined}
            autoFocus
          />
          {fieldErrors.username && (
            <p className="error" id="username-error">
              <Icon name="info" size={16} /> {fieldErrors.username}
            </p>
          )}
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={fieldErrors.password}
          inputRef={passwordRef}
        />

        <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit" disabled={busy}>
          {busy ? <><span className="spinner spinner-light" aria-hidden="true" /> Signing in…</> : 'Sign In'}
        </button>
      </form>

      <p className="auth-help">Forgot your password or locked out? Ask a Super Admin or Super Duper Admin to reset it.</p>
    </AuthShell>
  );
}
