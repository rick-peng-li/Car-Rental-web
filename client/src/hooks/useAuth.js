import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '@/store/slices/authSlice';

/**
 * Single entry point for anything auth related.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'admin',
    logout,
  };
};
