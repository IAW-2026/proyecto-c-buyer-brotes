export type Order = {
  id: number
  total: number
  estado: string
  created_at: string
}

export type Buyer = {
  id: number
  nombre: string | null
  email: string
  estado: string
  created_at: string
  deleted_at: string | null
  delete_reason: string | null
  orders: Order[]
}

export type OrdenReporte = {
  id: number
  buyer_nombre: string
  buyer_email: string
  seller_id: number
  total: number
  estado: string
  items_count: number
  created_at: string
}

export type EstadoCount = {
  estado: string
  _count: { estado: number }
}

export type Reporte = {
  totalOrdenes: number
  ordenesPorEstado: EstadoCount[]
  ingresoTotal: number
  ordenesRecientes: OrdenReporte[]
}