import { Card, CardContent, Button } from '@kb/ui';
import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-8">
      <h1 className="font-serif text-4xl font-bold">Secure Escrow Checkout</h1>
      <p className="text-charcoal/70">Your funds will be held securely in escrow until you confirm delivery of the goods.</p>

      <Card>
        <CardContent className="space-y-4 py-8">
          <div className="text-2xl font-bold mb-8">Amount to Hold: ৳375</div>
          <Button variant="primary" className="w-full h-14 bg-pink-600 hover:bg-pink-700 border-none text-white text-lg font-bold">
            Pay with bKash
          </Button>
          <Button variant="primary" className="w-full h-14 bg-orange-500 hover:bg-orange-600 border-none text-white text-lg font-bold">
            Pay with Nagad
          </Button>
        </CardContent>
      </Card>

      <Link href="/portfolio" className="inline-block pt-8 text-sm text-sage hover:underline">
        [Mock] Skip & View Portfolio
      </Link>
    </div>
  );
}
