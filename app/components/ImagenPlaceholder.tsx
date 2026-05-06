type Props = {
  tipo: 'vendedor' | 'producto'
  imagen?: string
  className?: string
}

export default function ImagenPlaceholder({ tipo, imagen, className }: Props) {
  if (imagen && imagen.startsWith('http')) {
    return (
      <img
        src={imagen}
        alt=""
        className={className}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    )
  }

  if (tipo === 'vendedor') {
    return (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <circle cx="40" cy="28" r="12" stroke="#7BA05D" strokeWidth="2.5" fill="none"/>
        <path d="M20 64c0-11 9-20 20-20s20 9 20 20" stroke="#7BA05D" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M52 18c3-4 8-3 8 2s-5 8-8 5" stroke="#4C6B3D" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M60 20c2-1 4 0 4 2s-2 3-4 2" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <path d="M40 60 C40 60 20 45 20 30 C20 20 29 14 40 20 C51 14 60 20 60 30 C60 45 40 60 40 60Z"
        stroke="#7BA05D" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      <path d="M40 20 L40 60" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M40 35 C40 35 30 28 25 32" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M40 42 C40 42 50 35 55 39" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}