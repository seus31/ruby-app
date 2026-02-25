'use client';

import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../schemas';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    const data: LoginFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === 'string' && !errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    await login(result.data.email, result.data.password);
  };

  return (
    <div className="container mt-5">
      <h2>ログイン</h2>
      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            メールアドレス
          </label>
          <input
            type="email"
            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            required
          />
          {fieldErrors.email && (
            <div className="invalid-feedback">{fieldErrors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            パスワード
          </label>
          <input
            type="password"
            className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            required
          />
          {fieldErrors.password && (
            <div className="invalid-feedback">{fieldErrors.password}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '送信中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
