import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/* { status: 'loading' | 'signedIn' | 'signedOut', me, notice, login, logout, changePassword, refresh, can } */
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
