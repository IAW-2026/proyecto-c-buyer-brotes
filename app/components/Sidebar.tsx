import Link from 'next/link'

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
          🏠 Inicio
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          🌿 Explorar plantas
        </Link>
        <Link
          href="/favoritos"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          🤍 Favoritos
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          📦 Mis pedidos
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          🔔 Notificaciones
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ color: '#4C6B3D' }}
        >
          👤 Perfil
        </Link>
      </div>

      {/* Banner promocional */}
      <div
        className="rounded-2xl p-4 text-center"
        style={{ backgroundColor: '#EAF3E6' }}
      >
        <p className="text-2xl mb-2">🌱</p>
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