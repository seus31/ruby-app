'use client';

import { useState } from 'react';
import { registerSchema, type RegisterFormData } from '../schemas';
import { useAuth } from '../hooks/useAuth';

export default function RegisterForm() {
  const { register: registerUser, loading, error } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    const data: RegisterFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === 'string') {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    registerUser(result.data.name, result.data.email, result.data.password);
  };

  return (
    <div className="container mt-5">
      <h2>会員登録</h2>
      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            名前
          </label>
          <input
            type="text"
            className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            required
          />
          {fieldErrors.name && (
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
        </div>
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
          {loading ? '送信中...' : '登録'}
        </button>
      </form>
    </div>
  );
}
