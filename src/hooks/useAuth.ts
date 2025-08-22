import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook from AuthContext for convenience
export const useAuth = useAuthContext;

// Additional auth utility hooks
export function useIsAuthenticated() {
  const { user, isLoading } = useAuth();
  return { isAuthenticated: !!user, isLoading };
}

export function useUserRole() {
  const { user } = useAuth();
  return user?.role || null;
}

export function useIsRole(role: string) {
  const { user } = useAuth();
  return user?.role === role;
}

export function useCanAccess(allowedRoles: string[]) {
  const { user } = useAuth();
  return user ? allowedRoles.includes(user.role || '') : false;
}
