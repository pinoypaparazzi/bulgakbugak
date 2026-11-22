import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/context.js';
import { api } from '../lib/api.js';
import Alert from '../components/Alert.jsx';
import Icon from '../components/Icon.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

const ROLE_LABELS = {
  super_duper_admin: 'Super Duper Admin',
  super_admin: 'Super Admin',
  admin: 'Admin',
  investor: 'Investor',
  hr: 'HR',
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';

/* Shows a temporary password once, with a copy button. */
function TemporaryPassword({ result, onDone }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.temporaryPassword);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="temp-password" tabIndex={-1} ref={ref} role="region" aria-labelledby="temp-title">
      <h2 id="temp-title"><Icon name="check" size={22} /> {result.heading}</h2>
      <p>
        Temporary password for <strong>{result.user.displayName}</strong> (username <strong>{result.user.username}</strong>):
      </p>
      <p className="temp-value"><code>{result.temporaryPassword}</code></p>
      <div className="temp-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={18} /> {copied ? 'Copied' : 'Copy password'}
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={onDone}>Done</button>
      </div>
      <p className="temp-warning">
        This is shown only once. Give it to the person privately (not by public chat or email). They’ll be asked to choose
        their own password the first time they sign in.
      </p>
    </div>
  );
}

function CreateAccountForm({ assignableRoles, onCreated }) {
  const empty = { username: '', displayName: '', role: '' };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!form.username.trim() || !form.displayName.trim() || !form.role) {
      setError('Please fill in the username, name and role.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await api('/accounts', { method: 'POST', body: { ...form, username: form.username.trim() } });
      setForm(empty);
      onCreated({ ...result, heading: 'Account created' });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-card create-form" onSubmit={onSubmit} noValidate aria-labelledby="create-title" aria-busy={busy}>
      <h2 id="create-title">Create a staff account</h2>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="new-username">Username</label>
          <input id="new-username" value={form.username} onChange={set('username')} autoComplete="off" autoCapitalize="none" spellCheck={false} required aria-describedby="new-username-hint" />
          <p className="hint" id="new-username-hint">3–32 characters: letters, numbers, dots, underscores or hyphens.</p>
        </div>
        <div className="field">
          <label htmlFor="new-name">Full name</label>
          <input id="new-name" value={form.displayName} onChange={set('displayName')} autoComplete="off" maxLength={80} required />
        </div>
        <div className="field">
          <label htmlFor="new-role">Role</label>
          <select id="new-role" value={form.role} onChange={set('role')} required>
            <option value="">Choose a role…</option>
            {assignableRoles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
      </div>
      <p className="hint">A temporary password is generated for them. They must change it when they first sign in.</p>
      <button type="submit" className="btn btn-primary" disabled={busy}>
        <Icon name="plus" size={18} /> {busy ? 'Creating…' : 'Create account'}
      </button>
    </form>
  );
}

function AccountCard({ account, me, can, assignableRoles, onChanged, onPassword, onError }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(account.displayName);
  const [role, setRole] = useState(account.role);
  const [busy, setBusy] = useState(false);

  const isSelf = account.id === me.user.id;
  const isProtected = account.role === 'super_duper_admin' && me.user.role !== 'super_duper_admin';
  const manageable = !isSelf && !isProtected;
  const canRename = can('staff.accounts.update');
  const canChangeRole = can('staff.roles.assign') && assignableRoles.some((r) => r.id === account.role);
  const canToggle = can('staff.accounts.deactivate');
  const canReset = can('staff.accounts.update');

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const save = (e) => {
    e.preventDefault();
    const body = {};
    if (canRename && displayName.trim() !== account.displayName) body.displayName = displayName;
    if (canChangeRole && role !== account.role) body.role = role;
    if (Object.keys(body).length === 0) return setEditing(false);
    run(async () => {
      const { account: updated } = await api(`/accounts/${account.id}`, { method: 'PATCH', body });
      onChanged(updated, `Saved changes to ${updated.displayName}.`);
      setEditing(false);
    });
  };

  const toggleStatus = () => {
    const deactivate = account.status === 'active';
    const question = deactivate
      ? `Deactivate ${account.displayName}? They will be signed out and won’t be able to sign in.`
      : `Reactivate ${account.displayName}? They will be able to sign in again.`;
    if (!window.confirm(question)) return;
    run(async () => {
      const { account: updated } = await api(`/accounts/${account.id}`, { method: 'PATCH', body: { status: deactivate ? 'deactivated' : 'active' } });
      onChanged(updated, `${updated.displayName} is now ${deactivate ? 'deactivated' : 'active'}.`);
    });
  };

  const resetPassword = () => {
    if (!window.confirm(`Reset the password for ${account.displayName}? Their current password stops working and they’ll be signed out.`)) return;
    run(async () => {
      const result = await api(`/accounts/${account.id}/reset-password`, { method: 'POST' });
      onChanged(result.user, null);
      onPassword({ ...result, heading: 'Password reset' });
    });
  };

  return (
    <li className={`account-card${account.status === 'deactivated' ? ' is-deactivated' : ''}`}>
      <div className="account-card-main">
        <div>
          <h3>
            {account.displayName}
            {isSelf && <span className="badge badge-self">You</span>}
          </h3>
          <p className="account-username">{account.username}</p>
        </div>
        <div className="account-badges">
          <span className="badge badge-role">{ROLE_LABELS[account.role]}</span>
          <span className={`badge ${account.status === 'active' ? 'badge-available' : 'badge-unavailable'}`}>
            {account.status === 'active' ? 'Active' : 'Deactivated'}
          </span>
          {account.mustChangePassword && account.status === 'active' && <span className="badge badge-pending">Password change pending</span>}
        </div>
      </div>
      <p className="account-meta">Last sign-in: {formatDate(account.lastLoginAt)}</p>

      {isProtected && <p className="account-meta">Only a Super Duper Admin can change this account.</p>}
      {isSelf && <p className="account-meta">To change your password, use the account menu at the top.</p>}

      {manageable && !editing && (
        <div className="account-actions">
          {(canRename || canChangeRole) && account.status === 'active' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(true)} disabled={busy}>Edit</button>
          )}
          {canReset && account.status === 'active' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={resetPassword} disabled={busy}>Reset password</button>
          )}
          {canToggle && (
            <button type="button" className={`btn btn-sm ${account.status === 'active' ? 'btn-danger' : 'btn-outline'}`} onClick={toggleStatus} disabled={busy}>
              {account.status === 'active' ? 'Deactivate' : 'Reactivate'}
            </button>
          )}
        </div>
      )}

      {manageable && editing && (
        <form className="account-edit" onSubmit={save} aria-label={`Edit ${account.displayName}`}>
          <div className="form-grid">
            {canRename && (
              <div className="field">
                <label htmlFor={`name-${account.id}`}>Full name</label>
                <input id={`name-${account.id}`} value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80} />
              </div>
            )}
            {canChangeRole && (
              <div className="field">
                <label htmlFor={`role-${account.id}`}>Role</label>
                <select id={`role-${account.id}`} value={role} onChange={(e) => setRole(e.target.value)} aria-describedby={`role-${account.id}-hint`}>
                  {assignableRoles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <p className="hint" id={`role-${account.id}-hint`}>Changing the role signs them out.</p>
              </div>
            )}
          </div>
          <div className="account-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEditing(false);
                setDisplayName(account.displayName);
                setRole(account.role);
              }}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

