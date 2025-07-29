import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../lib/auth-context'
import { CartProvider } from '../lib/cart-context'
import { Toaster } from 'sonner'
import NavbarWrapper from '../components/ui/NavbarWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeSkins - Web Template Marketplace',
  description: 'A modern web template marketplace where developers can sell their templates and users can purchase them.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <NavbarWrapper />
            <main className="min-h-screen">
              {children}
            </main>

            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
              theme="system"
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 