'use client'

import Link from 'next/link'
import { Home, Leaf, Heart, Package, Bell, User, Zap, Tag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type WeatherData = {
  temperatura: number
  viento: number
  descripcion: string
  recomiendaRiego: boolean
  mensaje: string
  emoji: string
  color: string
}

function WeatherWidget() {
  const [clima, setClima] = useState<WeatherData | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setClima(data)
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <div
        className="rounded-2xl border border-[#EAF3E6] p-4 animate-pulse"
        style={{ backgroundColor: 'white' }}
      >
        <div className="h-3 rounded-full bg-[#EAF3E6] w-2/3 mb-3" />
        <div className="h-6 rounded-full bg-[#EAF3E6] w-1/2 mb-2" />
        <div className="h-3 rounded-full bg-[#EAF3E6] w-full" />
      </div>
    )
  }

  if (!clima) return null

  return (
    <div
      className="rounded-2xl border p-4 shadow-sm"
      style={{
        backgroundColor: 'white',
        borderColor: '#EAF3E6'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-xs uppercase tracking-[0.2em] font-semibold"
          style={{ color: '#7BA05D' }}
        >
          Clima · Bahía Blanca
        </p>
        <span className="text-lg">{clima.emoji}</span>
      </div>

      {/* Temperatura */}
      <div className="flex items-end gap-1 mb-1">
        <span
          className="text-3xl font-bold leading-none"
          style={{ color: '#243B27' }}
        >
          {clima.temperatura}°
        </span>
        <span className="text-sm mb-0.5" style={{ color: '#7BA05D' }}>C</span>
      </div>
      <p className="text-xs mb-3" style={{ color: '#9BA8A0' }}>
        {clima.descripcion} · Viento {clima.viento} km/h
      </p>

      {/* Recomendación de riego */}
      <div
        className="rounded-xl px-3 py-2.5 flex items-start gap-2"
        style={{
          backgroundColor: clima.recomiendaRiego ? '#EAF3E6' : '#F5F2EA',
          borderLeft: `3px solid ${clima.color}`
        }}
      >
        <span className="text-base leading-none mt-0.5">
          {clima.recomiendaRiego ? '💧' : '🚫'}
        </span>
        <p
          className="text-xs font-medium leading-relaxed"
          style={{ color: '#243B27' }}
        >
          {clima.mensaje}
        </p>
      </div>
    </div>
  )
}

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
      className="w-56 min-h-screen flex flex-col gap-4 py-6 px-4 shrink-0"
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

      <div className="flex flex-col gap-4">
        {/* Widget de clima */}
        <WeatherWidget />

        {/* Ofertas del día */}
        {/* Productos económicos */}
        <div className="rounded-2xl border border-[#EAF3E6] bg-[#F5F2EA] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={16} style={{ color: '#4C6B3D' }} />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#4C6B3D' }}>
              Menos de $10.000
            </p>
          </div>
          <p className="text-xs mb-3" style={{ color: '#4C6B3D' }}>
            Plantas accesibles para empezar tu colección verde.
          </p>
          <Link
            href="/explorar?precio=bajo"
            className="text-xs font-semibold px-3 py-1 rounded-full text-white inline-block"
            style={{ backgroundColor: '#4C6B3D' }}
          >
            Ver productos
          </Link>
        </div>

        {/* Novedades */}
        <div className="rounded-2xl border border-[#EAF3E6] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#7BA05D' }}>
                Novedades
              </p>
              <h3 className="text-sm font-bold" style={{ color: '#243B27' }}>
                Nuevas colecciones
              </h3>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3E6]" style={{ color: '#4C6B3D' }}>
              <Zap size={16} />
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#4C6B3D' }}>
            Plantas raras y colecciones exclusivas de nuestros mejores viveros.
          </p>
        </div>
      </div>

      <div className="rounded-3xl p-4 text-center shadow-sm" style={{ backgroundColor: '#EAF3E6' }}>
        <Leaf size={28} className="mx-auto mb-2" style={{ color: '#4C6B3D' }} />
        <p className="font-bold text-sm mb-1" style={{ color: '#243B27' }}>
          Dale vida a tu hogar
        </p>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: '#4C6B3D' }}>
          Descubrí las mejores plantas de viveros con confianza.
        </p>
        <Link
          href="/explorar"
          className="block w-full py-2 rounded-full text-xs font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: '#4C6B3D' }}
        >
          Explorar plantas
        </Link>
      </div>
    </aside>
  )
}