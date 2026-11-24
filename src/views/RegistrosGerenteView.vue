<template>
  <div class="rg-viewport">
    <div class="rg-canvas" :style="{ height: `${altoCanvas}px` }">
      <div class="rg-footer" :style="{ top: `${altoCanvas - 50}px` }" />

      <!-- 4. Header verde -->
      <div style="position:absolute;left:0;top:0;width:1280px;height:100px;background:#008a52;" />

      <!-- 5. Título de página -->
      <p style="position:absolute;left:50%;top:31px;transform:translateX(-50%);font-family:'Lilita One:Regular',serif;font-size:40px;color:white;white-space:nowrap;margin:0;">
        Monitoreo de Actividad
      </p>

      <!-- 7. Logo -->
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila"
           style="position:absolute;left:20px;top:18px;height:64px;object-fit:contain;" />

      <div class="rg-corkboard">
        <CorkBoard banner-text="Registros generales de la semana" :stats="statsParaTablero" />
      </div>

      <section class="rg-history-panel">
        <div class="rg-history-content">
          <div class="rg-history-toolbar">
            <h2>{{ filtroActivo ? rangoLabel : mesLabel }}</h2>
            <button v-if="!filtroActivo" class="rg-filter-button" @click="abrirFiltro">
              <img :src="`${base}assets/e1814.png`" alt="" />
              Filtrar
            </button>
            <button v-else class="rg-filter-button" @click="reiniciarFiltro">
              <img :src="`${base}assets/46558.png`" alt="" />
              Reiniciar
            </button>
          </div>

          <div class="rg-table-scroll">
            <table class="rg-vendor-table">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Prospectos<br />Registrados</th>
                  <th>Contratos<br />Firmados</th>
                  <th>Paquetes<br />de Radio</th>
                  <th>Paquetes de<br />Periódico</th>
                  <th>Ventas<br />Totales</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="cargandoVendedores">
                  <td colspan="6" class="rg-empty-row">Cargando registros de vendedores...</td>
                </tr>
                <tr v-else-if="empleados.length === 0">
                  <td colspan="6" class="rg-empty-row">No hay vendedores activos para mostrar.</td>
                </tr>
                <template v-else>
                  <tr v-for="emp in empleados" :key="emp.id">
                    <td class="rg-vendor-name">{{ emp.nombre }}</td>
                    <td>{{ pad(emp.prospectos) }}</td>
                    <td>{{ pad(emp.contratos) }}</td>
                    <td>{{ pad(emp.radio) }}</td>
                    <td>{{ pad(emp.periodico) }}</td>
                    <td>{{ pad(emp.ventas) }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 16. Botón Regresar -->
      <button @click="regresar"
        style="position:absolute;left:1020px;top:17px;width:210px;height:60px;background:#d92525;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;">
        <img :src="`${base}assets/f79f1.png`" style="width:36px;height:36px;object-fit:cover;flex-shrink:0;" alt="" />
        <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:25px;color:white;">Regresar</span>
      </button>

      <!-- ── Modal rango de fechas ── -->
      <template v-if="showModal">
        <div style="position:absolute;left:0;top:100px;width:1280px;height:620px;background:rgba(0,0,0,0.76);" @click.self="cerrarModal" />
        <div style="position:absolute;left:136px;top:111px;width:1007px;height:548px;background:#f3e9dc;border-radius:15px;overflow:hidden;">

          <!-- Botón X cerrar -->
          <button @click="cerrarModal"
            style="position:absolute;right:24px;top:20px;width:40px;height:40px;background:#d92525;border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:20px;font-weight:bold;line-height:1;">✕</span>
          </button>

          <!-- Título modal -->
          <p style="text-align:center;margin-top:28px;font-family:'Lilita One:Regular',serif;font-size:48px;color:#615d5d;margin-bottom:0;">
            Seleccione el rango de fechas
          </p>

          <!-- Dos calendarios -->
          <div style="display:flex;gap:64px;justify-content:center;margin-top:12px;">
            <!-- Calendario izquierdo (fecha inicio) -->
            <div style="width:472px;border:4px solid #d9d9d9;border-radius:10px;overflow:hidden;background:white;">
              <div style="background:#635251;height:35px;display:flex;align-items:center;justify-content:center;">
                <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:white;">{{ calLeft.year }}</span>
              </div>
              <div style="padding:8px 12px;background:white;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="prevMonthLeft">&lt;</span>
                  <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;">{{ MESES[calLeft.month] }}</span>
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="nextMonthLeft">&gt;</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;">
                  <span v-for="d in DIAS" :key="d" style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;padding:2px 0;">{{ d }}</span>
                  <span v-for="_ in firstDayLeft" :key="`el${_}`" />
                  <span v-for="day in daysInMonthLeft" :key="day"
                    @click="selectDay('start', day)"
                    :style="`font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;padding:2px 0;cursor:pointer;border-radius:50%;${dayStyle('start', day, calLeft)}`">{{ day }}</span>
                </div>
              </div>
            </div>
            <!-- Calendario derecho (fecha fin) -->
            <div style="width:472px;border:4px solid #d9d9d9;border-radius:10px;overflow:hidden;background:white;">
              <div style="background:#635251;height:35px;display:flex;align-items:center;justify-content:center;">
                <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:white;">{{ calRight.year }}</span>
              </div>
              <div style="padding:8px 12px;background:white;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="prevMonthRight">&lt;</span>
                  <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;">{{ MESES[calRight.month] }}</span>
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="nextMonthRight">&gt;</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;">
                  <span v-for="d in DIAS" :key="d" style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;padding:2px 0;">{{ d }}</span>
                  <span v-for="_ in firstDayRight" :key="`er${_}`" />
                  <span v-for="day in daysInMonthRight" :key="day"
                    @click="selectDay('end', day)"
                    :style="`font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;padding:2px 0;cursor:pointer;border-radius:50%;${dayStyle('end', day, calRight)}`">{{ day }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón Aceptar -->
          <div style="display:flex;justify-content:center;margin-top:20px;">
            <button @click="aplicarFiltro"
              :style="`display:flex;align-items:center;justify-content:center;gap:10px;width:170px;height:60px;background:${selStart&&selEnd?'#008a52':'#8cc8ae'};border:none;border-radius:10px;cursor:pointer;`">
              <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:25px;color:white;">Aceptar</span>
            </button>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import CorkBoard from "@/components/CorkBoard.vue"

const router = useRouter()
const base = import.meta.env.BASE_URL

function updateScale() {
  const el = document.querySelector(".rg-canvas") as HTMLElement | null
  if (!el) return
  const sx = window.innerWidth / 1280
  el.style.transform = `scale(${sx}, 1)`
}
onMounted(async () => {
  updateScale()
  window.addEventListener("resize", updateScale)
  try {
    const { dashboardService } = await import("@/services/dashboardService")
    const { empleadoService } = await import("@/services/empleadoService")
    const [stats, emps] = await Promise.all([
      dashboardService.registrosSemanaGerente(),
      empleadoService.listarActivos(),
    ])
    totales.value = {
      prospectos: stats.prospectos,
      contratos: stats.contratos,
      radio: stats.paquetesRadio,
      periodico: stats.paquetesPeriodico,
      ventas: stats.ventasTotales,
    }
    const vendedores = emps
      .filter(e => e.rol === "Vendedor")
    empleados.value = await Promise.all(vendedores.map(async (empleado) => {
      const registros = await dashboardService.registrosSemana(empleado.id)
      return {
        id: empleado.id,
        nombre: empleado.nombre,
        prospectos: registros.prospectos,
        contratos: registros.contratos,
        radio: registros.paquetesRadio,
        periodico: registros.paquetesPeriodico,
        ventas: registros.ventasTotales,
      }
    }))
  } catch (e) {
    console.error("Error cargando registros gerente:", e)
  } finally {
    cargandoVendedores.value = false
  }
})
onUnmounted(() => { window.removeEventListener("resize", updateScale) })

type Empleado = {
  id: string
  nombre: string
  prospectos?: number
  contratos?: number
  radio?: number
  periodico?: number
  ventas?: number
}

const empleados = ref<Empleado[]>([])
const cargandoVendedores = ref(true)

type TotalesKey = "prospectos" | "contratos" | "radio" | "periodico" | "ventas"
const totales = ref<Record<TotalesKey, number | undefined>>({
  prospectos: undefined, contratos: undefined,
  radio: undefined, periodico: undefined, ventas: undefined,
})

const statsParaTablero = computed(() => [
  { id: "prospectos", label: "Prospectos\nRegistrados", value: totales.value.prospectos },
  { id: "contratos", label: "Contratos\nFirmados", value: totales.value.contratos },
  { id: "radio", label: "Paquetes\nde Radio", value: totales.value.radio },
  { id: "periodico", label: "Paquetes\nde Periódico", value: totales.value.periodico },
  { id: "ventas", label: "Ventas\nTotales", value: totales.value.ventas },
])

const altoCanvas = computed(() => Math.max(720, 620 + empleados.value.length * 52))

const MESES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
const now = new Date()
const mesLabel = computed(() => `${MESES_ES[now.getMonth()]} ${now.getFullYear()}`)

const filtroActivo = ref(false)
const rangoLabel = ref("")

function pad(n: number | undefined) {
  if (n === undefined) return "--"
  if (Number.isInteger(n)) return String(n).padStart(2, "0")
  return n.toLocaleString("es-MX", { maximumFractionDigits: 2 })
}
function regresar() { router.push({ name: "DashboardGerente" }) }
function reiniciarFiltro() { filtroActivo.value = false; rangoLabel.value = "" }

const showModal = ref(false)
const DIAS = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"]
const MESES = MESES_ES

interface CalState { year: number; month: number }

const calLeft = ref<CalState>({
  year: now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
  month: now.getMonth() === 0 ? 11 : now.getMonth() - 1,
})
const calRight = ref<CalState>({ year: now.getFullYear(), month: now.getMonth() })

const selStart = ref<{ year: number; month: number; day: number } | null>(null)
const selEnd   = ref<{ year: number; month: number; day: number } | null>(null)

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }

const daysInMonthLeft  = computed(() => daysInMonth(calLeft.value.year,  calLeft.value.month))
const daysInMonthRight = computed(() => daysInMonth(calRight.value.year, calRight.value.month))
const firstDayLeft     = computed(() => firstWeekday(calLeft.value.year,  calLeft.value.month))
const firstDayRight    = computed(() => firstWeekday(calRight.value.year, calRight.value.month))

function prevMonthLeft()  { if (calLeft.value.month===0) { calLeft.value.month=11; calLeft.value.year-- } else calLeft.value.month-- }
function nextMonthLeft()  { if (calLeft.value.month===11){ calLeft.value.month=0;  calLeft.value.year++ } else calLeft.value.month++ }
function prevMonthRight() { if (calRight.value.month===0){ calRight.value.month=11;calRight.value.year--} else calRight.value.month-- }
function nextMonthRight() { if (calRight.value.month===11){calRight.value.month=0; calRight.value.year++} else calRight.value.month++ }

function selectDay(which: "start"|"end", day: number) {
  const cal = which === "start" ? calLeft.value : calRight.value
  const obj = { year: cal.year, month: cal.month, day }
  if (which === "start") selStart.value = obj
  else selEnd.value = obj
}
function dayStyle(which: "start"|"end", day: number, cal: CalState) {
  const sel = which === "start" ? selStart.value : selEnd.value
  if (sel && sel.year===cal.year && sel.month===cal.month && sel.day===day)
    return "background:#635251;color:white;"
  return ""
}

function abrirFiltro() { selStart.value=null; selEnd.value=null; showModal.value=true }
function cerrarModal() { showModal.value=false }
function aplicarFiltro() {
  if (!selStart.value || !selEnd.value) return
  const fmt = (d: {year:number;month:number;day:number}) =>
    `${String(d.day).padStart(2,"0")}/${MESES[d.month].slice(0,3).toUpperCase()}/${d.year}`
  rangoLabel.value = `${fmt(selStart.value)} – ${fmt(selEnd.value)}`
  filtroActivo.value = true
  showModal.value = false
}
</script>

<style scoped>
.rg-viewport {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  background: #3a2422;
}
.rg-canvas {
  position: relative;
  width: 1280px;
  min-height: 720px;
  transform-origin: top left;
  background: #3a2422;
}
.rg-footer {
  position: absolute;
  left: 0;
  width: 1280px;
  height: 50px;
  background: #f8f4e3;
}
.rg-corkboard {
  position: absolute;
  left: 100px;
  top: 100px;
  width: 1080px;
  height: 240px;
}
.rg-corkboard :deep(.cork-board) {
  height: 240px;
  min-height: 240px;
}
.rg-corkboard :deep(.postits-row) {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  padding: 12px 16px;
}
.rg-corkboard :deep(.postit-wrapper) {
  min-height: 150px;
}
.rg-corkboard :deep(.postit-card) {
  min-height: 116px;
}
.rg-history-panel {
  position: absolute;
  top: 360px;
  left: 100px;
  width: 1080px;
  padding: 18px;
  box-sizing: border-box;
  background: #91634d;
  border-radius: 19px;
}
.rg-history-content {
  padding: 16px 20px 20px;
  background: #f3e9dc;
  border-radius: 5px;
}
.rg-history-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.rg-history-toolbar h2 {
  min-width: 0;
  margin: 0;
  color: #615d5d;
  font-family: "Lilita One:Regular", serif;
  font-size: 30px;
  font-weight: 400;
  overflow-wrap: anywhere;
}
.rg-filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 150px;
  min-height: 48px;
  padding: 6px 18px;
  border: 0;
  border-radius: 8px;
  background: #008a52;
  color: #fff;
  font-family: "Baloo Paaji:Regular", sans-serif;
  font-size: 20px;
  cursor: pointer;
}
.rg-filter-button img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
.rg-table-scroll {
  overflow-x: auto;
}
.rg-vendor-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 5px;
  table-layout: fixed;
  color: #615d5d;
  font-family: "Baloo Paaji:Regular", sans-serif;
}
.rg-vendor-table th {
  padding: 8px 6px;
  background: #fff;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
}
.rg-vendor-table th:first-child { border-radius: 8px 0 0 0; }
.rg-vendor-table th:last-child { border-radius: 0 8px 0 0; }
.rg-vendor-table td {
  padding: 8px 6px;
  background: #fff;
  font-size: 15px;
  line-height: 1.35;
  text-align: center;
  overflow-wrap: anywhere;
  font-variant-numeric: tabular-nums;
}
.rg-vendor-table td:first-child { border-radius: 3px 0 0 3px; }
.rg-vendor-table td:last-child { border-radius: 0 3px 3px 0; }
.rg-vendor-table .rg-vendor-name {
  padding-left: 12px;
  text-align: left;
  font-weight: 700;
}
.rg-vendor-table .rg-empty-row {
  padding: 18px;
  text-align: center;
}
</style>
