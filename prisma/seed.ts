import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Limpiar tablas en orden para evitar errores de FK ──
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.buyer.deleteMany()

  console.log('🧹 Tablas limpiadas')

  // ── Buyers ──
  const buyer1 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_001',
      nombre: 'María González',
      email: 'buyer@brotes.com',
      direccion: 'Av. Corrientes 1234, Buenos Aires',
      estado: 'activo'
    }
  })

  const buyer2 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_002',
      nombre: 'Carlos Rodríguez',
      email: 'ambos@brotes.com',
      direccion: 'San Martín 567, Córdoba',
      estado: 'activo'
    }
  })

  const buyer3 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_003',
      nombre: 'Laura Martínez',
      email: 'suspendido@brotes.com',
      direccion: 'Belgrano 890, Rosario',
      estado: 'suspendido'
    }
  })

  const buyer4 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_004',
      nombre: 'Admin Sistema',
      email: 'admin@brotes.com',
      direccion: '',
      estado: 'activo'
    }
  })

  const buyer5 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_005',
      nombre: 'Pedro Sánchez',
      email: 'eliminado@brotes.com',
      direccion: 'Florida 321, Buenos Aires',
      estado: 'eliminado',
      deleted_at: new Date(),
      delete_reason: 'Violación de términos y condiciones del marketplace'
    }
  })

  console.log('👤 Buyers creados')

  // ── Órdenes con distintos estados ──

  // Orden confirmada con items
  const orden1 = await prisma.order.create({
    data: {
      buyer_id: buyer1.id,
      seller_id: 1,
      total: 44000,
      estado: 'confirmada',
      payment_id: 1001,
      items: {
        create: [
          {
            product_id: 1,
            product_name_snapshot: 'Monstera Deliciosa',
            unit_price_snapshot: 28000,
            cantidad: 1
          },
          {
            product_id: 2,
            product_name_snapshot: 'Pilea Peperomioides',
            unit_price_snapshot: 16000,
            cantidad: 1
          }
        ]
      }
    }
  })

  // Orden entregada
  const orden2 = await prisma.order.create({
    data: {
      buyer_id: buyer1.id,
      seller_id: 3,
      total: 27000,
      estado: 'entregada',
      payment_id: 1002,
      items: {
        create: [
          {
            product_id: 30,
            product_name_snapshot: 'Aloe Vera',
            unit_price_snapshot: 9000,
            cantidad: 1
          },
          {
            product_id: 29,
            product_name_snapshot: 'Echeveria Rosa',
            unit_price_snapshot: 5000,
            cantidad: 2
          },
          {
            product_id: 34,
            product_name_snapshot: 'Crassula Ovata',
            unit_price_snapshot: 7000,
            cantidad: 1
          }
        ]
      }
    }
  })

  // Orden en preparación
  const orden3 = await prisma.order.create({
    data: {
      buyer_id: buyer2.id,
      seller_id: 4,
      total: 120000,
      estado: 'en_preparacion',
      payment_id: 1003,
      items: {
        create: [
          {
            product_id: 39,
            product_name_snapshot: 'Monstera Thai Constellation',
            unit_price_snapshot: 120000,
            cantidad: 1
          }
        ]
      }
    }
  })

  // Orden pendiente
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id,
      seller_id: 1,
      total: 32000,
      estado: 'pendiente',
      items: {
        create: [
          {
            product_id: 7,
            product_name_snapshot: 'Ficus Elastica',
            unit_price_snapshot: 32000,
            cantidad: 1
          }
        ]
      }
    }
  })

  // Orden caducada
  await prisma.order.create({
    data: {
      buyer_id: buyer3.id,
      seller_id: 2,
      total: 18000,
      estado: 'caducada',
      items: {
        create: [
          {
            product_id: 13,
            product_name_snapshot: 'Lavanda',
            unit_price_snapshot: 8000,
            cantidad: 1
          },
          {
            product_id: 14,
            product_name_snapshot: 'Romero',
            unit_price_snapshot: 6000,
            cantidad: 1
          },
          {
            product_id: 17,
            product_name_snapshot: 'Tomillo',
            unit_price_snapshot: 4500,
            cantidad: 1
          }
        ]
      }
    }
  })

  // Orden lista para retirar
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id,
      seller_id: 8,
      total: 75000,
      estado: 'listo',
      payment_id: 1004,
      items: {
        create: [
          {
            product_id: 88,
            product_name_snapshot: 'Bonsai Ficus',
            unit_price_snapshot: 75000,
            cantidad: 1
          }
        ]
      }
    }
  })

  console.log('📦 Órdenes creadas')

  // ── Carrito activo para buyer1 ──
  await prisma.cart.create({
    data: {
      buyer_id: buyer1.id,
      seller_id: 6,
      estado: 'active',
      items: {
        create: [
          {
            product_id: 63,
            cantidad: 1,
            precio_unitario: 55000
          },
          {
            product_id: 64,
            cantidad: 2,
            precio_unitario: 12000
          }
        ]
      }
    }
  })

  console.log('🛒 Carrito creado')

  // ── Favoritos ──
  await prisma.favorite.createMany({
    data: [
      { buyer_id: buyer1.id, product_id: 39, seller_id: 4 },
      { buyer_id: buyer1.id, product_id: 88, seller_id: 8 },
      { buyer_id: buyer1.id, product_id: 1,  seller_id: 1 },
      { buyer_id: buyer2.id, product_id: 40, seller_id: 4 },
      { buyer_id: buyer2.id, product_id: 63, seller_id: 6 }
    ]
  })

  console.log('❤️  Favoritos creados')
  console.log('')
  console.log('✅ Seed completado exitosamente')
  console.log('')
  console.log('👤 Usuarios de prueba:')
  console.log('   buyer@brotes.com     → rol buyer')
  console.log('   ambos@brotes.com     → rol buyer + seller')
  console.log('   admin@brotes.com     → rol admin')
  console.log('   seller@brotes.com    → rol seller')
}

main()
  .catch(e => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })