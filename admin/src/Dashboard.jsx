/* Placeholder home screen after sign-in. Inquiries, schedules and other
   staff tools will be added here. */
export default function Dashboard({ employee, onSignOut }) {
  return (
    <div className="dash">
      <header className="dash-header">
        <div className="dash-brand">
          <img src="/images/logo-120.webp" width="44" height="40" alt="" />
          <span>AT YOUR SERVICE <span className="muted">· Staff</span></span>
        </div>
        <div className="dash-user">
          <span className="who">
            {employee.name} <span className="role">{employee.role}</span>
          </span>
          <button type="button" className="btn-outline" onClick={onSignOut}>Sign out</button>
        </div>
      </header>
      <main className="dash-main">
        <h1>Welcome, {employee.name.split(' ')[0]}</h1>
        <p className="muted">You’re signed in as {employee.email}. Staff tools will appear here.</p>
      </main>
    </div>
  );
}
