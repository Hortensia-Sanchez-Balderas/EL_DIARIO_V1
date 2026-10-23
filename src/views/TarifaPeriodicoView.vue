<template>
  <div class="tp-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="tp-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="tp-logo" />
      <h1 class="tp-titulo">PAQUETES DE PERIODICO</h1>
      <button class="tp-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="tp-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="tp-body">
      <div class="tp-carpeta">

        <!-- Tab con nombre del servicio -->
        <div class="tp-tab">
          <span class="tp-tab-titulo">{{ servicio.label }}</span>
        </div>

        <!-- Hoja -->
        <div class="tp-hoja">
          <img :src="`${base}assets/5faaf.svg`" alt="" class="tp-clip" />

          <!-- Botón X de cierre -->
          <button class="tp-btn-x" @click="regresar">
            <img :src="`${base}assets/7422c.png`" alt="cerrar" style="width:22px;height:22px;object-fit:contain;" />
          </button>

          <!-- Controles de Administrador -->
          <div v-if="esAdministrador" class="tp-admin-controls" style="position: absolute; top: 15px; left: 90px; display: flex; gap: 10px; align-items: center; z-index: 4;">
            <button 
              @click="modoEdicion = !modoEdicion" 
              class="tp-admin-btn" style="background: #008a52; color: white; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-weight: bold;">
              {{ modoEdicion ? 'Cancelar Edición' : 'Modificar Paquetes' }}
            </button>
            <button 
              v-if="modoEdicion" 
              @click="guardarCambios" 
              class="tp-admin-btn" style="background: #28a745; color: white; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-weight: bold;">
              Guardar Cambios
            </button>
            <!-- Nuevo Botón para Agregar -->
            <button 
              @click="agregarNuevoPaqueteFila" 
              class="tp-admin-btn" style="background: #0059ff; color: white; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-weight: bold;">
              + Agregar Paquete
            </button>
            <span style="color: #000; font-weight: bold; font-size: 13px;">{{ mensajeEstado }}</span>
          </div>

          <div v-if="cargando" style="text-align: center; padding: 40px; font-weight: bold; font-size: 16px; color: #333;">
            Cargando paquetes...
          </div>

          <div v-else class="tp-tabla-wrap" :style="esAdministrador ? 'margin-top: 50px;' : 'margin-top: 45px;'">
            <table class="tp-tabla">

              <!-- Eventos Sociales: Tipo | Descripción | Tarifa | Aceptar -->
              <template v-if="servicioId === 'eventos'">
                <colgroup><col style="width:22%"/><col style="width:38%"/><col style="width:22%"/><col style="width:18%"/></colgroup>
                <thead>
                  <tr>
                    <th class="tp-th">Tipo De Servicio</th>
                    <th class="tp-th">Descripción</th>
                    <th class="tp-th">Tarifa (Sin IVA)</th>
                    <th class="tp-th">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in servicio.tarifas" :key="t.id || t.tipo" class="tp-tr">
                    <!-- Tipo de servicio editable -->
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.tipo" class="tp-input-edit" />
                      <span v-else>{{ t.tipo }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.descripcion" class="tp-input-edit" />
                      <span v-else>{{ t.descripcion }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.precio" class="tp-input-edit" />
                      <span v-else>{{ t.precio }}</span>
                    </td>
                    <td class="tp-td tp-td-btn">
                      <button v-if="!modoEdicion" class="tp-aceptar-btn" @click="seleccionar(t, t.precio!)">Aceptar</button>
                      <span v-else style="font-size: 11px; color: #666; font-weight: bold;">Editando</span>
                    </td>
                  </tr>
                </tbody>
              </template>

              <!-- Clasificados: Tipo | Desc | Tarifa Diaria | T.15 Días | T.30 Días | Aceptar -->
              <template v-else-if="servicioId === 'clasificados'">
                <colgroup><col style="width:17%"/><col style="width:13%"/><col style="width:16%"/><col style="width:16%"/><col style="width:16%"/><col style="width:22%"/></colgroup>
                <thead>
                  <tr>
                    <th class="tp-th">Tipo de servicio</th>
                    <th class="tp-th">Descripcion</th>
                    <th class="tp-th">Tarifa Diaria (Sin IVA)</th>
                    <th class="tp-th">Tarifa 15 Dias (Sin IVA)</th>
                    <th class="tp-th">Tarifa 30 Dias (Sin IVA)</th>
                    <th class="tp-th">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in servicio.tarifas" :key="t.id || t.tipo" class="tp-tr">
                    <!-- Tipo de servicio editable -->
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.tipo" class="tp-input-edit" />
                      <span v-else>{{ t.tipo }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.descripcion" class="tp-input-edit" />
                      <span v-else>{{ t.descripcion }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.precio" class="tp-input-edit" />
                      <span v-else>{{ t.precio }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.precio15" class="tp-input-edit" />
                      <span v-else>{{ t.precio15 }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.precio30" class="tp-input-edit" />
                      <span v-else>{{ t.precio30 }}</span>
                    </td>
                    <td class="tp-td tp-td-btn">
                      <button v-if="!modoEdicion" class="tp-aceptar-btn" @click="seleccionar(t, t.precio!)">Aceptar</button>
                      <span v-else style="font-size: 11px; color: #666; font-weight: bold;">Editando</span>
                    </td>
                  </tr>
                </tbody>
              </template>

              <!-- Publicidad Impresa: Tipo | Desc | Medidas | Tarifa | Acción -->
              <template v-else-if="servicioId === 'impresos'">
                <colgroup><col style="width:20%"/><col style="width:30%"/><col style="width:20%"/><col style="width:18%"/><col style="width:12%"/></colgroup>
                <thead>
                  <tr>
                    <th class="tp-th">Tipo de servicio</th>
                    <th class="tp-th">Descripción</th>
                    <th class="tp-th">Medidas/Ejemplos</th>
                    <th class="tp-th">Tarifa (Sin IVA)</th>
                    <th class="tp-th">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in servicio.tarifas" :key="t.id || t.tipo" class="tp-tr">
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.tipo" class="tp-input-edit" />
                      <span v-else>{{ t.tipo }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.descripcion" class="tp-input-edit" />
                      <span v-else>{{ t.descripcion }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.medidas" class="tp-input-edit" />
                      <span v-else>{{ t.medidas }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.precio" class="tp-input-edit" />
                      <span v-else>{{ t.precio }}</span>
                    </td>
                    <td class="tp-td tp-td-btn">
                      <button v-if="!modoEdicion" class="tp-aceptar-btn" @click="seleccionar(t, t.precio!)">Aceptar</button>
                      <span v-else style="font-size: 11px; color: #666; font-weight: bold;">Editando</span>
                    </td>
                  </tr>
                </tbody>
              </template>

              <!-- Digital (banners): Tipo | Desc | Medidas | Tarifa | Aceptar -->
              <template v-else>
                <colgroup><col style="width:18%"/><col style="width:22%"/><col style="width:20%"/><col style="width:20%"/><col style="width:20%"/></colgroup>
                <thead>
                  <tr>
                    <th class="tp-th">Tipo de servicio</th>
                    <th class="tp-th">Descripcion</th>
                    <th class="tp-th">Medidas/Ejemplos</th>
                    <th class="tp-th">Tarifa (Sin IVA)</th>
                    <th class="tp-th">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in servicio.tarifas" :key="t.id || t.tipo" class="tp-tr">
                    <!-- Tipo de servicio editable -->
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.tipo" class="tp-input-edit" />
                      <span v-else>{{ t.tipo }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.descripcion" class="tp-input-edit" />
                      <span v-else>{{ t.descripcion }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.medidas" class="tp-input-edit" />
                      <span v-else>{{ t.medidas }}</span>
                    </td>
                    <td class="tp-td">
                      <input v-if="modoEdicion" v-model="t.precio" class="tp-input-edit" />
                      <span v-else>{{ t.precio }}</span>
                    </td>
                    <td class="tp-td tp-td-btn">
                      <button v-if="!modoEdicion" class="tp-aceptar-btn" @click="seleccionar(t, t.precio!)">Aceptar</button>
                      <span v-else style="font-size: 11px; color: #666; font-weight: bold;">Editando</span>
                    </td>
                  </tr>
                </tbody>
              </template>

            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="tp-footer" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const route  = useRoute()
const base   = import.meta.env.BASE_URL
const authStore = useAuthStore()

interface Tarifa {
  id?: number
  tipo: string
  descripcion?: string
  medidas?: string
  precio?: string
  precio15?: string
  precio30?: string
}

interface Catalogo {
  label: string
  tarifas: Tarifa[]
}

// Variables de control
const esAdministrador = ref(false)
const modoEdicion = ref(false)
const mensajeEstado = ref("")
const cargando = ref(true)

const fallbackCatalogo: Record<string, Catalogo> = {
  eventos: {
    label: "Eventos Sociales",
    tarifas: [
      { tipo: "Plana.",      descripcion: "Celebraciones como bodas, aniversarios, graduaciones.", precio: "9086.00" },
      { tipo: "1/2 Plana.",  descripcion: "Versión reducida para eventos sociales.",               precio: "4543.00" },
      { tipo: "1/4 Plana.",  descripcion: "Formato económico para mensajes breves.",               precio: "2272.00" },
    ],
  },
  clasificados: {
    label: "Clasificados",
    tarifas: [
      { tipo: "Clasificado Simple.",  descripcion: "Texto 5x1",  precio: "88.00",  precio15: "513.00",    precio30: "955.50"  },
      { tipo: "Clasificado Medio.",   descripcion: "Texto 10x1", precio: "164.00", precio15: "1010.00", precio30: "1856.00" },
      { tipo: "Clasificado Amplio.",  descripcion: "Texto 15x1", precio: "240.00", precio15: "1508.00", precio30: "2796.00" },
      { tipo: "Clasificado Doble.",   descripcion: "Texto 10x2", precio: "317.00", precio15: "2010.00", precio30: "3724.00" },
      { tipo: "Clasificado Triple.",  descripcion: "Texto 15x3", precio: "699.00", precio15: "4499.50", precio30: "8364.00" },
    ],
  },
  digital: {
    label: "Publicidad digital (banners)",
    tarifas: [
      { tipo: "Top Banner (Leaderboard).", descripcion: "Banner superior.",             medidas: "1107 × 207 px.", precio: "754.00" },
      { tipo: "Medio Banner.",              descripcion: "Rectángulo medio.",            medidas: "708 × 166 px.",  precio: "481.00" },
      { tipo: "Full Banner.",               descripcion: "Medio vertical (Halfpage).",   medidas: "300 × 600 px.",  precio: "441.00" },
      { tipo: "Box Banner.",                descripcion: "Cuadrado cuadrado.",           medidas: "250 × 250 px.",  precio: "285.00" },
      { tipo: "Banner.",                    descripcion: "Cuadrado pequeño.",            medidas: "250 × 250 px.",  precio: "250.00" },
      { tipo: "Banner GIF.",                descripcion: "Animado vertical.",            medidas: "300 × 553 px.",  precio: "250.00" },
    ],
  },
  impresos: {
    label: "Publicidad Impresa",
    tarifas: [
      { tipo: "Plana Completa.", descripcion: "Anuncio impreso en plana entera.", medidas: "34 x 52 cm.", precio: "5000.00" },
    ],
  },
}

const nombreServicioMap: Record<string, { label: string; busqueda: string }> = {
  eventos:      { label: "Eventos Sociales",            busqueda: "Eventos" },
  clasificados: { label: "Clasificados",                busqueda: "Clasificados" },
  digital:      { label: "Publicidad digital (banners)", busqueda: "Digital" },
  impresos:     { label: "Publicidad Impresa",          busqueda: "Impresos" },
}

const servicioId = computed(() => (route.params.servicio as string) || "digital")
const servicioActual = ref<Catalogo>({ label: "", tarifas: [] })

const servicio = computed(() =>
  servicioActual.value.tarifas.length > 0
    ? servicioActual.value
    : fallbackCatalogo[servicioId.value] ?? fallbackCatalogo["digital"]!
)

const servicioIdMap: Record<string, number> = {
  eventos:      1, // Eventos Sociales
  digital:      2, // Publicidad Digital
  clasificados: 3, // Clasificados
  impresos:     4, // Publicidad Impresa
}

// 1. Cargar tarifas filtrando exactamente por el id_servicio de la ruta actual
async function cargarTarifas() {
  cargando.value = true // 👈 Iniciamos carga
  const sid = servicioId.value
  const idServicioTarget = servicioIdMap[sid] || 4

  try {
    const { data: rows, error } = await supabase
      .from("paquetes_tarifas")
      .select("*")
      .eq("id_servicio", idServicioTarget)

    if (error) throw error

    if (rows && rows.length > 0) {
      if (sid === 'eventos') servicioActual.value.label = "Eventos Sociales"
      else if (sid === 'clasificados') servicioActual.value.label = "Clasificados"
      else if (sid === 'digital') servicioActual.value.label = "Publicidad digital (banners)"
      else if (sid === 'impresos') servicioActual.value.label = "Publicidad Impresa"

      servicioActual.value.tarifas = rows.map((r: any) => ({
        id:          r.id,
        tipo:        r.tipo_servicio || "Servicio Impreso", 
        descripcion: r.descripcion ?? "",
        medidas:     r.medidas_ejemplos ?? "",
        precio:      r.tarifa_sin_iva != null ? `$${Number(r.tarifa_sin_iva).toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : "",
        precio15:    r.tarifa_15_dias != null ? `$${Number(r.tarifa_15_dias).toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : undefined,
        precio30:    r.tarifa_30_dias != null ? `$${Number(r.tarifa_30_dias).toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : undefined,
      }))
    } else {
      servicioActual.value = fallbackCatalogo[sid] ?? fallbackCatalogo["impresos"]!
    }
  } catch (e) {
    console.error("Error cargando tarifas filtradas:", e)
    servicioActual.value = fallbackCatalogo[sid] ?? fallbackCatalogo["impresos"]!
  } finally {
    cargando.value = false // 👈 2. Finalizamos la carga (tanto si tuvo éxito como si dio error)
  }
}

// 2. Función para verificar si el usuario es Administrador o Gerente
async function verificarRolAdministrador() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      esAdministrador.value = false
      return
    }

    const { data: perfil } = await supabase
      .from("empleados")
      .select("rol")
      .eq("auth_id", user.id)
      .single()

    if (perfil) {
      const rolLower = perfil.rol?.toLowerCase() || ""
      
      // Solo habilita los botones si el rol es administrador o gerente
      if (rolLower === "administrador" || rolLower === "admin" || rolLower === "gerente") {
        esAdministrador.value = true
      } else {
        esAdministrador.value = false // 👈 Vendedor / Vendedora / Ejecutivo
      }
    } else {
      esAdministrador.value = false
    }
  } catch (e) {
    console.error("No se pudo verificar el rol del usuario:", e)
    esAdministrador.value = false
  }
}

// 3. Función para guardar los datos modificados en 'paquetes_tarifas'
async function guardarCambios() {
  try {
    mensajeEstado.value = "Guardando cambios..."

    const limpiarPrecio = (val?: string | number) => {
      if (val === undefined || val === null || val === "") return null
      const num = Number(String(val).replace(/[^0-9.-]+/g, ""))
      return isNaN(num) ? null : num
    }

    for (const t of servicio.value.tarifas) {
      if (!t.id) {
        console.warn("Elemento sin ID de BD, no se puede guardar:", t.tipo)
        continue
      }

      const precioLimpio   = limpiarPrecio(t.precio)
      const precio15Limpio = limpiarPrecio(t.precio15)
      const precio30Limpio = limpiarPrecio(t.precio30)

      const { error } = await supabase
        .from("paquetes_tarifas")
        .update({
          tipo_servicio: t.tipo, // <-- ¡Importante para guardar los cambios en el nombre del tipo de servicio!
          tarifa_sin_iva: precioLimpio,
          tarifa_15_dias: precio15Limpio,
          tarifa_30_dias: precio30Limpio,
          descripcion: t.descripcion,
          medidas_ejemplos: t.medidas,
        })
        .eq("id", t.id)

      if (error) throw error
    }

    mensajeEstado.value = "¡Guardado con éxito!"
    modoEdicion.value = false

    await cargarTarifas()

    setTimeout(() => { mensajeEstado.value = "" }, 3000)

  } catch (error: any) {
    console.error("Error al guardar en Supabase:", error)
    mensajeEstado.value = "Error al guardar: " + (error.message || "Error desconocido")
  }
}

onMounted(async () => {
  await verificarRolAdministrador()
  await cargarTarifas()
})

function seleccionar(tarifa: Tarifa, precioSeleccionado: string) {
  if (modoEdicion.value) return
  router.push({
    name: "NuevaSolicitudRegistro",
    state: {
      tarifa: JSON.stringify({
        servicio: servicio.value.label,
        idPaquete: tarifa.id,
        tipo: tarifa.tipo,
        descripcion: tarifa.descripcion ?? "",
        medidas: tarifa.medidas ?? "",
        precio: precioSeleccionado,
      }),
    },
  })
}

function regresar() {
  router.push({ name: "Periodico" })
}

// 4. Agregar nuevo paquete asignándole el id_servicio de la vista actual
async function agregarNuevoPaqueteFila() {
  try {
    mensajeEstado.value = "Agregando paquete..."

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      throw new Error("No hay una sesión activa. Inicia sesión nuevamente como administrador.")
    }

    // Obtenemos el id_servicio correspondiente a la vista actual
    const sid = servicioId.value
    const idServicioActual = servicioIdMap[sid] || 1

    // Generamos un identificador PLN único para periódico (PLN-P)
    const randomNum = Math.floor(100 + Math.random() * 900)
    const plnGenerado = `PLN-P${randomNum}`

    const { data, error } = await supabase
      .from("paquetes_tarifas")
      .insert([
        {
          id_servicio: idServicioActual, // 1, 2, 3 o 4 según corresponda
          pln: plnGenerado,              // Código PLN de periódico (ej. PLN-P482)
          tipo_servicio: "Nuevo Servicio",
          descripcion: "Descripción del paquete",
          medidas_ejemplos: "N/A",
          tarifa_sin_iva: 0.00
        }
      ])
      .select()

    if (error) throw error

    mensajeEstado.value = "¡Paquete agregado con éxito!"
    await cargarTarifas()

    setTimeout(() => { mensajeEstado.value = "" }, 3000)
  } catch (error: any) {
    console.error("Error al agregar paquete:", error)
    mensajeEstado.value = "Error al agregar: " + (error.message || "revisa la consola")
  }
}

</script>

<style scoped>
.tp-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* Header */
.tp-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}
.tp-logo { width: 296px; height: 69px; object-fit: contain; object-position: left center; display: block; flex-shrink: 0; }
.tp-titulo {
  font-family: "Lilita One:Regular", "Lilita One", sans-serif;
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 400; color: #fff; margin: 0;
  position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap;
}
.tp-regresar-btn {
  display: flex; align-items: center; gap: 10px;
  background: #d92525; border: none; border-radius: 10px;
  padding: 0 24px; height: 60px; cursor: pointer;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap; transition: filter 0.15s;
}
.tp-regresar-btn:hover { filter: brightness(1.1); }
.tp-regresar-icon { width: 36px; height: 36px; object-fit: contain; }

/* Body */
.tp-body {
  flex: 1; display: flex; align-items: stretch;
  justify-content: center; padding: 16px 40px;
}

/* Carpeta */
.tp-carpeta {
  width: 100%; max-width: 1100px; display: flex; flex-direction: column;
}
.tp-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  width: 610px; max-width: 100%;
  padding: 10px 24px 14px;
  box-shadow: 10px 0px 10px 0px rgba(0,0,0,0.25);
}
.tp-tab-titulo {
  font-family: "Ligconsolata:Regular", "Inconsolata", monospace;
  font-size: 38px; color: #000; font-weight: 400; white-space: nowrap;
}

/* Hoja */
.tp-hoja {
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 0 7px 7px 7px;
  padding: 10px 10px 10px 0;
  display: flex; gap: 0; align-items: stretch;
  position: relative; flex: 1;
}

/* Clip */
.tp-clip {
  position: absolute; left: 0; top: 50%;
  transform: translateY(-50%);
  width: 72px; height: auto;
  object-fit: contain; z-index: 2; pointer-events: none;
}

/* X close */
.tp-btn-x {
  position: absolute;
  top: 10px; right: 10px;
  width: 40px; height: 40px;
  background: #d92525;
  border: none; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 3;
}
.tp-btn-x:hover { filter: brightness(1.1); }

/* Tabla wrap */
.tp-tabla-wrap {
  flex: 1; background: #fff;
  border: 1px solid #000; overflow: hidden;
  margin-left: 80px; min-width: 0;
}

/* Tabla */
.tp-tabla { width: 100%; border-collapse: collapse; table-layout: fixed; }

.tp-th {
  background: #d9d9d9; border: 1px solid #000;
  font-family: "Ligconsolata:Bold", "Inconsolata", monospace;
  font-size: 14px; font-weight: 700; color: #000;
  padding: 8px 10px; text-align: left; word-break: break-word;
}

.tp-tr:nth-child(even) { background: #fafafa; }

.tp-td {
  border: 1px solid #d0d0d0;
  font-family: "Ligconsolata:Regular", "Inconsolata", monospace;
  font-size: 13px; color: #000;
  padding: 8px 10px; word-break: break-word; vertical-align: middle;
}
.tp-td-btn { text-align: center; }

.tp-aceptar-btn {
  background: #584848; color: #fff;
  border: none; border-radius: 7px;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 13px; padding: 5px 16px;
  cursor: pointer; transition: filter 0.15s;
  white-space: nowrap; width: 100%; box-sizing: border-box;
}
.tp-aceptar-btn:hover { filter: brightness(1.2); }

/* Footer */
.tp-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

/* Responsive */
@media (max-width: 900px) {
  .tp-tab { width: 100%; }
  .tp-clip { display: none; }
  .tp-tabla-wrap { margin-left: 0; }
  .tp-body { padding: 12px 16px; }
}
@media (max-width: 600px) {
  .tp-header { height: 80px; padding: 0 12px; }
  .tp-logo { width: 180px; height: auto; }
  .tp-regresar-btn { padding: 0 14px; font-size: 18px; height: 48px; }
  .tp-tab-titulo { font-size: 24px; }
  .tp-th { font-size: 12px; padding: 6px 6px; }
  .tp-td { font-size: 11px; padding: 6px 6px; }
}

.tp-input-edit {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  font-family: inherit;
  font-size: inherit;
  border: 1px solid #008a52;
  border-radius: 4px;
  background: #fff;
}
</style>

