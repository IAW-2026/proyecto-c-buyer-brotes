export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

export const estadoColorBadge: Record<string, string> = {
  activo:     '#7BA05D',
  suspendido: '#E07A5F',
  eliminado:  '#B9B9B0'
}

export const estadoOrdenColor: Record<string, string> = {
  pendiente:      '#E0A85F',
  confirmada:     '#7BA05D',
  en_preparacion: '#5F9BE0',
  listo:          '#9B7BE0',
  entregada:      '#4C6B3D',
  caducada:       '#B9B9B0'
}

export const USUARIOS_POR_PAGINA = 8
export const ORDENES_POR_PAGINA = 10