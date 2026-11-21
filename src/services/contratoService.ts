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
  async subirArchivo(a: {
    idContrato: number
    idEmpleado: string
    formato: "PDF" | "WORD" | "JPG"
    nombre: string
    mime: string
    blob: Blob
  }) {
    const ruta = `${a.idContrato}/${Date.now()}-${a.nombre}`
    const { error: errSubida } = await supabase.storage
      .from("contratos")
      .upload(ruta, a.blob, { contentType: a.mime })
    if (errSubida) throw new Error(errSubida.message)

    const cliente = supabase as any
    const { error } = await cliente.from("contrato_archivos").insert({
      id_contrato: a.idContrato,
      formato: a.formato,
      nombre_archivo: a.nombre,
      ruta_storage: ruta,
      mime_type: a.mime,
      tamano_bytes: a.blob.size,
      id_empleado: a.idEmpleado,
    })
    if (error) {
      await supabase.storage.from("contratos").remove([ruta])
      throw new Error(error.message)
    }
  },

  async listarArchivos(idContrato: number) {
    const cliente = supabase as any
    const { data, error } = await cliente
      .from("contrato_archivos")
      .select("*")
      .eq("id_contrato", idContrato)
      .order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async urlDescarga(ruta: string, segundos = 3600) {
    const { data, error } = await supabase.storage.from("contratos").createSignedUrl(ruta, segundos)
    if (error) throw new Error(error.message)
    return data.signedUrl
  },
}
