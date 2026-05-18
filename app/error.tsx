'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
      <div className="text-center px-8 max-w-lg">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#FFF5F2' }}
        >
          <AlertTriangle size={48} style={{ color: '#E07A5F' }} />
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#243B27' }}>
          Algo salió mal
        </h1>
        <p className="text-lg mb-8" style={{ color: '#7BA05D' }}>
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 rounded-full font-semibold border-2 transition-all hover:bg-[#EAF3E6]"
            style={{ borderColor: '#4C6B3D', color: '#4C6B3D' }}
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: '#4C6B3D' }}
          >
            Volver al inicio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  )
}