'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginApi, register as registerApi } from '../api';
import { setToken, removeToken, isTokenValid } from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const { token } = await loginApi({ email, password });
        setToken(token);
        router.push('/');
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : 'ログインに失敗しました';
        setError(message ?? 'ログインに失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await registerApi({ name, email, password });
        router.push('/login');
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : '登録に失敗しました';
        setError(message ?? '登録に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    removeToken();
    router.push('/login');
  }, [router]);

  return {
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: isTokenValid(),
  };
}
