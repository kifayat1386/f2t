import '@kb/ui/globals.css';
import { I18nProvider } from './components/I18nProvider';
import { Navbar } from './components/Navbar';

export const metadata = {
  title: 'KhamarBari | Blockchain Verified Provenance',
  description: 'Farm-to-Door Pantry with Cryptographic Trust',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;600&family=Space+Mono&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-background min-h-screen">
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
        </I18nProvider>
      </body>
    </html>
  )
}
