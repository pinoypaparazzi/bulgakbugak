import { useEffect, useState } from 'react';
import { getMe, logout } from './api.js';
import LoginPage from './LoginPage.jsx';
import Dashboard from './Dashboard.jsx';

export default function App() {
  // undefined = still checking, null = signed out, object = signed-in employee
  const [employee, setEmployee] = useState(undefined);

  useEffect(() => {
    getMe().then(setEmployee).catch(() => setEmployee(null));
  }, []);

  useEffect(() => {
    document.title = employee ? 'Staff Dashboard | AT YOUR SERVICE' : 'Staff Sign In | AT YOUR SERVICE';
  }, [employee]);

  const signOut = async () => {
    try {
      await logout();
    } finally {
      setEmployee(null);
    }
  };

  if (employee === undefined) {
    return <div className="loading" role="status">Loading…</div>;
  }
  return employee ? <Dashboard employee={employee} onSignOut={signOut} /> : <LoginPage onSignedIn={setEmployee} />;
}
