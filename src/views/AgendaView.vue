<template>
  <div class="ag-root">

    <!-- ── HEADER ───────────────────────────────────────────── -->
    <header class="ag-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="ag-logo" />
      <h1 class="ag-titulo">AGENDA</h1>
      <button class="ag-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="ag-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ────────────────────────────────────────────── -->
    <div class="ag-body">
      <div class="ag-pantalla">

        <!-- Navegación de mes -->
        <div class="ag-mes-nav">
          <button class="ag-nav-btn" @click="mesAnterior">
            <img :src="`${base}assets/3e56f.png`" alt="" class="ag-flecha ag-flecha-prev" />
            Anterior
          </button>
          <div class="ag-mes-titulo">{{ mesLabel }}</div>
          <button class="ag-nav-btn" @click="mesSiguiente">
            Siguiente
            <img :src="`${base}assets/3e56f.png`" alt="" class="ag-flecha ag-flecha-next" />
          </button>
        </div>

        <!-- Área principal: calendario + opciones -->
        <div class="ag-main">

          <!-- Calendario -->
          <div class="ag-cal-outer">
            <div class="ag-cal-topbar" />
            <div class="ag-cal-inner">
              <div class="ag-cal-grid ag-cal-header">
                <div v-for="dia in diasSemana" :key="dia" class="ag-cal-cell ag-cal-head">{{ dia }}</div>
              </div>
              <div class="ag-cal-sep" />
              <div class="ag-cal-grid ag-cal-body">
                <div
                  v-for="(celda, i) in celdas"
                  :key="i"
                  class="ag-dia-cell"
                  :class="{ 'ag-dia-hoy': esHoy(celda), 'ag-dia-vacio': !celda }"
                  @click="celda && abrirListaDia(celda)"
                >
                  <span v-if="celda" class="ag-dia-num">{{ celda }}</span>
                  <div v-if="celda" class="ag-dia-dots">
                    <span
                      v-for="ev in eventosDelDia(celda)"
                      :key="ev.id"
                      class="ag-dot"
                      :style="{ background: ev.color }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel de Opciones -->
          <div class="ag-opciones-panel">
            <div class="ag-opciones-bg">
              <img :src="`${base}assets/47503.svg`" alt="" class="ag-opciones-bg-img" />
            </div>
            <p class="ag-opciones-titulo">OPCIONES</p>

            <button class="ag-op-btn ag-op-agregar" @click="abrirAgregar">
              <div class="ag-op-icon-wrap">
                <img :src="`${base}assets/516b4.png`" alt="" class="ag-op-cal-img" />
                <img :src="`${base}assets/35d2f.png`" alt="" class="ag-op-badge ag-op-badge-plus" />
              </div>
              <span class="ag-op-label">Agregar Evento</span>
            </button>

            <button class="ag-op-btn ag-op-eliminar" @click="abrirEliminar">
              <div class="ag-op-icon-wrap">
                <img :src="`${base}assets/516b4.png`" alt="" class="ag-op-cal-img" />
                <img :src="`${base}assets/35d2f.png`" alt="" class="ag-op-badge ag-op-badge-x" />
              </div>
              <span class="ag-op-label">Eliminar Evento</span>
            </button>

            <button class="ag-op-btn ag-op-filtrar" @click="showFiltrar = true">
              <div class="ag-op-icon-wrap">
                <img :src="`${base}assets/516b4.png`" alt="" class="ag-op-cal-img" />
                <img :src="`${base}assets/60c79.png`" alt="" class="ag-op-badge ag-op-badge-filter" />
              </div>
              <span class="ag-op-label ag-op-label-dark">Filtrar Evento</span>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ── FOOTER ────────────────────────────────────────────── -->
    <div class="ag-footer" />

    <!-- ══════════ MODAL: AGREGAR EVENTO ══════════ -->
    <Teleport to="body">
      <div v-if="showAgregar" class="ag-overlay">
        <div class="ag-modal ag-modal-agregar">
          <p class="ag-modal-titulo">Agregar evento</p>
          <button class="ag-modal-close" @click="showAgregar = false">✕</button>

          <div class="ag-modal-body">
            <!-- Fecha -->
            <div class="ag-modal-fecha">
              <p class="ag-modal-fecha-dia">{{ diaNombreSeleccionado }}</p>
              <p class="ag-modal-fecha-num">{{ diaSeleccionado }}</p>
              <p class="ag-modal-fecha-mes">{{ mesAnioLabel }}</p>
            </div>


            <!-- Contenido: paso 1 (tipo) o paso 2 (form) -->
            <div class="ag-modal-contenido">

              <!-- PASO 1: seleccionar tipo -->
              <div v-if="pasoAgregar === 1">
                <p class="ag-tipo-titulo">Tipo de evento</p>
                <div class="ag-tipo-cards">
                  <button
                    v-for="tipo in tiposEvento"
                    :key="tipo.id"
                    class="ag-tipo-card"
                    :class="{ 'ag-tipo-selected': tipoSeleccionado === tipo.id }"
                    @click="tipoSeleccionado = tipo.id"
                  >
                    <img :src="`${base}assets/${tipo.img}`" :alt="tipo.label" class="ag-tipo-img" />
                    <span class="ag-tipo-label">{{ tipo.label }}</span>
                  </button>
                </div>
                <div class="ag-modal-actions">
                  <button
                    class="ag-agregar-btn"
                    :class="{ 'ag-agregar-btn-activo': !!tipoSeleccionado }"
                    :disabled="!tipoSeleccionado"
                    @click="pasoAgregar = 2"
                  >
                    <img :src="`${base}assets/b9f9b.png`" alt="" class="ag-agregar-plus" />
                    Agregar
                  </button>
                </div>
              </div>

              <!-- PASO 2: Formulario (Figura 7.3) -->
              <div v-else class="ag-form-paso2">
                <p class="ag-tipo-titulo">Detalles del evento</p>

                <!-- Nombre del evento -->
                <div class="ag-form-field">
                  <label class="ag-form-label">Nombre del evento</label>
                  <input
                    v-if="tipoSeleccionado === 'otro'"
                    v-model="nuevoEvento.titulo"
                    class="ag-form-input"
                    placeholder="Nombre del evento"
                  />
                  <input
                    v-else
                    :value="nombreAutoEvento"
                    readonly
                    class="ag-form-input ag-form-readonly"
                  />
                </div>

                <!-- Nota -->
                <div class="ag-form-field">
                  <label class="ag-form-label">Nota</label>
                  <textarea
                    v-model="nuevoEvento.descripcion"
                    class="ag-form-input ag-form-textarea"
                    rows="3"
                    placeholder="Detalles, objetivos o dirección de la reunión…"
                  />
                </div>

                <!-- Color -->
                <div class="ag-form-field">
                  <label class="ag-form-label">Color</label>
                  <div class="ag-color-swatches">
                    <button
                      v-for="color in colorOptions"
                      :key="color"
                      class="ag-color-swatch"
                      :class="{ 'ag-color-selected': nuevoEvento.color === color }"
                      :style="{ background: color }"
                      @click="nuevoEvento.color = color"
                    />
                  </div>
                </div>
                
                <!-- Horario -->
              <div class="ag-form-field">
                <label class="ag-form-label" for="hora-inicio">Hora de inicio</label>
                <input
                  id="hora-inicio"
                  v-model="nuevoEvento.hora_inicio"
                  type="time"
                  class="ag-form-input"
                  required
                  @click="($event.target as HTMLInputElement).showPicker()"
                />
              </div>    
            <div class="ag-form-field">
              <label class="ag-form-label" for="hora-Fin">Hora de fin</label>
              <input
                id="hora-inicio"
                v-model="nuevoEvento.hora_fin"
                type="time"
                class="ag-form-input"
                required
                @click="($event.target as HTMLInputElement).showPicker()"
              />
            </div>

                <!-- Recordatorio -->
                <div class="ag-form-field">
                  <label class="ag-form-label">
                    <input
                      v-model="nuevoEvento.recordatorio"
                      type="checkbox"
                    />
                    Recordarme 10 minutos antes
                  </label>
                </div>
                <div class="ag-modal-actions">
                  <button class="ag-agregar-btn ag-btn-back" @click="pasoAgregar = 1">← Volver</button>
                  <button
                    class="ag-agregar-btn"
                    :class="{ 'ag-agregar-btn-activo': formularioLleno }"
                    :disabled="tipoSeleccionado === 'otro' && !nuevoEvento.titulo.trim()"
                    @click="guardarEvento"
                  >
                    <img :src="`${base}assets/b9f9b.png`" alt="" class="ag-agregar-plus" />
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════ MODAL: ELIMINAR — LISTA (Fig 7.4) ══════════ -->
    <Teleport to="body">
      <div v-if="showEliminar" class="ag-overlay">
        <div class="ag-modal ag-modal-agregar">
          <p class="ag-modal-titulo ag-modal-titulo-rojo">Eliminar evento</p>
          <button class="ag-modal-close" @click="showEliminar = false">✕</button>

          <div class="ag-modal-body">
            <!-- Fecha -->
            <div class="ag-modal-fecha">
              <p class="ag-modal-fecha-dia">{{ diaNombreEliminar }}</p>
              <p class="ag-modal-fecha-num">{{ diaSeleccionadoEliminar }}</p>
              <p class="ag-modal-fecha-mes">{{ mesAnioLabel }}</p>
            </div>

            <!-- Lista de eventos -->
            <div class="ag-elim-contenido">
              <div class="ag-elim-header">
                <p class="ag-elim-pregunta">¿Qué evento desea eliminar?</p>
                <button
                  class="ag-btn-elim-accion"
                  :disabled="!eventoEliminar"
                  @click="confirmarEliminar"
                >
                  <img :src="`${base}assets/355e9.png`" alt="" class="ag-trash-icon" />
                  Eliminar
                </button>
              </div>

              <div class="ag-elim-scroll-wrap">
                <div v-if="eventosParaEliminar.length === 0" class="ag-elim-vacio">
                  No hay eventos en este mes.
                </div>
                <div
                  v-for="ev in eventosParaEliminar"
                  :key="ev.id"
                  class="ag-elim-card"
                  :class="{ 'ag-elim-card-selected': eventoEliminar === ev.id }"
                  @click="eventoEliminar = ev.id"
                >
                  <div class="ag-elim-card-header" :style="{ background: ev.color }">
                    <img :src="`${base}assets/ab4ba.svg`" alt="" class="ag-elim-circle" />
                    <span class="ag-elim-card-titulo">{{ ev.titulo.toUpperCase() }}</span>
                  </div>
                  <div class="ag-elim-card-body" :style="{ background: ev.color + '40' }">
                    {{ ev.descripcion || "Sin descripción." }}
                  </div>
                </div>

                <p class="ag-elim-nota">Los eventos del sistema no pueden eliminarse</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════ MODAL: CONFIRMACIÓN ELIMINAR (Fig 7.5) ══════════ -->
    <Teleport to="body">
      <div v-if="showConfirm" class="ag-overlay">
        <div class="ag-modal ag-modal-confirm">
          <p class="ag-confirm-pregunta">
            ¿ESTÁ SEGURO DE ELIMINAR
            <span class="ag-confirm-nombre">"{{ tituloParaEliminar }}"</span>
            DE LA LISTA DE EVENTOS?
          </p>
          <div class="ag-confirm-botones">
            <button class="ag-confirm-btn ag-confirm-cancelar" @click="showConfirm = false; showEliminar = true">
              Cancelar
            </button>
            <button class="ag-confirm-btn ag-confirm-eliminar" @click="ejecutarEliminar">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════ MODAL: LISTA DE EVENTOS DEL DÍA (Fig 54:1285) ══════════ -->
    <Teleport to="body">
      <div v-if="showListaDia" class="ag-overlay">
        <div class="ag-lista-modal">

          <!-- Header -->
          <div class="ag-lista-header">
            <h2 class="ag-lista-titulo">Lista de eventos</h2>
            <button class="ag-lista-close" @click="showListaDia = false">✕</button>
          </div>

          <!-- Body -->
          <div class="ag-modal-body">

            <!-- Panel fecha -->
            <div class="ag-modal-fecha ag-lista-fecha-panel">
              <p class="ag-modal-fecha-dia">{{ diaNombreLista }}</p>
              <p class="ag-modal-fecha-num">{{ diaLista }}</p>
              <p class="ag-modal-fecha-mes">{{ mesAnioLabel }}</p>
            </div>

            <!-- Panel eventos -->
            <div class="ag-lista-contenido">
              <p class="ag-lista-dia-titulo">EVENTOS DEL DÍA</p>

              <div class="ag-lista-scroll">

                <div class="ag-lista-seccion-bar">EVENTOS</div>
                <template v-if="eventosUsuarioHoy.length">
                  <div v-for="ev in eventosUsuarioHoy" :key="ev.id" class="ag-lista-card">
                    <div class="ag-lista-card-header" :style="{ background: ev.color }">
                      <div class="ag-lista-icon-box">
                        <img :src="`${base}assets/a026a.png`" alt="" class="ag-lista-icon-img" />
                      </div>
                      <span class="ag-lista-card-titulo">{{ ev.titulo.toUpperCase() }}</span>
                    </div>
                    <div class="ag-lista-card-body" :style="{ background: ev.color + '40' }">
                      <span class="ag-lista-nota-text">{{ ev.descripcion || "- Nota del usuario -" }}</span>
                    </div>
                  </div>
                </template>
                <p v-else class="ag-lista-empty-msg">Sin eventos registrados.</p>

              </div>

              <!-- Arrows -->
              <div class="ag-lista-arrows">
                <button class="ag-lista-arrow-btn ag-lista-arrow-up" @click="scrollLista(-80)">
                  <img :src="`${base}assets/adf9a.png`" alt="▲" class="ag-lista-arrow-img ag-lista-arrow-img-up" />
                </button>
                <button class="ag-lista-arrow-btn ag-lista-arrow-dn" @click="scrollLista(80)">
                  <img :src="`${base}assets/adf9a.png`" alt="▼" class="ag-lista-arrow-img" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════ MODAL: ÉXITO ELIMINACIÓN (Fig 7.6) ══════════ -->
    <Teleport to="body">
      <div v-if="showExito" class="ag-overlay">
        <div class="ag-modal ag-modal-exito">
          <p class="ag-exito-msg">El evento se ha eliminado correctamente</p>
          <button class="ag-exito-btn" @click="showExito = false">Aceptar</button>
        </div>
      </div>
    </Teleport>

    <!-- ══════════ MODAL: FILTRAR EVENTOS (Fig 7.7) ══════════ -->
    <Teleport to="body">
      <div v-if="showFiltrar" class="ag-overlay">
        <div class="ag-modal-filtrar-wrap">

          <!-- Botón X -->
          <button class="ag-filtrar-close" @click="showFiltrar = false">✕</button>

          <!-- Cabecera + separador horizontal -->
          <div class="ag-filtrar-header">
            <span class="ag-filtrar-titulo">Filtrar eventos</span>
          </div>
          <div class="ag-filtrar-sep-h">
            <img :src="`${base}assets/ac76b.svg`" alt="" class="ag-filtrar-line-h" />
          </div>

          <!-- Cuerpo: separador vertical + opciones -->
          <div class="ag-filtrar-body">
            <div class="ag-filtrar-sep-v">
              <img :src="`${base}assets/35622.svg`" alt="" class="ag-filtrar-line-v" />
            </div>

            <div class="ag-filtrar-opciones">
              <div
                v-for="opcion in opcionesFiltro"
                :key="opcion.id"
                class="ag-filtrar-row"
                @click="filtroRadio = opcion.id"
              >
                <!-- Radio circle -->
                <div class="ag-radio-wrap">
                  <img :src="`${base}assets/ab4ba.svg`" alt="" class="ag-radio-outer" />
                  <img
                    :src="filtroRadio === opcion.id
                      ? `${base}assets/169b8.svg`
                      : `${base}assets/afbee.svg`"
                    alt=""
                    class="ag-radio-inner"
                  />
                </div>
                <!-- Label -->
                <span class="ag-filtrar-label">{{ opcion.label }}</span>
              </div>
            </div>
          </div>

          <!-- Botón Aceptar -->
          <div class="ag-filtrar-footer">
            <button class="ag-aceptar-btn" @click="aplicarFiltro">
              Aceptar
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const base   = import.meta.env.BASE_URL
const authStore = useAuthStore()

