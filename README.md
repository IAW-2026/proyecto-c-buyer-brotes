#  Brotes — Buyer App

Marketplace de plantas y productos de jardinería. Esta es la aplicación del comprador, parte de un sistema compuesto por tres apps independientes (Buyer, Seller y Payments).

---

##  Deploy

**[https://proyecto-c-buyer-brotes.vercel.app/](https://proyecto-c-buyer-brotes.vercel.app/)**

---

##  Usuarios de prueba

| Email | Contraseña | Rol | Accesos |
|---|---|---|---|
| `admin+clerk_test@iaw.com` | `iawuser#` | Administrador | Acceso completo más panel de admin (`/admin`): gestión de usuarios y reporte de ventas. |
| `buyer+clerk_test@iaw.com` | `iawuser#` | Comprador activo | Acceso completo: explorar, carrito, comprar, favoritos, foro, notificaciones, perfil. |
| `buyersuspendido+clerk_test@iaw.com` | `iawuser#` | Comprador suspendido | Puede navegar y ver el catálogo, pero tiene bloqueadas las compras y la participación en el foro. |
| `buyereliminado+clerk_test@iaw.com` | `iawuser#` | Comprador eliminado | Puede iniciar sesión, pero tiene bloqueadas las compras y la participación en el foro. |

> Los usuarios suspendido y eliminado están disponibles específicamente para testear que los controles de acceso funcionan correctamente.

---

##  Instrucciones para evaluar la aplicación

### Como comprador activo (`buyer+clerktest@iaw.com`)

1. **Explorar y comprar:** Navegá a `/explorar` o entrá a cualquier vendedor desde la home. Agregá productos al carrito y confirmá la compra desde `/carrito`.
2. **Perfil:** Antes de poder comprar, el comprador necesita tener nombre y dirección cargados en `/perfil`. El usuario de prueba ya los tiene completos.
3. **Favoritos:** Desde la página de cualquier vendedor podés marcar productos con el ícono de corazón. Se listan en `/favoritos`.
4. **Pedidos:** El historial de compras y el seguimiento de estado están en `/pedidos`.
5. **Foro:** En `/foro` podés crear debates y responder a otros. Las respuestas soportan likes.
6. **Notificaciones:** En `/notificaciones` se listan los cambios de estado de pedidos y eventos de cuenta.
7. **Asistente IA:** En el sidebar hay un botón para consultar cuidados de cualquier planta, impulsado por IA.

### Como administrador (`admin+clerktest@iaw.com`)

1. El panel está disponible en `/admin` o a través del botón en la barra de navegación.
2. Desde la pestaña **Gestión de usuarios** se pueden suspender, reactivar y eliminar compradores.
3. Desde la pestaña **Reporte de ventas** se pueden ver métricas de órdenes e ingresos confirmados.

### Como comprador suspendido o eliminado

Intentar agregar un producto al carrito o publicar en el foro mostrará un mensaje de error con el motivo del bloqueo. El resto de la navegación funciona normalmente.

---

##  Descripción del proyecto

**Brotes** es un marketplace de plantas y productos de jardinería que conecta compradores con vendedores de todo el país. La plataforma permite explorar catálogos de viveros, agregar productos al carrito, realizar compras y hacer seguimiento del estado de cada pedido. El sistema está dividido en tres aplicaciones independientes — Buyer App, Seller App y Payments App — cada una con su propia base de datos, que se comunican entre sí mediante APIs REST con autenticación por API key.

La Buyer App cubre el ciclo completo del comprador: registro y autenticación vía Clerk, exploración del catálogo obtenido desde la Seller App, gestión del carrito con validación de vendedor único por compra, confirmación de órdenes con integración a Payments App y consulta del historial de pedidos con sus estados actualizados en tiempo real. Los datos de productos se obtienen dinámicamente desde la Seller App y los precios se guardan como snapshots al momento de la compra para preservar el historial con exactitud.

Además del flujo de compra, la aplicación incluye funcionalidades complementarias orientadas a la comunidad y la experiencia del usuario: un foro de plantas donde los compradores pueden abrir debates, responder y dar likes a las respuestas; un asistente de IA (utilizando Groq / Llama 3) que brinda consejos de cuidado personalizados para cualquier planta; y un widget de clima en tiempo real (Open-Meteo) que sugiere si es buen momento para regar según las condiciones meteorológicas de la ubicación del usuario. El panel de administración permite gestionar el estado de las cuentas de compradores y consultar reportes de ventas con métricas agregadas.

---

##  Notas para la corrección

### Integración con Seller App y Payments App
La integración real con las otras dos apps está preparada y documentada en `app/lib/api.ts`. Cuando las variables de entorno `SELLER_APP_URL` y `PAYMENTS_APP_URL` no están configuradas, la app cae automáticamente a datos mock (`app/lib/mock-data.ts`) para que el flujo completo de compra sea evaluable de forma independiente. En producción, el deploy en Vercel usa los mocks mientras se coordina la integración final con los otros equipos.

### Categorización de productos
Las categorías de productos no se almacenan en la base de datos. Se infieren en runtime mediante la función `clasificarTipoPlanta()` que aplica matching por palabras clave sobre el nombre del producto. Esta decisión permite que los filtros del explorador funcionen sin depender de un campo `category` en la Seller App, aunque requerirá coordinación con el equipo de la Seller App para alinear los valores cuando se integren las APIs reales.

### Asistente IA
El asistente de cuidado de plantas usa la API de Groq (modelo Llama 3.1 8B) a través de un endpoint propio (`/api/plantas/consejos`). Incluye detección de consultas fuera de contexto para evitar respuestas sobre temas no relacionados con plantas. La API key debe estar configurada en la variable de entorno `GROQ_API_KEY`.

### Widget de clima — API externa Open-Meteo
El widget de clima visible en el sidebar consume la API pública de [Open-Meteo](https://open-meteo.com/) (sin API key). Cuando el usuario permite el acceso a su ubicación en el navegador, el widget muestra el clima de su ciudad junto con una recomendación de riego. Si el permiso de ubicación está denegado o no disponible, el widget muestra automáticamente el clima de **Bahía Blanca** como valor por defecto (coordenadas `-38.7196, -62.2724`), que es la ciudad sede del proyecto.

### Foro de la comunidad
Se implementó un foro completo con hilos, respuestas y sistema de likes. Los administradores pueden eliminar tanto hilos como respuestas individuales desde la vista del hilo. Los usuarios suspendidos y eliminados tienen bloqueada la creación de contenido pero pueden leer el foro.

### Limitación conocida — Admin eliminado
Si desde el panel de admin se elimina la cuenta de un usuario que también tiene rol de administrador en Clerk, ese usuario quedará bloqueado para operaciones de compra (el campo `estado` en DB será `eliminado`) pero seguirá pudiendo acceder al panel de administración, ya que el rol admin se verifica únicamente contra el JWT de Clerk y no contra el estado en la base de datos.

### Limitación conocida — Contador del carrito en la Navbar
El ícono del carrito en la barra de navegación muestra un contador con la cantidad de ítems. En algunas situaciones (por ejemplo, al agregar o eliminar productos sin una navegación completa de página) el contador puede no actualizarse de forma inmediata y mostrar un valor desactualizado. Esto se debe a que la Navbar es un Server Component que se rerenderiza con la navegación, pero no reacciona a cambios del carrito producidos del lado del cliente en tiempo real. El valor correcto siempre se refleja al recargar la página o navegar a otra ruta o luego de una secuencia de clicks agregando productos desde la página del carrito.