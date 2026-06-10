'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import AsistentePlanta from './AsistenteIA'

export default function PanelAsistente() {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      {/* Botón para abrir el panel */}
      <button
        onClick={() => setAbierto(true)}
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

      {/* Overlay y panel flotante */}
      {abierto && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(36,59,39,0.18)' }}
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />
          <div
            className="fixed left-60 top-24 z-50 w-80 rounded-3xl shadow-2xl border border-[#EAF3E6] overflow-hidden"
            style={{ backgroundColor: 'white' }}
            role="dialog"
            aria-label="Asistente de plantas"
          >
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
                onClick={() => setAbierto(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#CDE5C1]"
                style={{ color: '#4C6B3D' }}
                aria-label="Cerrar asistente"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <AsistentePlanta />
            </div>
          </div>
        </>
      )}
    </>
  )
}