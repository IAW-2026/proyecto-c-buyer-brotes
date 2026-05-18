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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API EXTERNA OBLIGATORIA (PRIORIDAD ALTA)
// Consumo de API real de Open-Meteo para obtener clima local (útil para el cuidado de las plantas)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getWeatherForPlants(latitude: number = -38.7196, longitude: number = -62.2724) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if (!res.ok) throw new Error('Error al obtener datos del clima');
    const data = await res.json();
    return data.current_weather;
  } catch (error) {
    console.error('Error en API externa de clima:', error);
    return null;
  }
}