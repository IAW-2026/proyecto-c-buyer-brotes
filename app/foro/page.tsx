import { prisma } from '../lib/prisma'
import { getBuyerFromClerk } from '../lib/auth'
import Link from 'next/link'
import { MessageCircle, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'
import BuscadorForo from './BuscadorForo'
import NuevoHiloModal from './NuevoHiloModal'

const POR_PAGINA = 10

type Props = {
  searchParams: Promise<{ q?: string; tag?: string; pagina?: string }>
}

function PaginacionForo({
  paginaActual,
  totalPaginas,
  q,
  tag,
}: {
  paginaActual: number
  totalPaginas: number
  q: string
  tag: string
}) {
  if (totalPaginas <= 1) return null

  const buildURL = (pagina: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (tag) params.set('tag', tag)
    params.set('pagina', String(pagina))
    return `/foro?${params.toString()}`
  }

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)
  // Mostrar máximo 5 números de página centrados en la actual
  const inicio = Math.max(1, paginaActual - 2)
  const fin = Math.min(totalPaginas, inicio + 4)
  const paginasVisibles = paginas.slice(inicio - 1, fin)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {paginaActual > 1 ? (
        <Link
          href={buildURL(paginaActual - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#EAF3E6]"
          style={{ borderColor: '#7BA05D', color: '#7BA05D' }}
        >
          <ChevronLeft size={16} />
          Anterior
        </Link>
      ) : (
        <span
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold border-2 opacity-40 cursor-not-allowed"
          style={{ borderColor: '#D9D9D4', color: '#D9D9D4' }}
        >
          <ChevronLeft size={16} />
          Anterior
        </span>
      )}

      <div className="flex items-center gap-1">
        {inicio > 1 && (
          <>
            <Link
              href={buildURL(1)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
              style={{ backgroundColor: 'white', color: '#4C6B3D', border: '2px solid #EAF3E6' }}
            >
              1
            </Link>
            {inicio > 2 && (
              <span className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: '#B9B9B0' }}>
                …
              </span>
            )}
          </>
        )}

        {paginasVisibles.map((num) => (
          <Link
            key={num}
            href={buildURL(num)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
            style={{
              backgroundColor: num === paginaActual ? '#4C6B3D' : 'white',
              color: num === paginaActual ? 'white' : '#4C6B3D',
              border: '2px solid',
              borderColor: num === paginaActual ? '#4C6B3D' : '#EAF3E6',
            }}
          >
            {num}
          </Link>
        ))}

        {fin < totalPaginas && (
          <>
            {fin < totalPaginas - 1 && (
              <span className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: '#B9B9B0' }}>
                …
              </span>
            )}
            <Link
              href={buildURL(totalPaginas)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
              style={{ backgroundColor: 'white', color: '#4C6B3D', border: '2px solid #EAF3E6' }}
            >
              {totalPaginas}
            </Link>
          </>
        )}
      </div>

      {paginaActual < totalPaginas ? (
        <Link
          href={buildURL(paginaActual + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#EAF3E6]"
          style={{ borderColor: '#7BA05D', color: '#7BA05D' }}
        >
          Siguiente
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold border-2 opacity-40 cursor-not-allowed"
          style={{ borderColor: '#D9D9D4', color: '#D9D9D4' }}
        >
          Siguiente
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  )
}

export default async function ForoPage({ searchParams }: Props) {
  const { q = '', tag = '', pagina = '1' } = await searchParams
  const paginaActual = Math.max(1, Number(pagina) || 1)
  const buyer = await getBuyerFromClerk()

  const filtroWhere = {
    ...(q && {
      OR: [
        { titulo: { contains: q, mode: 'insensitive' as const } },
        { contenido: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(tag && { planta_tag: { equals: tag, mode: 'insensitive' as const } }),
  }

  const [totalThreads, threads] = await Promise.all([
    prisma.forumThread.count({ where: filtroWhere }),
    prisma.forumThread.findMany({
      where: filtroWhere,
      include: {
        buyer: { select: { id: true, nombre: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (paginaActual - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
  ])

  const totalPaginas = Math.ceil(totalThreads / POR_PAGINA)

  // Tags únicos existentes para los botones de filtro
  const tagsRaw = await prisma.forumThread.findMany({
    where: { planta_tag: { not: null } },
    select: { planta_tag: true },
    distinct: ['planta_tag'],
  })
  const tags = tagsRaw.map((t) => t.planta_tag).filter(Boolean) as string[]

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
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm" style={{ color: '#7BA05D' }}>
            {totalThreads} debate{totalThreads !== 1 ? 's' : ''} encontrado{totalThreads !== 1 ? 's' : ''}
            {q && <> para <strong>"{q}"</strong></>}
            {tag && <> sobre <strong>{tag}</strong></>}
          </p>
          {totalPaginas > 1 && (
            <p className="text-xs" style={{ color: '#B9B9B0' }}>
              Página {paginaActual} de {totalPaginas}
            </p>
          )}
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
          <>
            <div className="grid gap-4">
              {threads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/foro/${thread.id}`}
                  className="block rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#7BA05D]"
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
                          overflow: 'hidden',
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
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <PaginacionForo
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              q={q}
              tag={tag}
            />
          </>
        )}
      </section>
    </main>
  )
}