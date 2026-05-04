import Link from 'next/link'
import { prisma } from '../lib/prisma'

export default async function Navbar() {
  // Por ahora buyer_id=1 hasta implementar Clerk
  const cart = await prisma.cart.findFirst({
    where: { buyer_id: 1, estado: 'active' },
    include: { items: true }
  })

  const cantidadItems = cart?.items.reduce((acc, item) => acc + item.cantidad, 0) ?? 0

  return (
    <nav className="flex items-center justify-between px-8 py-4" style={{ backgroundColor: '#4C6B3D' }}>
      <Link href="/">
        <img src="/logo1.png" alt="Brotes logo" className="h-10 cursor-pointer" />
      </Link>

      <div className="flex items-center gap-4">
        {/* Icono carrito */}
        <Link href="/carrito" className="relative">
          <span className="text-2xl">🛒</span>
          {cantidadItems > 0 && (
            <span
              className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-white"
              style={{ backgroundColor: '#E07A5F' }}
            >
              {cantidadItems}
            </span>
          )}
        </Link>

        <button
          className="px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: '#F5F2EA', color: '#4C6B3D' }}
        >
          Iniciar sesión
        </button>
      </div>
    </nav>
  )
}