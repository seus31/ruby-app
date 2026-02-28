'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginApi, register as registerApi } from '../api';
import { setToken, removeToken, isTokenValid } from '@/lib/auth';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? fallback;
  }
  return fallback;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isTokenValid());
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const { token } = await loginApi({ email, password });
        setToken(token);
        setIsAuthenticated(true);
        router.push('/');
      } catch (err: unknown) {
        setError(extractErrorMessage(err, 'メールアドレスまたはパスワードが正しくありません'));
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
        setError(extractErrorMessage(err, '登録に失敗しました'));
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
  };
}
