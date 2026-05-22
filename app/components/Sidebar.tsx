'use client'

import Link from 'next/link'
import { Home, Leaf, Heart, Package, Bell, User, Zap, X, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AsistentePlanta from './AsistenteIA'

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
  const [ciudad, setCiudad] = useState('Tu ubicación')
  const [permisoDenegado, setPermisoDenegado] = useState(false)

  useEffect(() => {
    // Fallback: usa Bahía Blanca si el usuario deniega o no hay geolocation
    const fetchClimaFallback = async () => {
      try {
        const res = await fetch('/api/weather')
        const data = await res.json()
        if (!data.error) {
          setClima(data)
          setCiudad('Bahía Blanca')
        }
      } catch {}
      finally { setCargando(false) }
    }

    if (!navigator.geolocation) {
      fetchClimaFallback()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Obtiene el nombre de la ciudad con Nominatim (gratuito, sin API key)
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'es' } }
          )
          const geoData = await geoRes.json()
          const nombreCiudad =
            geoData.address?.city ??
            geoData.address?.town ??
            geoData.address?.village ??
            'Tu ubicación'
          setCiudad(nombreCiudad)

          // Obtiene el clima con las coordenadas reales
          const climaRes = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
          const climaData = await climaRes.json()
          if (!climaData.error) setClima(climaData)
        } catch {
          await fetchClimaFallback()
        } finally {
          setCargando(false)
        }
      },
      // Si el usuario deniega el permiso → fallback
      async () => {
        setPermisoDenegado(true)
        await fetchClimaFallback()
      },
      { timeout: 8000 }
    )
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
      style={{ backgroundColor: 'white', borderColor: '#EAF3E6' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#7BA05D' }}>
          Clima · {ciudad}
        </p>
        <span className="text-lg">{clima.emoji}</span>
      </div>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-bold leading-none" style={{ color: '#243B27' }}>
          {clima.temperatura}°
        </span>
        <span className="text-sm mb-0.5" style={{ color: '#7BA05D' }}>C</span>
      </div>
      <p className="text-xs mb-3" style={{ color: '#9BA8A0' }}>
        {clima.descripcion} · Viento {clima.viento} km/h
        {permisoDenegado && (
          <span className="block mt-0.5" style={{ color: '#B9B9B0' }}>
            (ubicación no disponible, mostrando Bahía Blanca)
          </span>
        )}
      </p>
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
        <p className="text-xs font-medium leading-relaxed" style={{ color: '#243B27' }}>
          {clima.mensaje}
        </p>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const linkEstilo = (href: string) => ({
    className: `flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === href ? 'font-semibold' : ''}`,
    style: {
      backgroundColor: pathname === href ? '#EAF3E6' : 'transparent',
      color: '#4C6B3D'
    }
  })

  return (
    <>
      {/* ── Sidebar ── */}
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
          <WeatherWidget />

          {/* ── Botón asistente IA ── */}
          <button
            onClick={() => setAsistenteAbierto(true)}
            className="w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ borderColor: '#7BA05D', backgroundColor: '#EAF3E6' }}
            aria-label="Abrir asistente de plantas"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#4C6B3D' }}
              >
                <Sparkles size={13} color="white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#243B27' }}>
                Asistente IA
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#4C6B3D' }}>
              Consultá cómo cuidar cualquier planta al instante.
            </p>
            <div
              className="mt-3 w-full py-1.5 rounded-full text-center text-xs font-semibold text-white"
              style={{ backgroundColor: '#4C6B3D' }}
            >
              Consultar planta ✨
            </div>
          </button>

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

      {/* ── Panel flotante del asistente ── */}
      {asistenteAbierto && (
        <>
          {/* Overlay semitransparente */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(36,59,39,0.18)' }}
            onClick={() => setAsistenteAbierto(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="fixed left-60 top-24 z-50 w-80 rounded-3xl shadow-2xl border border-[#EAF3E6] overflow-hidden"
            style={{ backgroundColor: 'white' }}
            role="dialog"
            aria-label="Asistente de plantas"
          >
            {/* Header del panel */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b border-[#EAF3E6]"
              style={{ backgroundColor: '#EAF3E6' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#4C6B3D' }}
                >
                  <Sparkles size={14} color="white" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#243B27' }}>
                    Asistente de plantas
                  </p>
                  <p className="text-xs" style={{ color: '#7BA05D' }}>
                    Powered by IA ✨
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAsistenteAbierto(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#CDE5C1]"
                style={{ color: '#4C6B3D' }}
                aria-label="Cerrar asistente"
              >
                <X size={16} />
              </button>
            </div>

            {/* Contenido: el componente AsistentePlanta sin su propio header */}
            <div className="p-5">
              <AsistentePlanta />
            </div>
          </div>
        </>
      )}
    </>
  )
}