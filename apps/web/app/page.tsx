import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream space-y-6">
      <h1 className="font-serif text-4xl text-charcoal">KhamarBari Premium Pantry</h1>
      <div className="flex space-x-4">
        <Link href="/farmer" className="text-sage font-medium hover:underline">Farmer Portal</Link>
        <Link href="/admin" className="text-sage font-medium hover:underline">Admin Dashboard</Link>
      </div>
    </div>
  );
}
