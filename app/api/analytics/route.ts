import { prisma } from '@/app/lib/prisma'
import { vendedores } from '@/app/lib/mock-data'
import { NextRequest, NextResponse } from 'next/server'

const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY

function getSellerName(sellerId: number): string {
  return vendedores.find(v => v.id === sellerId)?.nombre ?? `Vendedor #${sellerId}`
}

function mondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function estadoCategoria(estado: string): 'completados' | 'enProceso' | 'cancelados' {
  if (['confirmada', 'listo', 'entregada'].includes(estado)) return 'completados'
  if (['pendiente', 'en_preparacion'].includes(estado)) return 'enProceso'
  return 'cancelados'
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const now = new Date()

  const weekStarts: string[] = []
  const weekStartDates: Date[] = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const monday = mondayOfWeek(d)
    weekStarts.push(monday.toISOString().slice(0, 10))
    weekStartDates.push(monday)
  }

  const [
    totalCompradores,
    compradoresActivos,
    compradoresSuspendidos,
    compradoresEliminados,
    buyersRecientes,
    distribucion,
    ordersRecientes,
    ordersMeses,
    totalHilosForo,
    totalRespuestasForo,
    usuariosFav,
    topHilos,
    threadsRecientes,
    repliesRecientes
  ] = await Promise.all([
    prisma.buyer.count(),
    prisma.buyer.count({ where: { estado: 'activo' } }),
    prisma.buyer.count({ where: { estado: 'suspendido' } }),
    prisma.buyer.count({ where: { estado: 'eliminado' } }),
    prisma.buyer.findMany({
      where: { created_at: { gte: weekStartDates[0] } },
      select: { created_at: true }
    }),
    prisma.order.groupBy({
      by: ['estado'],
      _count: { estado: true }
    }),
    prisma.order.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        buyer: { select: { id: true, nombre: true } },
        items: true
      }
    }),
    prisma.order.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true, estado: true }
    }),
    prisma.forumThread.count(),
    prisma.forumReply.count(),
    prisma.favorite.groupBy({
      by: ['buyer_id'],
      _count: { buyer_id: true }
    }),
    prisma.forumThread.findMany({
      orderBy: { replies: { _count: 'desc' } },
      take: 10,
      include: {
        buyer: { select: { id: true, nombre: true } },
        _count: { select: { replies: true } }
      }
    }),
    prisma.forumThread.findMany({
      where: { created_at: { gte: weekStartDates[0] } },
      select: { created_at: true }
    }),
    prisma.forumReply.findMany({
      where: { created_at: { gte: weekStartDates[0] } },
      select: { created_at: true }
    })
  ])

  // ── registrosPorSemana ──
  const weeklyBuyerMap = new Map<string, number>()
  for (const s of weekStarts) weeklyBuyerMap.set(s, 0)
  for (const b of buyersRecientes) {
    const key = mondayOfWeek(b.created_at).toISOString().slice(0, 10)
    if (weeklyBuyerMap.has(key)) weeklyBuyerMap.set(key, (weeklyBuyerMap.get(key) ?? 0) + 1)
  }
  const registrosPorSemana = weekStarts.map(s => weeklyBuyerMap.get(s) ?? 0)

  // ── pedidosPorMes ──
  const monthlyMap: Record<string, { completados: number; enProceso: number; cancelados: number }> = {}
  for (const o of ordersMeses) {
    const mes = o.created_at.toISOString().slice(0, 7)
    if (!monthlyMap[mes]) monthlyMap[mes] = { completados: 0, enProceso: 0, cancelados: 0 }
    monthlyMap[mes][estadoCategoria(o.estado)]++
  }
  const pedidosPorMes = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, data]) => ({ mes, ...data }))

  // ── distribucionEstadosPedidos ──
  const totalOrdenes = distribucion.reduce((sum, d) => sum + d._count.estado, 0)
  const distribucionEstadosPedidos = distribucion.map(d => ({
    estado: d.estado,
    cantidad: d._count.estado,
    porcentaje: totalOrdenes > 0 ? Math.round((d._count.estado / totalOrdenes) * 100) : 0
  }))

  // ── ultimosPedidos ──
  const ultimosPedidos = ordersRecientes.map(o => ({
    id: o.id,
    compradorId: o.buyer_id,
    compradorNombre: o.buyer?.nombre ?? 'Sin nombre',
    vendedorNombre: getSellerName(o.seller_id),
    monto: Number(o.total),
    estado: o.estado,
    creadoEn: o.created_at.toISOString()
  }))

  // ── hilosForo ──
  const likesPorHilo = await Promise.all(
    topHilos.map(t =>
      prisma.forumReplyLike.count({
        where: { reply: { thread_id: t.id } }
      })
    )
  )

  const hilosForo = topHilos.map((t, i) => ({
    id: t.id,
    titulo: t.titulo,
    autor: t.buyer?.nombre ?? 'Anónimo',
    respuestas: t._count.replies,
    likes: likesPorHilo[i],
    creadoEn: t.created_at.toISOString()
  }))

  // ── actividadForoPorSemana ──
  const weeklyThreadMap = new Map<string, number>()
  const weeklyReplyMap = new Map<string, number>()
  for (const s of weekStarts) {
    weeklyThreadMap.set(s, 0)
    weeklyReplyMap.set(s, 0)
  }
  for (const t of threadsRecientes) {
    const key = mondayOfWeek(t.created_at).toISOString().slice(0, 10)
    if (weeklyThreadMap.has(key)) weeklyThreadMap.set(key, (weeklyThreadMap.get(key) ?? 0) + 1)
  }
  for (const r of repliesRecientes) {
    const key = mondayOfWeek(r.created_at).toISOString().slice(0, 10)
    if (weeklyReplyMap.has(key)) weeklyReplyMap.set(key, (weeklyReplyMap.get(key) ?? 0) + 1)
  }
  const actividadForoPorSemana = weekStarts.map(s => ({
    hilos: weeklyThreadMap.get(s) ?? 0,
    respuestas: weeklyReplyMap.get(s) ?? 0
  }))

  return NextResponse.json({
    totalCompradores,
    compradoresActivos,
    compradoresSuspendidos,
    compradoresEliminados,
    registrosPorSemana,
    pedidosPorMes,
    distribucionEstadosPedidos,
    ultimosPedidos,
    hilosForo,
    totalHilosForo,
    totalRespuestasForo,
    usuariosConFavoritos: usuariosFav.length,
    actividadForoPorSemana
  })
}
