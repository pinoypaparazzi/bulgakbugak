import { BrowserRouter, Route, Routes } from 'react-router'
import AuthProvider from './auth/AuthProvider.jsx'
import { RequireAuth, RequirePasswordCurrent, RequirePermission } from './auth/guards.jsx'
import AppLayout from './components/AppLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import StaffAccountsPage from './pages/StaffAccountsPage.jsx'
import AuditLogPage from './pages/AuditLogPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

/* Routes of the staff portal:
   /login            sign in (public)
   /change-password  required after first sign-in or a reset; also voluntary
   /                 role-aware dashboard
   /accounts         staff accounts (staff.accounts.read)
   /audit            audit log (audit.read) */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route element={<RequirePasswordCurrent />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="accounts" element={<RequirePermission permission="staff.accounts.read"><StaffAccountsPage /></RequirePermission>} />
                <Route path="audit" element={<RequirePermission permission="audit.read"><AuditLogPage /></RequirePermission>} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
