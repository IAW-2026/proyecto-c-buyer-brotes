import { prisma } from '../lib/prisma'
import { getBuyerFromClerk } from '../lib/auth'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { MessageCircle, Leaf } from 'lucide-react'
import { Suspense } from 'react'
import BuscadorForo from './BuscadorForo'
import NuevoHiloModal from './NuevoHiloModal'
import BotonEliminarForo from './BotonEliminarForo'

type Props = {
  searchParams: Promise<{ q?: string; tag?: string }>
}

export default async function ForoPage({ searchParams }: Props) {
  const { q = '', tag = '' } = await searchParams
  const buyer = await getBuyerFromClerk()

  // Verificar si es admin
  const { sessionClaims } = await auth()
  const roles = (sessionClaims?.metadata as any) ?? []
  const esAdmin = Array.isArray(roles) ? roles.includes('admin') : roles === 'admin'

  const threads = await prisma.forumThread.findMany({
    where: {
      ...(q && {
        OR: [
          { titulo: { contains: q, mode: 'insensitive' } },
          { contenido: { contains: q, mode: 'insensitive' } },
        ]
      }),
      ...(tag && { planta_tag: { equals: tag, mode: 'insensitive' } })
    },
    include: {
      buyer: { select: { id: true, nombre: true } },
      _count: { select: { replies: true } }
    },
    orderBy: { created_at: 'desc' }
  })

  // Tags únicos existentes para los botones de filtro
  const tagsRaw = await prisma.forumThread.findMany({
    where: { planta_tag: { not: null } },
    select: { planta_tag: true },
    distinct: ['planta_tag']
  })
  const tags = tagsRaw.map(t => t.planta_tag).filter(Boolean) as string[]

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest font-semibold mb-1" style={{ color: '#7BA05D' }}>
              Comunidad
            </p>
            <h1 className="text-4xl font-bold" style={{ color: '#243B27' }}>
              Foro de plantas
            </h1>
            <p className="text-sm mt-2" style={{ color: '#4C6B3D' }}>
              Compartí dudas, consejos y experiencias con otros amantes de las plantas
            </p>
          </div>
          {buyer && <NuevoHiloModal />}
        </div>

        {/* Buscador y filtros por tag */}
        <Suspense>
          <BuscadorForo tags={tags} initialQ={q} initialTag={tag} />
        </Suspense>

        {/* Contador de resultados */}
        <div className="mb-4">
          <p className="text-sm" style={{ color: '#7BA05D' }}>
            {threads.length} debate{threads.length !== 1 ? 's' : ''} encontrado{threads.length !== 1 ? 's' : ''}
            {q && <> para <strong>"{q}"</strong></>}
            {tag && <> sobre <strong>{tag}</strong></>}
          </p>
        </div>

        {/* Lista de hilos */}
        {threads.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-[#EAF3E6] bg-white">
            <Leaf size={48} className="mx-auto mb-4" style={{ color: '#B9B9B0' }} />
            <p className="text-lg font-semibold mb-2" style={{ color: '#243B27' }}>
              No hay debates todavía
            </p>
            <p className="text-sm" style={{ color: '#4C6B3D' }}>
              {q || tag
                ? 'Probá con otros términos de búsqueda'
                : '¡Sé el primero en abrir una discusión!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {threads.map(thread => (
              <div
                key={thread.id}
                className="rounded-3xl border border-[#EAF3E6] bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#7BA05D]"
              >
                <Link
                  href={`/foro/${thread.id}`}
                  className="block p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      {thread.planta_tag && (
                        <span
                          className="inline-block mb-2 text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D' }}
                        >
                          🌿 {thread.planta_tag}
                        </span>
                      )}
                      <h2 className="text-lg font-bold mb-1" style={{ color: '#243B27' }}>
                        {thread.titulo}
                      </h2>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: '#4C6B3D',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {thread.contenido}
                      </p>
                    </div>

                    {/* Contador de respuestas */}
                    <div className="flex items-center gap-1.5 shrink-0" style={{ color: '#7BA05D' }}>
                      <MessageCircle size={16} />
                      <span className="text-sm font-semibold">{thread._count.replies}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: '#B9B9B0' }}>
                    <span>por {thread.buyer.nombre ?? 'Usuario'}</span>
                    <span>·</span>
                    <span>
                      {new Date(thread.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </Link>

                {/* Botón eliminar — solo visible para admin */}
                {esAdmin && (
                  <div className="px-6 pb-4 flex justify-end border-t border-[#EAF3E6] pt-3">
                    <BotonEliminarForo
                      tipo="thread"
                      id={thread.id}
                      redirectTo="/foro"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  )
}