export default function StaffAccountsPage() {
  const { me, can } = useAuth();
  const [accounts, setAccounts] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState(null); // { tone, text }
  const [tempPassword, setTempPassword] = useState(null);

  const load = useCallback(
    () =>
      api('/accounts')
        .then((data) => {
          setAccounts(data.accounts);
          setLoadError('');
        })
        .catch((err) => setLoadError(err.message)),
    [],
  );

  useEffect(() => {
    document.title = 'Staff Accounts | AT YOUR SERVICE Staff';
    load();
  }, [load]);

  const replace = (updated, text) => {
    setAccounts((list) => list.map((a) => (a.id === updated.id ? updated : a)));
    if (text) setMessage({ tone: 'success', text });
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">Administration</p>
          <h1>Staff accounts</h1>
          <p className="page-lead">Everyone who can sign in to the staff portal. Accounts are deactivated rather than deleted, so their history is kept.</p>
        </div>
      </section>

      <section className="section section-soft section-tight">
        <div className="container accounts-layout">
          <div className="live-region" aria-live="polite">
            {message && <Alert tone={message.tone}>{message.text}</Alert>}
          </div>

          {tempPassword && (
            <TemporaryPassword
              result={tempPassword}
              onDone={() => {
                setTempPassword(null);
                setMessage({ tone: 'success', text: `Done. Remember to give ${tempPassword.user.displayName} their temporary password.` });
              }}
            />
          )}

          {can('staff.accounts.create') && me.assignableRoles.length > 0 && !tempPassword && (
            <CreateAccountForm
              assignableRoles={me.assignableRoles}
              onCreated={(result) => {
                setAccounts((list) => [...(list || []), result.user]);
                setMessage(null);
                setTempPassword(result);
              }}
            />
          )}

          <div>
            <h2 className="section-title">All accounts {accounts && <span className="count">({accounts.length})</span>}</h2>
            {loadError && <Alert tone="error">{loadError} <button type="button" className="link-button" onClick={load}>Try again</button></Alert>}
            {!accounts && !loadError && <LoadingScreen label="Loading accounts…" />}
            {accounts && accounts.length === 0 && <p>No accounts yet.</p>}
            {accounts && accounts.length > 0 && (
              <ul className="account-list">
                {accounts.map((a) => (
                  <AccountCard
                    key={a.id}
                    account={a}
                    me={me}
                    can={can}
                    assignableRoles={me.assignableRoles}
                    onChanged={replace}
                    onPassword={(result) => {
                      setMessage(null);
                      setTempPassword(result);
                      window.scrollTo({ top: 0 });
                    }}
                    onError={(text) => setMessage({ tone: 'error', text })}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
