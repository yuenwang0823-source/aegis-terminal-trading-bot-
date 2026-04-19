export const metadata = {
  title: 'AEGIS Terminal',
  description: 'TW Stock Trading Terminal',
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
