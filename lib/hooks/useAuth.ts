'use client'

import { useEffect, useCallback } from 'react';
import { useStore } from '../store/store';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const {
    username,
    token,
    expiresAt,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    checkSession,
  } = useStore();

  const isAuthenticated = !!token;

  const handleLogin = useCallback(async (username: string, password: string) => {
    try {
      await login(username, password);
      // router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
    // router.push('/sign-in');
  }, [logout]);

  useEffect(() => {
    if (token && expiresAt) {
      const timeUntilExpire = expiresAt - Date.now();
      const refreshBuffer = 60000; // Refresh 1 minute before expiration

      if (timeUntilExpire > 0) {
        const timeoutId = setTimeout(() => {
          refreshToken();
        }, Math.max(timeUntilExpire - refreshBuffer, 0));

        return () => clearTimeout(timeoutId);
      }
    }
  }, [token, expiresAt, refreshToken]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    username,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshToken,
  };
};