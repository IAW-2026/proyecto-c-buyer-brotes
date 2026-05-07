import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { getVendedores } from './lib/api'
import Link from 'next/link'
import Buscador from './components/Buscador'
import { MapPin, Leaf, Flower2, Package, Sparkles } from 'lucide-react'
import ImagenPlaceholder from './components/ImagenPlaceholder'

export default async function Home() {
  const vendedores = await getVendedores()
  const vendedorTags: Record<number, string> = {
    1: 'Top ventas',
    2: 'Oferta',
    3: 'Nuevo',
    4: 'Más buscado'
  }

  const getFirstImageFromFolder = (folderName: string) => {
    const folder = path.join(process.cwd(), 'public', folderName)
    if (!fs.existsSync(folder)) return null

    const files = fs.readdirSync(folder).filter(file => /\.(png|jpe?g|webp|avif|gif)$/i.test(file))
    return files.length > 0 ? `/${folderName}/${files[0]}` : null
  }

  const images = {
    jardinVertical: getFirstImageFromFolder('ImagenPared'),
    escritorioVerde: getFirstImageFromFolder('ImagenEscritorio'),
    balconUrbano: getFirstImageFromFolder('ImagenBalcon')
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F2EA' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(122,160,93,0.16),_transparent_35%),linear-gradient(180deg,#F5F2EA_0%,#EFF8EE_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:gap-10 lg:grid-cols-[1.2fr_0.9fr] items-center">
          <div className="space-y-6 rounded-[2rem] border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_40px_80px_rgba(36,59,39,0.08)]">
            <div className="mb-4">
              <Buscador vendedores={vendedores} />
            </div>
            <span className="inline-flex items-center rounded-full bg-[#EAF3E6] px-4 py-2 text-sm font-semibold text-[#4C6B3D]">
              <Leaf size={16} className="mr-2" /> Viveros verificados · envío exprés
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#243B27' }}>
              Tu vivero online para dar vida a cada rincón
            </h1>
            <p className="max-w-2xl text-base sm:text-lg leading-8" style={{ color: '#4C6B3D' }}>
              Encontrá plantas, accesorios y cuidados de los mejores vendedores en un solo lugar. Inspírate con colecciones únicas y dale verde a tu hogar.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#F1FAF1] px-4 py-3 text-sm font-semibold text-[#243B27] shadow-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                <Leaf size={16} /> Suculentas +20%
              </div>
              <div className="rounded-3xl bg-[#F1FAF1] px-4 py-3 text-sm font-semibold text-[#243B27] shadow-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                <Flower2 size={16} /> Plantas de interior
              </div>
              <div className="rounded-3xl bg-[#F1FAF1] px-4 py-3 text-sm font-semibold text-[#243B27] shadow-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                <Package size={16} /> Macetas & kits
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-[#F8FFF6]/90 p-6 sm:p-8 shadow-[0_40px_80px_rgba(36,59,39,0.08)]">
            <div className="grid gap-6">
              <div className="rounded-[1.75rem] bg-[#EAF3E6] p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-[#4C6B3D] inline-block px-3 py-1 rounded-full bg-white/60">
                  Promociones
                </p>
                <h2 className="mt-4 text-2xl font-bold" style={{ color: '#243B27' }}>
                  Hasta 30% off en plantas purificadoras
                </h2>
                <p className="mt-3 text-sm" style={{ color: '#4C6B3D' }}>
                  Aprovechá descuentos exclusivos y envío gratis en pedidos mayores a $30.000.
                </p>
                <div className="mt-6 inline-flex rounded-full bg-[#4C6B3D] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg cursor-pointer">
                  Ver promociones
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-white border border-[#EAF3E6] p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-[#7BA05D] inline-block px-3 py-1 rounded-full bg-[#EAF3E6]/60">
                  Novedades
                </p>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: '#243B27' }}>
                  Nuevas colecciones para tu jardín interior
                </h3>
                <p className="mt-3 text-sm" style={{ color: '#4C6B3D' }}>
                  Descubrí plantas y estilos frescos que renuevan cualquier espacio con un toque natural.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb/Subtítulo */}
      <section className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm mb-4" style={{ color: '#7BA05D' }}>
            <span>Inicio</span> <span className="mx-2">{'>'}</span> <span style={{ color: '#4C6B3D' }}>Viveros destacados</span>
          </nav>
          <p className="text-lg text-center" style={{ color: '#4C6B3D' }}>
            Descubrí los mejores viveros de la zona con plantas frescas y consejos expertos
          </p>
        </div>
      </section>

      <section className="px-8 pb-16">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#243B27' }}>
          Viveros destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendedores.map((vendedor) => (
            <div
              key={vendedor.id}
              className="rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#EAF3E6] hover:border-[#7BA05D] hover:-translate-y-1"
              style={{ backgroundColor: 'white' }}
            >
              {/* Imagen del vendedor */}
              <div
                className="h-40 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#EAF3E6' }}
              >
                <ImagenPlaceholder tipo="vendedor" imagen={vendedor.imagen} />
              </div>

              {/* Info del vendedor */}
              <div className="p-5">
                <div className="mb-3 inline-flex rounded-full bg-gradient-to-r from-[#EAF3E6] to-[#E8F1E3] px-3 py-1 text-xs font-semibold text-[#4C6B3D] animate-pulse-subtle border border-[#7BA05D]/20">
                  {vendedorTags[vendedor.id]}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#243B27' }}>
                  {vendedor.nombre}
                </h3>
                <p className="text-sm mb-3 flex items-center gap-1" style={{ color: '#7BA05D' }}>
                  <MapPin size={14} /> {vendedor.ubicacion}
                </p>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#4C6B3D' }}>
                  {vendedor.descripcion}
                </p>

                {/* Mini resumen */}
                <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-[#EAF3E6]">
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: '#243B27' }}>+20</p>
                    <p className="text-xs" style={{ color: '#7BA05D' }}>Plantas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: '#243B27' }}>Rápido</p>
                    <p className="text-xs" style={{ color: '#7BA05D' }}>Envío</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: '#243B27' }}>Hoy</p>
                    <p className="text-xs" style={{ color: '#7BA05D' }}>Disponible</p>
                  </div>
                </div>

                <Link
                  href={`/vendedores/${vendedor.id}`}
                  className="block w-full py-2.5 rounded-full text-sm font-semibold text-white text-center transition-all duration-200 hover:brightness-110\"
                  style={{ backgroundColor: '#4C6B3D' }}
                >
                  Ver tienda
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías populares */}
      <section className="px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#243B27' }}>
          Categorías populares
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link
            href="/explorar?tipo=suculentas"
            className="rounded-2xl bg-white p-6 text-center shadow-sm border border-[#EAF3E6] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Leaf size={32} className="mx-auto mb-3" style={{ color: '#7BA05D' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#243B27' }}>Suculentas</h3>
            <p className="text-xs mt-1" style={{ color: '#4C6B3D' }}>Bajas en mantenimiento</p>
          </Link>
          <Link
            href="/explorar?tipo=interior"
            className="rounded-2xl bg-white p-6 text-center shadow-sm border border-[#EAF3E6] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Flower2 size={32} className="mx-auto mb-3" style={{ color: '#7BA05D' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#243B27' }}>Plantas de interior</h3>
            <p className="text-xs mt-1" style={{ color: '#4C6B3D' }}>Purificadoras del aire</p>
          </Link>
          <Link
            href="/explorar?tipo=accesorios"
            className="rounded-2xl bg-white p-6 text-center shadow-sm border border-[#EAF3E6] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Package size={32} className="mx-auto mb-3" style={{ color: '#7BA05D' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#243B27' }}>Macetas & kits</h3>
            <p className="text-xs mt-1" style={{ color: '#4C6B3D' }}>Todo incluido</p>
          </Link>
          <Link
            href="/explorar?tipo=raras"
            className="rounded-2xl bg-white p-6 text-center shadow-sm border border-[#EAF3E6] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Sparkles size={32} className="mx-auto mb-3" style={{ color: '#7BA05D' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#243B27' }}>Colecciones</h3>
            <p className="text-xs mt-1" style={{ color: '#4C6B3D' }}>Plantas raras</p>
          </Link>
        </div>
      </section>

      {/* Inspírate */}
      <section className="px-8 py-12" style={{ backgroundColor: '#EAF3E6' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#243B27' }}>
            Inspírate con estas ideas
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="relative h-40 rounded-xl mb-3 overflow-hidden bg-[#F1FAF1]">
                {images.jardinVertical ? (
                  <Image src={images.jardinVertical} alt="Jardín vertical" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Leaf size={48} style={{ color: '#7BA05D' }} />
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#243B27' }}>Jardín vertical</h3>
              <p className="text-sm" style={{ color: '#4C6B3D' }}>
                Crea un muro verde en tu hogar con plantas colgantes y suculentas.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="relative h-40 rounded-xl mb-3 overflow-hidden bg-[#F1FAF1]">
                {images.escritorioVerde ? (
                  <Image src={images.escritorioVerde} alt="Escritorio verde" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Flower2 size={48} style={{ color: '#7BA05D' }} />
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#243B27' }}>Escritorio verde</h3>
              <p className="text-sm" style={{ color: '#4C6B3D' }}>
                Mejora tu concentración con plantas purificadoras en tu espacio de trabajo.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="relative h-40 rounded-xl mb-3 overflow-hidden bg-[#F1FAF1]">
                {images.balconUrbano ? (
                  <Image src={images.balconUrbano} alt="Balcón urbano" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package size={48} style={{ color: '#7BA05D' }} />
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#243B27' }}>Balcón urbano</h3>
              <p className="text-sm" style={{ color: '#4C6B3D' }}>
                Transforma tu balcón en un oasis con plantas resistentes y aromáticas.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}