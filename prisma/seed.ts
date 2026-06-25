/**
 *
 * Carga los 4 usuarios de prueba del README (admin, comprador activo,
 * suspendido y eliminado) con ids fijos (1-4) más dos compradores "de
 * fondo" (ids 5-6) para el foro y para una orden adicional. Los ids de
 * Buyer y Order se fijan explícitamente porque se referencian desde los
 * otros dos seeds (Seller.IncomingOrder y Payments.Payment).
 *
 * CÓMO CORRERLO
 *   1) Corré primero el seed de la Seller App.
 *   2) Completá CLERK_IDS con los Clerk User IDs reales (tienen que
 *      coincidir con los que uses en el dashboard de Clerk de esta app, y
 *      con los mismos valores usados en BUYER_REFS del seed de Seller).
 *   3) npx prisma db seed
 *
 * IMPORTANTE
 *   - El import de `prisma` de más abajo asume que ya tenés un singleton
 *     de PrismaClient configurado en otro archivo de tu app (porque el
 *     schema usa `previewFeatures = ["driverAdapters"]`, lo que implica
 *     que en algún lado ya le pasan un adapter de Neon/pg/etc). Ajustá el
 *     path. Si no existe tal archivo, usá el bloque comentado de abajo.
 *   - `Order.estado` usa los mismos valores que el enum
 *     `IncomingOrderStatus` de la Seller App (pendiente, recibida,
 *     en_preparacion, listo, entregada), asumiendo que ese estado se
 *     sincroniza entre ambas apps.
 *   - `Order.payment_id` queda en `null`: es `Int?` en este schema pero
 *     `Payment.id` en la Payments App es `String` (cuid), son tipos
 *     incompatibles — convendría revisar ese campo en el schema real.
 */

// --- Opción A (recomendada): reusar el singleton que ya tiene tu app ---
import { prisma } from "../app/lib/prisma"; // <-- AJUSTAR ESTE PATH

// --- Opción B (fallback si todavía no existe ese archivo) ---
// import { PrismaClient } from "@prisma/client";
// // Completar con el adapter que corresponda, ej:
// // import { PrismaNeon } from "@prisma/adapter-neon";
// // const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
// const prisma = new PrismaClient(/* { adapter } */);

const CLERK_IDS = {
  admin: "user_3EXak8DtO4KtYtF3kP9WXaRluQU",
  activo: "user_3EXaprWcBdQ9Yw6s2dSY5uU35Zk",
  suspendido: "user_3EXb8dMLs69yOQdCbMj9ix6T5tc",
  eliminado: "user_3EXbEfdzMAm4pepxqysxfJl8n9P",
};

async function limpiarDatosPrevios() {
  await prisma.accountNotification.deleteMany();
  await prisma.forumReplyLike.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.buyer.deleteMany();
}

async function sincronizarSecuencias() {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Buyer"', 'id'), (SELECT MAX(id) FROM "Buyer"))`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Order"', 'id'), (SELECT MAX(id) FROM "Order"))`
  );
}

async function crearBuyers() {
  await prisma.buyer.create({
    data: {
      id: 1,
      clerk_user_id: CLERK_IDS.admin,
      nombre: "Admin Brotes",
      email: "admin+clerk_test@iaw.com",
      direccion: "Av. Colón 80, Bahía Blanca",
      estado: "activo",
    },
  });

  await prisma.buyer.create({
    data: {
      id: 2,
      clerk_user_id: CLERK_IDS.activo,
      nombre: "Lucía Fernández",
      email: "buyer+clerk_test@iaw.com",
      direccion: "Estomba 450, Bahía Blanca",
      estado: "activo",
    },
  });

  await prisma.buyer.create({
    data: {
      id: 3,
      clerk_user_id: CLERK_IDS.suspendido,
      nombre: "Martín Suárez",
      email: "buyersuspendido+clerk_test@iaw.com",
      direccion: "Chiclana 120, Bahía Blanca",
      estado: "suspendido",
    },
  });

  await prisma.buyer.create({
    data: {
      id: 4,
      clerk_user_id: CLERK_IDS.eliminado,
      nombre: "Carla Gómez",
      email: "buyereliminado+clerk_test@iaw.com",
      direccion: "Zelarrayán 980, Bahía Blanca",
      estado: "eliminado",
      deleted_at: new Date(),
      delete_reason: "Incumplimiento de las normas de la comunidad",
    },
  });

  // Compradores "de fondo": no son cuentas reales de Clerk, solo dan
  // contenido al foro y una orden adicional. id=5 ("fondo1") tiene que
  // coincidir con BUYER_REFS.fondo1 del seed de Seller.
  await prisma.buyer.create({
    data: {
      id: 5,
      clerk_user_id: "seed_buyer_fondo_1",
      nombre: "Pedro Almada",
      email: "pedro.almada.seed@brotes.test",
      direccion: "Brown 230, Bahía Blanca",
      estado: "activo",
    },
  });

  await prisma.buyer.create({
    data: {
      id: 6,
      clerk_user_id: "seed_buyer_fondo_2",
      nombre: "Sofía Ibarra",
      email: "sofia.ibarra.seed@brotes.test",
      direccion: "Sarmiento 1500, Bahía Blanca",
      estado: "activo",
    },
  });
}

