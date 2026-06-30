import '@kb/ui/globals.css';
import { I18nProvider } from './components/I18nProvider';
import { Navbar } from './components/Navbar';

export const metadata = {
  title: 'KhamarBari',
  description: 'Premium Pantry',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-cream text-charcoal min-h-screen">
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
        </I18nProvider>
      </body>
    </html>
  )
}