// ── Estado del calendario ──────────────────────────────────────
const hoy    = new Date()
const anio   = ref(hoy.getFullYear())
const mes    = ref(hoy.getMonth())

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
               "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

const mesLabel   = computed(() => `${MESES[mes.value].toUpperCase()} ${anio.value}`)
const mesAnioLabel = computed(() => `${MESES[mes.value].toUpperCase()} ${anio.value}`)

function mesAnterior() { if (mes.value === 0) { mes.value = 11; anio.value-- } else mes.value-- }
function mesSiguiente() { if (mes.value === 11) { mes.value = 0; anio.value++ } else mes.value++ }

const celdas = computed(() => {
  const primerDia = new Date(anio.value, mes.value, 1)
  let offset = primerDia.getDay() - 1
  if (offset < 0) offset = 6
  const diasEnMes = new Date(anio.value, mes.value + 1, 0).getDate()
  const arr: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= diasEnMes; d++) arr.push(d)
  while (arr.length % 7 !== 0) arr.push(null)
  return arr
})

function esHoy(dia: number | null): boolean {
  if (!dia) return false
  return dia === hoy.getDate() && mes.value === hoy.getMonth() && anio.value === hoy.getFullYear()
}

function fechaKey(dia: number, m?: number, a?: number): string {
  const mm = m ?? mes.value
  const aa = a ?? anio.value
  return `${aa}-${String(mm + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
}

// ── Tipos UI ↔ BD ──────────────────────────────────────────────
type TipoUI = "cita" | "reunion" | "otro"
type TipoBD = "Llamada" | "Visita" | "Reunion" | "Seguimiento" | "Otro"

function tipoUIaTipoBD(tipo: TipoUI): TipoBD {
  if (tipo === "cita")    return "Llamada"
  if (tipo === "reunion") return "Reunion"
  return "Otro"
}
function tipoBDaTipoUI(tipo: string): TipoUI {
  if (tipo === "Llamada" || tipo === "Visita" || tipo === "Seguimiento") return "cita"
  if (tipo === "Reunion") return "reunion"
  return "otro"
}

// ── Eventos ────────────────────────────────────────────────────
interface AgendaEvento {
  id: number
  date: string
  tipo: TipoUI
  titulo: string
  descripcion: string
  color: string
  hora_inicio: string | null
  hora_fin: string | null
}

const eventos = ref<AgendaEvento[]>([])

onMounted(async () => {
  const empleadoId = authStore.empleado?.id
  if (!empleadoId) return
  try {
    const { agendaService } = await import("@/services/agendaService")
    const data = await agendaService.listarPorEmpleado(empleadoId)
    eventos.value = data.map((e) => ({
      id: e.id,
      date: e.fecha,
      tipo: tipoBDaTipoUI(e.tipo),
      titulo: e.titulo,
      descripcion: e.descripcion ?? "",
      color: e.color,
      hora_inicio: e.hora_inicio ?? null,
      hora_fin: e.hora_fin ?? null,
    }))
  } catch (err) {
    console.error("Error cargando agenda:", err)
  }
})

function eventosDelDia(dia: number): AgendaEvento[] {
  const key = fechaKey(dia)
  const base_ = filtroActivo.value.length
    ? eventos.value.filter(e => filtroActivo.value.includes(e.tipo))
    : eventos.value
  return base_.filter(e => e.date === key)
}

const todoEventosMes = computed(() => {
  const prefix = `${anio.value}-${String(mes.value + 1).padStart(2, "0")}-`
  return eventos.value.filter(e => e.date.startsWith(prefix))
})

// ── Tipos de evento ────────────────────────────────────────────
const tiposEvento = [
  { id: "cita",    label: "Cita con cliente",      img: "54fcb.png", color: "#ee68c1" },
  { id: "reunion", label: "Reunión administrativa", img: "31924.png", color: "#008a52" },
  { id: "otro",    label: "Otro",                   img: "7869e.png", color: "#ffa352" },
] as const

const colorOptions = [
  "#ee68c1","#008a52","#ffa352","#5170ff",
  "#fff740","#cf1127","#1cb2f4","#a97c50",
]

function colorPorTipo(tipo: string): string {
  return tiposEvento.find(t => t.id === tipo)?.color ?? "#aaa"
}

// ── Modal: Lista de eventos del día ───────────────────────────
const showListaDia = ref(false)
const diaLista     = ref(hoy.getDate())

const diaNombreLista = computed(() => {
  const d = new Date(anio.value, mes.value, diaLista.value)
  return DIAS_NOMBRE[d.getDay()].toUpperCase()
})

const eventosUsuarioHoy = computed(() => {
  const key = fechaKey(diaLista.value)
  return eventos.value.filter(e => e.date === key)
})

function scrollLista(delta: number) {
  const el = document.querySelector(".ag-lista-scroll") as HTMLElement | null
  if (el) el.scrollTop += delta
}

function abrirListaDia(dia: number) {
  diaLista.value = dia
  showListaDia.value = true
}

// ── Modal: Agregar ─────────────────────────────────────────────
const showAgregar      = ref(false)
const pasoAgregar      = ref(1)
const diaSeleccionado  = ref(hoy.getDate())
const tipoSeleccionado = ref<"cita" | "reunion" | "otro" | "">("")
const nuevoEvento = ref({
  titulo: "",
  descripcion: "",
  color: "#ee68c1",
  hora_inicio: "09:00",
  hora_fin: "",
  recordatorio: true,
})

const DIAS_NOMBRE = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
const diaNombreSeleccionado = computed(() => {
  const d = new Date(anio.value, mes.value, diaSeleccionado.value)
  return DIAS_NOMBRE[d.getDay()].toUpperCase()
})
const nombreAutoEvento = computed(() => {
  if (tipoSeleccionado.value === "cita")    return "Cita con cliente"
  if (tipoSeleccionado.value === "reunion") return "Reunión administrativa"
  return ""
})

const formularioLleno = computed(() => {
  if (pasoAgregar.value === 1) return !!tipoSeleccionado.value
  if (tipoSeleccionado.value === "otro") return !!nuevoEvento.value.titulo.trim()
  return !!tipoSeleccionado.value
})

function abrirAgregar() {
  pasoAgregar.value      = 1
  tipoSeleccionado.value = ""
nuevoEvento.value = {
  titulo: "",
  descripcion: "",
  color: "#ee68c1",
  hora_inicio: "09:00",
  hora_fin: "",
  recordatorio: true,
}
  showAgregar.value      = true
}
function abrirDiaAgregar(dia: number) {
  diaSeleccionado.value = dia
  abrirAgregar()
}


async function guardarEvento() {
  const titulo = tipoSeleccionado.value === "otro"
    ? nuevoEvento.value.titulo.trim()
    : nombreAutoEvento.value

  if (!titulo) return

  const empleadoId = authStore.empleado?.id
  if (!empleadoId) {
    showAgregar.value = false
    return
  }

  const fecha = fechaKey(diaSeleccionado.value)

  try {
    const { agendaService } = await import("@/services/agendaService")

    const saved = await agendaService.crear({
      id_empleado: empleadoId,
      id_prospecto: null,
      titulo,
      descripcion: nuevoEvento.value.descripcion || null,
      fecha,
      hora_inicio: nuevoEvento.value.hora_inicio || null,
      hora_fin: nuevoEvento.value.hora_fin || null,
      tipo: tipoUIaTipoBD(tipoSeleccionado.value as TipoUI),
      color: nuevoEvento.value.color || colorPorTipo(tipoSeleccionado.value),
      completado: false,
      recordatorio_activo: nuevoEvento.value.recordatorio,
      recordatorio_minutos: 10,
      recordatorio_disparado: false,
      recordatorio_atendido: false,
    })

    eventos.value = [...eventos.value, {
      id: saved.id,
      date: saved.fecha,
      tipo: tipoBDaTipoUI(saved.tipo),
      titulo: saved.titulo,
      descripcion: saved.descripcion ?? "",
      color: saved.color,
      hora_inicio: saved.hora_inicio ?? null,
      hora_fin: saved.hora_fin ?? null,
    }]
  } catch (err) {
    console.error("Error guardando evento:", err)
  } finally {
    showAgregar.value = false
  }
}

// ── Modal: Eliminar — lista ────────────────────────────────────
const showEliminar              = ref(false)
const eventoEliminar            = ref<number | null>(null)
const diaSeleccionadoEliminar   = ref(hoy.getDate())
const diaNombreEliminar = computed(() => {
  const d = new Date(anio.value, mes.value, diaSeleccionadoEliminar.value)
  return DIAS_NOMBRE[d.getDay()].toUpperCase()
})
const eventosParaEliminar = computed(() => todoEventosMes.value)

function abrirEliminar() {
  eventoEliminar.value = null
  diaSeleccionadoEliminar.value = hoy.getDate()
  showEliminar.value = true
}

// ── Modal: Confirmación ────────────────────────────────────────
const showConfirm       = ref(false)
const tituloParaEliminar = computed(() => {
  return eventos.value.find(e => e.id === eventoEliminar.value)?.titulo ?? ""
})

function confirmarEliminar() {
  if (!eventoEliminar.value) return
  showEliminar.value = false
  showConfirm.value  = true
}

// ── Modal: Éxito ───────────────────────────────────────────────
const showExito = ref(false)

async function ejecutarEliminar() {
  if (!eventoEliminar.value) return
  try {
    const { agendaService } = await import("@/services/agendaService")
    await agendaService.eliminar(eventoEliminar.value)
    eventos.value = eventos.value.filter(e => e.id !== eventoEliminar.value)
  } catch (err) {
    console.error("Error eliminando evento:", err)
  } finally {
    eventoEliminar.value = null
    showConfirm.value    = false
    showExito.value      = true
  }
}

// ── Modal: Filtrar ─────────────────────────────────────────────
const showFiltrar  = ref(false)
const filtroRadio  = ref<string>("todos") // "todos" | "cita" | "reunion" | "otro"
const filtroActivo = ref<string[]>([])

const opcionesFiltro = [
  { id: "todos",   label: "Eventos del sistema" },
  { id: "cita",    label: "Cita con cliente"     },
  { id: "reunion", label: "Reunión Admin."        },
  { id: "otro",    label: "Otro"                  },
]

function aplicarFiltro() {
  filtroActivo.value = filtroRadio.value === "todos" ? [] : [filtroRadio.value]
  showFiltrar.value  = false
}

// ── Navegación ─────────────────────────────────────────────────
function regresar() { router.push({ name: "Dashboard" }) }
</script>

<style scoped>
/* ── Raíz ───────────────────────────────────────────────────── */
.ag-root { min-height: 100vh; background: #3a2422; display: flex; flex-direction: column; }

/* ── Header ─────────────────────────────────────────────────── */
.ag-header {
  background: #008a52; height: 100px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; flex-shrink: 0; position: relative;
}
.ag-logo { width: 296px; height: 69px; object-fit: contain; object-position: left center; display: block; flex-shrink: 0; }
.ag-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 40px; font-weight: 400; color: #fff; margin: 0;
  position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap;
}
.ag-regresar-btn {
  display: flex; align-items: center; gap: 10px;
  background: #d92525; border: none; border-radius: 10px;
  padding: 0 24px; height: 60px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap; transition: filter 0.15s;
}
.ag-regresar-btn:hover { filter: brightness(1.1); }
.ag-regresar-icon { width: 36px; height: 36px; object-fit: contain; }

/* ── Body ───────────────────────────────────────────────────── */
.ag-body { flex: 1; display: flex; align-items: stretch; justify-content: center; padding: 20px 32px; }
.ag-pantalla {
  width: 100%; max-width: 1060px;
  background: #ebd2aa; border-radius: 8px;
  padding: 16px 18px 20px;
  display: flex; flex-direction: column; gap: 12px;
}

/* ── Mes nav ─────────────────────────────────────────────────── */
.ag-mes-nav { display: flex; align-items: center; gap: 10px; }
.ag-nav-btn {
  display: flex; align-items: center; gap: 8px;
  background: #d7d6d4; border: none; border-radius: 10px;
  padding: 0 20px; height: 48px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 16px; color: #7f7f7f; transition: filter 0.15s;
}
.ag-nav-btn:hover { filter: brightness(0.95); }
.ag-flecha { width: 28px; height: 28px; object-fit: contain; }
.ag-flecha-next { transform: rotate(180deg); }
.ag-mes-titulo {
  flex: 1; text-align: center;
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 32px; color: #484848;
}

/* ── Área principal ──────────────────────────────────────────── */
.ag-main { display: flex; gap: 18px; align-items: flex-start; flex: 1; }

/* ── Calendario ─────────────────────────────────────────────── */
.ag-cal-outer { flex: 1; display: flex; flex-direction: column; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
.ag-cal-topbar { height: 16px; background: linear-gradient(to bottom, #da2527, #bf133b); }
.ag-cal-inner { background: #d7d6d4; }
.ag-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
.ag-cal-header { background: #fff; border-radius: 6px 6px 0 0; }
.ag-cal-head {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 16px; color: #615d5d; text-align: center; padding: 6px 4px;
}
.ag-cal-sep { height: 4px; background: linear-gradient(to right, #1cb2f4, #4a63f3); box-shadow: 4px 1px 4px rgba(0,0,0,0.25); }
.ag-cal-body { gap: 2px; padding: 2px; background: #d7d6d4; }
.ag-dia-cell {
  background: #fff; border-radius: 2px;
  min-height: 58px; padding: 4px 6px;
  cursor: pointer; position: relative; transition: background 0.12s;
}
.ag-dia-cell:hover { background: #f0f6ff; }
.ag-dia-vacio { background: transparent !important; cursor: default; }
.ag-dia-hoy { background: #e8f5e9 !important; }
.ag-dia-hoy .ag-dia-num { color: #008a52; font-weight: 700; }
.ag-dia-num { font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif; font-size: 16px; color: #615d5d; line-height: 1; }
.ag-dia-dots { display: flex; flex-wrap: wrap; gap: 3px; position: absolute; bottom: 4px; left: 5px; }
.ag-dot { width: 9px; height: 9px; border-radius: 2px; display: inline-block; }

/* ── Panel opciones ──────────────────────────────────────────── */
.ag-opciones-panel {
  width: 145px; flex-shrink: 0;
  display: flex; flex-direction: column; align-items: center;
  position: relative; padding-top: 8px;
}
.ag-opciones-bg { position: absolute; inset: 0; pointer-events: none; }
.ag-opciones-bg-img { width: 100%; height: 100%; object-fit: fill; }
.ag-opciones-titulo {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 20px; color: #584848; text-align: center; margin: 0 0 8px; position: relative; z-index: 1;
}
.ag-op-btn {
  width: 125px; height: 118px; border: none; border-radius: 5px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  padding: 0 0 10px; position: relative; z-index: 1;
  transition: filter 0.15s; margin-bottom: 8px; overflow: hidden;
}
.ag-op-btn:hover { filter: brightness(1.1); }
.ag-op-agregar  { background: linear-gradient(to bottom, #7cc91a, #1ba547); }
.ag-op-eliminar { background: linear-gradient(to bottom, #da2527, #bf133b); }
.ag-op-filtrar  { background: linear-gradient(to bottom, #fff740, #f3ea17); }
.ag-op-icon-wrap { position: absolute; top: 7px; left: 18px; width: 78px; height: 78px; }
.ag-op-cal-img { width: 78px; height: 78px; object-fit: contain; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25)); }
.ag-op-badge { position: absolute; bottom: -2px; right: -16px; width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25)); }
.ag-op-badge-x { transform: rotate(-45deg); }
.ag-op-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 11px; color: rgba(255,255,255,0.85); text-align: center; width: 107px; line-height: 1.2; z-index: 1;
}
.ag-op-label-dark { color: rgba(97,93,93,0.85); }

/* ── Footer ─────────────────────────────────────────────────── */
.ag-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

/* ══ Overlay ════════════════════════════════════════════════════ */
.ag-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.76);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}

/* ══ Modal base ════════════════════════════════════════════════ */
.ag-modal {
  background: rgba(255,255,255,0.97); border-radius: 5px;
  padding: 28px 32px; position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.ag-modal-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 40px; margin: 0 0 16px; text-align: center;
  padding-right: 52px;
  background: linear-gradient(to right, #615d5d 20%, #3c3b3b);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ag-modal-titulo-rojo {
  background: linear-gradient(to right, #615d5d 20%, #3c3b3b) !important;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ag-modal-titulo-amarillo {
  background: linear-gradient(to right, #d4a017, #a07010) !important;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ag-modal-close {
  position: absolute; top: 12px; right: 14px;
  background: #d92525; color: #fff; border: none; border-radius: 5px;
  width: 40px; height: 40px; cursor: pointer; font-size: 16px; font-weight: 700;
}

/* ══ Modal Lista de Eventos del Día ═════════════════════════════ */
.ag-lista-modal {
  background: rgba(255,255,255,0.97); border-radius: 5px;
  width: 860px; max-width: 96vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.ag-lista-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 28px 12px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.ag-lista-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 40px; margin: 0; font-weight: 400;
  background: linear-gradient(to right, #615d5d 20%, #3c3b3b);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  text-shadow: 2px 4px 4px rgba(0,0,0,0.25);
  flex: 1; text-align: center;
}
.ag-lista-close {
  background: #d92525; color: #fff; border: none; border-radius: 5px;
  width: 40px; height: 40px; cursor: pointer; font-size: 16px; font-weight: 700;
  flex-shrink: 0;
}
.ag-lista-fecha-panel { border-radius: 5px 0 0 5px; }
.ag-lista-contenido {
  flex: 1; display: flex; flex-direction: column; position: relative;
  background: #fff; border-radius: 0 5px 5px 5px; padding: 14px 48px 14px 16px; min-height: 300px;
}
.ag-lista-dia-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 20px; color: #615d5d; text-align: center; margin: 0 0 8px;
}
.ag-lista-scroll { flex: 1; overflow-y: auto; max-height: 260px; display: flex; flex-direction: column; gap: 0; }
.ag-lista-seccion-bar {
  background: #969696; color: #fff;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 14px; padding: 4px 10px;
  box-shadow: 3px 3px 4px rgba(0,0,0,0.25); margin-bottom: 0;
}
.ag-lista-card { margin-bottom: 8px; border-radius: 2px; }
.ag-lista-card-header {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 10px; border-radius: 2px 2px 0 0;
}
.ag-lista-icon-box {
  background: #fff; border-radius: 2px; width: 30px; height: 28px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ag-lista-icon-img { width: 22px; height: 22px; object-fit: contain; }
.ag-lista-card-titulo {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 22px; color: #fff; font-weight: 400;
}
.ag-lista-card-body {
  padding: 6px 12px; border-radius: 0 0 2px 2px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 13px; color: #615d5d;
}
.ag-lista-nota-list { margin: 0; padding-left: 18px; }
.ag-lista-nota-list li { list-style: disc; }
.ag-lista-nota-text { display: block; }
.ag-lista-empty-msg {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 13px; color: #aaa; padding: 6px 10px 10px; text-align: center;
}
.ag-lista-arrows {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 8px;
}
.ag-lista-arrow-btn {
  background: #635251; border: none; border-radius: 5px;
  width: 25px; height: 25px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; padding: 0;
}
.ag-lista-arrow-btn:hover { filter: brightness(1.2); }
.ag-lista-arrow-img { width: 14px; height: 14px; object-fit: contain; transform: rotate(90deg); }
.ag-lista-arrow-img-up { transform: rotate(-90deg); }

/* ── Modal Agregar ───────────────────────────────────────────── */
.ag-modal-agregar {
  width: 860px;
  max-width: 96vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ag-modal-body {
  display: flex;
  gap: 0;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.ag-modal-fecha {
  width: 152px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 5px 0 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-right: 2px solid #ddd;
  box-sizing: border-box;
}

.ag-modal-fecha-dia {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 22px;
  color: #615d5d;
  margin: 0 0 6px;
}

.ag-modal-fecha-num {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 48px;
  color: #615d5d;
  margin: 0 0 4px;
  line-height: 1;
}

.ag-modal-fecha-mes {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 16px;
  color: #615d5d;
  margin: 0;
  text-align: center;
}

.ag-modal-contenido {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #fff;
  border-radius: 0 5px 5px 0;
  padding: 20px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .ag-modal-agregar {
    width: 96vw;
    max-width: 96vw;
    max-height: 92vh;
  }

  .ag-modal-body {
    flex-direction: column;
    overflow-y: auto;
  }

  .ag-modal-fecha {
    width: 100%;
    flex-shrink: 0;
    padding: 12px;
    border-right: none;
    border-bottom: 2px solid #ddd;
    border-radius: 5px 5px 0 0;
  }

  .ag-modal-contenido {
    overflow: visible;
    padding: 16px;
  }
}

/* ── Tipos ───────────────────────────────────────────────────── */
.ag-tipo-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif; font-size: 22px; color: #615d5d;
  text-align: center; margin: 0 0 16px; text-shadow: 0px 4px 4px rgba(0,0,0,0.25);
}
.ag-tipo-cards { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.ag-tipo-card {
  background: #efece9; border: 2px solid transparent; border-radius: 4px; padding: 12px;
  cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 160px;
  transition: border-color 0.15s, box-shadow 0.15s; box-shadow: 0 4px 4px rgba(0,0,0,0.25);
}
.ag-tipo-card:hover { border-color: #aaa; }
.ag-tipo-selected { border-color: #008a52 !important; box-shadow: 0 0 0 3px rgba(0,138,82,0.2) !important; background: #c8e8d8 !important; }
.ag-tipo-img { width: 80px; height: 80px; object-fit: contain; }
.ag-tipo-label {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif; font-size: 14px; color: #615d5d; text-align: center;
}

/* ── Paso 2 form ─────────────────────────────────────────────── */
.ag-form-paso2 { display: flex; flex-direction: column; gap: 14px; }
.ag-form-field { display: flex; flex-direction: column; gap: 4px; }
.ag-form-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif; font-size: 13px; font-weight: 700; color: #444;
}
.ag-form-input {
  border: 1px solid #bbb; border-radius: 5px; padding: 7px 10px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 14px; outline: none; background: #fff; color: #000;
}
.ag-form-input:focus { border-color: #008a52; }
.ag-form-readonly { background: #ede3c8; color: #555; cursor: default; }
.ag-form-textarea { resize: vertical; min-height: 60px; }

/* Color swatches */
.ag-color-swatches { display: flex; gap: 10px; flex-wrap: wrap; padding: 4px 0; }
.ag-color-swatch {
  width: 32px; height: 32px; border-radius: 6px; cursor: pointer;
  border: 2px solid transparent; transition: transform 0.1s, border-color 0.1s;
}
.ag-color-swatch:hover { transform: scale(1.12); }
.ag-color-selected { border-color: #333 !important; transform: scale(1.18) !important; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #333; }

/* ── Botones compartidos ─────────────────────────────────────── */
.ag-modal-actions { display: flex; gap: 12px; justify-content: center; margin-top: 18px; }
.ag-agregar-btn {
  display: flex; align-items: center; gap: 8px;
  background: #a7d6e4; color: #fff; border: none; border-radius: 5px;
  padding: 8px 20px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 15px; cursor: pointer; transition: filter 0.15s;
}
.ag-agregar-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ag-agregar-btn:not(:disabled):hover { filter: brightness(1.1); }
.ag-agregar-btn-activo { background: #5a9ab5 !important; }
.ag-agregar-plus { width: 20px; height: 20px; object-fit: contain; }
.ag-btn-back { background: #888; }

/* ══ Modal Eliminar lista ════════════════════════════════════════ */
.ag-elim-contenido { flex: 1; padding: 0 16px; display: flex; flex-direction: column; gap: 10px; }
.ag-elim-header { display: flex; align-items: center; justify-content: space-between; padding: 0 0 6px; }
.ag-elim-pregunta {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 20px; color: #615d5d; margin: 0;
  text-shadow: 0px 4px 4px rgba(0,0,0,0.25);
}
.ag-btn-elim-accion {
  display: flex; align-items: center; gap: 8px;
  background: #f0afaf; color: #fff; border: none; border-radius: 5px;
  padding: 6px 16px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 14px; transition: filter 0.15s; white-space: nowrap;
}
.ag-btn-elim-accion:disabled { opacity: 0.4; cursor: not-allowed; }
.ag-btn-elim-accion:not(:disabled) { background: #d92525; }
.ag-btn-elim-accion:not(:disabled):hover { filter: brightness(1.1); }
.ag-trash-icon { width: 18px; height: 18px; object-fit: contain; }

.ag-elim-scroll-wrap { flex: 1; overflow-y: auto; max-height: 260px; display: flex; flex-direction: column; gap: 8px; }

.ag-elim-card {
  border-radius: 2px; cursor: pointer;
  outline: 2px solid transparent; transition: outline-color 0.12s;
}
.ag-elim-card:hover { outline-color: #888; }
.ag-elim-card-selected { outline-color: #d92525 !important; }

.ag-elim-card-header {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 2px 2px 0 0;
}
.ag-elim-circle { width: 22px; height: 22px; object-fit: contain; }
.ag-elim-card-titulo {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 18px; color: #fff; font-weight: 400;
}
.ag-elim-card-body {
  padding: 6px 12px; border-radius: 0 0 2px 2px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 12px; color: #615d5d;
}
.ag-elim-vacio {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 15px; color: #888; text-align: center; padding: 20px;
}
.ag-elim-nota {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 13px; color: #615d5d; text-align: center; margin-top: 8px;
}

/* ══ Modal Confirmación (Fig 7.5) ════════════════════════════════ */
.ag-modal-confirm { width: 620px; max-width: 96vw; padding: 40px 48px; }
.ag-confirm-pregunta {
  font-family: 'Londrina Solid:Regular', 'Londrina Solid', sans-serif;
  font-size: 36px; color: #615d5d; text-align: center; margin: 0 0 32px; line-height: 1.2;
}
.ag-confirm-nombre { color: #3c3b3b; }
.ag-confirm-botones { display: flex; gap: 20px; justify-content: center; }
.ag-confirm-btn {
  border: none; border-radius: 8px; padding: 12px 36px;
  font-family: 'Londrina Solid:Regular', 'Londrina Solid', sans-serif;
  font-size: 22px; cursor: pointer; transition: filter 0.15s;
}
.ag-confirm-cancelar { background: #b0aaa8; color: #fff; }
.ag-confirm-cancelar:hover { filter: brightness(1.05); }
.ag-confirm-eliminar { background: #d92525; color: #fff; }
.ag-confirm-eliminar:hover { filter: brightness(1.1); }

/* ══ Modal Éxito (Fig 7.6) ════════════════════════════════════════ */
.ag-modal-exito { width: 540px; max-width: 96vw; padding: 48px 40px; }
.ag-exito-msg {
  font-family: 'Londrina Solid:Regular', 'Londrina Solid', sans-serif;
  font-size: 36px; color: #615d5d; text-align: center; margin: 0 0 32px; line-height: 1.3;
}
.ag-exito-btn {
  display: block; margin: 0 auto;
  background: #008a52; color: #fff; border: none; border-radius: 8px;
  padding: 12px 48px;
  font-family: 'Londrina Solid:Regular', 'Londrina Solid', sans-serif;
  font-size: 22px; cursor: pointer; transition: filter 0.15s;
}
.ag-exito-btn:hover { filter: brightness(1.1); }

/* ══ Modal Filtrar (Fig 7.7) ════════════════════════════════════ */
.ag-modal-filtrar-wrap {
  background: #fff; border-radius: 14px;
  width: 331px; max-width: 96vw;
  box-shadow: inset 0px 4px 4px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.4);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
}
.ag-filtrar-close {
  position: absolute; top: 10px; right: 10px;
  background: #d92525; color: #fff; border: none; border-radius: 5px;
  width: 40px; height: 40px; cursor: pointer; font-size: 16px; font-weight: 700; z-index: 2;
}

/* Cabecera */
.ag-filtrar-header {
  padding: 20px 24px 10px;
  text-align: center;
}
.ag-filtrar-titulo {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; color: #000; font-weight: 400;
}

/* Separador horizontal */
.ag-filtrar-sep-h { width: 100%; height: 2px; }
.ag-filtrar-line-h { width: 100%; height: 2px; object-fit: fill; display: block; }

/* Cuerpo: línea vertical + opciones */
.ag-filtrar-body { display: flex; align-items: stretch; flex: 1; }

.ag-filtrar-sep-v {
  width: 2px; flex-shrink: 0; margin-left: 60px;
  display: flex; align-items: stretch;
}
.ag-filtrar-line-v { width: 2px; height: 100%; object-fit: fill; }

.ag-filtrar-opciones {
  flex: 1; display: flex; flex-direction: column;
  padding: 8px 20px 8px 16px; gap: 2px;
}

/* Fila de opción */
.ag-filtrar-row {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 0; cursor: pointer;
  transition: background 0.1s; border-radius: 6px;
}
.ag-filtrar-row:hover { background: rgba(0,138,82,0.05); }

/* Radio circles */
.ag-radio-wrap {
  position: relative; width: 28px; height: 28px; flex-shrink: 0;
}
.ag-radio-outer {
  position: absolute; inset: 0; width: 28px; height: 28px; object-fit: contain;
}
.ag-radio-inner {
  position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; object-fit: contain;
}

.ag-filtrar-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 23px; color: #000; font-weight: 400;
}

/* Botón Aceptar */
.ag-filtrar-footer { padding: 12px 24px 20px; display: flex; justify-content: center; }
.ag-aceptar-btn {
  background: #008a52; color: #fff; border: none; border-radius: 10px;
  width: 170px; height: 60px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; transition: filter 0.15s;
}
.ag-aceptar-btn:hover { filter: brightness(1.1); }

@media (max-width: 860px) {
  .ag-main { flex-direction: column; }
  .ag-opciones-panel { width: 100%; flex-direction: row; justify-content: center; gap: 12px; padding: 8px 0; }
  .ag-opciones-bg { display: none; }
  .ag-op-btn { margin-bottom: 0; }
  .ag-mes-titulo { font-size: 24px; }
  .ag-modal-agregar { width: 98vw; }
  .ag-modal-body { flex-direction: column; }
  .ag-modal-fecha { width: 100%; flex-direction: row; gap: 16px; border-right: none; border-bottom: 2px solid #ddd; border-radius: 5px 5px 0 0; }
  .ag-modal-contenido { border-radius: 0 0 5px 5px; }
}
</style>
