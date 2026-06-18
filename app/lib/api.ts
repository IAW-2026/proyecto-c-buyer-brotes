import { vendedores as mockVendedores, Vendedor, Producto } from './mock-data'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SELLER APP — endpoints consumidos
//
// GET /api/sellers              → todos los vendedores
// GET /api/sellers/:id          → detalle de un vendedor
// GET /api/products             → todos los productos (con ?seller_id= para filtrar)
// GET /api/products/:id         → detalle de un producto
//
// PAYMENTS APP — endpoints consumidos
// POST /api/payments            → procesar pago
// GET  /api/payments/:id        → estado del pago
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELLER_APP_URL   = process.env.SELLER_APP_URL
const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL

// Cada app tiene su propia API key
const SELLER_API_KEY   = process.env.SELLER_SERVICE_API_KEY
const PAYMENTS_API_KEY = process.env.PAYMENTS_SERVICE_API_KEY

const sellerHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SELLER_API_KEY}`
}

const paymentsHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${PAYMENTS_API_KEY}`
}

// ── Helpers de mapeo ──────────────────────────────────────────────────────────

function mapProducto(p: any): Producto {
  return {
    id: p.id,
    nombre: p.name ?? p.nombre,
    precio: p.price?.amount ?? p.precio,
    stock: p.stock?.available ?? p.stock,
    descripcion: p.description ?? p.descripcion ?? '',
    imagen: p.image_url ?? p.imagen ?? ''
  }
}

function mapVendedor(s: any, productos: Producto[]): Vendedor {
  return {
    id: s.id,
    nombre: s.name ?? s.nombre,
    descripcion: s.description ?? s.descripcion ?? '',
    imagen: s.icon_url ?? s.imagen ?? '',
    ubicacion: s.city ?? s.ubicacion ?? '',
    productos
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SELLER APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getVendedores(): Promise<Vendedor[]> {
  if (!SELLER_APP_URL) {
    console.warn('[api] SELLER_APP_URL no configurada, usando mock-data')
    return mockVendedores
  }

  try {
    const res = await fetch(`${SELLER_APP_URL}/api/sellers`, {
      headers: sellerHeaders,
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('[api] Error al obtener sellers:', res.status)
      return mockVendedores
    }

    const data = await res.json()
    console.log('[api] Raw sellers response:', JSON.stringify(data).slice(0, 500))
    const sellers: any[] = data.sellers ?? data

    const vendedores = await Promise.all(
      sellers.map(async (seller) => {
        const productos = await getProductosPorVendedor(seller.id)
        return mapVendedor(seller, productos)
      })
    )

    return vendedores
  } catch (err) {
    console.error('[api] Error en getVendedores:', err)
    return mockVendedores
  }
}

export async function getVendedorById(id: number): Promise<Vendedor | undefined> {
  if (!SELLER_APP_URL) {
    console.warn('[api] SELLER_APP_URL no configurada, usando mock-data')
    return mockVendedores.find(v => v.id === id)
  }

  try {
    const [sellersRes, productos] = await Promise.all([
      fetch(`${SELLER_APP_URL}/api/sellers`, {
        headers: sellerHeaders,
        next: { revalidate: 60 }
      }),
      getProductosPorVendedor(id)
    ])

    if (!sellersRes.ok) {
      console.error('[api] Error al obtener sellers:', sellersRes.status)
      return mockVendedores.find(v => v.id === id)
    }

    const data = await sellersRes.json()
    const sellers: any[] = data.sellers ?? data
    const seller = sellers.find((s: any) => s.id === id)

    if (!seller) return undefined

    return mapVendedor(seller, productos)
  } catch (err) {
    console.error('[api] Error en getVendedorById:', err)
    return mockVendedores.find(v => v.id === id)
  }
}

async function getProductosPorVendedor(sellerId: number): Promise<Producto[]> {
  if (!SELLER_APP_URL) {
    return mockVendedores.find(v => v.id === sellerId)?.productos ?? []
  }

  try {
    const res = await fetch(`${SELLER_APP_URL}/api/products?seller_id=${sellerId}`, {
      headers: sellerHeaders,
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('[api] Error al obtener productos del seller:', sellerId, res.status)
      return mockVendedores.find(v => v.id === sellerId)?.productos ?? []
    }

    const data = await res.json()
    console.log('[api] Raw productos seller', sellerId, ':', JSON.stringify(data).slice(0, 500))
    const productos: any[] = data.data ?? data

    return productos.map(mapProducto)
  } catch (err) {
    console.error('[api] Error en getProductosPorVendedor:', err)
    return mockVendedores.find(v => v.id === sellerId)?.productos ?? []
  }
}

export async function getProductoById(id: number): Promise<Producto | undefined> {
  if (!SELLER_APP_URL) {
    console.warn('[api] SELLER_APP_URL no configurada, usando mock-data')
    return mockVendedores.flatMap(v => v.productos).find(p => p.id === id)
  }

  try {
    const res = await fetch(`${SELLER_APP_URL}/api/products/${id}`, {
      headers: sellerHeaders,
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      if (res.status === 404) return undefined
      console.error('[api] Error al obtener producto:', res.status)
      return mockVendedores.flatMap(v => v.productos).find(p => p.id === id)
    }

    const data = await res.json()
    return mapProducto(data)
  } catch (err) {
    console.error('[api] Error en getProductoById:', err)
    return mockVendedores.flatMap(v => v.productos).find(p => p.id === id)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENTS APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getEstadoPago(pagoId: number) {
  if (!PAYMENTS_APP_URL) {
    console.warn('[api] PAYMENTS_APP_URL no configurada, usando mock')
    return { id: pagoId, status: 'approved' }
  }

  try {
    const res = await fetch(`${PAYMENTS_APP_URL}/api/payments/${pagoId}`, {
      headers: paymentsHeaders
    })

    if (!res.ok) {
      console.error('[api] Error al obtener estado de pago:', res.status)
      return null
    }

    return res.json()
  } catch (err) {
    console.error('[api] Error en getEstadoPago:', err)
    return null
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API EXTERNA — Open-Meteo (clima para cuidado de plantas)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getWeatherForPlants(
  latitude: number = -38.7196,
  longitude: number = -62.2724
) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    )
    if (!res.ok) throw new Error('Error al obtener datos del clima')
    const data = await res.json()
    return data.current_weather
  } catch (error) {
    console.error('[api] Error en API externa de clima:', error)
    return null
  }
}