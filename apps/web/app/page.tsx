"use client";

import { useI18n } from './components/I18nProvider';
import Link from 'next/link';

export default function Page() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 md:px-margin-desktop py-24 md:py-32 overflow-hidden flex flex-col justify-center">
        <p className="font-mono-data text-mono-data text-primary mb-4 tracking-[0.2em] relative z-10">ESTABLISHED PROVENANCE MMXXIV</p>
        <h1 className="font-display-lg text-display-lg mb-6 leading-none relative z-10 uppercase">FARM-TO-DOOR PANTRY</h1>
        <div className="h-px w-32 bg-on-background mb-8 relative z-10"></div>
        <p className="font-mono-data text-mono-data text-secondary uppercase tracking-widest relative z-10">MASTER BUILD SPECIFICATION v1.0.4</p>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mt-8 relative z-10">
          The convergence of artisanal agriculture and cryptographic integrity. We deliver essential provisions directly from the source, secured by immutable ledger verification.
        </p>
        <div className="mt-12 flex gap-4 relative z-10">
          <button className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 hover:bg-on-background transition-colors">EXPLORE ARCHIVE</button>
          <button className="border border-outline font-label-caps text-label-caps px-8 py-4 hover:bg-on-background hover:text-background transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
            VERIFY PROVENANCE
          </button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-surface-container-low px-6 md:px-margin-desktop py-section-gap">
        <div className="max-w-3xl">
          <h2 className="font-headline-md text-headline-md mb-8">Cryptographic Trust</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
              Every item in our pantry carries a unique cryptographic signature. From soil health metrics to harvest timestamps, the data is anchored to the blockchain, ensuring what you receive is exactly what was promised. No intermediaries, no obscured origins.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-l border-outline-variant pl-6">
              <p className="font-headline-sm text-headline-sm text-primary">100%</p>
              <p className="font-label-caps text-label-caps text-secondary mt-2">VERIFIED ORIGIN</p>
            </div>
            <div className="border-l border-outline-variant pl-6">
              <p className="font-headline-sm text-headline-sm text-primary">Zero</p>
              <p className="font-label-caps text-label-caps text-secondary mt-2">TAMPER RISK</p>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Section */}
      <section className="px-6 md:px-margin-desktop py-section-gap">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="font-mono-data text-mono-data text-primary mb-2 uppercase">Current Stock</p>
            <h2 className="font-headline-md text-headline-md">The Pantry Archive</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="border border-outline px-4 py-2 font-label-caps text-label-caps hover:bg-on-background hover:text-background transition-colors">ALL GOODS</button>
            <button className="border border-outline px-4 py-2 font-label-caps text-label-caps hover:bg-on-background hover:text-background transition-colors">LIMITED EDITIONS</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-high mb-6 relative overflow-hidden flex items-center justify-center">
              <span className="text-secondary opacity-50 font-mono-data uppercase">Image Placeholder</span>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
              {/* Blueprint Overlay Sim */}
              <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="absolute top-2 left-2 font-mono-data text-primary text-[10px]">SPEC_V1.04</div>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-sm text-headline-sm group-hover:text-primary transition-colors">Botanical Pantry Bundle</h3>
                <p className="font-mono-data text-mono-data text-secondary mt-1">BATCH #0541-B | WILD HARVEST</p>
              </div>
              <p className="font-mono-data text-mono-data font-bold">৳12,000</p>
            </div>
          </div>

           {/* Card 2 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-surface-container-high mb-6 relative overflow-hidden flex items-center justify-center">
              <span className="text-secondary opacity-50 font-mono-data uppercase">Image Placeholder</span>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-sm text-headline-sm group-hover:text-primary transition-colors">Sundarbans Raw Honey</h3>
                <p className="font-mono-data text-mono-data text-secondary mt-1">BATCH #0299-A | FOREST HARVEST</p>
              </div>
              <p className="font-mono-data text-mono-data font-bold">৳3,400</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
