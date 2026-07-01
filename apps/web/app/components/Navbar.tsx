"use client";

import Link from 'next/link';
import { useI18n } from './I18nProvider';

export function Navbar() {
  const { t, toggleLocale } = useI18n();

  return (
    <nav className="flex items-center justify-between p-6 md:px-margin-desktop bg-background sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link href="/" className="font-display-lg text-headline-sm font-bold tracking-tight">KhamarBari</Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">{t('nav.home')}</Link>
          <Link href="/ledger" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">{t('nav.ledger')}</Link>
          <Link href="/portfolio" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">{t('nav.portfolio')}</Link>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/farmer" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">{t('nav.farmer')}</Link>
        <Link href="/admin" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">{t('nav.admin')}</Link>
        <button
          className="font-label-caps text-label-caps border border-outline px-4 py-2 hover:bg-on-background hover:text-background transition-colors uppercase"
          onClick={toggleLocale}
        >
          {t('btn.toggle')}
        </button>
      </div>
    </nav>
  );
}
