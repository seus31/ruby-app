'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar navbar-expand-md navbar-light bg-light border-bottom">
      <div className="container">
        <Link href="/" className="navbar-brand">
          ブログ
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="メニューを開く"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <nav className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                トップ
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/posts" className="nav-link">
                記事一覧
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link">
                  ダッシュボード
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link btn btn-link"
                  onClick={logout}
                >
                  ログアウト
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    ログイン
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    会員登録
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
