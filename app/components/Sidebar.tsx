import Link from 'next/link'
import { Home, Leaf, Heart, Package, Bell, User } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside
      className="w-56 min-h-screen flex flex-col justify-between py-6 px-4 shrink-0"
      style={{ backgroundColor: 'white', borderRight: '1px solid #EAF3E6' }}
    >
      {/* Navegación */}
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold"
          style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D' }}
        >
          <Home size={18} /> Inicio
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          <Leaf size={18} /> Explorar plantas
        </Link>
        <Link
          href="/favoritos"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          <Heart size={18} /> Favoritos
        </Link>
        <Link
          href="/pedidos"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          <Package size={18} /> Mis pedidos
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          <Bell size={18} /> Notificaciones
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          <User size={18} /> Perfil
        </Link>
      </div>

      {/* Banner promocional */}
      <div
        className="rounded-2xl p-4 text-center"
        style={{ backgroundColor: '#EAF3E6' }}
      >
        <Leaf size={32} className="mx-auto mb-2" style={{ color: '#4C6B3D' }} />
        <p className="font-bold text-sm mb-1" style={{ color: '#243B27' }}>
          Dale vida a tu hogar
        </p>
        <p className="text-xs mb-3" style={{ color: '#4C6B3D' }}>
          Descubrí las mejores plantas de viveros con confianza.
        </p>
        <Link
          href="/"
          className="block w-full py-2 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: '#4C6B3D' }}
        >
          Explorar plantas
        </Link>
      </div>
    </aside>
  )
}