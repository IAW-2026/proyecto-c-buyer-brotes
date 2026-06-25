import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY

function mondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey !== SERVICE_API_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const [totalHilosForo, totalRespuestasForo, usuariosFav, topHilos, threadsRecientes, repliesRecientes] =
    await Promise.all([
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
        where: { created_at: { gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) } },
        select: { created_at: true },
        orderBy: { created_at: 'asc' }
      }),
      prisma.forumReply.findMany({
        where: { created_at: { gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) } },
        select: { created_at: true },
        orderBy: { created_at: 'asc' }
      })
    ])

  const hilosForo = topHilos.map(t => ({
    id: t.id,
    titulo: t.titulo,
    autor: t.buyer?.nombre ?? 'Anónimo',
    respuestas: t._count.replies,
    created_at: t.created_at.toISOString()
  }))

  const weeklyMapThreads = new Map<string, number>()
  const weeklyMapReplies = new Map<string, number>()
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 7)
    const key = mondayOfWeek(date).toISOString().slice(0, 10)
    weeklyMapThreads.set(key, 0)
    weeklyMapReplies.set(key, 0)
  }

  for (const t of threadsRecientes) {
    const key = mondayOfWeek(t.created_at).toISOString().slice(0, 10)
    if (weeklyMapThreads.has(key)) {
      weeklyMapThreads.set(key, (weeklyMapThreads.get(key) ?? 0) + 1)
    }
  }

  for (const r of repliesRecientes) {
    const key = mondayOfWeek(r.created_at).toISOString().slice(0, 10)
    if (weeklyMapReplies.has(key)) {
      weeklyMapReplies.set(key, (weeklyMapReplies.get(key) ?? 0) + 1)
    }
  }

  const actividadForoPorSemana = Array.from(weeklyMapThreads.entries()).map(([semana]) => ({
    semana,
    hilos: weeklyMapThreads.get(semana) ?? 0,
    respuestas: weeklyMapReplies.get(semana) ?? 0
  }))

  return NextResponse.json({
    hilosForo,
    totalHilosForo,
    totalRespuestasForo,
    actividadForoPorSemana,
    usuariosConFavoritos: usuariosFav.length
  })
}
