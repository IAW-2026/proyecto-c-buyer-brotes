import Link from 'next/link'
import { getVendedores } from '../lib/api'
import Buscador from '../components/Buscador'
import ImagenPlaceholder from '../components/ImagenPlaceholder'
import FiltrosExplorar from './FiltrosExplorar'
import { Leaf, Flower2, Sparkles, MapPin } from 'lucide-react'
import { Suspense } from 'react'

type ProductoExtendido = {
  id: number
  nombre: string
  precio: number
  stock: number
  descripcion: string
  imagen: string
  sellerId: number
  sellerName: string
  sellerLocation: string
  tipo?: string
}

function clasificarTipoPlanta(nombre: string): string {
  const n = nombre.toLowerCase()
  if (n.includes('maceta') || n.includes('kit') || n.includes('accesorio') || n.includes('tierra') || n.includes('sustrato') || n.includes('fertilizante') || n.includes('humus') || n.includes('perlita') || n.includes('vermiculita') || n.includes('bandeja') || n.includes('tijera') || n.includes('alambre') || n.includes('mesa') || n.includes('macramé') || n.includes('porta')) return 'accesorios'
  if (n.includes('lavanda') || n.includes('romero') || n.includes('tomillo') || n.includes('albahaca') || n.includes('menta') || n.includes('salvia') || n.includes('cedrón') || n.includes('melisa') || n.includes('orégano') || n.includes('eneldo') || n.includes('estragón') || n.includes('hierba buena') || n.includes('stevia') || n.includes('manzanilla')) return 'aromaticas'
  if (n.includes('limonero') || n.includes('naranjo') || n.includes('higuera') || n.includes('frutilla') || n.includes('tomate') || n.includes('zapallito') || n.includes('lechuga') || n.includes('espinaca') || n.includes('acelga') || n.includes('rúcula') || n.includes('pimiento') || n.includes('berenjena') || n.includes('rabanito') || n.includes('semilla') || n.includes('plantín')) return 'frutales'
  if (n.includes('cactus') || n.includes('san pedro') || n.includes('gymnocalycium') || n.includes('saguaro') || n.includes('cereus') || n.includes('ferocactus') || n.includes('melocactus') || n.includes('notocactus') || n.includes('trichocereus') || n.includes('opuntia') || n.includes('turbinicarpus') || n.includes('ariocarpus')) return 'cactus'
  if (n.includes('thai') || n.includes('constellation') || n.includes('pink princess') || n.includes('alocasia') || n.includes('zebrina') || n.includes('gloriosum') || n.includes('clarinervium') || n.includes('black velvet') || n.includes('white fusion') || n.includes('bonsai') || n.includes('orquídea') || n.includes('vanda') || n.includes('loto')) return 'raras'
  if (n.includes('echeveria') || n.includes('sedum') || n.includes('haworthia') || n.includes('crassula') || n.includes('aloe') || n.includes('agave') || n.includes('kalanchoe') || n.includes('lithops') || n.includes('graptopetalum') || n.includes('suculenta') || n.includes('pack suculenta')) return 'suculentas'
  return 'interior'
}

function filtrarPorPrecio(productos: ProductoExtendido[], filtro: string): ProductoExtendido[] {
  switch (filtro) {
    case 'bajo': return productos.filter(p => p.precio <= 10000)
    case 'medio': return productos.filter(p => p.precio > 10000 && p.precio <= 20000)
    case 'alto': return productos.filter(p => p.precio > 20000 && p.precio <= 50000)
    case 'premium': return productos.filter(p => p.precio > 50000)
    default: return productos
  }
}

function filtrarPorTipo(productos: ProductoExtendido[], filtro: string): ProductoExtendido[] {
  if (filtro === 'todos') return productos
  return productos.filter(p => p.tipo === filtro)
}

function ordenarPorPrecio(productos: ProductoExtendido[], orden: string): ProductoExtendido[] {
  switch (orden) {
    case 'asc': return [...productos].sort((a, b) => a.precio - b.precio)
    case 'desc': return [...productos].sort((a, b) => b.precio - a.precio)
    default: return productos
  }
}

const POR_PAGINA = 12

