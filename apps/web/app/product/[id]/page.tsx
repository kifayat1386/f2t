import { Card, CardContent, Button } from '@kb/ui';
import Link from 'next/link';

export default function ProductDetailPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Mock Image */}
        <div className="bg-white rounded-lg border border-border-light shadow-sm aspect-square flex items-center justify-center">
          <span className="text-4xl">🌾</span>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">Miniket Rice</h1>
            <p className="text-sage font-medium tracking-wide">BOGRA PREMIUM RICE FARM • VERIFIED</p>
          </div>

          <div className="text-3xl font-bold">
            ৳65 <span className="text-lg font-normal text-charcoal/60">/ kg</span>
          </div>

          <p className="text-charcoal/80 leading-relaxed">
            Premium organic Miniket rice sourced directly from the fields of Bogra. Fully verified with lab tests and immutable provenance tracking.
          </p>

          <div className="space-y-4 pt-4">
            <h3 className="font-medium text-sm uppercase tracking-wider text-charcoal/60">Select Variant</h3>
            <div className="flex space-x-4">
              <Button variant="secondary">5 KG Bag</Button>
              <Button variant="secondary" className="opacity-50">25 KG Sack (Sold Out)</Button>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/cart">
              <Button variant="primary" size="lg" className="w-full">Add to Cart</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
