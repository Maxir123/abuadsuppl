// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from '@/lib/constants'
import ClientProviders from '@/components/shared/client-providers'
import Providers from '@/components/providers'
// 💡 IMPORTANT: Import the Next.js Script component
import Script from 'next/script'

// Use Inter instead of Geist → Turbopack can always download it
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans', // optional, for Tailwind
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME}. ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <Providers>
          <ClientProviders>{children}</ClientProviders>
        </Providers>
      </body>
    </html>
  )
}
