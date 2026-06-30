import { Card, CardHeader, CardTitle, CardContent, IoTWidget } from '@kb/ui';

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
      <h1 className="font-serif text-4xl font-bold mb-8">Your Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IoTWidget label="Active Holdings" value="2" status="normal" />
        <IoTWidget label="Funds in Escrow" value="৳375" status="warning" />
        <IoTWidget label="Carbon Offset" value="15.6" unit="kg CO2e" status="normal" />
      </div>

      <h2 className="font-serif text-2xl font-bold pt-8">Recent Assets</h2>
      <Card>
        <CardContent className="py-6 flex justify-between items-center border-b last:border-b-0 border-border-light">
          <div>
            <h3 className="font-bold">Miniket Rice (5KG)</h3>
            <p className="text-sm text-charcoal/70">Order #ord_xyz123 • Status: IN_TRANSIT</p>
          </div>
          <div className="text-right">
            <div className="font-bold">৳325</div>
            <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded mt-1 font-medium">ESCROWED</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
