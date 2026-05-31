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
    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch {
      // Clerk API no disponible, creamos el buyer con datos mínimos
    }

    // Intentamos obtener el nombre real, si no lo dejamos null
    // para que el usuario sea forzado a completarlo en su perfil
    const nombreReal =
      clerkUser?.fullName?.trim() ||
      clerkUser?.firstName?.trim() ||
      null

    buyer = await prisma.buyer.create({
      data: {
        clerk_user_id: userId,
        nombre: nombreReal,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? '',
        direccion: null
      }
    })
  }

  return buyer
}