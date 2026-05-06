export type Producto = {
  id: number
  nombre: string
  precio: number
  stock: number
  descripcion: string
  imagen: string
}

export type Vendedor = {
  id: number
  nombre: string
  descripcion: string
  imagen: string
  ubicacion: string
  productos: Producto[]
}

export const vendedores: Vendedor[] = [
  {
    id: 1,
    nombre: "Verde Natural",
    descripcion: "Especialistas en plantas de interior y suculentas",
    imagen: "",
    ubicacion: "Buenos Aires",
    productos: [
      { id: 1, nombre: "Monstera Deliciosa", precio: 28000, stock: 6, descripcion: "Planta tropical de interior, hojas grandes y decorativas", imagen: "" },
      { id: 2, nombre: "Pilea Peperomioides", precio: 16000, stock: 10, descripcion: "Planta redonda y llamativa, perfecta para escritorios", imagen: "" },
      { id: 3, nombre: "Sansevieria Laurentii", precio: 22000, stock: 8, descripcion: "Planta resistente, ideal para principiantes", imagen: "" },
    ]
  },
  {
    id: 2,
    nombre: "El Vivero del Sur",
    descripcion: "Plantas de exterior, aromáticas y frutales",
    imagen: "",
    ubicacion: "Córdoba",
    productos: [
      { id: 4, nombre: "Lavanda", precio: 8000, stock: 15, descripcion: "Aromática ideal para jardines y balcones", imagen: "" },
      { id: 5, nombre: "Romero", precio: 6000, stock: 20, descripcion: "Hierba aromática y culinaria muy resistente", imagen: "" },
      { id: 6, nombre: "Limonero", precio: 45000, stock: 3, descripcion: "Frutal en maceta, da frutos todo el año", imagen: "" },
    ]
  },
  {
    id: 3,
    nombre: "Cactus & Co",
    descripcion: "Cactus, suculentas y plantas de bajo mantenimiento",
    imagen: "",
    ubicacion: "Rosario",
    productos: [
      { id: 7, nombre: "Cactus San Pedro", precio: 12000, stock: 5, descripcion: "Cactus columnar de rápido crecimiento", imagen: "" },
      { id: 8, nombre: "Echeveria Rosa", precio: 5000, stock: 25, descripcion: "Suculenta rosada perfecta para combinar", imagen: "" },
      { id: 9, nombre: "Aloe Vera", precio: 9000, stock: 12, descripcion: "Planta medicinal y decorativa muy resistente", imagen: "" },
    ]
  },
  {
    id: 4,
    nombre: "Jardín Secreto",
    descripcion: "Plantas raras, importadas y de colección",
    imagen: "",
    ubicacion: "Mendoza",
    productos: [
      { id: 10, nombre: "Monstera Thai Constellation", precio: 120000, stock: 2, descripcion: "Variedad premium con manchas blancas únicas", imagen: "" },
      { id: 11, nombre: "Philodendron Pink Princess", precio: 85000, stock: 1, descripcion: "Rarísima planta con hojas rosadas y verdes", imagen: "" },
      { id: 12, nombre: "Alocasia Zebrina", precio: 35000, stock: 4, descripcion: "Tallos rayados como cebra, muy llamativa", imagen: "" },
    ]
  }
]