'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Footer() {
  return (
    <footer className="bg-light border-top py-4 mt-auto">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="mb-0 text-muted small">&copy; ブログ</p>
          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-outline-secondary btn-sm">
              トップへ
            </Link>
            <Button
              variant="outline-secondary"
              size="sm"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ページトップへ
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
