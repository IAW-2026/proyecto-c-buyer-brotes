import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let _buyerIdx = 0
let _orderIdx = 0
let _favIdx = 0
let _threadIdx = 0
let _replyIdx = 0
let _likeIdx = 0
let _oldBuyerIdx = 0
let _oldOrderIdx = 0

function oldBuyerDate(): Date {
  const d = new Date('2025-02-01T08:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_oldBuyerIdx * 45))
  d.setHours(8 + (_oldBuyerIdx % 6))
  _oldBuyerIdx++
  return d
}

function oldOrderDate(): Date {
  const d = new Date('2025-06-01T10:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_oldOrderIdx * 10))
  d.setHours(10 + (_oldOrderIdx % 8))
  _oldOrderIdx++
  return d
}

function buyerDate(): Date {
  const offsets = [6, 8, 9, 10, 13, 15, 18, 20, 24, 27, 29, 32, 38, 41, 43, 46, 48, 52, 53, 54]
  const d = new Date('2026-05-01T08:00:00.000Z')
  d.setDate(d.getDate() + offsets[_buyerIdx])
  d.setHours(8 + (_buyerIdx % 6))
  _buyerIdx++
  return d
}

function orderDate(): Date {
  const d = new Date('2026-03-15T10:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_orderIdx * 1.5))
  d.setHours(10 + (_orderIdx % 10))
  _orderIdx++
  return d
}

function favoriteDate(): Date {
  const d = new Date('2026-03-20T12:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_favIdx * 2.5))
  d.setHours(12 + (_favIdx % 6))
  _favIdx++
  return d
}

function threadDate(): Date {
  const d = new Date('2026-03-15T09:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_threadIdx * 9))
  d.setHours(9 + (_threadIdx % 4))
  _threadIdx++
  return d
}

function replyDate(): Date {
  const d = new Date('2026-03-20T15:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_replyIdx * 3))
  d.setHours(15 + (_replyIdx % 5))
  _replyIdx++
  return d
}

function likeDate(): Date {
  const d = new Date('2026-03-25T20:00:00.000Z')
  d.setDate(d.getDate() + Math.floor(_likeIdx * 2))
  d.setHours(20 + (_likeIdx % 4))
  _likeIdx++
  return d
}

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Limpiar tablas en orden para evitar errores de FK ──
  await prisma.forumReplyLike.deleteMany()
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
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer2 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_002',
      nombre: 'Carlos Rodríguez',
      email: 'ambos@brotes.com',
      direccion: 'San Martín 567, Córdoba',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer3 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_003',
      nombre: 'Laura Martínez',
      email: 'suspendido@brotes.com',
      direccion: 'Belgrano 890, Rosario',
      estado: 'suspendido',
      created_at: buyerDate()
    }
  })

  const buyer4 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_004',
      nombre: 'Admin Sistema',
      email: 'admin@brotes.com',
      direccion: '',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer5 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_005',
      nombre: 'Pedro Sánchez',
      email: 'eliminado@brotes.com',
      direccion: 'Florida 321, Buenos Aires',
      estado: 'eliminado',
      created_at: buyerDate(),
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
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer7 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_007',
      nombre: 'Ignacio Pereyra',
      email: 'ignacio@brotes.com',
      direccion: 'Mitre 88, Tucumán',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer8 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_008',
      nombre: 'Sofía Herrera',
      email: 'sofia@brotes.com',
      direccion: 'Las Heras 2200, Santa Fe',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer9 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_009',
      nombre: 'Matías Fernández',
      email: 'matias@brotes.com',
      direccion: 'Urquiza 310, Corrientes',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer10 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_010',
      nombre: 'Lucía Ramírez',
      email: 'lucia@brotes.com',
      direccion: 'Sarmiento 900, Bariloche',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer11 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_011',
      nombre: 'Tomás Aguirre',
      email: 'tomas@brotes.com',
      direccion: 'Av. San Juan 1500, Buenos Aires',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer12 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_012',
      nombre: 'Camila Vega',
      email: 'camila@brotes.com',
      direccion: 'Lavalle 780, Rosario',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer13 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_013',
      nombre: 'Nicolás Blanco',
      email: 'nicolas@brotes.com',
      direccion: 'Chacabuco 200, Córdoba',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer14 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_014',
      nombre: 'Martina López',
      email: 'martina@brotes.com',
      direccion: 'Independencia 3300, Mendoza',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer15 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_015',
      nombre: 'Ezequiel Mora',
      email: 'ezequiel@brotes.com',
      direccion: 'Pellegrini 600, Bach',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer16 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_016',
      nombre: 'Florencia Castillo',
      email: 'florencia@brotes.com',
      direccion: 'Brown 1100, Mar del Plata',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer17 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_017',
      nombre: 'Rodrigo Ibáñez',
      email: 'rodrigo@brotes.com',
      direccion: 'Colón 450, San Juan',
      estado: 'suspendido',
      created_at: buyerDate()
    }
  })

  const buyer18 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_018',
      nombre: 'Agustina Paredes',
      email: 'agustina@brotes.com',
      direccion: 'Rivadavia 2500, Entre Ríos',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer19 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_019',
      nombre: 'Leandro Ríos',
      email: 'leandro@brotes.com',
      direccion: 'Moreno 890, San Luis',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer20 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_020',
      nombre: 'Julieta Acosta',
      email: 'julieta@brotes.com',
      direccion: 'Libertad 340, Misiones',
      estado: 'activo',
      created_at: buyerDate()
    }
  })

  const buyer21 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_021', nombre: 'Facundo Molina', email: 'facundo@brotes.com', direccion: 'Belgrano 1200, Salta', estado: 'activo', created_at: oldBuyerDate()
    }
  })
  const buyer22 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_022', nombre: 'Emilia Rivas', email: 'emilia@brotes.com', direccion: '9 de Julio 500, Jujuy', estado: 'activo', created_at: oldBuyerDate()
    }
  })
  const buyer23 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_023', nombre: 'Benjamín Soto', email: 'benjamin@brotes.com', direccion: 'Alvear 800, La Plata', estado: 'activo', created_at: oldBuyerDate()
    }
  })
  const buyer24 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_024', nombre: 'Victoria Paz', email: 'victoria@brotes.com', direccion: 'Maipú 2500, Neuquén', estado: 'suspendido', created_at: oldBuyerDate()
    }
  })
  const buyer25 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_025', nombre: 'Santiago Luna', email: 'santiago@brotes.com', direccion: 'San Lorenzo 1800, Formosa', estado: 'activo', created_at: oldBuyerDate()
    }
  })
  const buyer26 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_026', nombre: 'Catalina Méndez', email: 'catalina@brotes.com', direccion: 'Buenos Aires 650, Santiago del Estero', estado: 'eliminado', created_at: oldBuyerDate(), deleted_at: new Date('2026-05-01T12:00:00Z'), delete_reason: 'Solicitud propia'
    }
  })
  const buyer27 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_027', nombre: 'Maximiliano Campos', email: 'maximiliano@brotes.com', direccion: 'Entre Ríos 300, La Rioja', estado: 'activo', created_at: oldBuyerDate()
    }
  })
  const buyer28 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_028', nombre: 'Antonella Roldán', email: 'antonella@brotes.com', direccion: 'Córdoba 750, San Luis', estado: 'activo', created_at: oldBuyerDate()
    }
  })
  const buyer29 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_029', nombre: 'Joaquín Farías', email: 'joaquin@brotes.com', direccion: 'Moreno 400, Catamarca', estado: 'suspendido', created_at: oldBuyerDate()
    }
  })
  const buyer30 = await prisma.buyer.create({
    data: {
      clerk_user_id: 'seed_buyer_030', nombre: 'Valeria Núñez', email: 'valeria@brotes.com', direccion: 'Rivadavia 920, Chubut', estado: 'activo', created_at: oldBuyerDate()
    }
  })

  console.log('👤 30 Buyers creados')

  // ── Órdenes antiguas (buyers 21-30, antes de mayo 2026) ────────────────

  // buyer21 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer21.id, seller_id: 1, total: 32000, estado: 'entregada', payment_id: 2001, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 1, product_name_snapshot: 'Monstera Deliciosa',  unit_price_snapshot: 28000, cantidad: 1 },
        { product_id: 2, product_name_snapshot: 'Pilea Peperomioides', unit_price_snapshot: 4000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer21.id, seller_id: 5, total: 13000, estado: 'entregada', payment_id: 2002, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 57, product_name_snapshot: 'Frutilla',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 55, product_name_snapshot: 'Pimiento',  unit_price_snapshot: 4000, cantidad: 1 },
        { product_id: 56, product_name_snapshot: 'Berenjena', unit_price_snapshot: 4000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer21.id, seller_id: 8, total: 75000, estado: 'entregada', payment_id: 2003, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 88, product_name_snapshot: 'Bonsai Ficus', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })

  // buyer22 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer22.id, seller_id: 3, total: 27000, estado: 'entregada', payment_id: 2004, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 30, product_name_snapshot: 'Aloe Vera',      unit_price_snapshot: 9000, cantidad: 1 },
        { product_id: 29, product_name_snapshot: 'Echeveria Rosa',  unit_price_snapshot: 5000, cantidad: 2 },
        { product_id: 34, product_name_snapshot: 'Crassula Ovata',  unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer22.id, seller_id: 11, total: 90000, estado: 'entregada', payment_id: 2005, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 121, product_name_snapshot: 'Orquídea Phalaenopsis', unit_price_snapshot: 35000, cantidad: 1 },
        { product_id: 122, product_name_snapshot: 'Orquídea Cattleya',     unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer22.id, seller_id: 14, total: 12500, estado: 'entregada', payment_id: 2006, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 154, product_name_snapshot: 'Menta Peperita', unit_price_snapshot: 4500, cantidad: 1 },
        { product_id: 163, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000, cantidad: 1 }
      ]}
    }
  })

  // buyer23 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer23.id, seller_id: 6, total: 55000, estado: 'entregada', payment_id: 2007, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 63, product_name_snapshot: 'Palmera Areca', unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer23.id, seller_id: 17, total: 28000, estado: 'entregada', payment_id: 2008, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 187, product_name_snapshot: 'Helecho Cuerno de Alce', unit_price_snapshot: 28000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer23.id, seller_id: 2, total: 18500, estado: 'confirmada', payment_id: 2009, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 13, product_name_snapshot: 'Lavanda', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 14, product_name_snapshot: 'Romero',  unit_price_snapshot: 6000, cantidad: 1 },
        { product_id: 17, product_name_snapshot: 'Tomillo', unit_price_snapshot: 4500, cantidad: 1 }
      ]}
    }
  })

  // buyer24 — 2 órdenes (suspendido)
  await prisma.order.create({
    data: {
      buyer_id: buyer24.id, seller_id: 9, total: 57000, estado: 'entregada', payment_id: 2010, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 98,  product_name_snapshot: 'Loto Sagrado', unit_price_snapshot: 32000, cantidad: 1 },
        { product_id: 100, product_name_snapshot: 'Kit Terrario', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer24.id, seller_id: 4, total: 85000, estado: 'caducada', created_at: oldOrderDate(),
      items: { create: [
        { product_id: 40, product_name_snapshot: 'Philodendron Pink Princess', unit_price_snapshot: 85000, cantidad: 1 }
      ]}
    }
  })

  // buyer25 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer25.id, seller_id: 7, total: 65000, estado: 'entregada', payment_id: 2011, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 75, product_name_snapshot: 'Rosa Roja',  unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 76, product_name_snapshot: 'Hortensia',  unit_price_snapshot: 22000, cantidad: 1 },
        { product_id: 79, product_name_snapshot: 'Camellia',   unit_price_snapshot: 28000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer25.id, seller_id: 13, total: 45000, estado: 'entregada', payment_id: 2012, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 143, product_name_snapshot: 'Ficus Lyrata', unit_price_snapshot: 45000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer25.id, seller_id: 16, total: 73000, estado: 'confirmada', payment_id: 2013, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 177, product_name_snapshot: 'Olivo en Maceta',      unit_price_snapshot: 65000, cantidad: 1 },
        { product_id: 178, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000,  cantidad: 1 }
      ]}
    }
  })

  // buyer26 — 1 orden (eliminado)
  await prisma.order.create({
    data: {
      buyer_id: buyer26.id, seller_id: 12, total: 30000, estado: 'caducada', created_at: oldOrderDate(),
      items: { create: [
        { product_id: 132, product_name_snapshot: 'Notro',    unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 133, product_name_snapshot: 'Calafate', unit_price_snapshot: 12000, cantidad: 1 }
      ]}
    }
  })

  // buyer27 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer27.id, seller_id: 19, total: 33000, estado: 'entregada', payment_id: 2014, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 216, product_name_snapshot: 'String of Pearls', unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 217, product_name_snapshot: 'Hoya Carnosa',     unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer27.id, seller_id: 20, total: 90000, estado: 'entregada', payment_id: 2015, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 224, product_name_snapshot: 'Strelitzia Nicolai', unit_price_snapshot: 55000, cantidad: 1 },
        { product_id: 226, product_name_snapshot: 'Frangipanier',       unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer27.id, seller_id: 10, total: 20000, estado: 'entregada', payment_id: 2016, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 109, product_name_snapshot: 'Mix Semillas Orgánicas',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 111, product_name_snapshot: 'Tierra Orgánica Premium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 117, product_name_snapshot: 'Humus de Lombriz',        unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })

  // buyer28 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer28.id, seller_id: 18, total: 60000, estado: 'entregada', payment_id: 2017, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 199, product_name_snapshot: 'Cactus Totem',  unit_price_snapshot: 35000, cantidad: 1 },
        { product_id: 201, product_name_snapshot: 'Cactus Cereus', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer28.id, seller_id: 15, total: 27000, estado: 'entregada', payment_id: 2018, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 167, product_name_snapshot: 'Pack Suculentas x3',    unit_price_snapshot: 9000,  cantidad: 1 },
        { product_id: 175, product_name_snapshot: 'Pack Regalo Suculentas', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer28.id, seller_id: 4, total: 120000, estado: 'confirmada', payment_id: 2019, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 39, product_name_snapshot: 'Monstera Thai Constellation', unit_price_snapshot: 120000, cantidad: 1 }
      ]}
    }
  })

  // buyer29 — 2 órdenes (suspendido)
  await prisma.order.create({
    data: {
      buyer_id: buyer29.id, seller_id: 2, total: 11000, estado: 'caducada', created_at: oldOrderDate(),
      items: { create: [
        { product_id: 21, product_name_snapshot: 'Menta',    unit_price_snapshot: 4000, cantidad: 1 },
        { product_id: 22, product_name_snapshot: 'Albahaca', unit_price_snapshot: 3500, cantidad: 1 },
        { product_id: 23, product_name_snapshot: 'Perejil',  unit_price_snapshot: 3000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer29.id, seller_id: 3, total: 14000, estado: 'caducada', created_at: oldOrderDate(),
      items: { create: [
        { product_id: 32, product_name_snapshot: 'Gymnocalycium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 31, product_name_snapshot: 'Sedum Burro',   unit_price_snapshot: 6000, cantidad: 1 }
      ]}
    }
  })

  // buyer30 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer30.id, seller_id: 17, total: 46000, estado: 'entregada', payment_id: 2020, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 187, product_name_snapshot: 'Helecho Cuerno de Alce', unit_price_snapshot: 28000, cantidad: 1 },
        { product_id: 190, product_name_snapshot: 'Helecho Nido de Pájaro', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer30.id, seller_id: 5, total: 25000, estado: 'entregada', payment_id: 2021, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 49, product_name_snapshot: 'Kit Huerta Inicial', unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 50, product_name_snapshot: 'Tomate Cherry',      unit_price_snapshot: 7000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer30.id, seller_id: 6, total: 75000, estado: 'confirmada', payment_id: 2022, created_at: oldOrderDate(),
      items: { create: [
        { product_id: 69, product_name_snapshot: 'Palmera Kentia', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })

  console.log('📦 30 órdenes antiguas (buyers 21-30, antes de mayo 2026)')

  // ── Órdenes ──────────────────────────────────────────────────────────────

  // buyer1 — 4 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 1, total: 44000, estado: 'confirmada', payment_id: 1001, created_at: orderDate(),
      items: { create: [
        { product_id: 1, product_name_snapshot: 'Monstera Deliciosa',   unit_price_snapshot: 28000, cantidad: 1 },
        { product_id: 2, product_name_snapshot: 'Pilea Peperomioides',  unit_price_snapshot: 16000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 3, total: 27000, estado: 'entregada', payment_id: 1002, created_at: orderDate(),
      items: { create: [
        { product_id: 30, product_name_snapshot: 'Aloe Vera',      unit_price_snapshot: 9000, cantidad: 1 },
        { product_id: 29, product_name_snapshot: 'Echeveria Rosa',  unit_price_snapshot: 5000, cantidad: 2 },
        { product_id: 34, product_name_snapshot: 'Crassula Ovata',  unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 8, total: 75000, estado: 'listo', payment_id: 1003, created_at: orderDate(),
      items: { create: [
        { product_id: 88, product_name_snapshot: 'Bonsai Ficus', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer1.id, seller_id: 5, total: 30000, estado: 'entregada', payment_id: 1031, created_at: orderDate(),
      items: { create: [
        { product_id: 49, product_name_snapshot: 'Kit Huerta Inicial', unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 57, product_name_snapshot: 'Frutilla',           unit_price_snapshot: 5000,  cantidad: 1 },
        { product_id: 50, product_name_snapshot: 'Tomate Cherry',      unit_price_snapshot: 7000,  cantidad: 1 }
      ]}
    }
  })

  // buyer2 — 4 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 4, total: 120000, estado: 'en_preparacion', payment_id: 1004, created_at: orderDate(),
      items: { create: [
        { product_id: 39, product_name_snapshot: 'Monstera Thai Constellation', unit_price_snapshot: 120000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 1, total: 32000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 7, product_name_snapshot: 'Ficus Elastica', unit_price_snapshot: 32000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 6, total: 55000, estado: 'confirmada', payment_id: 1005, created_at: orderDate(),
      items: { create: [
        { product_id: 63, product_name_snapshot: 'Palmera Areca', unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer2.id, seller_id: 8, total: 75000, estado: 'listo', payment_id: 1032, created_at: orderDate(),
      items: { create: [
        { product_id: 88, product_name_snapshot: 'Bonsai Ficus', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })

  // buyer3 — 2 órdenes (suspendido)
  await prisma.order.create({
    data: {
      buyer_id: buyer3.id, seller_id: 2, total: 18500, estado: 'caducada', created_at: orderDate(),
      items: { create: [
        { product_id: 13, product_name_snapshot: 'Lavanda', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 14, product_name_snapshot: 'Romero',  unit_price_snapshot: 6000, cantidad: 1 },
        { product_id: 17, product_name_snapshot: 'Tomillo', unit_price_snapshot: 4500, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer3.id, seller_id: 12, total: 30000, estado: 'caducada', created_at: orderDate(),
      items: { create: [
        { product_id: 132, product_name_snapshot: 'Notro',    unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 133, product_name_snapshot: 'Calafate', unit_price_snapshot: 12000, cantidad: 1 }
      ]}
    }
  })

  // buyer4 (admin) — 2 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer4.id, seller_id: 10, total: 20000, estado: 'entregada', payment_id: 1033, created_at: orderDate(),
      items: { create: [
        { product_id: 109, product_name_snapshot: 'Mix Semillas Orgánicas',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 111, product_name_snapshot: 'Tierra Orgánica Premium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 117, product_name_snapshot: 'Humus de Lombriz',        unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer4.id, seller_id: 14, total: 13000, estado: 'confirmada', payment_id: 1034, created_at: orderDate(),
      items: { create: [
        { product_id: 154, product_name_snapshot: 'Menta Peperita', unit_price_snapshot: 4500, cantidad: 2 },
        { product_id: 155, product_name_snapshot: 'Manzanilla',     unit_price_snapshot: 4000, cantidad: 1 }
      ]}
    }
  })

  // buyer6 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer6.id, seller_id: 11, total: 90000, estado: 'entregada', payment_id: 1006, created_at: orderDate(),
      items: { create: [
        { product_id: 121, product_name_snapshot: 'Orquídea Phalaenopsis', unit_price_snapshot: 35000, cantidad: 1 },
        { product_id: 122, product_name_snapshot: 'Orquídea Cattleya',     unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer6.id, seller_id: 5, total: 25000, estado: 'confirmada', payment_id: 1007, created_at: orderDate(),
      items: { create: [
        { product_id: 49, product_name_snapshot: 'Kit Huerta Inicial', unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 50, product_name_snapshot: 'Tomate Cherry',      unit_price_snapshot: 7000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer6.id, seller_id: 9, total: 25000, estado: 'listo', payment_id: 1035, created_at: orderDate(),
      items: { create: [
        { product_id: 100, product_name_snapshot: 'Kit Terrario', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })

  // buyer7 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer7.id, seller_id: 7, total: 65000, estado: 'en_preparacion', payment_id: 1008, created_at: orderDate(),
      items: { create: [
        { product_id: 75, product_name_snapshot: 'Rosa Roja',  unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 76, product_name_snapshot: 'Hortensia',  unit_price_snapshot: 22000, cantidad: 1 },
        { product_id: 79, product_name_snapshot: 'Camellia',   unit_price_snapshot: 28000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer7.id, seller_id: 12, total: 30000, estado: 'listo', payment_id: 1009, created_at: orderDate(),
      items: { create: [
        { product_id: 132, product_name_snapshot: 'Notro',    unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 133, product_name_snapshot: 'Calafate', unit_price_snapshot: 12000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer7.id, seller_id: 20, total: 55000, estado: 'confirmada', payment_id: 1036, created_at: orderDate(),
      items: { create: [
        { product_id: 224, product_name_snapshot: 'Strelitzia Nicolai', unit_price_snapshot: 55000, cantidad: 1 }
      ]}
    }
  })

  // buyer8 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer8.id, seller_id: 15, total: 27000, estado: 'entregada', payment_id: 1010, created_at: orderDate(),
      items: { create: [
        { product_id: 167, product_name_snapshot: 'Pack Suculentas x3',    unit_price_snapshot: 9000,  cantidad: 1 },
        { product_id: 175, product_name_snapshot: 'Pack Regalo Suculentas', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer8.id, seller_id: 10, total: 20000, estado: 'confirmada', payment_id: 1011, created_at: orderDate(),
      items: { create: [
        { product_id: 109, product_name_snapshot: 'Mix Semillas Orgánicas',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 111, product_name_snapshot: 'Tierra Orgánica Premium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 117, product_name_snapshot: 'Humus de Lombriz',        unit_price_snapshot: 7000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer8.id, seller_id: 1, total: 28000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 1, product_name_snapshot: 'Monstera Deliciosa', unit_price_snapshot: 28000, cantidad: 1 }
      ]}
    }
  })

  // buyer9 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer9.id, seller_id: 9, total: 57000, estado: 'en_preparacion', payment_id: 1012, created_at: orderDate(),
      items: { create: [
        { product_id: 98,  product_name_snapshot: 'Loto Sagrado', unit_price_snapshot: 32000, cantidad: 1 },
        { product_id: 100, product_name_snapshot: 'Kit Terrario', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer9.id, seller_id: 3, total: 27000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 28, product_name_snapshot: 'Cactus San Pedro', unit_price_snapshot: 12000, cantidad: 1 },
        { product_id: 33, product_name_snapshot: 'Agave Azul',       unit_price_snapshot: 15000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer9.id, seller_id: 6, total: 75000, estado: 'caducada', created_at: orderDate(),
      items: { create: [
        { product_id: 69, product_name_snapshot: 'Palmera Kentia', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })

  // buyer10 — 4 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 4, total: 85000, estado: 'confirmada', payment_id: 1013, created_at: orderDate(),
      items: { create: [
        { product_id: 40, product_name_snapshot: 'Philodendron Pink Princess', unit_price_snapshot: 85000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 13, total: 45000, estado: 'entregada', payment_id: 1014, created_at: orderDate(),
      items: { create: [
        { product_id: 143, product_name_snapshot: 'Ficus Lyrata', unit_price_snapshot: 45000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 6, total: 75000, estado: 'listo', payment_id: 1015, created_at: orderDate(),
      items: { create: [
        { product_id: 69, product_name_snapshot: 'Palmera Kentia', unit_price_snapshot: 75000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer10.id, seller_id: 11, total: 35000, estado: 'entregada', payment_id: 1037, created_at: orderDate(),
      items: { create: [
        { product_id: 121, product_name_snapshot: 'Orquídea Phalaenopsis', unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })

  // buyer11 — 4 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer11.id, seller_id: 14, total: 21000, estado: 'confirmada', payment_id: 1016, created_at: orderDate(),
      items: { create: [
        { product_id: 154, product_name_snapshot: 'Menta Peperita',       unit_price_snapshot: 4500, cantidad: 2 },
        { product_id: 163, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 155, product_name_snapshot: 'Manzanilla',           unit_price_snapshot: 4000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer11.id, seller_id: 19, total: 33000, estado: 'entregada', payment_id: 1017, created_at: orderDate(),
      items: { create: [
        { product_id: 216, product_name_snapshot: 'String of Pearls', unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 217, product_name_snapshot: 'Hoya Carnosa',     unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer11.id, seller_id: 3, total: 23000, estado: 'en_preparacion', payment_id: 1038, created_at: orderDate(),
      items: { create: [
        { product_id: 30, product_name_snapshot: 'Aloe Vera',      unit_price_snapshot: 9000, cantidad: 1 },
        { product_id: 31, product_name_snapshot: 'Sedum Burro',    unit_price_snapshot: 6000, cantidad: 1 },
        { product_id: 32, product_name_snapshot: 'Gymnocalycium',  unit_price_snapshot: 8000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer11.id, seller_id: 8, total: 36000, estado: 'confirmada', payment_id: 1039, created_at: orderDate(),
      items: { create: [
        { product_id: 89, product_name_snapshot: 'Maceta Artesanal', unit_price_snapshot: 18000, cantidad: 2 }
      ]}
    }
  })

  // buyer12 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer12.id, seller_id: 16, total: 73000, estado: 'listo', payment_id: 1018, created_at: orderDate(),
      items: { create: [
        { product_id: 177, product_name_snapshot: 'Olivo en Maceta',      unit_price_snapshot: 65000, cantidad: 1 },
        { product_id: 178, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer12.id, seller_id: 2, total: 11000, estado: 'caducada', created_at: orderDate(),
      items: { create: [
        { product_id: 21, product_name_snapshot: 'Menta',    unit_price_snapshot: 4000, cantidad: 1 },
        { product_id: 22, product_name_snapshot: 'Albahaca', unit_price_snapshot: 3500, cantidad: 1 },
        { product_id: 23, product_name_snapshot: 'Perejil',  unit_price_snapshot: 3000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer12.id, seller_id: 17, total: 28000, estado: 'entregada', payment_id: 1040, created_at: orderDate(),
      items: { create: [
        { product_id: 187, product_name_snapshot: 'Helecho Cuerno de Alce', unit_price_snapshot: 28000, cantidad: 1 }
      ]}
    }
  })

  // buyer13 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer13.id, seller_id: 18, total: 60000, estado: 'en_preparacion', payment_id: 1019, created_at: orderDate(),
      items: { create: [
        { product_id: 199, product_name_snapshot: 'Cactus Totem',  unit_price_snapshot: 35000, cantidad: 1 },
        { product_id: 201, product_name_snapshot: 'Cactus Cereus', unit_price_snapshot: 25000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer13.id, seller_id: 15, total: 18000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 175, product_name_snapshot: 'Pack Regalo Suculentas', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer13.id, seller_id: 5, total: 26000, estado: 'listo', payment_id: 1041, created_at: orderDate(),
      items: { create: [
        { product_id: 49, product_name_snapshot: 'Kit Huerta Inicial', unit_price_snapshot: 18000, cantidad: 1 },
        { product_id: 55, product_name_snapshot: 'Pimiento',           unit_price_snapshot: 4000,  cantidad: 1 },
        { product_id: 56, product_name_snapshot: 'Berenjena',          unit_price_snapshot: 4000,  cantidad: 1 }
      ]}
    }
  })

  // buyer14 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer14.id, seller_id: 20, total: 90000, estado: 'confirmada', payment_id: 1020, created_at: orderDate(),
      items: { create: [
        { product_id: 224, product_name_snapshot: 'Strelitzia Nicolai', unit_price_snapshot: 55000, cantidad: 1 },
        { product_id: 226, product_name_snapshot: 'Frangipanier',       unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer14.id, seller_id: 17, total: 46000, estado: 'entregada', payment_id: 1021, created_at: orderDate(),
      items: { create: [
        { product_id: 187, product_name_snapshot: 'Helecho Cuerno de Alce', unit_price_snapshot: 28000, cantidad: 1 },
        { product_id: 190, product_name_snapshot: 'Helecho Nido de Pájaro', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer14.id, seller_id: 4, total: 85000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 40, product_name_snapshot: 'Philodendron Pink Princess', unit_price_snapshot: 85000, cantidad: 1 }
      ]}
    }
  })

  // buyer15 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer15.id, seller_id: 6, total: 110000, estado: 'listo', payment_id: 1022, created_at: orderDate(),
      items: { create: [
        { product_id: 69, product_name_snapshot: 'Palmera Kentia', unit_price_snapshot: 75000, cantidad: 1 },
        { product_id: 70, product_name_snapshot: 'Strelitzia',     unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer15.id, seller_id: 4, total: 65000, estado: 'confirmada', payment_id: 1023, created_at: orderDate(),
      items: { create: [
        { product_id: 43, product_name_snapshot: 'Anthurium Clarinervium', unit_price_snapshot: 65000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer15.id, seller_id: 13, total: 75000, estado: 'entregada', payment_id: 1042, created_at: orderDate(),
      items: { create: [
        { product_id: 143, product_name_snapshot: 'Ficus Lyrata',       unit_price_snapshot: 45000, cantidad: 1 },
        { product_id: 150, product_name_snapshot: 'Alocasia Amazonica', unit_price_snapshot: 30000, cantidad: 1 }
      ]}
    }
  })

  // buyer16 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer16.id, seller_id: 11, total: 71000, estado: 'en_preparacion', payment_id: 1024, created_at: orderDate(),
      items: { create: [
        { product_id: 125, product_name_snapshot: 'Orquídea Vanda',             unit_price_snapshot: 65000, cantidad: 1 },
        { product_id: 128, product_name_snapshot: 'Fertilizante para Orquídeas', unit_price_snapshot: 6000,  cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer16.id, seller_id: 13, total: 30000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 150, product_name_snapshot: 'Alocasia Amazonica', unit_price_snapshot: 30000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer16.id, seller_id: 20, total: 75000, estado: 'en_preparacion', payment_id: 1043, created_at: orderDate(),
      items: { create: [
        { product_id: 220, product_name_snapshot: 'Heliconia',  unit_price_snapshot: 40000, cantidad: 1 },
        { product_id: 226, product_name_snapshot: 'Frangipanier', unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })

  // buyer17 — 2 órdenes (suspendido)
  await prisma.order.create({
    data: {
      buyer_id: buyer17.id, seller_id: 3, total: 14000, estado: 'caducada', created_at: orderDate(),
      items: { create: [
        { product_id: 32, product_name_snapshot: 'Gymnocalycium', unit_price_snapshot: 8000, cantidad: 1 },
        { product_id: 31, product_name_snapshot: 'Sedum Burro',   unit_price_snapshot: 6000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer17.id, seller_id: 14, total: 8000, estado: 'caducada', created_at: orderDate(),
      items: { create: [
        { product_id: 163, product_name_snapshot: 'Lavanda Angustifolia', unit_price_snapshot: 8000, cantidad: 1 }
      ]}
    }
  })

  // buyer18 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer18.id, seller_id: 20, total: 40000, estado: 'entregada', payment_id: 1025, created_at: orderDate(),
      items: { create: [
        { product_id: 220, product_name_snapshot: 'Heliconia', unit_price_snapshot: 40000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer18.id, seller_id: 9, total: 35000, estado: 'confirmada', payment_id: 1026, created_at: orderDate(),
      items: { create: [
        { product_id: 104, product_name_snapshot: 'Terrario Vidrio 30cm', unit_price_snapshot: 35000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer18.id, seller_id: 7, total: 37000, estado: 'listo', payment_id: 1044, created_at: orderDate(),
      items: { create: [
        { product_id: 75, product_name_snapshot: 'Rosa Roja',  unit_price_snapshot: 15000, cantidad: 1 },
        { product_id: 76, product_name_snapshot: 'Hortensia',  unit_price_snapshot: 22000, cantidad: 1 }
      ]}
    }
  })

  // buyer19 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer19.id, seller_id: 8, total: 108000, estado: 'listo', payment_id: 1027, created_at: orderDate(),
      items: { create: [
        { product_id: 92, product_name_snapshot: 'Bonsai Pino',      unit_price_snapshot: 90000, cantidad: 1 },
        { product_id: 89, product_name_snapshot: 'Maceta Artesanal', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer19.id, seller_id: 16, total: 65000, estado: 'confirmada', payment_id: 1028, created_at: orderDate(),
      items: { create: [
        { product_id: 177, product_name_snapshot: 'Olivo en Maceta', unit_price_snapshot: 65000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer19.id, seller_id: 12, total: 18000, estado: 'pendiente', created_at: orderDate(),
      items: { create: [
        { product_id: 132, product_name_snapshot: 'Notro', unit_price_snapshot: 18000, cantidad: 1 }
      ]}
    }
  })

  // buyer20 — 3 órdenes
  await prisma.order.create({
    data: {
      buyer_id: buyer20.id, seller_id: 17, total: 50000, estado: 'en_preparacion', payment_id: 1029, created_at: orderDate(),
      items: { create: [
        { product_id: 197, product_name_snapshot: 'Phlebodium Aureum', unit_price_snapshot: 16000, cantidad: 1 },
        { product_id: 193, product_name_snapshot: 'Adiantum',          unit_price_snapshot: 14000, cantidad: 1 },
        { product_id: 191, product_name_snapshot: 'Aspidistra',        unit_price_snapshot: 20000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer20.id, seller_id: 5, total: 13000, estado: 'entregada', payment_id: 1030, created_at: orderDate(),
      items: { create: [
        { product_id: 57, product_name_snapshot: 'Frutilla',  unit_price_snapshot: 5000, cantidad: 1 },
        { product_id: 55, product_name_snapshot: 'Pimiento',  unit_price_snapshot: 4000, cantidad: 1 },
        { product_id: 56, product_name_snapshot: 'Berenjena', unit_price_snapshot: 4000, cantidad: 1 }
      ]}
    }
  })
  await prisma.order.create({
    data: {
      buyer_id: buyer20.id, seller_id: 3, total: 27000, estado: 'listo', payment_id: 1045, created_at: orderDate(),
      items: { create: [
        { product_id: 28, product_name_snapshot: 'Cactus San Pedro', unit_price_snapshot: 12000, cantidad: 1 },
        { product_id: 33, product_name_snapshot: 'Agave Azul',       unit_price_snapshot: 15000, cantidad: 1 }
      ]}
    }
  })

  console.log('📦 ' + await prisma.order.count() + ' órdenes creadas con fechas distribuidas')

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
      { buyer_id: buyer1.id,  product_id: 39,  seller_id: 4,  created_at: favoriteDate() },
      { buyer_id: buyer1.id,  product_id: 88,  seller_id: 8,  created_at: favoriteDate() },
      { buyer_id: buyer1.id,  product_id: 1,   seller_id: 1,  created_at: favoriteDate() },
      { buyer_id: buyer2.id,  product_id: 40,  seller_id: 4,  created_at: favoriteDate() },
      { buyer_id: buyer2.id,  product_id: 63,  seller_id: 6,  created_at: favoriteDate() },
      { buyer_id: buyer2.id,  product_id: 224, seller_id: 20, created_at: favoriteDate() },
      { buyer_id: buyer6.id,  product_id: 121, seller_id: 11, created_at: favoriteDate() },
      { buyer_id: buyer6.id,  product_id: 143, seller_id: 13, created_at: favoriteDate() },
      { buyer_id: buyer6.id,  product_id: 100, seller_id: 9,  created_at: favoriteDate() },
      { buyer_id: buyer7.id,  product_id: 75,  seller_id: 7,  created_at: favoriteDate() },
      { buyer_id: buyer7.id,  product_id: 224, seller_id: 20, created_at: favoriteDate() },
      { buyer_id: buyer8.id,  product_id: 167, seller_id: 15, created_at: favoriteDate() },
      { buyer_id: buyer8.id,  product_id: 1,   seller_id: 1,  created_at: favoriteDate() },
      { buyer_id: buyer9.id,  product_id: 98,  seller_id: 9,  created_at: favoriteDate() },
      { buyer_id: buyer9.id,  product_id: 69,  seller_id: 6,  created_at: favoriteDate() },
      { buyer_id: buyer10.id, product_id: 40,  seller_id: 4,  created_at: favoriteDate() },
      { buyer_id: buyer10.id, product_id: 69,  seller_id: 6,  created_at: favoriteDate() },
      { buyer_id: buyer10.id, product_id: 121, seller_id: 11, created_at: favoriteDate() },
      { buyer_id: buyer11.id, product_id: 216, seller_id: 19, created_at: favoriteDate() },
      { buyer_id: buyer11.id, product_id: 154, seller_id: 14, created_at: favoriteDate() },
      { buyer_id: buyer11.id, product_id: 89,  seller_id: 8,  created_at: favoriteDate() },
      { buyer_id: buyer12.id, product_id: 177, seller_id: 16, created_at: favoriteDate() },
      { buyer_id: buyer12.id, product_id: 187, seller_id: 17, created_at: favoriteDate() },
      { buyer_id: buyer13.id, product_id: 199, seller_id: 18, created_at: favoriteDate() },
      { buyer_id: buyer13.id, product_id: 49,  seller_id: 5,  created_at: favoriteDate() },
      { buyer_id: buyer14.id, product_id: 224, seller_id: 20, created_at: favoriteDate() },
      { buyer_id: buyer14.id, product_id: 40,  seller_id: 4,  created_at: favoriteDate() },
      { buyer_id: buyer15.id, product_id: 69,  seller_id: 6,  created_at: favoriteDate() },
      { buyer_id: buyer15.id, product_id: 143, seller_id: 13, created_at: favoriteDate() },
      { buyer_id: buyer16.id, product_id: 125, seller_id: 11, created_at: favoriteDate() },
      { buyer_id: buyer16.id, product_id: 220, seller_id: 20, created_at: favoriteDate() },
      { buyer_id: buyer17.id, product_id: 163, seller_id: 14, created_at: favoriteDate() },
      { buyer_id: buyer18.id, product_id: 220, seller_id: 20, created_at: favoriteDate() },
      { buyer_id: buyer18.id, product_id: 75,  seller_id: 7,  created_at: favoriteDate() },
      { buyer_id: buyer19.id, product_id: 92,  seller_id: 8,  created_at: favoriteDate() },
      { buyer_id: buyer19.id, product_id: 177, seller_id: 16, created_at: favoriteDate() },
      { buyer_id: buyer20.id, product_id: 197, seller_id: 17, created_at: favoriteDate() },
      { buyer_id: buyer20.id, product_id: 28,  seller_id: 3,  created_at: favoriteDate() },
    ]
  })

  console.log('❤️  37 favoritos creados con fechas distribuidas')

  // ── Foro: hilos y respuestas ──────────────────────────────────────────────

  // ── Hilo 1: Monstera ──
  const thread1 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer1.id,
      titulo: '¿Cada cuánto hay que regar una Monstera Deliciosa?',
      contenido: 'Compré mi primera Monstera hace un mes y no sé bien cada cuánto regarla. A veces la tierra parece seca pero no quiero pasarme. ¿Alguien tiene experiencia con esta planta?',
      planta_tag: 'Monstera',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread1.id, buyer_id: buyer2.id,  contenido: 'Yo riego la mía cada 10 días en verano y cada 15 en invierno. Lo clave es meter el dedo en la tierra: si los primeros 3 cm están secos, es hora de regar.', created_at: replyDate() },
      { thread_id: thread1.id, buyer_id: buyer10.id, contenido: 'Totalmente de acuerdo con Carlos. Además fijate que el agua escurra bien por los agujeros de la maceta, no conviene que quede encharcada.', created_at: replyDate() },
      { thread_id: thread1.id, buyer_id: buyer6.id,  contenido: 'Una vez por semana en primavera y verano me funciona perfecto. En invierno la reduzco bastante. Y siempre con agua a temperatura ambiente.', created_at: replyDate() },
      { thread_id: thread1.id, buyer_id: buyer15.id, contenido: 'Además del riego, la Monstera necesita buena humedad ambiental. Podés poner un plato con piedras y agua debajo de la maceta sin que el agua toque la tierra.', created_at: replyDate() },
    ]
  })

  // ── Hilo 2: Sustrato para suculentas ──
  const thread2 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer9.id,
      titulo: '¿Cuál es el mejor sustrato para suculentas y cactus?',
      contenido: 'Estoy armando una colección de suculentas y quiero saber qué sustrato usan. Vi que algunos mezclan tierra con perlita pero no sé las proporciones exactas.',
      planta_tag: 'Suculentas',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread2.id, buyer_id: buyer12.id, contenido: 'Yo uso 50% tierra para plantas + 50% perlita y me va bárbaro. El drenaje es clave para que no se pudran las raíces.', created_at: replyDate() },
      { thread_id: thread2.id, buyer_id: buyer15.id, contenido: 'En viveros especializados venden sustrato específico para cactus y suculentas que ya viene listo. Vale un poco más pero ahorra el trabajo de mezclar.', created_at: replyDate() },
      { thread_id: thread2.id, buyer_id: buyer8.id,  contenido: 'Yo hago 60% perlita, 30% tierra y 10% arena de río. Desde que uso esa mezcla mis suculentas no tuvieron más problemas de raíces.', created_at: replyDate() },
      { thread_id: thread2.id, buyer_id: buyer19.id, contenido: 'Agreguen también un poco de carbón activado en el fondo de la maceta antes del sustrato. Ayuda a evitar hongos y mantiene el sustrato fresco más tiempo.', created_at: replyDate() },
    ]
  })

  // ── Hilo 3: Orquídea Phalaenopsis ──
  const thread3 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer6.id,
      titulo: 'Tips para mantener una Orquídea Phalaenopsis en flor más tiempo',
      contenido: 'Compré una Orquídea Phalaenopsis que vino con flores hermosas pero ya se me cayeron todas. ¿Cómo hago para que vuelva a florecer? ¿Hay algún truco?',
      planta_tag: 'Orquídea',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread3.id, buyer_id: buyer16.id, contenido: 'Las orquídeas necesitan un cambio de temperatura entre el día y la noche para reflorecer. Poné la maceta cerca de una ventana donde reciba luz indirecta.', created_at: replyDate() },
      { thread_id: thread3.id, buyer_id: buyer14.id, contenido: 'Usá fertilizante específico para orquídeas en floración, diluido a la mitad de lo que dice el envase. Una vez por mes en el período de crecimiento es suficiente.', created_at: replyDate() },
      { thread_id: thread3.id, buyer_id: buyer11.id, contenido: 'Cuando se caen las flores no cortés el tallo entero. Cortalo justo por encima de un nudo y muchas veces rebrota desde ahí. A mí me funcionó varias veces.', created_at: replyDate() },
    ]
  })

  // ── Hilo 4: Abono para cactus ──
  const thread4 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer13.id,
      titulo: '¿Los cactus necesitan abono? ¿Cuál recomiendan?',
      contenido: 'Tengo varios cactus columnares y globosos y nunca les puse abono. Un amigo me dijo que en primavera conviene fertilizarlos pero no sé qué producto usar ni cada cuánto.',
      planta_tag: 'Cactus',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread4.id, buyer_id: buyer19.id, contenido: 'Sí conviene abonarlos en primavera y verano que es cuando están en crecimiento activo. Yo uso un fertilizante bajo en nitrógeno (tipo 5-10-10) una vez al mes.', created_at: replyDate() },
      { thread_id: thread4.id, buyer_id: buyer20.id, contenido: 'Los fertilizantes específicos para cactus que venden en viveros son los más seguros. Tienen la proporción de nutrientes ideal para estas plantas.', created_at: replyDate() },
      { thread_id: thread4.id, buyer_id: buyer9.id,  contenido: 'Importante: nunca abones un cactus que esté en reposo invernal o recién trasplantado. Esperá al menos un mes después de cambiarlo de maceta.', created_at: replyDate() },
    ]
  })

  // ── Hilo 5: Pothos vs Philodendron ──
  const thread5 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer11.id,
      titulo: 'Pothos vs Philodendron: ¿cuál recomiendan para principiantes?',
      contenido: 'Quiero empezar mi colección de plantas de interior y estoy dudando entre Pothos y Philodendron. ¿Cuál es más fácil de mantener? ¿Cuál crece más rápido?',
      planta_tag: 'Interior',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread5.id, buyer_id: buyer1.id,  contenido: 'Ambas son ideales para principiantes pero el Pothos le gana en resistencia. Aguanta más el olvido de riego, tolera menos luz y crece rapidísimo.', created_at: replyDate() },
      { thread_id: thread5.id, buyer_id: buyer8.id,  contenido: 'El Philodendron Scandens es igual de fácil que el Pothos y tiene un verde más intenso. Yo tengo los dos y la verdad es que no noto gran diferencia en el cuidado.', created_at: replyDate() },
      { thread_id: thread5.id, buyer_id: buyer18.id, contenido: 'Yo empecé con Pothos dorado y fue la mejor decisión. En seis meses lo tengo colgando por toda la estantería. Le doy agua cada 10 días y no le presto mucha más atención.', created_at: replyDate() },
    ]
  })

  // ── Hilo 6: Calathea ──
  const thread6 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer20.id,
      titulo: 'Mi Calathea mueve las hojas de noche, ¿es normal?',
      contenido: 'Tengo una Calathea Orbifolia y noté que durante el día tiene las hojas caídas y de noche las levanta. Pensé que estaba enferma pero sigue verde y con buen aspecto.',
      planta_tag: 'Calathea',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread6.id, buyer_id: buyer2.id,  contenido: '¡Es completamente normal! Las Calatheas son conocidas como "plantas que rezan" justo por eso. Siguen la luz del sol durante el día y se cierran de noche.', created_at: replyDate() },
      { thread_id: thread6.id, buyer_id: buyer10.id, contenido: 'Sí, es uno de los fenómenos más lindos de las Calatheas. Se llama nictinastia, un movimiento en respuesta a los cambios de luz. Si las hojas se mueven significa que la planta está sana.', created_at: replyDate() },
      { thread_id: thread6.id, buyer_id: buyer11.id, contenido: 'Asegurate de mantener la humedad alta, las Calatheas aman la humedad. Un humidificador cerca o una bandeja con agua y piedras la van a mantener feliz.', created_at: replyDate() },
    ]
  })

  // ── Hilo 7: Propagar Lavanda ──
  const thread7 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer7.id,
      titulo: '¿Cómo propagar una Lavanda en casa?',
      contenido: 'Tengo una Lavanda que está enorme y quiero sacarle esquejes para regalar. ¿Cuál es la mejor época para hacerlo y qué método funciona mejor?',
      planta_tag: 'Lavanda',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread7.id, buyer_id: buyer14.id, contenido: 'La primavera es la mejor época. Cortá un esqueje de tallo semileñoso de unos 10 cm, sacale las hojas de abajo y ponelo en sustrato húmedo. En 3-4 semanas debería tener raíces.', created_at: replyDate() },
      { thread_id: thread7.id, buyer_id: buyer12.id, contenido: 'Yo usé hormona enraizante en polvo y me fue muy bien. Mojás la base del esqueje, lo pasás por la hormona y lo plantás. Acelera mucho el proceso.', created_at: replyDate() },
      { thread_id: thread7.id, buyer_id: buyer18.id, contenido: 'También podés probar en agua. Ponés el esqueje en un vasito con agua y cuando salen raíces de 2-3 cm lo trasplantás a tierra. Tarda un poco más pero podés ver el proceso completo.', created_at: replyDate() },
    ]
  })

  // ── Hilo 8: Ficus Lyrata (nuevo) ──
  const thread8 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer15.id,
      titulo: '¿Por qué mi Ficus Lyrata tiene manchas marrones en las hojas?',
      contenido: 'Compré un Ficus Lyrata hace dos meses y noté que están apareciendo manchas marrones en los bordes de las hojas. Lo riego una vez por semana y tiene luz indirecta. ¿Qué puede estar pasando?',
      planta_tag: 'Ficus',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread8.id, buyer_id: buyer10.id, contenido: 'Las manchas marrones en los bordes suelen ser por falta de humedad ambiental. Los Ficus Lyrata son tropicales y necesitan humedad. Probá con un humidificador cerca.', created_at: replyDate() },
      { thread_id: thread8.id, buyer_id: buyer1.id,  contenido: 'También puede ser exceso de riego. Dejá que la tierra se seque entre riegos. Meté el dedo unos 5 cm: si está húmedo, esperá unos días más antes de regar.', created_at: replyDate() },
      { thread_id: thread8.id, buyer_id: buyer6.id,  contenido: 'Fijate que no le dé el sol directo en ningún momento del día. Aunque sea luz indirecta, si recibe sol directo en algún momento quema las hojas. Y limpiá las hojas con un paño húmedo cada tanto.', created_at: replyDate() },
      { thread_id: thread8.id, buyer_id: buyer16.id, contenido: 'Otra causa posible: el agua de la canilla tiene mucho cloro. Dejá reposar el agua 24 horas antes de regar o usá agua filtrada. Mis Ficus mejoraron mucho con ese cambio.', created_at: replyDate() },
    ]
  })

  // ── Hilo 9: Helechos (nuevo) ──
  const thread9 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer14.id,
      titulo: '¿Cómo revivir un helecho que se está secando?',
      contenido: 'Mi helecho cuerno de alce empezó a ponerse amarillo y las hojas más viejas están completamente secas. Lo tengo en un baño con luz natural pero parece que no está feliz.',
      planta_tag: 'Helecho',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread9.id, buyer_id: buyer8.id,  contenido: 'Los helechos aman la humedad constante. Si está en un baño debería estar bien, pero quizás necesita más riego. Regalo cada 2-3 días manteniendo la tierra siempre húmeda pero no encharcada.', created_at: replyDate() },
      { thread_id: thread9.id, buyer_id: buyer18.id, contenido: 'Cortá todas las hojas secas y amarillas para que la planta concentre energía en las hojas sanas. También revisá que no tenga corrientes de aire frío, los helechos las odian.', created_at: replyDate() },
      { thread_id: thread9.id, buyer_id: buyer20.id, contenido: 'Pulverizá las hojas con agua todos los días. Los helechos absorben mucha agua por las hojas además de las raíces. Con buena humedad ambiental y riego frecuente se recuperan rápido.', created_at: replyDate() },
    ]
  })

  // ── Hilo 10: Maceta y drenaje (nuevo) ──
  const thread10 = await prisma.forumThread.create({
    data: {
      buyer_id: buyer19.id,
      titulo: '¿Es obligatorio poner piedras en el fondo de la maceta?',
      contenido: 'Siempre vi que ponen piedras o perlita en el fondo de las macetas para el drenaje. ¿Es realmente necesario? ¿O hay casos donde no conviene hacerlo?',
      planta_tag: 'Macetas',
      created_at: threadDate()
    }
  })

  await prisma.forumReply.createMany({
    data: [
      { thread_id: thread10.id, buyer_id: buyer12.id, contenido: 'No solo no es obligatorio, sino que los expertos ya no lo recomiendan. Las piedras en el fondo pueden elevar el nivel del agua y encharcar las raíces. Mejor usar un buen sustrato con perlita mezclada.', created_at: replyDate() },
      { thread_id: thread10.id, buyer_id: buyer9.id,  contenido: 'Coincido. La clave no son las piedras sino que la maceta tenga agujeros de drenaje y un sustrato aireado. Las piedras ocupan espacio que podrían usar las raíces.', created_at: replyDate() },
      { thread_id: thread10.id, buyer_id: buyer13.id, contenido: 'Yo dejé de usar piedras después de que un viverista me explicó que crean una "mesa de agua" donde se acumula la humedad justo donde están las raíces. Desde que uso solo sustrato con perlita mis plantas mejoraron.', created_at: replyDate() },
    ]
  })

  console.log('💬 Foro: 10 hilos y 33 respuestas creados con fechas distribuidas')

  // ── Likes en respuestas del foro ──
  // Obtenemos todas las respuestas para asignar likes
  const allReplies = await prisma.forumReply.findMany({ orderBy: { id: 'asc' } })

  const likesData: { reply_id: number; buyer_id: number; created_at: Date }[] = [
    // Hilo 1 — Monstera
    { reply_id: allReplies[0].id, buyer_id: buyer6.id,  created_at: likeDate() },
    { reply_id: allReplies[0].id, buyer_id: buyer10.id, created_at: likeDate() },
    { reply_id: allReplies[1].id, buyer_id: buyer1.id,  created_at: likeDate() },
    { reply_id: allReplies[2].id, buyer_id: buyer2.id,  created_at: likeDate() },
    { reply_id: allReplies[2].id, buyer_id: buyer10.id, created_at: likeDate() },
    { reply_id: allReplies[3].id, buyer_id: buyer1.id,  created_at: likeDate() },

    // Hilo 2 — Sustrato
    { reply_id: allReplies[4].id, buyer_id: buyer8.id,  created_at: likeDate() },
    { reply_id: allReplies[4].id, buyer_id: buyer15.id, created_at: likeDate() },
    { reply_id: allReplies[5].id, buyer_id: buyer12.id, created_at: likeDate() },
    { reply_id: allReplies[6].id, buyer_id: buyer9.id,  created_at: likeDate() },
    { reply_id: allReplies[6].id, buyer_id: buyer19.id, created_at: likeDate() },
    { reply_id: allReplies[7].id, buyer_id: buyer12.id, created_at: likeDate() },

    // Hilo 3 — Orquídea
    { reply_id: allReplies[8].id, buyer_id: buyer11.id, created_at: likeDate() },
    { reply_id: allReplies[8].id, buyer_id: buyer14.id, created_at: likeDate() },
    { reply_id: allReplies[9].id, buyer_id: buyer6.id,  created_at: likeDate() },
    { reply_id: allReplies[10].id, buyer_id: buyer16.id, created_at: likeDate() },

    // Hilo 4 — Cactus
    { reply_id: allReplies[11].id, buyer_id: buyer20.id, created_at: likeDate() },
    { reply_id: allReplies[11].id, buyer_id: buyer13.id, created_at: likeDate() },
    { reply_id: allReplies[12].id, buyer_id: buyer19.id, created_at: likeDate() },
    { reply_id: allReplies[13].id, buyer_id: buyer13.id, created_at: likeDate() },

    // Hilo 5 — Pothos vs Philodendron
    { reply_id: allReplies[14].id, buyer_id: buyer8.id,  created_at: likeDate() },
    { reply_id: allReplies[14].id, buyer_id: buyer18.id, created_at: likeDate() },
    { reply_id: allReplies[15].id, buyer_id: buyer11.id, created_at: likeDate() },
    { reply_id: allReplies[16].id, buyer_id: buyer1.id,  created_at: likeDate() },

    // Hilo 6 — Calathea
    { reply_id: allReplies[17].id, buyer_id: buyer10.id, created_at: likeDate() },
    { reply_id: allReplies[17].id, buyer_id: buyer20.id, created_at: likeDate() },
    { reply_id: allReplies[18].id, buyer_id: buyer2.id,  created_at: likeDate() },
    { reply_id: allReplies[19].id, buyer_id: buyer20.id, created_at: likeDate() },

    // Hilo 7 — Lavanda
    { reply_id: allReplies[20].id, buyer_id: buyer12.id, created_at: likeDate() },
    { reply_id: allReplies[20].id, buyer_id: buyer7.id,  created_at: likeDate() },
    { reply_id: allReplies[21].id, buyer_id: buyer14.id, created_at: likeDate() },
    { reply_id: allReplies[22].id, buyer_id: buyer7.id,  created_at: likeDate() },

    // Hilo 8 — Ficus Lyrata
    { reply_id: allReplies[23].id, buyer_id: buyer1.id,  created_at: likeDate() },
    { reply_id: allReplies[24].id, buyer_id: buyer15.id, created_at: likeDate() },
    { reply_id: allReplies[25].id, buyer_id: buyer10.id, created_at: likeDate() },
    { reply_id: allReplies[26].id, buyer_id: buyer15.id, created_at: likeDate() },

    // Hilo 9 — Helechos
    { reply_id: allReplies[27].id, buyer_id: buyer14.id, created_at: likeDate() },
    { reply_id: allReplies[27].id, buyer_id: buyer18.id, created_at: likeDate() },
    { reply_id: allReplies[28].id, buyer_id: buyer8.id,  created_at: likeDate() },
    { reply_id: allReplies[29].id, buyer_id: buyer14.id, created_at: likeDate() },

    // Hilo 10 — Macetas
    { reply_id: allReplies[30].id, buyer_id: buyer9.id,  created_at: likeDate() },
    { reply_id: allReplies[30].id, buyer_id: buyer19.id, created_at: likeDate() },
    { reply_id: allReplies[31].id, buyer_id: buyer12.id, created_at: likeDate() },
    { reply_id: allReplies[32].id, buyer_id: buyer19.id, created_at: likeDate() },
  ]

  await prisma.forumReplyLike.createMany({ data: likesData })

  console.log('👍 44 likes en respuestas creados con fechas distribuidas')
  console.log('')
  console.log('✅ Seed completado exitosamente')
  console.log('')
  console.log('👤 Usuarios de prueba:')
  console.log('   buyer@brotes.com        → comprador activo (4 órdenes, carrito)')
  console.log('   ambos@brotes.com        → comprador activo (4 órdenes)')
  console.log('   suspendido@brotes.com   → cuenta suspendida (2 órdenes caducadas)')
  console.log('   admin@brotes.com        → administrador (2 órdenes)')
  console.log('   eliminado@brotes.com    → cuenta eliminada')
  console.log('   valentina@brotes.com    → compradora activa (3 órdenes)')
  console.log('   ignacio@brotes.com      → comprador activo (3 órdenes)')
  console.log('   sofia@brotes.com        → compradora activa (3 órdenes)')
  console.log('   matias@brotes.com       → comprador activo (3 órdenes)')
  console.log('   lucia@brotes.com        → compradora activa (4 órdenes)')
  console.log('   tomas@brotes.com        → comprador activo (4 órdenes)')
  console.log('   camila@brotes.com       → compradora activa (3 órdenes)')
  console.log('   nicolas@brotes.com      → comprador activo (3 órdenes)')
  console.log('   martina@brotes.com      → compradora activa (3 órdenes)')
  console.log('   ezequiel@brotes.com     → comprador activo (3 órdenes)')
  console.log('   florencia@brotes.com    → compradora activa (3 órdenes)')
  console.log('   rodrigo@brotes.com      → cuenta suspendida (2 órdenes caducadas)')
  console.log('   agustina@brotes.com     → compradora activa (3 órdenes)')
  console.log('   leandro@brotes.com      → comprador activo (3 órdenes)')
  console.log('   julieta@brotes.com      → compradora activa (3 órdenes)')
  console.log('   facundo@brotes.com      → comprador histórico (3 órdenes, 2025)')
  console.log('   emilia@brotes.com       → compradora histórica (3 órdenes, 2025)')
  console.log('   benjamin@brotes.com     → comprador histórico (3 órdenes, 2025)')
  console.log('   victoria@brotes.com     → cuenta suspendida (2 órdenes)')
  console.log('   santiago@brotes.com     → comprador histórico (3 órdenes, 2025)')
  console.log('   catalina@brotes.com     → cuenta eliminada (1 orden)')
  console.log('   maximiliano@brotes.com  → comprador histórico (3 órdenes, 2025)')
  console.log('   antonella@brotes.com    → compradora histórica (3 órdenes, 2025)')
  console.log('   joaquin@brotes.com      → cuenta suspendida (2 órdenes)')
  console.log('   valeria@brotes.com      → compradora histórica (3 órdenes, 2025)')
  console.log('')
  console.log('💬 Foro:')
  console.log('   10 hilos de debate con 33 respuestas y 44 likes entre usuarios')
  console.log('')
  console.log('📊 Fechas distribuidas desde febrero 2025 hasta junio 2026')
}

main()
  .catch(e => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })