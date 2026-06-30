import { Card, CardContent } from '@kb/ui';

export default function LedgerPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold">Public Audit Ledger</h1>
        <p className="text-sage mt-2 font-medium tracking-wide">CRYPTOGRAPHICALLY VERIFIED HASH CHAIN</p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-light before:to-transparent">

        {/* Mock Ledger Block 1 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-sage text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
          </div>
          <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm tracking-wide">ESCROW_RELEASED</span>
                <span className="text-xs text-charcoal/50">Seq #4402</span>
              </div>
              <p className="text-xs text-charcoal/70 break-all bg-cream p-2 rounded mb-1">
                Prev: <span className="font-mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </p>
              <p className="text-xs text-sage break-all bg-cream p-2 rounded">
                Hash: <span className="font-mono">1f71a41fc3658ebc4658ccfc6111f1de454bcbcbf3c09f3e098cb9b7c89f21e0</span>
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
