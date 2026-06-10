'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { BarChart2, Users } from 'lucide-react'
import { Buyer, Reporte } from './components/types'
import GestionUsuarios from './components/GestionUsuarios'
import ReporteCompras from './components/ReporteCompras'

type Props = {
  buyersIniciales: Buyer[]
  reporte: Reporte
  initialQuery: string
  initialTab: 'usuarios' | 'reporte'
}

export default function AdminPanel({ buyersIniciales, reporte, initialQuery, initialTab }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [tab, setTab] = useState<'usuarios' | 'reporte'>(initialTab)

  const cambiarTab = (nuevaTab: 'usuarios' | 'reporte') => {
    setTab(nuevaTab)
    const params = new URLSearchParams()
    if (initialQuery) params.set('q', initialQuery)
    params.set('tab', nuevaTab)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#7BA05D' }}>
            Panel de administración
          </p>
          <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
            Control del sistema
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => cambiarTab('usuarios')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: tab === 'usuarios' ? '#4C6B3D' : '#EAF3E6',
              color: tab === 'usuarios' ? 'white' : '#4C6B3D'
            }}
          >
            <Users size={16} /> Gestión de usuarios
          </button>
          <button
            onClick={() => cambiarTab('reporte')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: tab === 'reporte' ? '#4C6B3D' : '#EAF3E6',
              color: tab === 'reporte' ? 'white' : '#4C6B3D'
            }}
          >
            <BarChart2 size={16} /> Reporte de compras
          </button>
        </div>

        {tab === 'reporte' && (
          <ReporteCompras reporte={reporte} />
        )}

        {tab === 'usuarios' && (
          <GestionUsuarios
            buyersIniciales={buyersIniciales}
            initialQuery={initialQuery}
            tab={tab}
          />
        )}

      </section>
    </main>
  )
}