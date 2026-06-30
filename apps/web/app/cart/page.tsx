import { Card, CardHeader, CardTitle, CardContent, Button } from '@kb/ui';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <h1 className="font-serif text-4xl font-bold">Your Cart</h1>

      <Card>
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-cream rounded flex items-center justify-center text-2xl">🌾</div>
            <div>
              <h3 className="font-bold">Miniket Rice - 5 KG Bag</h3>
              <p className="text-sm text-charcoal/70">Bogra Premium Rice Farm</p>
            </div>
          </div>
          <div className="font-bold text-lg">৳325</div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <div className="w-1/2 space-y-4">
          <div className="flex justify-between font-medium">
            <span>Subtotal</span>
            <span>৳325</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Delivery Estimate</span>
            <span>৳50</span>
          </div>
          <div className="flex justify-between font-bold text-xl pt-4 border-t border-border-light">
            <span>Total (Escrow)</span>
            <span>৳375</span>
          </div>
          <Link href="/checkout" className="block pt-4">
            <Button variant="primary" size="lg" className="w-full">Proceed to Escrow Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