function ExplorarContent({
  productos,
  filtroTipo,
  filtroPrecio,
  ordenPrecio,
  paginaActual
}: {
  productos: ProductoExtendido[]
  filtroTipo: string
  filtroPrecio: string
  ordenPrecio: string
  paginaActual: number
}) {
  let productosFiltrados = filtrarPorTipo(productos, filtroTipo)
  productosFiltrados = filtrarPorPrecio(productosFiltrados, filtroPrecio)
  productosFiltrados = ordenarPorPrecio(productosFiltrados, ordenPrecio)

  const total = productosFiltrados.length
  const totalPaginas = Math.ceil(total / POR_PAGINA)
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  )

  const buildURL = (pagina: number) => {
    const params = new URLSearchParams()
    if (filtroTipo !== 'todos') params.set('tipo', filtroTipo)
    if (filtroPrecio !== 'todos') params.set('precio', filtroPrecio)
    if (ordenPrecio !== 'default') params.set('orden', ordenPrecio)
    params.set('pagina', String(pagina))
    return `/explorar?${params.toString()}`
  }

  return (
    <>
      <FiltrosExplorar />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] font-semibold" style={{ color: '#7BA05D' }}>Catálogo</p>
          <h2 className="text-3xl font-bold" style={{ color: '#243B27' }}>Productos disponibles</h2>
          <p className="text-sm mt-2" style={{ color: '#4C6B3D' }}>
            {total} productos encontrados — página {paginaActual} de {totalPaginas}
          </p>
        </div>
      </div>

      {productosPagina.length === 0 ? (
        <div className="text-center py-20">
          <Leaf size={80} className="mx-auto mb-4" style={{ color: '#7BA05D' }} />
          <p className="text-xl mb-6" style={{ color: '#4C6B3D' }}>No se encontraron productos con esos filtros</p>
          <Link href="/explorar" className="px-8 py-3 rounded-full text-white font-semibold" style={{ backgroundColor: '#4C6B3D' }}>
            Limpiar filtros
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productosPagina.map((producto) => (
              <div key={producto.id} className="rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#EAF3E6] hover:border-[#7BA05D] hover:-translate-y-1 bg-white">
                <div className="h-44 bg-[#EAF3E6] flex items-center justify-center">
                  <ImagenPlaceholder tipo="producto" imagen={producto.imagen} />
                </div>
                <div className="p-5">
                  <div className="mb-3 text-sm text-[#7BA05D] font-semibold flex items-center gap-2">
                    <MapPin size={14} /> {producto.sellerLocation}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#243B27' }}>{producto.nombre}</h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: '#4C6B3D' }}>{producto.descripcion}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-bold" style={{ color: '#243B27' }}>
                      ${producto.precio.toLocaleString('es-AR')}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: producto.stock > 5 ? '#7BA05D' : '#E07A5F' }}>
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link href={`/vendedores/${producto.sellerId}`} className="text-sm font-semibold text-[#7BA05D] underline">
                      {producto.sellerName}
                    </Link>
                    <Link href={`/vendedores/${producto.sellerId}`} className="rounded-full bg-[#4C6B3D] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
                      Ver planta
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {paginaActual > 1 && (
                <Link href={buildURL(paginaActual - 1)} className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all" style={{ borderColor: '#7BA05D', color: '#7BA05D' }}>
                  ← Anterior
                </Link>
              )}
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                <Link
                  key={num}
                  href={buildURL(num)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: num === paginaActual ? '#4C6B3D' : 'white',
                    color: num === paginaActual ? 'white' : '#4C6B3D',
                    border: '2px solid',
                    borderColor: num === paginaActual ? '#4C6B3D' : '#EAF3E6'
                  }}
                >
                  {num}
                </Link>
              ))}
              {paginaActual < totalPaginas && (
                <Link href={buildURL(paginaActual + 1)} className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all" style={{ borderColor: '#7BA05D', color: '#7BA05D' }}>
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default async function ExplorarPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const filtroTipo = params.tipo ?? 'todos'
  const filtroPrecio = params.precio ?? 'todos'
  const ordenPrecio = params.orden ?? 'default'
  const paginaActual = Number(params.pagina ?? 1)

  const vendedores = await getVendedores()
  const productos: ProductoExtendido[] = vendedores.flatMap((vendedor) =>
    vendedor.productos.map((producto) => ({
      ...producto,
      sellerId: vendedor.id,
      sellerName: vendedor.nombre,
      sellerLocation: vendedor.ubicacion,
      tipo: clasificarTipoPlanta(producto.nombre)
    }))
  )

  const categorias = [
    { title: 'Suculentas', subtitle: 'Fáciles de cuidar', icon: Flower2 },
    { title: 'Plantas de interior', subtitle: 'Purifican el aire', icon: Leaf },
    { title: 'Colecciones nuevas', subtitle: 'Estilo fresco', icon: Sparkles }
  ]

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>
      <section className="px-4 sm:px-8 pt-10 pb-8">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 sm:p-10 shadow-[0_30px_70px_rgba(36,59,39,0.08)]">
            <span className="inline-flex items-center rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
              <Leaf size={16} className="mr-2" /> Explora plantas y viveros
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight" style={{ color: '#243B27' }}>
              Encontrá la planta perfecta para tu hogar
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: '#4C6B3D' }}>
              Navegá entre plantas seleccionadas, filtrá por estilo y descubrí recomendaciones de viveros de confianza.
            </p>
            <div className="mt-8 max-w-lg">
              <Buscador vendedores={vendedores} />
            </div>
          </div>

          <div className="grid gap-4">
            {categorias.map((categoria) => {
              const Icon = categoria.icon
              return (
                <div key={categoria.title} className="rounded-[2rem] border border-[#EAF3E6] bg-white p-6 shadow-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#4C6B3D] mb-4">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#243B27' }}>{categoria.title}</h2>
                  <p className="text-sm" style={{ color: '#4C6B3D' }}>{categoria.subtitle}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div className="text-center py-8">Cargando...</div>}>
            <ExplorarContent
              productos={productos}
              filtroTipo={filtroTipo}
              filtroPrecio={filtroPrecio}
              ordenPrecio={ordenPrecio}
              paginaActual={paginaActual}
            />
          </Suspense>
        </div>
      </section>
    </main>
  )
}