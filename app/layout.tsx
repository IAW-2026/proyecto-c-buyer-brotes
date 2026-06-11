import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import CarritoFlotante from './components/CarritoFlotante'
import { ClerkProvider } from '@clerk/nextjs'
import { getBuyerFromClerk } from './lib/auth'

export const metadata: Metadata = {
  title: 'Brotes',
  description: 'Tu vivero online',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const buyer = await getBuyerFromClerk()

  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              {children}
            </div>
          </div>
          <CarritoFlotante buyerId={buyer?.id ?? null} />
        </body>
      </html>
    </ClerkProvider>
  )
}