import { supabase } from "@/lib/supabase"
import type { Contrato, ContratoDetalle } from "@/types"

export const contratoService = {
  async listar() {
    const { data, error } = await supabase
      .from("contratos")
      .select("*, prospectos(nombre_empresa, nombre_contacto), empleados(nombre)")
      .order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarPorEmpleado(idEmpleado: string) {
    const { data, error } = await supabase
      .from("contratos")
      .select("*, prospectos(nombre_empresa, nombre_contacto)")
      .eq("id_empleado_responsable", idEmpleado)
      .order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async obtener(id: number) {
    const { data, error } = await supabase
      .from("contratos")
      .select("*, contrato_detalles(*, paquetes_tarifas(pln, descripcion, tarifa_sin_iva))")
      .eq("id", id)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async crear(contrato: Omit<Contrato, "id" | "created_at">, detalles: Omit<ContratoDetalle, "id" | "id_contrato">[]) {
    const cliente = supabase as any
    const { data, error } = await cliente.rpc("crear_contrato_con_detalles", {
      p_contrato: contrato,
      p_detalles: detalles,
    })
    if (error) throw new Error(error.message)

    const contratoId = data?.[0]?.contrato_id
    if (contratoId == null) throw new Error("La RPC no devolvio el ID del contrato creado")
    return { ...contrato, id: contratoId }
  },

  async actualizarEstado(id: number, estado: Contrato["estado"]) {
    const cliente = supabase as any
    const { data, error } = await cliente
      .from("contratos")
      .update({ estado })
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },
}
