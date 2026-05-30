import { prisma } from '../../lib/prisma'
import { getBuyerFromClerk } from '../../lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, User } from 'lucide-react'
import FormRespuesta from './FormRespuesta'

type Props = {
  params: Promise<{ id: string }>
}

export default async function HiloPage({ params }: Props) {
  const { id } = await params
  const buyer = await getBuyerFromClerk()

  const thread = await prisma.forumThread.findUnique({
    where: { id: Number(id) },
    include: {
      buyer: { select: { id: true, nombre: true } },
      replies: {
        include: {
          buyer: { select: { id: true, nombre: true } }
        },
        orderBy: { created_at: 'asc' }
      }
    }
  })

  if (!thread) notFound()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">

        {/* Volver */}
        <Link
          href="/foro"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: '#7BA05D' }}
        >
          <ArrowLeft size={16} /> Volver al foro
        </Link>

        {/* Hilo principal */}
        <div className="rounded-3xl border border-[#EAF3E6] bg-white p-8 shadow-sm mb-6">

          {/* Tag de planta */}
          {thread.planta_tag && (
            <span
              className="inline-block mb-4 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: '#EAF3E6', color: '#4C6B3D' }}
            >
              🌿 {thread.planta_tag}
            </span>
          )}

          <h1 className="text-2xl font-bold mb-4" style={{ color: '#243B27' }}>
            {thread.titulo}
          </h1>

          <p className="text-sm leading-relaxed mb-6" style={{ color: '#4C6B3D' }}>
            {thread.contenido}
          </p>

          {/* Autor y fecha */}
          <div
            className="flex items-center gap-3 pt-4 border-t"
            style={{ borderColor: '#EAF3E6' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: '#4C6B3D' }}
            >
              {(thread.buyer.nombre ?? 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#243B27' }}>
                {thread.buyer.nombre ?? 'Usuario'}
              </p>
              <p className="text-xs" style={{ color: '#B9B9B0' }}>
                {new Date(thread.created_at).toLocaleDateString('es-AR', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Contador de respuestas */}
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={18} style={{ color: '#7BA05D' }} />
          <p className="font-semibold text-sm" style={{ color: '#243B27' }}>
            {thread.replies.length} {thread.replies.length === 1 ? 'respuesta' : 'respuestas'}
          </p>
        </div>

        {/* Lista de respuestas */}
        {thread.replies.length > 0 && (
          <div className="grid gap-4 mb-8">
            {thread.replies.map((reply, index) => (
              <div
                key={reply.id}
                className="rounded-3xl border border-[#EAF3E6] bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: '#7BA05D' }}
                  >
                    {(reply.buyer.nombre ?? 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold" style={{ color: '#243B27' }}>
                        {reply.buyer.nombre ?? 'Usuario'}
                      </p>
                      <span className="text-xs" style={{ color: '#B9B9B0' }}>·</span>
                      <p className="text-xs" style={{ color: '#B9B9B0' }}>
                        {new Date(reply.created_at).toLocaleDateString('es-AR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full ml-auto"
                        style={{ backgroundColor: '#F5F2EA', color: '#7BA05D' }}
                      >
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#4C6B3D' }}>
                      {reply.contenido}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulario de respuesta */}
        {buyer ? (
          <FormRespuesta threadId={thread.id} />
        ) : (
          <div
            className="rounded-3xl border border-[#EAF3E6] bg-white p-6 text-center"
          >
            <User size={32} className="mx-auto mb-3" style={{ color: '#B9B9B0' }} />
            <p className="text-sm mb-4" style={{ color: '#4C6B3D' }}>
              Iniciá sesión para dejar una respuesta
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: '#4C6B3D' }}
            >
              Iniciar sesión
            </Link>
          </div>
        )}

      </section>
    </main>
  )
}