import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Limpiar tablas en orden para evitar errores de FK ──
  await prisma.forumReply.deleteMany()
  await prisma.forumThread.deleteMany()
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

  const buyer6 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_006',
      nombre: 'Valentina Torres',
      email: 'valentina@brotes.com',
      direccion: 'Rivadavia 450, Mendoza',
      estado: 'activo'
    }
  })

  const buyer7 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_007',
      nombre: 'Ignacio Pereyra',
      email: 'ignacio@brotes.com',
      direccion: 'Mitre 88, Tucumán',
      estado: 'activo'
    }
  })

  const buyer8 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_008',
      nombre: 'Sofía Herrera',
      email: 'sofia@brotes.com',
      direccion: 'Las Heras 2200, Santa Fe',
      estado: 'activo'
    }
  })

  const buyer9 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_009',
      nombre: 'Matías Fernández',
      email: 'matias@brotes.com',
      direccion: 'Urquiza 310, Corrientes',
      estado: 'activo'
    }
  })

  const buyer10 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_010',
      nombre: 'Lucía Ramírez',
      email: 'lucia@brotes.com',
      direccion: 'Sarmiento 900, Bariloche',
      estado: 'activo'
    }
  })

  const buyer11 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_011',
      nombre: 'Tomás Aguirre',
      email: 'tomas@brotes.com',
      direccion: 'Av. San Juan 1500, Buenos Aires',
      estado: 'activo'
    }
  })

  const buyer12 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_012',
      nombre: 'Camila Vega',
      email: 'camila@brotes.com',
      direccion: 'Lavalle 780, Rosario',
      estado: 'activo'
    }
  })

  const buyer13 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_013',
      nombre: 'Nicolás Blanco',
      email: 'nicolas@brotes.com',
      direccion: 'Chacabuco 200, Córdoba',
      estado: 'activo'
    }
  })

  const buyer14 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_014',
      nombre: 'Martina López',
      email: 'martina@brotes.com',
      direccion: 'Independencia 3300, Mendoza',
      estado: 'activo'
    }
  })

  const buyer15 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_015',
      nombre: 'Ezequiel Mora',
      email: 'ezequiel@brotes.com',
      direccion: 'Pellegrini 600, Bach',
      estado: 'activo'
    }
  })

  const buyer16 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_016',
      nombre: 'Florencia Castillo',
      email: 'florencia@brotes.com',
      direccion: 'Brown 1100, Mar del Plata',
      estado: 'activo'
    }
  })

  const buyer17 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_017',
      nombre: 'Rodrigo Ibáñez',
      email: 'rodrigo@brotes.com',
      direccion: 'Colón 450, San Juan',
      estado: 'suspendido'
    }
  })

  const buyer18 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_018',
      nombre: 'Agustina Paredes',
      email: 'agustina@brotes.com',
      direccion: 'Rivadavia 2500, Entre Ríos',
      estado: 'activo'
    }
  })

  const buyer19 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_019',
      nombre: 'Leandro Ríos',
      email: 'leandro@brotes.com',
      direccion: 'Moreno 890, San Luis',
      estado: 'activo'
    }
  })

  const buyer20 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_020',
      nombre: 'Julieta Acosta',
      email: 'julieta@brotes.com',
      direccion: 'Libertad 340, Misiones',
      estado: 'activo'
    }
  })

  console.log('👤 20 Buyers creados')

  // ── Órdenes ──────────────────────────────────────────────────────────────

  // buyer1
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 1, total: 44000, estado: 'confirmada', payment_id: 1001,
      items: { create: [
        { product_id: 1, product_name_snapshot: 'Monstera Deliciosa',   unit_price_snapshot: 28000, cantidad: 1 },
        { product_id: 2, product_name_snapshot: 'Pilea Peperomioides',  unit_price_snapshot: 16000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 3, total: 27000, estado: 'entregada', payment_id: 1002,
      items: { create: [
        { product_id: 30, product_name_snapshot: 'Aloe Vera',      unit_price_snapshot: 9000, cantidad: 1 },
        { product_id: 29, product_name_snapshot: 'Echeveria Rosa',  unit_price_snapshot: 5000, cantidad: 2 },
        { product_id: 34, product_name_snapshot: 'Crassula Ovata',  unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 8, total: 75000, estado: 'listo', payment_id: 1003,
      items: { create: [
        { product_id: 88, product_name_snapshot: 'Bonsai Ficus', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })

  // buyer2
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 4, total: 120000, estado: 'en_preparacion', payment_id: 1004,
      items: { create: [
        { product_id: 39, product_name_snapshot: 'Monstera Thai Constellation', unit_price_snapshot: 120000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 1, total: 32000, estado: 'pendiente',
      items: { create: [
        { product_id: 7, product_name_snapshot: 'Ficus Elastica', unit_price_snapshot: 32000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 6, total: 55000, estado: 'confirmada', payment_id: 1005,
      items: { create: [
        { product_id: 63, product_name_snapshot: 'Palmera Areca', unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })

  // buyer3
  await prisma.order.create({
    data: {
      buyer_id: buyer3.id, seller_id: 2, total: 18500, estado: 'caducada',
      items: { create: [
        { product_id: 13, product_name_snapshot: 'Lavanda', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 14, product_name_snapshot: 'Romero',  unit_price_snapshot: 6000, cantidad: 1 },
        { product_id: 17, product_name_snapshot: 'Tomillo', unit_price_snapshot: 4500, cantidad: 1 }
      ]}
    }
  })

  // buyer6
  await prisma.order.create({
    data: {
      buyer_id: buyer6.id, seller_id: 11, total: 90000, estado: 'entregada', payment_id: 1006,
      items: { create: [
        { product_id: 121, product_name_snapshot: 'Orquídea Phalaenopsis', unit_price_snapshot: 35000, cantidad: 1 },
        { product_id: 122, product_name_snapshot: 'Orquídea Cattleya',     unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer6.id, seller_id: 5, total: 25000, estado: 'confirmada', payment_id: 1007,
      items: { create: [
        { product_id: 49, product_name_snapshot: 'Kit Huerta Inicial', unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 50, product_name_snapshot: 'Tomate Cherry',      unit_price_snapshot: 7000,  cantidad: 1 }
      ]}
    }
  })

  // buyer7
  await prisma.order.create({
    data: {
      buyer_id: buyer7.id, seller_id: 7, total: 65000, estado: 'en_preparacion', payment_id: 1008,
      items: { create: [
        { product_id: 75, product_name_snapshot: 'Rosa Roja',  unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 76, product_name_snapshot: 'Hortensia',  unit_price_snapshot: 22000, cantidad: 1 },
        { product_id: 79, product_name_snapshot: 'Camellia',   unit_price_snapshot: 28000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer7.id, seller_id: 12, total: 30000, estado: 'listo', payment_id: 1009,
      items: { create: [
        { product_id: 132, product_name_snapshot: 'Notro',    unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 133, product_name_snapshot: 'Calafate', unit_price_snapshot: 12000, cantidad: 1 }
      ]}
    }
  })

  // buyer8
  await prisma.order.create({
    data: {
      buyer_id: buyer8.id, seller_id: 15, total: 27000, estado: 'entregada', payment_id: 1010,
      items: { create: [
        { product_id: 167, product_name_snapshot: 'Pack Suculentas x3',    unit_price_snapshot: 9000,  cantidad: 1 },
        { product_id: 175, product_name_snapshot: 'Pack Regalo Suculentas', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer8.id, seller_id: 10, total: 20000, estado: 'confirmada', payment_id: 1011,
      items: { create: [
        { product_id: 109, product_name_snapshot: 'Mix Semillas Orgánicas',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 111, product_name_snapshot: 'Tierra Orgánica Premium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 117, product_name_snapshot: 'Humus de Lombriz',        unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })

  // buyer9
  await prisma.order.create({
    data: {
      buyer_id: buyer9.id, seller_id: 9, total: 57000, estado: 'en_preparacion', payment_id: 1012,
      items: { create: [
        { product_id: 98,  product_name_snapshot: 'Loto Sagrado', unit_price_snapshot: 32000, cantidad: 1 },
        { product_id: 100, product_name_snapshot: 'Kit Terrario', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer9.id, seller_id: 3, total: 27000, estado: 'pendiente',
      items: { create: [
        { product_id: 28, product_name_snapshot: 'Cactus San Pedro', unit_price_snapshot: 12000, cantidad: 1 },
        { product_id: 33, product_name_snapshot: 'Agave Azul',       unit_price_snapshot: 15000, cantidad: 1 }
      ]}
    }
  })

  // buyer10
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 4, total: 85000, estado: 'confirmada', payment_id: 1013,
      items: { create: [
        { product_id: 40, product_name_snapshot: 'Philodendron Pink Princess', unit_price_snapshot: 85000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 13, total: 45000, estado: 'entregada', payment_id: 1014,
      items: { create: [
        { product_id: 143, product_name_snapshot: 'Ficus Lyrata', unit_price_snapshot: 45000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 6, total: 75000, estado: 'listo', payment_id: 1015,
      items: { create: [
        { product_id: 69, product_name_snapshot: 'Palmera Kentia', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })

  // buyer11
  await prisma.order.create({
    data: {
      buyer_id: buyer11.id, seller_id: 14, total: 21000, estado: 'confirmada', payment_id: 1016,
      items: { create: [
        { product_id: 154, product_name_snapshot: 'Menta Peperita',       unit_price_snapshot: 4500, cantidad: 2 },
        { product_id: 163, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 155, product_name_snapshot: 'Manzanilla',           unit_price_snapshot: 4000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer11.id, seller_id: 19, total: 33000, estado: 'entregada', payment_id: 1017,
      items: { create: [
        { product_id: 216, product_name_snapshot: 'String of Pearls', unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 217, product_name_snapshot: 'Hoya Carnosa',     unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })

  // buyer12
  await prisma.order.create({
    data: {
      buyer_id: buyer12.id, seller_id: 16, total: 73000, estado: 'listo', payment_id: 1018,
      items: { create: [
        { product_id: 177, product_name_snapshot: 'Olivo en Maceta',      unit_price_snapshot: 65000, cantidad: 1 },
        { product_id: 178, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer12.id, seller_id: 2, total: 11000, estado: 'caducada',
      items: { create: [
        { product_id: 21, product_name_snapshot: 'Menta',    unit_price_snapshot: 4000, cantidad: 1 },
        { product_id: 22, product_name_snapshot: 'Albahaca', unit_price_snapshot: 3500, cantidad: 1 },
        { product_id: 23, product_name_snapshot: 'Perejil',  unit_price_snapshot: 3000, cantidad: 1 }
      ]}
    }
  })

  // buyer13
  await prisma.order.create({
    data: {
      buyer_id: buyer13.id, seller_id: 18, total: 60000, estado: 'en_preparacion', payment_id: 1019,
      items: { create: [
        { product_id: 199, product_name_snapshot: 'Cactus Totem',  unit_price_snapshot: 35000, cantidad: 1 },
        { product_id: 201, product_name_snapshot: 'Cactus Cereus', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer13.id, seller_id: 15, total: 18000, estado: 'pendiente',
      items: { create: [
        { product_id: 175, product_name_snapshot: 'Pack Regalo Suculentas', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })

  // buyer14
  await prisma.order.create({
    data: {
      buyer_id: buyer14.id, seller_id: 20, total: 90000, estado: 'confirmada', payment_id: 1020,
      items: { create: [
        { product_id: 224, product_name_snapshot: 'Strelitzia Nicolai', unit_price_snapshot: 55000, cantidad: 1 },
        { product_id: 226, product_name_snapshot: 'Frangipanier',       unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer14.id, seller_id: 17, total: 46000, estado: 'entregada', payment_id: 1021,
      items: { create: [
        { product_id: 187, product_name_snapshot: 'Helecho Cuerno de Alce', unit_price_snapshot: 28000, cantidad: 1 },
        { product_id: 190, product_name_snapshot: 'Helecho Nido de Pájaro', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })

  // buyer15
  await prisma.order.create({
    data: {
      buyer_id: buyer15.id, seller_id: 6, total: 110000, estado: 'listo', payment_id: 1022,
      items: { create: [
        { product_id: 69, product_name_snapshot: 'Palmera Kentia', unit_price_snapshot: 75000, cantidad: 1 },
        { product_id: 70, product_name_snapshot: 'Strelitzia',     unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer15.id, seller_id: 4, total: 65000, estado: 'confirmada', payment_id: 1023,
      items: { create: [
        { product_id: 43, product_name_snapshot: 'Anthurium Clarinervium', unit_price_snapshot: 65000, cantidad: 1 }
      ]}
    }
  })

  // buyer16
  await prisma.order.create({
    data: {
      buyer_id: buyer16.id, seller_id: 11, total: 71000, estado: 'en_preparacion', payment_id: 1024,
      items: { create: [
        { product_id: 125, product_name_snapshot: 'Orquídea Vanda',             unit_price_snapshot: 65000, cantidad: 1 },
        { product_id: 128, product_name_snapshot: 'Fertilizante para Orquídeas', unit_price_snapshot: 6000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer16.id, seller_id: 13, total: 30000, estado: 'pendiente',
      items: { create: [
        { product_id: 150, product_name_snapshot: 'Alocasia Amazonica', unit_price_snapshot: 30000, cantidad: 1 }
      ]}
    }
  })

  // buyer17
  await prisma.order.create({
    data: {
      buyer_id: buyer17.id, seller_id: 3, total: 14000, estado: 'caducada',
      items: { create: [
        { product_id: 32, product_name_snapshot: 'Gymnocalycium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 31, product_name_snapshot: 'Sedum Burro',   unit_price_snapshot: 6000, cantidad: 1 }
      ]}
    }
  })

  // buyer18
  await prisma.order.create({
    data: {
      buyer_id: buyer18.id, seller_id: 20, total: 40000, estado: 'entregada', payment_id: 1025,
      items: { create: [
        { product_id: 220, product_name_snapshot: 'Heliconia', unit_price_snapshot: 40000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer18.id, seller_id: 9, total: 35000, estado: 'confirmada', payment_id: 1026,
      items: { create: [
        { product_id: 104, product_name_snapshot: 'Terrario Vidrio 30cm', unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })

  // buyer19
  await prisma.order.create({
    data: {
      buyer_id: buyer19.id, seller_id: 8, total: 108000, estado: 'listo', payment_id: 1027,
      items: { create: [
        { product_id: 92, product_name_snapshot: 'Bonsai Pino',      unit_price_snapshot: 90000, cantidad: 1 },
        { product_id: 89, product_name_snapshot: 'Maceta Artesanal', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer19.id, seller_id: 16, total: 65000, estado: 'confirmada', payment_id: 1028,
      items: { create: [
        { product_id: 177, product_name_snapshot: 'Olivo en Maceta', unit_price_snapshot: 65000, cantidad: 1 }
      ]}
    }
  })

  // buyer20
  await prisma.order.create({
    data: {
      buyer_id: buyer20.id, seller_id: 17, total: 50000, estado: 'en_preparacion', payment_id: 1029,
      items: { create: [
        { product_id: 197, product_name_snapshot: 'Phlebodium Aureum', unit_price_snapshot: 16000, cantidad: 1 },
        { product_id: 193, product_name_snapshot: 'Adiantum',          unit_price_snapshot: 14000, cantidad: 1 },
        { product_id: 191, product_name_snapshot: 'Aspidistra',        unit_price_snapshot: 20000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer20.id, seller_id: 5, total: 13000, estado: 'entregada', payment_id: 1030,
      items: { create: [
        { product_id: 57, product_name_snapshot: 'Frutilla',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 55, product_name_snapshot: 'Pimiento',  unit_price_snapshot: 4000, cantidad: 1 },
        { product_id: 56, product_name_snapshot: 'Berenjena', unit_price_snapshot: 4000, cantidad: 1 }
      ]}
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
          { product_id: 63, cantidad: 1, precio_unitario: 55000 },
          { product_id: 64, cantidad: 2, precio_unitario: 12000 }
        ]
      }
    }
  })

  console.log('🛒 Carrito creado')

  // ── Favoritos ──
  await prisma.favorite.createMany({
    data: [
      { buyer_id: buyer1.id,  product_id: 39,  seller_id: 4  },
      { buyer_id: buyer1.id,  product_id: 88,  seller_id: 8  },
      { buyer_id: buyer1.id,  product_id: 1,   seller_id: 1  },
      { buyer_id: buyer2.id,  product_id: 40,  seller_id: 4  },
      { buyer_id: buyer2.id,  product_id: 63,  seller_id: 6  },
      { buyer_id: buyer6.id,  product_id: 121, seller_id: 11 },
      { buyer_id: buyer6.id,  product_id: 143, seller_id: 13 },
      { buyer_id: buyer7.id,  product_id: 75,  seller_id: 7  },
      { buyer_id: buyer8.id,  product_id: 167, seller_id: 15 },
      { buyer_id: buyer9.id,  product_id: 98,  seller_id: 9  },
      { buyer_id: buyer10.id, product_id: 40,  seller_id: 4  },
      { buyer_id: buyer10.id, product_id: 69,  seller_id: 6  },
      { buyer_id: buyer11.id, product_id: 216, seller_id: 19 },
      { buyer_id: buyer11.id, product_id: 154, seller_id: 14 },
      { buyer_id: buyer12.id, product_id: 177, seller_id: 16 },
      { buyer_id: buyer13.id, product_id: 199, seller_id: 18 },
      { buyer_id: buyer14.id, product_id: 224, seller_id: 20 },
      { buyer_id: buyer15.id, product_id: 69,  seller_id: 6  },
      { buyer_id: buyer16.id, product_id: 125, seller_id: 11 },
      { buyer_id: buyer18.id, product_id: 220, seller_id: 20 },
      { buyer_id: buyer19.id, product_id: 92,  seller_id: 8  },
      { buyer_id: buyer20.id, product_id: 197, seller_id: 17 },
    ]
  })

  console.log('❤️  Favoritos creados')

  // ── Foro: hilos y respuestas ──────────────────────────────────────────────

  const thread1 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer1.id,
      titulo: '¿Cada cuánto hay que regar una Monstera Deliciosa?',
      contenido: 'Compré mi primera Monstera hace un mes y no sé bien cada cuánto regarla. A veces la tierra parece seca pero no quiero pasarme. ¿Alguien tiene experiencia con esta planta?',
      planta_tag: 'Monstera'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread1.id,
        buyer_id: buyer2.id,
        contenido: 'Yo riego la mía cada 10 días en verano y cada 15 en invierno. Lo clave es meter el dedo en la tierra: si los primeros 3 cm están secos, es hora de regar.'
      },
      {
        thread_id: thread1.id,
        buyer_id: buyer10.id,
        contenido: 'Totalmente de acuerdo con Carlos. Además fijate que el agua escurra bien por los agujeros de la maceta, no conviene que quede encharcada. La Monstera prefiere quedarse un poco seca antes que mojada de más.'
      },
      {
        thread_id: thread1.id,
        buyer_id: buyer6.id,
        contenido: 'Una vez por semana en primavera y verano me funciona perfecto. En invierno la reduzco bastante. Y siempre con agua a temperatura ambiente, nunca fría directo de la canilla.'
      }
    ]
  })

  const thread2 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer9.id,
      titulo: '¿Cuál es el mejor sustrato para suculentas y cactus?',
      contenido: 'Estoy armando una colección de suculentas y quiero saber qué sustrato usan. Vi que algunos mezclan tierra con perlita pero no sé las proporciones exactas.',
      planta_tag: 'Suculentas'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread2.id,
        buyer_id: buyer12.id,
        contenido: 'Yo uso 50% tierra para plantas + 50% perlita y me va bárbaro. El drenaje es clave para que no se pudran las raíces. Si conseguís arena gruesa también podés agregarle un poco.'
      },
      {
        thread_id: thread2.id,
        buyer_id: buyer15.id,
        contenido: 'En viveros especializados venden sustrato específico para cactus y suculentas que ya viene listo. Vale un poco más pero ahorra el trabajo de mezclar y el resultado es muy bueno.'
      },
      {
        thread_id: thread2.id,
        buyer_id: buyer8.id,
        contenido: 'Yo hago 60% perlita, 30% tierra y 10% arena de río. Desde que uso esa mezcla mis suculentas no tuvieron más problemas de raíces. La clave es que el agua drene rápido.'
      },
      {
        thread_id: thread2.id,
        buyer_id: buyer19.id,
        contenido: 'Agreguen también un poco de carbón activado en el fondo de la maceta antes del sustrato. Ayuda a evitar hongos y mantiene el sustrato fresco más tiempo.'
      }
    ]
  })

  const thread3 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer6.id,
      titulo: 'Tips para mantener una Orquídea Phalaenopsis en flor más tiempo',
      contenido: 'Compré una Orquídea Phalaenopsis que vino con flores hermosas pero ya se me cayeron todas. ¿Cómo hago para que vuelva a florecer? ¿Hay algún truco?',
      planta_tag: 'Orquídea'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread3.id,
        buyer_id: buyer16.id,
        contenido: 'Las orquídeas necesitan un cambio de temperatura entre el día y la noche para reflorecer. Poné la maceta cerca de una ventana donde reciba luz indirecta y asegurate de que de noche baje la temperatura unos grados.'
      },
      {
        thread_id: thread3.id,
        buyer_id: buyer14.id,
        contenido: 'Usá fertilizante específico para orquídeas en floración, diluido a la mitad de lo que dice el envase. Una vez por mes en el período de crecimiento es suficiente. Y nada de regar de más, que les hace muy mal.'
      },
      {
        thread_id: thread3.id,
        buyer_id: buyer11.id,
        contenido: 'Cuando se caen las flores no cortés el tallo entero. Cortalo justo por encima de un nudo y muchas veces rebrota desde ahí. A mí me funcionó varias veces con la misma planta.'
      }
    ]
  })

  const thread4 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer13.id,
      titulo: '¿Los cactus necesitan abono? ¿Cuál recomiendan?',
      contenido: 'Tengo varios cactus columnares y globosos y nunca les puse abono. Un amigo me dijo que en primavera conviene fertilizarlos pero no sé qué producto usar ni cada cuánto.',
      planta_tag: 'Cactus'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread4.id,
        buyer_id: buyer19.id,
        contenido: 'Sí conviene abonarlos en primavera y verano que es cuando están en crecimiento activo. Yo uso un fertilizante bajo en nitrógeno (tipo 5-10-10) una vez al mes. En otoño e invierno nada.'
      },
      {
        thread_id: thread4.id,
        buyer_id: buyer20.id,
        contenido: 'Los fertilizantes específicos para cactus que venden en viveros son los más seguros. Tienen la proporción de nutrientes ideal para estas plantas. No uses fertilizante común de jardín que tiene mucho nitrógeno y los daña.'
      }
    ]
  })

  const thread5 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer11.id,
      titulo: 'Pothos vs Philodendron: ¿cuál recomiendan para principiantes?',
      contenido: 'Quiero empezar mi colección de plantas de interior y estoy dudando entre Pothos y Philodendron. ¿Cuál es más fácil de mantener? ¿Cuál crece más rápido?',
      planta_tag: 'Interior'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread5.id,
        buyer_id: buyer1.id,
        contenido: 'Ambas son ideales para principiantes pero el Pothos le gana en resistencia. Aguanta más el olvido de riego, tolera menos luz y crece rapidísimo. Si recién empezás, arrancá con Pothos.'
      },
      {
        thread_id: thread5.id,
        buyer_id: buyer8.id,
        contenido: 'El Philodendron Scandens es igual de fácil que el Pothos y tiene un verde más intenso. Yo tengo los dos y la verdad es que no noto gran diferencia en el cuidado. Los dos perdonan mucho.'
      },
      {
        thread_id: thread5.id,
        buyer_id: buyer18.id,
        contenido: 'Yo empecé con Pothos dorado y fue la mejor decisión. En seis meses lo tengo colgando por toda la estantería. Le doy agua cada 10 días y no le presto mucha más atención. Ideal para aprender.'
      }
    ]
  })

  const thread6 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer20.id,
      titulo: 'Mi Calathea mueve las hojas de noche, ¿es normal?',
      contenido: 'Tengo una Calathea Orbifolia y noté que durante el día tiene las hojas caídas y de noche las levanta. Pensé que estaba enferma pero sigue verde y con buen aspecto. ¿A alguien le pasa lo mismo?',
      planta_tag: 'Calathea'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread6.id,
        buyer_id: buyer2.id,
        contenido: '¡Es completamente normal! Las Calatheas son conocidas como "plantas que rezan" justo por eso. Siguen la luz del sol durante el día y se cierran de noche. Es un mecanismo natural de la planta.'
      },
      {
        thread_id: thread6.id,
        buyer_id: buyer10.id,
        contenido: 'Sí, es uno de los fenómenos más lindos de las Calatheas. Se llama nictinastia, un movimiento en respuesta a los cambios de luz. Si las hojas se mueven significa que la planta está sana y activa.'
      }
    ]
  })

  const thread7 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer7.id,
      titulo: '¿Cómo propagar una Lavanda en casa?',
      contenido: 'Tengo una Lavanda que está enorme y quiero sacarle esquejes para regalar. ¿Cuál es la mejor época para hacerlo y qué método funciona mejor?',
      planta_tag: 'Lavanda'
    }
  })

  await prisma.forumReply.createMany({
    data: [
      {
        thread_id: thread7.id,
        buyer_id: buyer14.id,
        contenido: 'La primavera es la mejor época. Cortá un esqueje de tallo semileñoso de unos 10 cm, sacale las hojas de abajo y ponelo en sustrato húmedo. En 3-4 semanas debería tener raíces.'
      },
      {
        thread_id: thread7.id,
        buyer_id: buyer12.id,
        contenido: 'Yo usé hormona enraizante en polvo y me fue muy bien. Mojás la base del esqueje, lo pasás por la hormona y lo plantás. Acelera mucho el proceso. Lo conseguís en cualquier vivero.'
      },
      {
        thread_id: thread7.id,
        buyer_id: buyer18.id,
        contenido: 'También podés probar en agua. Ponés el esqueje en un vasito con agua y cuando salen raíces de 2-3 cm lo trasplantás a tierra. Tarda un poco más pero podés ver el proceso completo.'
      }
    ]
  })

  console.log('💬 Foro: hilos y respuestas creados')
  console.log('')
  console.log('✅ Seed completado exitosamente')
  console.log('')
  console.log('👤 Usuarios de prueba:')
  console.log('   buyer@brotes.com        → comprador activo (3 órdenes, carrito activo)')
  console.log('   ambos@brotes.com        → comprador activo (3 órdenes)')
  console.log('   suspendido@brotes.com   → cuenta suspendida (1 orden caducada)')
  console.log('   admin@brotes.com        → administrador')
  console.log('   eliminado@brotes.com    → cuenta eliminada')
  console.log('   valentina@brotes.com    → compradora activa (2 órdenes)')
  console.log('   ignacio@brotes.com      → comprador activo (2 órdenes)')
  console.log('   sofia@brotes.com        → compradora activa (2 órdenes)')
  console.log('   matias@brotes.com       → comprador activo (2 órdenes)')
  console.log('   lucia@brotes.com        → compradora activa (3 órdenes)')
  console.log('   tomas@brotes.com        → comprador activo (2 órdenes)')
  console.log('   camila@brotes.com       → compradora activa (2 órdenes)')
  console.log('   nicolas@brotes.com      → comprador activo (2 órdenes)')
  console.log('   martina@brotes.com      → compradora activa (2 órdenes)')
  console.log('   ezequiel@brotes.com     → comprador activo (2 órdenes)')
  console.log('   florencia@brotes.com    → compradora activa (2 órdenes)')
  console.log('   rodrigo@brotes.com      → cuenta suspendida (1 orden caducada)')
  console.log('   agustina@brotes.com     → compradora activa (2 órdenes)')
  console.log('   leandro@brotes.com      → comprador activo (2 órdenes)')
  console.log('   julieta@brotes.com      → compradora activa (2 órdenes)')
  console.log('')
  console.log('💬 Foro:')
  console.log('   7 hilos de debate con 20 respuestas entre usuarios')
}

main()
  .catch(e => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })