import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const SERVICE_API_KEY = process.env.BUYER_SERVICE_API_KEY;

function mondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
  console.log("[analytics] received key:", apiKey);
  console.log("[analytics] expected key:", SERVICE_API_KEY);

  if (apiKey !== SERVICE_API_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const now = new Date();

  const [
    totalCompradores,
    compradoresActivos,
    suspendidos,
    eliminados,
    buyersRecientes,
    distribucion,
    ordersRecientes,
    ordersMeses,
    totalHilosForo,
    totalRespuestasForo,
    usuariosFav,
    topHilos,
    threadsRecientes,
    repliesRecientes,
  ] = await Promise.all([
    prisma.buyer.count(),
    prisma.buyer.count({ where: { estado: "activo" } }),
    prisma.buyer.count({ where: { estado: "suspendido" } }),
    prisma.buyer.count({ where: { estado: "eliminado" } }),
    prisma.buyer.findMany({
      where: { created_at: { gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) } },
      select: { created_at: true },
      orderBy: { created_at: "asc" },
    }),
    prisma.order.groupBy({
      by: ["estado"],
      _count: { estado: true },
    }),
    prisma.order.findMany({
      orderBy: { created_at: "desc" },
      take: 50,
      include: {
        buyer: { select: { id: true, nombre: true, email: true } },
        items: true,
      },
    }),
    prisma.order.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true, estado: true },
      orderBy: { created_at: "asc" },
    }),
    prisma.forumThread.count(),
    prisma.forumReply.count(),
    prisma.favorite.groupBy({
      by: ["buyer_id"],
      _count: { buyer_id: true },
    }),
    prisma.forumThread.findMany({
      orderBy: { replies: { _count: "desc" } },
      take: 10,
      include: {
        buyer: { select: { id: true, nombre: true } },
        _count: { select: { replies: true } },
      },
    }),
    prisma.forumThread.findMany({
      where: { created_at: { gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) } },
      select: { created_at: true },
      orderBy: { created_at: "asc" },
    }),
    prisma.forumReply.findMany({
      where: { created_at: { gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000) } },
      select: { created_at: true },
      orderBy: { created_at: "asc" },
    }),
  ]);

  // ─── registrosPorSemana ─────────────────────────────────────────────────────

  const weeklyMap = new Map<string, number>();
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);
    const key = mondayOfWeek(date).toISOString().slice(0, 10);
    weeklyMap.set(key, 0);
  }

  for (const b of buyersRecientes) {
    const key = mondayOfWeek(b.created_at).toISOString().slice(0, 10);
    if (weeklyMap.has(key)) {
      weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + 1);
    }
  }

  const registrosPorSemana = Array.from(weeklyMap.entries()).map(([semana, cantidad]) => ({
    semana,
    cantidad,
  }));

  // ─── pedidosPorMes ──────────────────────────────────────────────────────────

  const monthlyMap: Record<string, Record<string, number>> = {};
  for (const o of ordersMeses) {
    const mes = o.created_at.toISOString().slice(0, 7);
    if (!monthlyMap[mes]) monthlyMap[mes] = {};
    monthlyMap[mes][o.estado] = (monthlyMap[mes][o.estado] ?? 0) + 1;
  }

  const pedidosPorMes = Object.entries(monthlyMap).map(([mes, data]) => ({
    mes,
    ...data,
  }));

  // ─── distribucionEstadosPedidos ──────────────────────────────────────────────

  const totalOrders = distribucion.reduce((sum, d) => sum + d._count.estado, 0);
  const distribucionEstadosPedidos = distribucion.map((d) => ({
    estado: d.estado,
    cantidad: d._count.estado,
    porcentaje: totalOrders > 0 ? Math.round((d._count.estado / totalOrders) * 100) : 0,
  }));

  // ─── ultimosPedidos ─────────────────────────────────────────────────────────

  const ultimosPedidos = ordersRecientes.map((o) => ({
    id: String(o.id),
    compradorId: String(o.buyer_id),
    compradorNombre: o.buyer?.nombre ?? "Sin nombre",
    vendedorNombre: "",
    monto: Number(o.total),
    estado: o.estado,
    creadoEn: o.created_at.toISOString(),
  }));

  // ─── hilosForo ──────────────────────────────────────────────────────────────

  const hilosForo = topHilos.map((t) => ({
    id: String(t.id),
    titulo: t.titulo,
    autor: t.buyer?.nombre ?? "Anónimo",
    respuestas: t._count.replies,
    likes: 0,
    creadoEn: t.created_at.toISOString(),
  }));

  // ─── actividadForoPorSemana ─────────────────────────────────────────────────

  const weeklyMapThreads = new Map<string, number>();
  const weeklyMapReplies = new Map<string, number>();
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);
    const key = mondayOfWeek(date).toISOString().slice(0, 10);
    weeklyMapThreads.set(key, 0);
    weeklyMapReplies.set(key, 0);
  }

  for (const t of threadsRecientes) {
    const key = mondayOfWeek(t.created_at).toISOString().slice(0, 10);
    if (weeklyMapThreads.has(key)) {
      weeklyMapThreads.set(key, (weeklyMapThreads.get(key) ?? 0) + 1);
    }
  }

  for (const r of repliesRecientes) {
    const key = mondayOfWeek(r.created_at).toISOString().slice(0, 10);
    if (weeklyMapReplies.has(key)) {
      weeklyMapReplies.set(key, (weeklyMapReplies.get(key) ?? 0) + 1);
    }
  }

  const actividadForoPorSemana = Array.from(weeklyMapThreads.entries()).map(([semana]) => ({
    hilos: weeklyMapThreads.get(semana) ?? 0,
    respuestas: weeklyMapReplies.get(semana) ?? 0,
  }));

  // ─── Respuesta consolidada ──────────────────────────────────────────────────

  const response = {
    totalCompradores,
    compradoresActivos,
    compradoresSuspendidos: suspendidos,
    compradoresEliminados: eliminados,
    registrosPorSemana: registrosPorSemana.map((r) => r.cantidad),
    pedidosPorMes,
    distribucionEstadosPedidos,
    ultimosPedidos,
    hilosForo,
    totalHilosForo,
    totalRespuestasForo,
    usuariosConFavoritos: usuariosFav.length,
    actividadForoPorSemana,
  };

  console.log("[analytics] response:", JSON.stringify(response).slice(0, 500));

  return NextResponse.json(response);
}
