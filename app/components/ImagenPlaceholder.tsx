type Props = {
  tipo: 'vendedor' | 'producto'
  imagen?: string
}

export default function ImagenPlaceholder({ tipo, imagen }: Props) {
  if (imagen && imagen.startsWith('http')) {
    return (
      <img
        src={imagen}
        alt=""
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    )
  }

  if (tipo === 'vendedor') {
    return (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
        <circle cx="40" cy="30" r="13" stroke="#7BA05D" strokeWidth="2.5"/>
        <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="#7BA05D" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
      <path d="M40 62 C40 62 18 46 18 30 C18 19 28 13 40 20 C52 13 62 19 62 30 C62 46 40 62 40 62Z"
        stroke="#7BA05D" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M40 20 L40 62" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M40 36 C36 33 28 32 24 35" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M40 44 C44 41 52 40 56 43" stroke="#4C6B3D" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}