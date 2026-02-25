'use client';

import Link from 'next/link';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Navbar expand="md" bg="light" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} href="/">
          ブログ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" aria-label="メニューを開く" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              トップ
            </Nav.Link>
            <Nav.Link as={Link} href="/posts">
              記事一覧
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} href="/dashboard">
                ダッシュボード
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Nav.Link as="button" type="button" onClick={logout} className="btn btn-link p-0 border-0">
                ログアウト
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} href="/login">
                  ログイン
                </Nav.Link>
                <Nav.Link as={Link} href="/register">
                  会員登録
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
