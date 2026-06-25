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

  const [totalCompradores, compradoresActivos, suspendidos, eliminados, buyersRecientes] = await Promise.all([
    prisma.buyer.count(),
    prisma.buyer.count({ where: { estado: 'activo' } }),
    prisma.buyer.count({ where: { estado: 'suspendido' } }),
    prisma.buyer.count({ where: { estado: 'eliminado' } }),
    prisma.buyer.findMany({
      where: { created_at: { gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) } },
      select: { created_at: true },
      orderBy: { created_at: 'asc' }
    })
  ])

  const weeklyMap = new Map<string, number>()
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 7)
    const key = mondayOfWeek(date).toISOString().slice(0, 10)
    weeklyMap.set(key, 0)
  }

  for (const b of buyersRecientes) {
    const key = mondayOfWeek(b.created_at).toISOString().slice(0, 10)
    if (weeklyMap.has(key)) {
      weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + 1)
    }
  }

  const registrosPorSemana = Array.from(weeklyMap.entries()).map(([semana, cantidad]) => ({
    semana,
    cantidad
  }))

  return NextResponse.json({
    totalCompradores,
    compradoresActivos,
    suspendidos,
    eliminados,
    registrosPorSemana
  })
}
