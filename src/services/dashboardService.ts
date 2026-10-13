import { supabase } from "@/lib/supabase"

function rangoSemana(): { inicio: string; fin: string } {
  const hoy = new Date()
  const inicio = new Date(hoy)
  // Lunes de la semana actual
  const dia = hoy.getDay() // 0=Dom
  inicio.setDate(hoy.getDate() - (dia === 0 ? 6 : dia - 1))
  inicio.setHours(0, 0, 0, 0)
  const fin = new Date(inicio)
  fin.setDate(inicio.getDate() + 7)
  return { inicio: inicio.toISOString(), fin: fin.toISOString() }
}

function nombreServicio(detalle: any): string {
  const servicio = detalle.paquetes_tarifas?.productos_servicios
  const registro = Array.isArray(servicio) ? servicio[0] : servicio
  return String(registro?.nombre_servicio ?? "")
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function clasificarServicio(nombre: string): "radio" | "periodico" | null {
  const servicio = nombre
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
  if (servicio.includes("radio")) return "radio"
  if (servicio.includes("periodico")) return "periodico"
  return null
}

function validarRespuesta(nombre: string, error: { message: string } | null) {
  if (error) throw new Error(`Error cargando ${nombre}: ${error.message}`)
}

async function contarPaquetes(contratoIds: number[]) {
  if (contratoIds.length === 0) return { paquetesRadio: 0, paquetesPeriodico: 0 }

  const cliente = supabase as any
  const { data, error } = await cliente
    .from("contrato_detalles")
    .select("id, cantidad, id_contrato, paquetes_tarifas(id_servicio, productos_servicios(nombre_servicio))")
    .in("id_contrato", contratoIds)
  validarRespuesta("detalles de contratos", error)

  let paquetesRadio = 0
  let paquetesPeriodico = 0
  for (const detalle of data ?? []) {
    const cantidad = Number(detalle.cantidad ?? 1)
    const tipo = clasificarServicio(nombreServicio(detalle))
    if (tipo === "radio") paquetesRadio += cantidad
    if (tipo === "periodico") paquetesPeriodico += cantidad
  }

  return { paquetesRadio, paquetesPeriodico }
}

export const dashboardService = {
  async registrosSemana(idEmpleado: string) {
    const semana = rangoSemana()
    const cliente = supabase as any

    const [prospectos, contratos] = await Promise.all([
      cliente
        .from("prospectos")
        .select("id", { count: "exact", head: true })
        .eq("id_empleado_registro", idEmpleado)
        .gte("fecha_registro", semana.inicio)
        .lt("fecha_registro", semana.fin),
      cliente
        .from("contratos")
        .select("id, total")
        .eq("id_empleado_responsable", idEmpleado)
        .in("estado", ["Firmado", "Vigente"])
        .gte("created_at", semana.inicio)
        .lt("created_at", semana.fin),
    ])
    validarRespuesta("prospectos", prospectos.error)
    validarRespuesta("contratos", contratos.error)

    const ventasTotales = (contratos.data ?? []).reduce((s, c) => s + (c.total ?? 0), 0)
    const paquetes = await contarPaquetes((contratos.data ?? []).map(c => c.id))

    return {
      prospectos: prospectos.count ?? 0,
      contratos: contratos.data?.length ?? 0,
      ...paquetes,
      ventasTotales,
    }
  },

  async registrosSemanaGerente() {
    const semana = rangoSemana()
    const cliente = supabase as any

    const [prospectos, contratos, empleados] = await Promise.all([
      cliente
        .from("prospectos")
        .select("id", { count: "exact", head: true })
        .gte("fecha_registro", semana.inicio)
        .lt("fecha_registro", semana.fin),
      cliente
        .from("contratos")
        .select("id, total")
        .in("estado", ["Firmado", "Vigente"])
        .gte("created_at", semana.inicio)
        .lt("created_at", semana.fin),
      cliente
        .from("empleados")
        .select("id", { count: "exact", head: true })
        .eq("activo", true)
        .eq("rol", "Vendedor"),
    ])
    validarRespuesta("prospectos globales", prospectos.error)
    validarRespuesta("contratos globales", contratos.error)
    validarRespuesta("empleados", empleados.error)

    const ventasTotales = (contratos.data ?? []).reduce((s, c) => s + (c.total ?? 0), 0)
    const paquetes = await contarPaquetes((contratos.data ?? []).map(c => c.id))

    return {
      prospectos: prospectos.count ?? 0,
      prospectosRegistrados: prospectos.count ?? 0,
      contratos: contratos.data?.length ?? 0,
      ...paquetes,
      ventasTotales,
      vendedores: empleados.count ?? 0,
    }
  },

  async ventasPorServicio(idEmpleado: string, desde?: string, hasta?: string) {
    const cliente = supabase as any
    const { data, error } = await cliente
      .from("contratos")
      .select("id, contrato_detalles(importe, paquetes_tarifas(productos_servicios(nombre_servicio)))")
      .eq("id_empleado_responsable", idEmpleado)
      .in("estado", ["Firmado", "Vigente"])
      .gte("created_at", desde ?? rangoSemana().inicio)
      .lte("created_at", hasta ?? new Date().toISOString())
    if (error) throw new Error(error.message)

    let radio = 0
    let periodico = 0
    for (const contrato of data ?? []) {
      for (const detalle of contrato.contrato_detalles ?? []) {
        const importe = Number(detalle.importe ?? 0)
        const servicio = clasificarServicio(nombreServicio(detalle))
        if (servicio === "radio") radio += importe
        else if (servicio === "periodico") periodico += importe
      }
    }

    return { radio, periodico, total: radio + periodico }
  },
}
