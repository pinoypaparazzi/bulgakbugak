import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../auth/context.js';
import AuthShell from '../components/AuthShell.jsx';
import Alert from '../components/Alert.jsx';
import PasswordField from '../components/PasswordField.jsx';

const MIN_LENGTH = 12; // the server enforces the full policy

export default function ChangePasswordPage() {
  const { me, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const forced = me.user.mustChangePassword;

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const errorRef = useRef(null);
  const currentRef = useRef(null);
  const newRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    document.title = 'Change Password | AT YOUR SERVICE Staff';
  }, []);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const errs = {};
    if (!current) errs.current = 'Please enter your current password.';
    if (next.length < MIN_LENGTH) errs.next = `Use at least ${MIN_LENGTH} characters.`;
    else if (next === current) errs.next = 'Your new password must be different from your current one.';
    if (confirm !== next) errs.confirm = 'The two new passwords don’t match.';
    setErrors(errs);
    setError('');
    const first = ['current', 'next', 'confirm'].find((k) => errs[k]);
    const refFor = { current: currentRef, next: newRef, confirm: confirmRef };
    if (first) return refFor[first].current?.focus();

    setBusy(true);
    try {
      await changePassword(current, next);
      navigate('/', { replace: true, state: { flash: 'Your password has been changed.' } });
    } catch (err) {
      setBusy(false);
      if (err.code === 'wrong_current_password') {
        setErrors({ current: err.message });
        setCurrent('');
        currentRef.current?.focus();
      } else if (err.code === 'weak_password') {
        setErrors({ next: err.message });
        newRef.current?.focus();
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <AuthShell
      eyebrow={forced ? 'Action required' : 'Your account'}
      title={forced ? 'Choose a new password' : 'Change password'}
      intro={
        forced
          ? 'For your security, you need to replace the password you were given before you can continue.'
          : 'Changing your password signs you out on your other devices.'
      }
    >
      {error && (
        <Alert tone="error" ref={errorRef}>
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate aria-busy={busy}>
        {/* Helps password managers save the new password under the right account. */}
        <input type="text" name="username" autoComplete="username" value={me.user.username} readOnly hidden />
        <PasswordField id="current-password" label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" error={errors.current} inputRef={currentRef} />
        <PasswordField
          id="new-password"
          label="New password"
          value={next}
          onChange={setNext}
          autoComplete="new-password"
          error={errors.next}
          inputRef={newRef}
          hint={`At least ${MIN_LENGTH} characters. A few unrelated words make a strong, memorable password. Don’t include your username or reuse a password from another site.`}
        />
        <PasswordField id="confirm-password" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" error={errors.confirm} inputRef={confirmRef} />

        <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit" disabled={busy}>
          {busy ? <><span className="spinner spinner-light" aria-hidden="true" /> Saving…</> : 'Save new password'}
        </button>
      </form>

      <p className="auth-help">
        {forced ? (
          <button type="button" className="link-button" onClick={logout}>Sign out instead</button>
        ) : (
          <Link to="/">Back to dashboard</Link>
        )}
      </p>
    </AuthShell>
  );
}
