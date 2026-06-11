import Link from 'next/link'
import { getBuyerFromClerk } from '../lib/auth'
import { cancelarOrdenesCaducadas } from '../lib/cancelarOrdenesCaducadas'
import { auth } from '@clerk/nextjs/server'
import UserMenu from './UserMenu'

export default async function Navbar() {
  const buyer = await getBuyerFromClerk()
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  const esAdmin = Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'

  if (buyer) {
    await cancelarOrdenesCaducadas(buyer.id)
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4" style={{ backgroundColor: '#4a6535' }}>
      <Link href="/">
        <img
          src="/logo2.png"
          alt="Brotes logo"
          className="cursor-pointer object-contain h-10 w-48"
        />
      </Link>

      <div className="flex items-center gap-4">
        {esAdmin && (
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: '#E07A5F', color: 'white' }}
          >
            Panel de administración
          </Link>
        )}

        {buyer ? (
          <UserMenu nombre={buyer.nombre ?? 'Mi perfil'} />
        ) : (
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:brightness-90"
            style={{ backgroundColor: '#F5F2EA', color: '#4C6B3D' }}
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  )
}