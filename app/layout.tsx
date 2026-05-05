import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export const metadata: Metadata = {
  title: 'Brotes',
  description: 'Tu vivero online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}