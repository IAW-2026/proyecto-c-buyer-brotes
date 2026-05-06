'use client'

import Link from 'next/link'
import { Home, Leaf, Heart, Package, Bell, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const linkEstilo = (href: string) => ({
    className: `flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === href ? 'font-semibold' : ''}`,
    style: {
      backgroundColor: pathname === href ? '#EAF3E6' : 'transparent',
      color: '#4C6B3D'
    }
  })

  return (
    <aside
      className="w-56 min-h-screen flex flex-col justify-between py-6 px-4 shrink-0"
      style={{ backgroundColor: 'white', borderRight: '1px solid #EAF3E6' }}
    >
      <div className="flex flex-col gap-1">
        <Link href="/" {...linkEstilo('/')}>
          <Home size={18} /> Inicio
        </Link>
        <Link href="/explorar" {...linkEstilo('/explorar')}>
          <Leaf size={18} /> Explorar plantas
        </Link>
        <Link href="/favoritos" {...linkEstilo('/favoritos')}>
          <Heart size={18} /> Favoritos
        </Link>
        <Link href="/pedidos" {...linkEstilo('/pedidos')}>
          <Package size={18} /> Mis pedidos
        </Link>
        <Link href="/notificaciones" {...linkEstilo('/notificaciones')}>
          <Bell size={18} /> Notificaciones
        </Link>
        <Link href="/perfil" {...linkEstilo('/perfil')}>
          <User size={18} /> Perfil
        </Link>
      </div>

      <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#EAF3E6' }}>
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