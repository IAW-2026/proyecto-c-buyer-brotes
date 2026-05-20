import { prisma } from '../lib/prisma'
import { getBuyerFromClerk } from '../lib/auth'
import Link from 'next/link'
import {
  Bell, CheckCircle2, XCircle, Clock3, Truck,
  Wrench, Package, ArrowRight
} from 'lucide-react'

function formatDate(date: Date) {
  const ahora = new Date()
  const diff = ahora.getTime() - date.getTime()
  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(diff / 3600000)
  const dias = Math.floor(diff / 86400000)

  if (minutos < 1) return 'Hace un momento'
  if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`
  if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`
  if (dias < 7) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

type Notificacion = {
  id: string
  titulo: string
  descripcion: string
  fecha: Date
  tipo: 'confirmada' | 'en_preparacion' | 'listo' | 'entregada' | 'caducada' | 'pendiente'
  orden_id: number
}

const configPorTipo: Record<Notificacion['tipo'], {
  icono: React.ElementType
  bg: string
  iconColor: string
  border: string
  label: string
}> = {
  pendiente: {
    icono: Clock3,
    bg: '#FFF8E5',
    iconColor: '#E0A85F',
    border: '#F4C842',
    label: 'Pago pendiente'
  },
  confirmada: {
    icono: CheckCircle2,
    bg: '#EAF3E6',
    iconColor: '#7BA05D',
    border: '#7BA05D',
    label: 'Pago confirmado'
  },
  en_preparacion: {
    icono: Wrench,
    bg: '#E8F0FF',
    iconColor: '#5F9BE0',
    border: '#6B8FD4',
    label: 'En preparación'
  },
  listo: {
    icono: Truck,
    bg: '#F3EEFF',
    iconColor: '#9B7BE0',
    border: '#A78BFA',
    label: 'Listo para retirar'
  },
  entregada: {
    icono: Package,
    bg: '#EAF3E6',
    iconColor: '#4C6B3D',
    border: '#4C6B3D',
    label: 'Entregado'
  },
  caducada: {
    icono: XCircle,
    bg: '#F5F5F5',
    iconColor: '#B9B9B0',
    border: '#D9D9D4',
    label: 'Pedido caducado'
  },
}

const mensajePorEstado: Record<Notificacion['tipo'], (id: number) => { titulo: string; descripcion: string }> = {
  pendiente: (id) => ({
    titulo: `Pedido #${id} en espera de pago`,
    descripcion: 'Tu pedido fue registrado y está esperando confirmación de pago.'
  }),
  confirmada: (id) => ({
    titulo: `Pago confirmado para el pedido #${id}`,
    descripcion: 'Tu pago fue procesado exitosamente. El vendedor fue notificado.'
  }),
  en_preparacion: (id) => ({
    titulo: `Tu pedido #${id} está en preparación`,
    descripcion: 'El vendedor está preparando tu pedido.'
  }),
  listo: (id) => ({
    titulo: `¡Tu pedido #${id} está listo!`,
    descripcion: 'Tu pedido está listo para ser retirado o despachado.'
  }),
  entregada: (id) => ({
    titulo: `Pedido #${id} entregado`,
    descripcion: '¡Tu pedido fue entregado! Esperamos que disfrutes tus plantas.'
  }),
  caducada: (id) => ({
    titulo: `Pedido #${id} caducado`,
    descripcion: 'El pedido caducó por inactividad o el pago fue rechazado.'
  }),
}

export default async function NotificacionesPage() {
  const buyer = await getBuyerFromClerk()

  if (!buyer) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EA' }}>
        <p style={{ color: '#243B27' }}>Tenés que iniciar sesión para ver tus notificaciones</p>
      </main>
    )
  }

  const orders = await prisma.order.findMany({
    where: { buyer_id: buyer.id },
    orderBy: { created_at: 'desc' },
  })

  // Generamos una notificación por cada orden según su estado actual
  const notificaciones: Notificacion[] = orders.map(order => {
    const tipo = order.estado as Notificacion['tipo']
    const { titulo, descripcion } = mensajePorEstado[tipo]?.(order.id) ?? {
      titulo: `Pedido #${order.id} actualizado`,
      descripcion: `El estado de tu pedido cambió a "${order.estado}".`
    }
    return {
      id: `order-${order.id}`,
      titulo,
      descripcion,
      fecha: order.created_at,
      tipo,
      orden_id: order.id,
    }
  })

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm mb-2" style={{ color: '#7BA05D' }}>Centro de actividad</p>
            <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
              Notificaciones
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
            <Bell size={18} />
            {notificaciones.length} actividad{notificaciones.length !== 1 ? 'es' : ''}
          </div>
        </div>

        {notificaciones.length === 0 ? (
          <div className="rounded-[2rem] border border-[#EAF3E6] bg-white p-10 text-center shadow-sm">
            <Bell size={48} className="mx-auto mb-4" style={{ color: '#B9B9B0' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#243B27' }}>Sin notificaciones</h2>
            <p className="text-sm text-[#4C6B3D] mb-6">
              Cuando realices una compra o haya novedades en tus pedidos, las verás acá.
            </p>
            <Link
              href="/explorar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4C6B3D] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Explorar plantas <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notificaciones.map(notif => {
              const config = configPorTipo[notif.tipo] ?? configPorTipo['pendiente']
              const Icono = config.icono

              return (
                <Link
                  key={notif.id}
                  href="/pedidos"
                  className="flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: '#EAF3E6' }}
                >
                  {/* Ícono */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: config.bg,
                      borderColor: config.border,
                    }}
                  >
                    <Icono size={20} style={{ color: config.iconColor }} />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-sm leading-snug" style={{ color: '#243B27' }}>
                        {notif.titulo}
                      </p>
                      <span className="text-xs shrink-0 mt-0.5" style={{ color: '#B9B9B0' }}>
                        {formatDate(notif.fecha)}
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#4C6B3D' }}>
                      {notif.descripcion}
                    </p>
                    <span
                      className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: config.bg, color: config.iconColor }}
                    >
                      {config.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </section>
    </main>
  )
}