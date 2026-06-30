"use client";

import { useI18n } from './components/I18nProvider';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@kb/ui';
import Link from 'next/link';

export default function Page() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center py-12 px-4 space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="font-serif text-5xl font-bold text-charcoal">{t('home.title')}</h1>
        <p className="text-lg text-charcoal/80">{t('home.subtitle')}</p>
      </div>

      {/* Mock Map / Catalog Area */}
      <div className="w-full max-w-5xl bg-white p-4 rounded-lg shadow-sm border border-border-light h-96 flex items-center justify-center relative">
        <span className="text-charcoal/50 font-medium tracking-widest">[ MAPBOX INTERACTIVE MAP MOUNT POINT ]</span>

        {/* Mock Map Overlay */}
        <div className="absolute top-8 left-8">
          <Card className="w-64 bg-white/90 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Bogra Premium Rice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-charcoal/70 mb-4">Verified Farm • Active Harvest</p>
              <Link href="/product/prod_1">
                <Button variant="primary" className="w-full">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
