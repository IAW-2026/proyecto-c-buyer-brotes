import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
      <div className="text-center px-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#EAF3E6' }}
        >
          <Leaf size={48} style={{ color: '#4C6B3D' }} />
        </div>
        <h1 className="text-8xl font-bold mb-4" style={{ color: '#4C6B3D' }}>404</h1>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#243B27' }}>
          Página no encontrada
        </h2>
        <p className="text-lg mb-8" style={{ color: '#7BA05D' }}>
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: '#4C6B3D' }}
        >
          Volver al inicio <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  )
}