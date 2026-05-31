'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { UserCircle, X, ArrowRight } from 'lucide-react'

type Props = {
  faltaNombre: boolean
  faltaDireccion: boolean
  onClose: () => void
}

export default function ModalPerfilIncompleto({ faltaNombre, faltaDireccion, onClose }: Props) {
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose()
  }

  const queFalta =
    faltaNombre && faltaDireccion
      ? 'tu nombre y tu dirección de entrega'
      : faltaNombre
      ? 'tu nombre'
      : 'tu dirección de entrega'

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(36,59,39,0.45)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-[#EAF3E6]"
        style={{ backgroundColor: 'white' }}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#EAF3E6]"
          style={{ color: '#7BA05D' }}
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {/* Ícono */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: '#EAF3E6' }}
        >
          <UserCircle size={32} style={{ color: '#4C6B3D' }} />
        </div>

        {/* Texto */}
        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#243B27' }}>
          Completá tu perfil
        </h2>
        <p className="text-sm text-center leading-relaxed mb-6" style={{ color: '#4C6B3D' }}>
          Para realizar compras necesitás completar {queFalta} en tu perfil.
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/perfil')}
            className="w-full py-3 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
            style={{ backgroundColor: '#4C6B3D' }}
          >
            Ir al perfil <ArrowRight size={16} />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full font-semibold text-sm border-2 transition-all hover:bg-[#EAF3E6]"
            style={{ borderColor: '#4C6B3D', color: '#4C6B3D' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}