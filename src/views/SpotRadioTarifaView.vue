<template>
  <div class="srt-root">

    <!-- HEADER -->
    <header class="srt-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="srt-logo" />
      <h1 class="srt-titulo">PAQUETES DE RADIO</h1>
      <button class="srt-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="srt-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- CUERPO -->
    <div class="srt-body">
      <div class="srt-carpeta">

        <div class="srt-tab">
          <span class="srt-tab-titulo">{{ servicio.label }}</span>
        </div>

        <div class="srt-hoja">
          <img :src="`${base}assets/5faaf.svg`" alt="" class="srt-clip" />

          <div class="srt-contenido">

            <!-- CONTROLES DE ADMINISTRADOR -->
            <div v-if="esAdministrador" class="srt-admin-controls">
              <span class="srt-admin-label">Administración de paquetes</span>

              <div class="srt-admin-botones">
                <button
                  v-if="!modoEdicion"
                  class="srt-admin-btn"
                  @click="modoEdicion = true"
                >
                  Modificar paquetes
                </button>

                <button
                  v-if="modoEdicion"
                  class="srt-admin-btn srt-admin-guardar"
                  :disabled="guardando"
                  @click="guardarCambios"
                >
                  {{ guardando ? "Guardando..." : "Guardar cambios" }}
                </button>

                <button
                  v-if="modoEdicion"
                  class="srt-admin-btn srt-admin-agregar"
                  :disabled="guardando || !idServicioRadio"
                  @click="agregarNuevoPaqueteFila"
                >
                  + Agregar paquete
                </button>

                <button
                  v-if="modoEdicion"
                  class="srt-admin-btn srt-admin-cancelar"
                  @click="cancelarEdicion"
                  :disabled="guardando"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <p v-if="mensajeEstado" class="srt-mensaje" :class="tipoMensaje">
              {{ mensajeEstado }}
            </p>

            <p v-if="cargando" class="srt-cargando">
              Cargando paquetes...
            </p>

            <div v-else class="srt-tabla-wrap">
              <table class="srt-tabla">
                <colgroup v-if="!servicio.sinDuracion">
                  <col style="width:35%" />
                  <col style="width:35%" />
                  <col style="width:30%" />
                </colgroup>

                <colgroup v-else>
                  <col style="width:70%" />
                  <col style="width:30%" />
                </colgroup>

                <thead>
                  <tr>
                    <th v-if="!servicio.sinDuracion" class="srt-th">
                      {{ modoEdicion ? "Duración / Descripción" : "Duración" }}
                    </th>

                    <th class="srt-th">Tarifa (Sin IVA)</th>
                    <th class="srt-th">Aceptar</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(tarifa, indice) in servicio.tarifas"
                    :key="tarifa.id ?? `nuevo-${indice}`"
                    class="srt-tr"
                  >
                    <td v-if="!servicio.sinDuracion" class="srt-td">
                      <input
                        v-if="modoEdicion"
                        v-model="tarifa.duracion"
                        class="srt-input"
                        type="text"
                        placeholder="Ej. 30 segundos"
                      />
                      <span v-else>{{ tarifa.duracion }}</span>
                    </td>

                    <td class="srt-td">
                      <input
                        v-if="modoEdicion"
                        v-model="tarifa.precio"
                        class="srt-input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <span v-else>{{ tarifa.precio }}</span>
                    </td>

                    <td class="srt-td srt-td-btn">
                      <button
                        v-if="!modoEdicion"
                        class="srt-aceptar-btn"
                        @click="seleccionar(tarifa)"
                      >
                        Aceptar
                      </button>

                      <button
                        v-else
                        class="srt-eliminar-btn"
                        @click="eliminarPaquete(indice)"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>

                  <tr v-if="servicio.tarifas.length === 0">
                    <td :colspan="servicio.sinDuracion ? 2 : 3" class="srt-sin-datos">
                      No hay paquetes registrados para este servicio.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="srt-footer" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { supabase } from "@/lib/supabase"

const router = useRouter()
const route = useRoute()
const base = import.meta.env.BASE_URL

type TarifaRadio = {
  id?: number
  duracion: string
  precio: string
}

type ServicioRadio = {
  label: string
  sinDuracion?: boolean
  tarifas: TarifaRadio[]
}

const nombreServicioMap: Record<
  string,
  { label: string; busqueda: string; sinDuracion?: boolean }
> = {
  spot: {
    label: "Spot Publicitario",
    busqueda: "Spot",
  },
  cortinilla: {
    label: "Cortinilla",
    busqueda: "Cortinilla",
  },
  entrevista: {
    label: "Entrevista",
    busqueda: "Entrevista",
  },
  programas: {
    label: "Programas",
    busqueda: "Programa",
  },
  mencion: {
    label: "Mención",
    busqueda: "Mención",
  },
  "control-remoto": {
    label: "Control Remoto",
    busqueda: "Control Remoto",
  },
  patrocinios: {
    label: "Patrocinios",
    busqueda: "Patrocinio",
    sinDuracion: true,
  },
  blinks: {
    label: "Blinks",
    busqueda: "Blink",
  },
}

const fallbackCatalogo: Record<string, ServicioRadio> = {
  spot: {
    label: "Spot Publicitario",
    tarifas: [
      { duracion: "10 Segundos.", precio: "$93.00" },
      { duracion: "20 Segundos.", precio: "$186.00" },
      { duracion: "30 Segundos.", precio: "$279.00" },
    ],
  },
  cortinilla: {
    label: "Cortinilla",
    tarifas: [
      { duracion: "20 Segundos.", precio: "$200.00" },
    ],
  },
  entrevista: {
    label: "Entrevista",
    tarifas: [
      { duracion: "15 Minutos.", precio: "$2,500.00" },
      { duracion: "30 Minutos.", precio: "$5,000.00" },
    ],
  },
  programas: {
    label: "Programas",
    tarifas: [
      { duracion: "30 Minutos.", precio: "$20,000.00" },
      { duracion: "1 Hora.", precio: "$40,000.00" },
    ],
  },
  mencion: {
    label: "Mención",
    tarifas: [
      { duracion: "30 Segundos.", precio: "$382.00" },
    ],
  },
  "control-remoto": {
    label: "Control Remoto",
    tarifas: [
      { duracion: "30 Minutos.", precio: "$8,500.00" },
    ],
  },
  patrocinios: {
    label: "Patrocinios",
    sinDuracion: true,
    tarifas: [
      { duracion: "", precio: "$12,500.00" },
    ],
  },
  blinks: {
    label: "Blinks",
    tarifas: [
      { duracion: "30 Segundos.", precio: "$93.00" },
    ],
  },
}

const servicioId = computed(
  () => (route.params.servicio as string) || "spot"
)

const servicioActual = ref<ServicioRadio>({
  label: "",
  tarifas: [],
})

const servicio = computed(() => {
  if (servicioActual.value.label) {
    return servicioActual.value
  }

  return fallbackCatalogo[servicioId.value] ?? fallbackCatalogo.spot!
})

const esAdministrador = ref(false)
const modoEdicion = ref(false)
const cargando = ref(false)
const guardando = ref(false)
const mensajeEstado = ref("")
const tipoMensaje = ref("")
const idServicioRadio = ref<number | null>(null)

let tarifasOriginales: TarifaRadio[] = []

function mostrarMensaje(mensaje: string, tipo = "error") {
  mensajeEstado.value = mensaje
  tipoMensaje.value = tipo
}

function limpiarMensaje() {
  mensajeEstado.value = ""
  tipoMensaje.value = ""
}

function formatearPrecio(valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") {
    return "$0.00"
  }

  return `$${Number(valor).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function obtenerPrecioNumerico(precio: string): number {
  const numero = Number(String(precio).replace(/[$,\s]/g, ""))

  if (!Number.isFinite(numero) || numero < 0) {
    throw new Error("Todos los precios deben ser números iguales o mayores a cero.")
  }

  return numero
}

function crearClavePaquete(): string {
  return `PLN-R${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/* Comprueba el rol del usuario conectado */
async function verificarRolAdministrador() {
  try {
    const { data: usuarioData, error: usuarioError } =
      await supabase.auth.getUser()

    if (usuarioError || !usuarioData.user) {
      esAdministrador.value = false
      return
    }

    const { data: empleado, error } = await supabase
      .from("empleados")
      .select("rol")
      .eq("auth_id", usuarioData.user.id)
      .maybeSingle()

    if (error) {
      console.error("Error verificando administrador:", error.message)
      esAdministrador.value = false
      return
    }

    const rol = String(empleado?.rol ?? "").trim().toLowerCase()

    esAdministrador.value = [
      "administrador",
      "admin",
      "gerente",
    ].includes(rol)
  } catch (error) {
    console.error("No se pudo verificar el rol:", error)
    esAdministrador.value = false
  }
}

/* Obtiene el ID exacto del servicio de radio */
async function obtenerIdServicioRadio(
  nombre: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from("productos_servicios")
    .select("id, nombre_servicio, medio")
    .eq("medio", "Radio")
    .eq("nombre_servicio", nombre)
    .maybeSingle()

  if (error) {
    throw new Error(
      `No se pudo buscar el servicio "${nombre}": ${error.message}`
    )
  }

  return data?.id != null ? Number(data.id) : null
}

/* Carga los paquetes correspondientes a la categoría seleccionada */
async function cargarTarifas() {
  const sid = servicioId.value
  const meta = nombreServicioMap[sid]

  limpiarMensaje()
  modoEdicion.value = false
  idServicioRadio.value = null
  servicioActual.value = {
    label: meta?.label ?? "Paquetes de radio",
    sinDuracion: meta?.sinDuracion ?? false,
    tarifas: [],
  }

  if (!meta) {
    mostrarMensaje("No se reconoció la categoría de radio.")
    return
  }

  cargando.value = true

  try {
    const id = await obtenerIdServicioRadio(meta.label)
    idServicioRadio.value = id

    if (id === null) {
      servicioActual.value.tarifas = (fallbackCatalogo[sid]?.tarifas ?? [])
        .map(t => ({ ...t }))

      mostrarMensaje(
        `No se encontró el servicio "${meta.label}" en productos_servicios. Verifica que esté registrado con el medio Radio.`,
        "aviso"
      )
      tarifasOriginales = servicioActual.value.tarifas.map(t => ({ ...t }))
      return
    }

    const { data: rows, error } = await supabase
      .from("paquetes_tarifas")
      .select("*")
      .eq("id_servicio", id)
      .order("tarifa_sin_iva", { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    if (rows && rows.length > 0) {
      servicioActual.value.tarifas = rows.map((r: any) => ({
        id: r.id,
        duracion: String(
          r.medidas_ejemplos ?? r.descripcion ?? ""
        ),
        precio: String(r.tarifa_sin_iva ?? 0),
      }))
    } else {
      /* Conserva los precios originales como catálogo inicial.
         Si se guardan, se insertarán en Supabase. */
      servicioActual.value.tarifas = (
        fallbackCatalogo[sid]?.tarifas ?? []
      ).map(t => ({ ...t }))
    }

    tarifasOriginales = servicioActual.value.tarifas.map(t => ({ ...t }))
  } catch (error: any) {
    console.error("Error cargando tarifas de radio:", error)

    servicioActual.value.tarifas = (
      fallbackCatalogo[sid]?.tarifas ?? []
    ).map(t => ({ ...t }))

    tarifasOriginales = servicioActual.value.tarifas.map(t => ({ ...t }))

    mostrarMensaje(
      `No se pudieron cargar los paquetes desde Supabase: ${error?.message ?? "Error desconocido"}`
    )
  } finally {
    cargando.value = false
  }
}

/* Guarda los cambios de los paquetes */
async function guardarCambios() {
  if (!esAdministrador.value) {
    mostrarMensaje("No tienes permisos para modificar los paquetes.")
    return
  }

  if (idServicioRadio.value === null) {
    mostrarMensaje(
      "No se encontró el servicio de radio en la base de datos. No se guardaron cambios."
    )
    return
  }

  guardando.value = true
  limpiarMensaje()

  try {
    for (const tarifa of servicioActual.value.tarifas) {
      const precio = obtenerPrecioNumerico(tarifa.precio)

      const descripcion = tarifa.duracion.trim()
      const meta = nombreServicioMap[servicioId.value]

      if (!meta) {
        throw new Error("No se reconoció la categoría seleccionada.")
      }

      if (!servicio.value.sinDuracion && !descripcion) {
        throw new Error("Completa la duración o descripción de todos los paquetes.")
      }

      const datos = {
        tipo_servicio: meta.label,
        descripcion: descripcion || meta.label,
        medidas_ejemplos: descripcion || meta.label,
        tarifa_sin_iva: precio,
      }

      if (tarifa.id !== undefined) {
        const { error } = await supabase
          .from("paquetes_tarifas")
          .update(datos)
          .eq("id", tarifa.id)
          .eq("id_servicio", idServicioRadio.value)

        if (error) {
          throw new Error(error.message)
        }
      } else {
        const { error } = await supabase
          .from("paquetes_tarifas")
          .insert({
            ...datos,
            id_servicio: idServicioRadio.value,
            pln: crearClavePaquete(),
          })

        if (error) {
          throw new Error(error.message)
        }
      }
    }

    mostrarMensaje("Los paquetes se guardaron correctamente.", "exito")
    modoEdicion.value = false
    await cargarTarifas()
  } catch (error: any) {
    console.error("Error guardando paquetes:", error)

    mostrarMensaje(
      `No se pudieron guardar todos los cambios: ${error?.message ?? "Error desconocido"}`
    )
  } finally {
    guardando.value = false
  }
}

/* Agrega una fila nueva y la registra en Supabase */
async function agregarNuevoPaqueteFila() {
  if (!esAdministrador.value) {
    mostrarMensaje("No tienes permisos para agregar paquetes.")
    return
  }

  if (idServicioRadio.value === null) {
    mostrarMensaje("No se encontró el servicio de radio en la base de datos.")
    return
  }

  limpiarMensaje()

  try {
    const meta = nombreServicioMap[servicioId.value]

    if (!meta) {
      throw new Error("No se reconoció la categoría seleccionada.")
    }

    const { data, error } = await supabase
      .from("paquetes_tarifas")
      .insert({
        id_servicio: idServicioRadio.value,
        pln: crearClavePaquete(),
        tipo_servicio: meta.label,
        descripcion: meta.label,
        medidas_ejemplos: meta.sinDuracion ? meta.label : "Nueva duración",
        tarifa_sin_iva: 0,
      })
      .select("id, medidas_ejemplos, descripcion, tarifa_sin_iva")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    servicioActual.value.tarifas.push({
      id: data.id,
      duracion: String(
        data.medidas_ejemplos ?? data.descripcion ?? ""
      ),
      precio: String(data.tarifa_sin_iva ?? 0),
    })

    modoEdicion.value = true
    mostrarMensaje(
      "Paquete agregado. Edita su información y guarda los cambios.",
      "exito"
    )
  } catch (error: any) {
    console.error("Error agregando paquete:", error)

    mostrarMensaje(
      `No se pudo agregar el paquete: ${error?.message ?? "Error desconocido"}`
    )
  }
}

/* Elimina una fila del listado.
   La eliminación definitiva se realiza al confirmar Guardar cambios. */
async function eliminarPaquete(indice: number) {
  if (!esAdministrador.value || !modoEdicion.value) return

  const tarifa = servicioActual.value.tarifas[indice]
  if (!tarifa) return

  if (tarifa.id !== undefined) {
    const confirmar = window.confirm(
      "¿Deseas eliminar este paquete de forma permanente?"
    )

    if (!confirmar) return

    guardando.value = true
    limpiarMensaje()

    try {
      const { error } = await supabase
        .from("paquetes_tarifas")
        .delete()
        .eq("id", tarifa.id)
        .eq("id_servicio", idServicioRadio.value)

      if (error) {
        throw new Error(error.message)
      }

      servicioActual.value.tarifas.splice(indice, 1)
      tarifasOriginales = servicioActual.value.tarifas.map(t => ({ ...t }))

      mostrarMensaje("El paquete se eliminó correctamente.", "exito")
    } catch (error: any) {
      mostrarMensaje(
        `No se pudo eliminar el paquete: ${error?.message ?? "Error desconocido"}`
      )
    } finally {
      guardando.value = false
    }
  } else {
    servicioActual.value.tarifas.splice(indice, 1)
  }
}

/* Descarta las modificaciones locales */
function cancelarEdicion() {
  servicioActual.value.tarifas = tarifasOriginales.map(t => ({ ...t }))
  modoEdicion.value = false
  limpiarMensaje()
}

/* Conserva la navegación hacia la solicitud */
function seleccionar(tarifa: TarifaRadio) {
  router.push({
    name: "NuevaSolicitudRadio",
    state: {
      radioTarifa: JSON.stringify({
        servicio: servicio.value.label,
        idPaquete: tarifa.id,
        duracion: tarifa.duracion,
        precio: tarifa.precio.startsWith("$")
          ? tarifa.precio
          : formatearPrecio(tarifa.precio),
      }),
    },
  })
}

function regresar() {
  router.push({ name: "Radio" })
}

onMounted(async () => {
  await verificarRolAdministrador()
  await cargarTarifas()
})

watch(servicioId, async () => {
  await cargarTarifas()
})
</script>

<style scoped>
.srt-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* Header */
.srt-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.srt-logo {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
  flex-shrink: 0;
}

.srt-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 400;
  color: #fff;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.srt-regresar-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #d92525;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 60px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  color: #fff;
  white-space: nowrap;
  transition: filter 0.15s;
}

.srt-regresar-btn:hover {
  filter: brightness(1.1);
}

.srt-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* Cuerpo */
.srt-body {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 16px 40px;
}

/* Carpeta */
.srt-carpeta {
  width: 100%;
  max-width: 1030px;
  display: flex;
  flex-direction: column;
}

.srt-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  width: 560px;
  max-width: 100%;
  padding: 10px 24px 14px;
  box-shadow: 10px 0 10px 0 rgba(0, 0, 0, 0.25);
}

.srt-tab-titulo {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 38px;
  color: #000;
  font-weight: 400;
  white-space: nowrap;
}

.srt-hoja {
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 0 7px 7px 7px;
  padding: 16px;
  display: flex;
  align-items: stretch;
  position: relative;
  flex: 1;
  min-width: 0;
}

/* Clip */
.srt-clip {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 72px;
  height: auto;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
}

/* Contenido de la hoja */
.srt-contenido {
  flex: 1;
  min-width: 0;
  margin-left: 64px;
}

/* Administración */
.srt-admin-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 0 14px;
}

