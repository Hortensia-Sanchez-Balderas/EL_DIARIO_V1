import { defineStore } from "pinia"
import { ref, computed, watch } from "vue"
import { IVA, type ProductoTienda } from "@/data/catalogoCliente"

// Carrito y pedidos del cliente — solo frontend (localStorage) mientras
// no existan las tablas de pedidos en la BD.

export interface ItemCarrito {
  producto: ProductoTienda
  cantidad: number
  fechaInicio: string // YYYY-MM-DD — fecha deseada de publicación / transmisión
  /** Solo Publicidad impresa — mismos datos que pide ContratoPeriodicoView */
  impresa?: ExtrasImpresa
}

export interface ExtrasImpresa {
  seccion: string
  pagina: string
  fechasPublicacion: string // fechas adicionales (texto libre)
  posicionEspecial: boolean // costo extra lo confirma el ejecutivo
}

export interface Pedido {
  folio: string
  fecha: string // ISO
  items: ItemCarrito[]
  subtotal: number
  iva: number
  total: number
  metodoPago: string
  facturacion: { razonSocial: string; rfc: string; telefono: string; correo: string }
  notas: string
  estado: "Pagado" | "En revisión" | "Publicado"
}

const KEY_CARRITO = "eldiario.cliente.carrito"
const KEY_PEDIDOS = "eldiario.cliente.pedidos"

function leer<T>(key: string, def: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : def
  } catch {
    return def
  }
}
function guardar(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function hoyISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export const useClienteStore = defineStore("cliente", () => {
  const carrito = ref<ItemCarrito[]>(leer(KEY_CARRITO, []))
  const pedidos = ref<Pedido[]>(leer(KEY_PEDIDOS, []))

  watch(carrito, (v) => guardar(KEY_CARRITO, v), { deep: true })
  watch(pedidos, (v) => guardar(KEY_PEDIDOS, v), { deep: true })

  const totalPiezas = computed(() => carrito.value.reduce((a, i) => a + i.cantidad, 0))
  const subtotal = computed(() => carrito.value.reduce((a, i) => a + i.producto.precio * i.cantidad, 0))
  const iva = computed(() => subtotal.value * IVA)
  const total = computed(() => subtotal.value + iva.value)

  function agregar(producto: ProductoTienda) {
    const item = carrito.value.find((i) => i.producto.id === producto.id)
    if (item) item.cantidad++
    else carrito.value.push({
      producto,
      cantidad: 1,
      fechaInicio: hoyISO(),
      ...(producto.servicioId === "impresa"
        ? { impresa: { seccion: "", pagina: "", fechasPublicacion: "", posicionEspecial: false } }
        : {}),
    })
  }

  function quitar(id: string) {
    carrito.value = carrito.value.filter((i) => i.producto.id !== id)
  }

  function cambiarCantidad(id: string, delta: number) {
    const item = carrito.value.find((i) => i.producto.id === id)
    if (!item) return
    item.cantidad = Math.max(1, Math.min(99, item.cantidad + delta))
  }

  function vaciar() { carrito.value = [] }

  function confirmarCompra(datos: Pick<Pedido, "metodoPago" | "facturacion" | "notas">): Pedido {
    const pedido: Pedido = {
      folio: "ED-" + Date.now().toString().slice(-8),
      fecha: new Date().toISOString(),
      items: JSON.parse(JSON.stringify(carrito.value)),
      subtotal: subtotal.value,
      iva: iva.value,
      total: total.value,
      estado: datos.metodoPago === "Transferencia" ? "En revisión" : "Pagado",
      ...datos,
    }
    pedidos.value.unshift(pedido)
    vaciar()
    return pedido
  }

  return { carrito, pedidos, totalPiezas, subtotal, iva, total, agregar, quitar, cambiarCantidad, vaciar, confirmarCompra }
})
