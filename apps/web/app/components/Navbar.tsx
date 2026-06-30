"use client";

import Link from 'next/link';
import { useI18n } from './I18nProvider';
import { Button } from '@kb/ui';

export function Navbar() {
  const { t, toggleLocale } = useI18n();

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-border-light shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <Link href="/" className="font-serif text-2xl font-bold text-sage">KhamarBari</Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-charcoal hover:text-sage">{t('nav.home')}</Link>
          <Link href="/ledger" className="text-charcoal hover:text-sage">{t('nav.ledger')}</Link>
          <Link href="/portfolio" className="text-charcoal hover:text-sage">{t('nav.portfolio')}</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/farmer" className="text-sm font-medium text-charcoal">{t('nav.farmer')}</Link>
        <Link href="/admin" className="text-sm font-medium text-charcoal">{t('nav.admin')}</Link>
        <Button variant="secondary" size="sm" onClick={toggleLocale}>
          {t('btn.toggle')}
        </Button>
      </div>
    </nav>
  );
}
