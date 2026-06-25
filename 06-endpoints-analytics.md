# 1.6 — Endpoints necesarios para Analytics Dashboard

> **Tipo C — Marketplace**

Mapeo de endpoints existentes vs. datos que necesita el dashboard, y propuesta de nuevos endpoints por app.

---

## Buyer App — Endpoints existentes

| Endpoint actual | Sirve para analytics |
|---|---|
| `GET /api/orders/:id` | ❌ Solo 1 orden, no agrega |
| `POST /api/approved-payment/:id` | ❌ Webhook operacional |
| `POST /api/rejected-payment/:id` | ❌ Webhook operacional |
| `POST /api/orders/:id/status-update` | ❌ Webhook operacional |

### Datos que necesita el dashboard y no tienen endpoint

| Dato faltante | Uso en dashboard |
|---|---|
| `totalCompradores`, `compradoresActivos`, `suspendidos`, `eliminados` | Resumen KPIs, Usuarios |
| `registrosPorSemana` (últimas 8 semanas) | Resumen, Usuarios (crecimiento) |
| `pedidosPorMes` (últimos 6 meses, c/ estado) | Ventas, Resumen |
| `distribucionEstadosPedidos` (global) | Resumen |
| `ultimosPedidos` (lista c/ datos completos) | Ventas (tabla) |
| `hilosForo` (top hilos) + `totalHilosForo` + `totalRespuestasForo` | Comunidad |
| `actividadForoPorSemana` (últimas 8 semanas) | Comunidad |
| `usuariosConFavoritos` | Comunidad |

### Endpoints nuevos necesarios en Buyer App

```
GET /api/analytics/buyers
  → totalCompradores, compradoresActivos, suspendidos, eliminados, registrosPorSemana

GET /api/analytics/orders
  → pedidosPorMes, distribucionEstadosPedidos, ultimosPedidos

GET /api/analytics/forum
  → hilosForo, totalHilosForo, totalRespuestasForo, actividadForoPorSemana
---