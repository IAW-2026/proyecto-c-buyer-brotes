import { vendedores, Vendedor, Producto } from './mock-data'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SELLER APP — endpoints consumidos
// GET /api/products     → todos los productos
// GET /api/products/:id → detalle de un producto
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getVendedores(): Promise<Vendedor[]> {
  // TODO: reemplazar por fetch a la Seller App
  // const res = await fetch('http://seller-app/api/sellers')
  // return res.json()
  return vendedores
}

export async function getVendedorById(id: number): Promise<Vendedor | undefined> {
  // TODO: reemplazar por fetch a la Seller App
  // const res = await fetch(`http://seller-app/api/sellers/${id}`)
  // return res.json()
  return vendedores.find(v => v.id === id)
}

export async function getProductoById(id: number): Promise<Producto | undefined> {
  // TODO: reemplazar por fetch a la Seller App
  // const res = await fetch(`http://seller-app/api/products/${id}`)
  // return res.json()
  const todosLosProductos = vendedores.flatMap(v => v.productos)
  return todosLosProductos.find(p => p.id === id)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENTS APP — endpoints consumidos
// POST /api/payments    → procesar pago
// GET  /api/payments/:id → estado del pago
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function procesarPago(ordenId: number, monto: number) {
  // TODO: reemplazar por fetch a la Payments App
  // const res = await fetch('http://payments-app/api/payments', {
  //   method: 'POST',
  //   body: JSON.stringify({ order_id: ordenId, amount: monto })
  // })
  // return res.json()
  return { id: 1, status: 'approved', amount: monto }
}

export async function getEstadoPago(pagoId: number) {
  // TODO: reemplazar por fetch a la Payments App
  // const res = await fetch(`http://payments-app/api/payments/${pagoId}`)
  // return res.json()
  return { id: pagoId, status: 'approved' }
}