async function crearCartYFavoritos() {
  // Un solo vendedor por carrito (regla de negocio mencionada en el README).
  await prisma.cart.create({
    data: {
      buyer_id: 2,
      seller_id: 1,
      estado: "active",
      items: {
        create: [{ product_id: 2, cantidad: 1, precio_unitario: 4200 }],
      },
    },
  });

  await prisma.favorite.createMany({
    data: [
      { buyer_id: 2, product_id: 3, seller_id: 2 },
      { buyer_id: 2, product_id: 4, seller_id: 2 },
    ],
  });
}

async function crearOrdenes() {
  // Mismos ids/totales/estados que los IncomingOrder del seed de Seller.
  await prisma.order.create({
    data: {
      id: 1,
      seller_id: 1,
      buyer_id: 2,
      total: 7000,
      estado: "entregada",
      payment_id: null,
      items: {
        create: [
          {
            product_id: 1,
            product_name_snapshot: "Suculenta Echeveria",
            unit_price_snapshot: 3500,
            cantidad: 2,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: 2,
      seller_id: 2,
      buyer_id: 2,
      total: 8900,
      estado: "pendiente",
      payment_id: null,
      items: {
        create: [
          {
            product_id: 3,
            product_name_snapshot: "Monstera Deliciosa",
            unit_price_snapshot: 8900,
            cantidad: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: 3,
      seller_id: 1,
      buyer_id: 5,
      total: 4200,
      estado: "en_preparacion",
      payment_id: null,
      items: {
        create: [
          {
            product_id: 2,
            product_name_snapshot: "Cactus San Pedro",
            unit_price_snapshot: 4200,
            cantidad: 1,
          },
        ],
      },
    },
  });
}

async function crearForo() {
  const thread1 = await prisma.forumThread.create({
    data: {
      buyer_id: 2,
      titulo: "¿Cada cuánto riego mi suculenta en verano?",
      contenido:
        "Hace poco compré una Echeveria y no sé bien cada cuánto regarla ahora que empieza el calor. ¿Alguna recomendación?",
      planta_tag: "suculentas",
    },
  });

  const thread2 = await prisma.forumThread.create({
    data: {
      buyer_id: 5,
      titulo: "Hojas amarillas en mi Monstera",
      contenido:
        "Las hojas de abajo se me están poniendo amarillas de a una. ¿Es normal o es falta/exceso de riego?",
      planta_tag: "plantas_de_interior",
    },
  });

  const reply1 = await prisma.forumReply.create({
    data: {
      thread_id: thread1.id,
      buyer_id: 6,
      contenido:
        "Con el calor le podés dar agua una vez por semana, dejando que la tierra seque bien entre riego y riego.",
    },
  });

  const reply2 = await prisma.forumReply.create({
    data: {
      thread_id: thread1.id,
      buyer_id: 5,
      contenido:
        "Sumale que le dé bastante luz directa, las suculentas con poca luz se estiran y pudren más fácil.",
    },
  });

  const reply3 = await prisma.forumReply.create({
    data: {
      thread_id: thread2.id,
      buyer_id: 2,
      contenido:
        "Revisá el drenaje de la maceta, una hoja amarilla de tanto en tanto es normal pero varias juntas suele ser exceso de agua.",
    },
  });

  await prisma.forumReplyLike.createMany({
    data: [
      { reply_id: reply1.id, buyer_id: 2 },
      { reply_id: reply2.id, buyer_id: 6 },
      { reply_id: reply3.id, buyer_id: 5 },
    ],
  });
}

async function crearNotificaciones() {
  await prisma.accountNotification.createMany({
    data: [
      {
        buyer_id: 3,
        tipo: "suspendido",
        titulo: "Tu cuenta fue suspendida",
        mensaje:
          "Un administrador suspendió tu cuenta. Podés seguir navegando el catálogo, pero no podrás comprar ni participar del foro hasta que se reactive.",
        leida: false,
      },
      {
        buyer_id: 4,
        tipo: "eliminado",
        titulo: "Tu cuenta fue eliminada",
        mensaje:
          "Tu cuenta fue eliminada por un administrador. No podrás realizar compras ni participar del foro.",
        leida: false,
      },
      {
        buyer_id: 2,
        tipo: "reactivado",
        titulo: "Tu cuenta fue reactivada",
        mensaje:
          "Tu cuenta volvió a estar activa. Ya podés comprar y participar del foro normalmente.",
        leida: true,
      },
    ],
  });
}

async function main() {
  console.log("Borrando datos previos del seed...");
  await limpiarDatosPrevios();

  console.log("Creando buyers...");
  await crearBuyers();

  console.log("Creando carrito y favoritos...");
  await crearCartYFavoritos();

  console.log("Creando órdenes...");
  await crearOrdenes();

  console.log("Creando foro...");
  await crearForo();

  console.log("Creando notificaciones de cuenta...");
  await crearNotificaciones();

  console.log("Sincronizando secuencias de Postgres...");
  await sincronizarSecuencias();

  console.log("Seed de Buyer App completado ✅");
}

main()
  .catch((e) => {
    console.error("Error corriendo el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });