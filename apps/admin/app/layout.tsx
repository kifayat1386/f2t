import '@kb/ui/globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
