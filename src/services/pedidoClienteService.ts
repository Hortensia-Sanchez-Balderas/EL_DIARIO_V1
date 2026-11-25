import { supabase, supabaseConfigured } from "@/lib/supabase"
import type { ItemCarrito, Pedido } from "@/stores/cliente"
import type { PedidoClienteRow } from "@/types/database"

interface DatosNuevoPedido {
  nombre: string
  email: string
  items: ItemCarrito[]
  subtotal: number
  iva: number
  total: number
  metodoPago: string
  facturacion: Pedido["facturacion"]
  notas: string
}

export interface PedidoAdministracion extends Omit<PedidoClienteRow, "cliente_token_hash"> {
  items: ItemCarrito[]
  facturacion: Pedido["facturacion"]
}

function tokenCliente(email: string): string {
  const key = `eldiario.cliente.pedidos.token:${email.trim().toLowerCase()}`
  const existente = localStorage.getItem(key)
  if (existente) return existente
  if (!globalThis.crypto?.randomUUID) {
    throw new Error("Este navegador no permite crear una sesión segura para consultar tus pedidos.")
  }
  const token = globalThis.crypto.randomUUID() + globalThis.crypto.randomUUID()
  localStorage.setItem(key, token)
  return token
}

function asegurarSupabase() {
  if (!supabaseConfigured) {
    throw new Error("Configura Supabase para guardar y consultar pedidos.")
  }
}

function mapearPedido(data: Record<string, unknown>): Pedido {
  return {
    id: String(data.id ?? ""),
    folio: String(data.folio ?? ""),
    fecha: String(data.created_at ?? new Date().toISOString()),
    items: (data.items ?? []) as ItemCarrito[],
    subtotal: Number(data.subtotal ?? 0),
    iva: Number(data.iva ?? 0),
    total: Number(data.total ?? 0),
    metodoPago: String(data.metodo_pago ?? ""),
    facturacion: (data.facturacion ?? {}) as Pedido["facturacion"],
    notas: String(data.notas ?? ""),
    estado: (data.estado ?? "En revisión") as Pedido["estado"],
  }
}

export const pedidoClienteService = {
  async crear(datos: DatosNuevoPedido, emailCliente: string): Promise<Pedido> {
    asegurarSupabase()
    const { data, error } = await supabase.rpc("crear_pedido_cliente", {
      p_token: tokenCliente(emailCliente),
      p_pedido: {
        cliente_nombre: datos.nombre,
        cliente_email: datos.email,
        items: datos.items,
        subtotal: datos.subtotal,
        iva: datos.iva,
        total: datos.total,
        metodo_pago: datos.metodoPago,
        facturacion: datos.facturacion,
        notas: datos.notas,
      },
    })
    if (error) throw new Error(error.message)
    return mapearPedido(data as Record<string, unknown>)
  },

  async listarMios(emailCliente: string): Promise<Pedido[]> {
    asegurarSupabase()
    const { data, error } = await supabase.rpc("listar_mis_pedidos_cliente", {
      p_token: tokenCliente(emailCliente),
    })
    if (error) throw new Error(error.message)
    return ((data ?? []) as Record<string, unknown>[]).map(mapearPedido)
  },

  async listarTodos(): Promise<PedidoAdministracion[]> {
    asegurarSupabase()
    const { data, error } = await supabase
      .from("pedidos_cliente")
      .select("id, folio, cliente_nombre, cliente_email, items, subtotal, iva, total, metodo_pago, facturacion, notas, estado, created_at")
      .order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((pedido) => ({
      ...pedido,
      items: pedido.items as unknown as ItemCarrito[],
      facturacion: pedido.facturacion as unknown as Pedido["facturacion"],
    }))
  },
}
