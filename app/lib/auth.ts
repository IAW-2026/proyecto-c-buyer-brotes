import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getBuyerFromClerk() {
  const { userId } = await auth()

  if (!userId) return null

  // Busca si ya existe en la BD
  let buyer = await prisma.buyer.findUnique({
    where: { clerk_user_id: userId }
  })

  // Si no existe, lo crea (lazy load)
  if (!buyer) {
    // ✅ try-catch para que no explote si la API de Clerk está caída
    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch {
      // Clerk API no disponible, creamos el buyer con datos mínimos
    }

    buyer = await prisma.buyer.create({
      data: {
        clerk_user_id: userId,
        nombre: clerkUser?.fullName ?? clerkUser?.firstName ?? 'Usuario',
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? '',
        direccion: ''
      }
    })
  }

  return buyer
}