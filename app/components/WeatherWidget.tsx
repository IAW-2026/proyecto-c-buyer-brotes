'use client'

import { useState, useEffect } from 'react'

type WeatherData = {
  temperatura: number
  viento: number
  descripcion: string
  recomiendaRiego: boolean
  mensaje: string
  emoji: string
  color: string
}

export default function WeatherWidget() {
  const [clima, setClima] = useState<WeatherData | null>(null)
  const [cargando, setCargando] = useState(true)
  const [ciudad, setCiudad] = useState('Tu ubicación')
  const [permisoDenegado, setPermisoDenegado] = useState(false)

  useEffect(() => {
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

          const climaRes = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
          const climaData = await climaRes.json()
          if (!climaData.error) setClima(climaData)
        } catch {
          await fetchClimaFallback()
        } finally {
          setCargando(false)
        }
      },
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