.srt-admin-label {
  color: #000;
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 15px;
}

.srt-admin-botones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.srt-admin-btn {
  border: none;
  border-radius: 6px;
  padding: 9px 12px;
  background: #584848;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.srt-admin-btn:hover {
  filter: brightness(1.12);
}

.srt-admin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.srt-admin-guardar {
  background: #008a52;
}

.srt-admin-agregar {
  background: #245f9e;
}

.srt-admin-cancelar {
  background: #777;
}

/* Mensajes */
.srt-mensaje {
  padding: 10px 12px;
  margin: 0 0 12px;
  border-radius: 6px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.srt-mensaje.exito {
  color: #155724;
  background: #d4edda;
}

.srt-mensaje.error {
  color: #842029;
  background: #f8d7da;
}

.srt-mensaje.aviso {
  color: #664d03;
  background: #fff3cd;
}

.srt-cargando {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}

/* Tabla */
.srt-tabla-wrap {
  background: #fff;
  border: 1px solid #000;
  overflow-x: auto;
}

.srt-tabla {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.srt-th {
  background: #d9d9d9;
  border: 1px solid #000;
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  padding: 10px 16px;
  text-align: left;
}

.srt-tr:nth-child(even) {
  background: #fafafa;
}

.srt-td {
  border: 1px solid #d0d0d0;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 16px;
  color: #000;
  padding: 10px 16px;
  overflow-wrap: anywhere;
}

.srt-td-btn {
  text-align: center;
}

.srt-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  border: 1px solid #aaa;
  border-radius: 5px;
  padding: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #000;
  background: #fff;
}

.srt-aceptar-btn {
  background: #584848;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 14px;
  padding: 5px 0;
  width: 100%;
  cursor: pointer;
  transition: filter 0.15s;
}

.srt-aceptar-btn:hover {
  filter: brightness(1.2);
}

.srt-eliminar-btn {
  background: #b42323;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 10px;
  cursor: pointer;
  font-size: 13px;
}

.srt-eliminar-btn:hover {
  filter: brightness(1.15);
}

.srt-sin-datos {
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  color: #444;
}

/* Footer */
.srt-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

@media (max-width: 860px) {
  .srt-header {
    height: auto;
    min-height: 100px;
    gap: 10px;
    padding: 12px;
  }

  .srt-logo {
    width: 150px;
    height: auto;
  }

  .srt-titulo {
    position: static;
    transform: none;
    white-space: normal;
    text-align: center;
    font-size: 22px;
  }

  .srt-regresar-btn {
    height: 46px;
    padding: 0 10px;
    font-size: 16px;
  }

  .srt-regresar-icon {
    width: 24px;
    height: 24px;
  }

  .srt-clip {
    display: none;
  }

  .srt-contenido {
    margin-left: 0;
  }

  .srt-body {
    padding: 12px 16px;
  }

  .srt-tab-titulo {
    font-size: clamp(22px, 5vw, 32px);
    white-space: normal;
  }

  .srt-admin-controls {
    align-items: flex-start;
    flex-direction: column;
  }

  .srt-th,
  .srt-td {
    padding: 8px;
    font-size: 14px;
  }
}

@media (max-width: 520px) {
  .srt-logo {
    width: 90px;
  }

  .srt-titulo {
    font-size: 17px;
  }

  .srt-regresar-btn {
    gap: 4px;
    padding: 0 7px;
    font-size: 13px;
  }

  .srt-admin-botones {
    width: 100%;
  }

  .srt-admin-btn {
    padding: 8px;
    font-size: 12px;
  }
}
</style>
