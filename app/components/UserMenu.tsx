'use client'

import { useState, useRef, useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, ChevronDown } from 'lucide-react'

type Props = {
  nombre: string
}

export default function UserMenu({ nombre }: Props) {
  const { signOut } = useClerk()
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:brightness-90"
        style={{ backgroundColor: '#F5F2EA', color: '#4C6B3D' }}
      >
        {nombre}
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 0.2s',
            transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {abierto && (
        <div
          className="absolute right-0 top-12 w-48 rounded-2xl border shadow-lg overflow-hidden z-50"
          style={{ backgroundColor: 'white', borderColor: '#EAF3E6' }}
        >
          <Link
            href="/perfil"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-[#EAF3E6]"
            style={{ color: '#243B27' }}
          >
            <User size={16} style={{ color: '#7BA05D' }} />
            Mi perfil
          </Link>

          <div style={{ borderTop: '1px solid #EAF3E6' }} />

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-[#FFF5F2]"
            style={{ color: '#E07A5F' }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}