<template>
  <div class="registros-root">
    <!-- HEADER -->
    <header class="reg-header">
      <div class="reg-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="reg-titulo">Registros</span>
      <button class="btn-regresar" @click="$router.push({ name: 'Dashboard' })">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- KPI ROW -->
    <section class="kpi-row">
      <div class="kpi-frame">
        <div class="kpi-card" v-for="kpi in kpis" :key="kpi.id">
          <div class="kpi-tape"></div>
          <div class="kpi-yellow-strip"></div>
          <div class="kpi-body">
            <span class="kpi-label">{{ kpi.label1 }}<br />{{ kpi.label2 }}</span>
            <span class="kpi-count">{{ String(kpi.valor).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CLIPBOARD AREA -->
    <section class="clipboard-area">
      <div class="clipboard-outer">
        <!-- Clip decoration -->
        <div class="clip-wrap">
          <div class="clip-outer"></div>
          <div class="clip-inner"></div>
        </div>

        <!-- Inner cream panel -->
        <div class="clipboard-panel">
          <!-- Header row: title + button -->
          <div class="clipboard-header-row">
            <span v-if="!filtroAplicado" class="clipboard-titulo">Ultima semana</span>
            <span v-else class="clipboard-rango">{{ rangoLabel }}</span>
            <button v-if="!filtroAplicado" class="btn-filtrar" @click="abrirFiltro">
              <img :src="`${base}assets/39558.png`" alt="" style="width:28px;height:28px;" />
              Filtrar
            </button>
            <button v-else class="btn-reiniciar" @click="reiniciar">
              Reiniciar
            </button>
          </div>

          <!-- Tables side by side -->
          <div class="tables-row">
            <!-- Left table: servicios -->
            <div class="table-servicios">
              <div class="table-head-row">
                <div class="th">Tipo de servicio</div>
                <div class="th">Ventas sin IVA</div>
                <div class="th">Ventas Finales</div>
              </div>
              <div class="table-body-row" v-for="row in tablaServicios" :key="row.tipo">
                <div class="td">{{ row.tipo }}</div>
                <div class="td">{{ formatMXN(row.sinIVA) }}</div>
                <div class="td">{{ formatMXN(row.finales) }}</div>
              </div>
            </div>

            <!-- Right table: clientes/prospectos -->
            <div class="table-contactos">
              <div class="table-head-row">
                <div class="th">Clientes</div>
                <div class="th">Prospectos</div>
              </div>
              <div class="table-body-row" v-for="(row, i) in tablaContactos" :key="i">
                <div class="td">{{ row.cliente }}</div>
                <div class="td">{{ row.prospecto }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="reg-footer"></footer>

    <!-- MODAL SELECCIONAR FECHA -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-fecha-card">
          <div class="modal-fecha-titulo">Seleccione el rango de fechas</div>
          <button class="btn-x" @click="cerrarModal">✕</button>

          <div class="calendarios-row">
            <!-- Calendario izquierdo (inicio) -->
            <div class="calendario">
              <div class="cal-header-bar">
                <span class="cal-year">{{ añoIzq }}</span>
              </div>
              <div class="cal-nav-row">
                <button class="cal-nav" @click="mesAnteriorIzq">&lt;</button>
                <span class="cal-mes">{{ nombreMes(mesIzq) }}</span>
                <button class="cal-nav" @click="mesSiguienteIzq">&gt;</button>
              </div>
              <div class="cal-dias-header">
                <span v-for="d in diasSemana" :key="d">{{ d }}</span>
              </div>
              <div class="cal-grid">
                <button
                  v-for="(dia, i) in diasCalendarioIzq"
                  :key="i"
                  class="cal-day"
                  :class="{
                    'cal-day--vacio': dia === null,
                    'cal-day--otro': dia && dia.otroMes,
                    'cal-day--seleccionado': dia && !dia.otroMes && esFechaSeleccionada(dia.fecha, 'inicio'),
                    'cal-day--enrango': dia && !dia.otroMes && estaEnRango(dia.fecha),
                  }"
                  @click="dia && !dia.otroMes && seleccionarInicio(dia.fecha)"
                >
                  {{ dia ? dia.num : '' }}
                </button>
              </div>
            </div>

            <!-- Calendario derecho (fin) -->
            <div class="calendario">
              <div class="cal-header-bar">
                <span class="cal-year">{{ añoDer }}</span>
              </div>
              <div class="cal-nav-row">
                <button class="cal-nav" @click="mesAnteriorDer">&lt;</button>
                <span class="cal-mes">{{ nombreMes(mesDer) }}</span>
                <button class="cal-nav" @click="mesSiguienteDer">&gt;</button>
              </div>
              <div class="cal-dias-header">
                <span v-for="d in diasSemana" :key="d">{{ d }}</span>
              </div>
              <div class="cal-grid">
                <button
                  v-for="(dia, i) in diasCalendarioDer"
                  :key="i"
                  class="cal-day"
                  :class="{
                    'cal-day--vacio': dia === null,
                    'cal-day--otro': dia && dia.otroMes,
                    'cal-day--seleccionado': dia && !dia.otroMes && esFechaSeleccionada(dia.fecha, 'fin'),
                    'cal-day--enrango': dia && !dia.otroMes && estaEnRango(dia.fecha),
                  }"
                  @click="dia && !dia.otroMes && seleccionarFin(dia.fecha)"
                >
                  {{ dia ? dia.num : '' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Aceptar -->
          <button
            class="btn-aceptar-modal"
            :class="{ 'btn-aceptar-modal--activo': fechaInicio && fechaFin }"
            @click="aplicarFiltro"
          >
            Aceptar
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const base = import.meta.env.BASE_URL
const authStore = useAuthStore()

// ─── KPI data ─────────────────────────────────────────────────────────────────
interface KPI { id: string; label1: string; label2: string; valor: number }
const kpis = ref<KPI[]>([
  { id: 'prospectos', label1: 'Prospectos',  label2: 'Registrados', valor: 0 },
  { id: 'contratos',  label1: 'Contratos',   label2: 'Firmados',    valor: 0 },
  { id: 'radio',      label1: 'Paquetes',    label2: 'de Radio',    valor: 0 },
  { id: 'periodico',  label1: 'Paquetes',    label2: 'de Periódico',valor: 0 },
  { id: 'ventas',     label1: 'Ventas',      label2: 'Totales',     valor: 0 },
])

// ─── Tabla data ────────────────────────────────────────────────────────────────
interface FilaServicio { tipo: string; sinIVA: number; finales: number }
interface FilaContacto  { cliente: string; prospecto: string }

const tablaServicios = ref<FilaServicio[]>([
  { tipo: 'Radio',     sinIVA: 0, finales: 0 },
  { tipo: 'Periódico', sinIVA: 0, finales: 0 },
  { tipo: 'Total',     sinIVA: 0, finales: 0 },
])
const tablaContactos = ref<FilaContacto[]>([])

onMounted(async () => {
  const empleadoId = authStore.empleado?.id
  if (!empleadoId) return
  try {
    const { dashboardService } = await import('@/services/dashboardService')
    const res = await dashboardService.registrosSemana(empleadoId)
    kpis.value[0].valor = res.prospectos
    kpis.value[1].valor = res.contratos
    kpis.value[2].valor = res.paquetesRadio
    kpis.value[3].valor = res.paquetesPeriodico
    kpis.value[4].valor = res.ventasTotales

    const ventas = await dashboardService.ventasPorServicio(empleadoId)
    const totalRadio = ventas.radio
    const totalPeriodico = ventas.periodico
    tablaServicios.value = [
      { tipo: 'Radio',     sinIVA: totalRadio,      finales: totalRadio * 1.16 },
      { tipo: 'Periódico', sinIVA: totalPeriodico,  finales: totalPeriodico * 1.16 },
      { tipo: 'Total',     sinIVA: totalRadio + totalPeriodico, finales: (totalRadio + totalPeriodico) * 1.16 },
    ]
    const { contratoService } = await import('@/services/contratoService')
    const contratos = await contratoService.listarPorEmpleado(empleadoId)
    tablaContactos.value = contratos.slice(0, 5).map((c: any) => ({
      cliente:   (c.prospectos as any)?.nombre_empresa ?? '-',
      prospecto: (c.prospectos as any)?.nombre_contacto ?? '-',
    }))
  } catch (e) {
    console.error('Error cargando registros:', e)
  }
})

// ─── Filter state ──────────────────────────────────────────────────────────────
const filtroAplicado = ref(false)
const rangoLabel     = ref('')

function formatMXN(n: number) {
  if (n === 0) return '$0'
  return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function reiniciar() {
  filtroAplicado.value = false
  rangoLabel.value = ''
  fechaInicio.value = null
  fechaFin.value = null
}

// ─── Modal ──────────────────────────────────────────────────────────────────────
const mostrarModal = ref(false)
function abrirFiltro() { mostrarModal.value = true }
function cerrarModal() { mostrarModal.value = false }

// ─── Calendars ─────────────────────────────────────────────────────────────────
const diasSemana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

const hoy = new Date()
const mesIzq = ref(hoy.getMonth())
const añoIzq = ref(hoy.getFullYear())

// Right calendar = left + 1
const mesDerBase = hoy.getMonth() + 1 > 11 ? 0 : hoy.getMonth() + 1
const añoDerBase = hoy.getMonth() + 1 > 11 ? hoy.getFullYear() + 1 : hoy.getFullYear()
const mesDer = ref(mesDerBase)
const añoDer = ref(añoDerBase)

const fechaInicio = ref<string | null>(null)
const fechaFin    = ref<string | null>(null)

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
function nombreMes(m: number) { return MESES[m] }

interface DiaCal { num: number; fecha: string; otroMes: boolean }

function buildCalendario(mes: number, año: number): (DiaCal | null)[] {
  const primerDia = new Date(año, mes, 1)
  const ultimoDia = new Date(año, mes + 1, 0)
  const offset = (primerDia.getDay() - 1 + 7) % 7

  const dias: (DiaCal | null)[] = []
  // Previous month padding
  const prevUltimo = new Date(año, mes, 0)
  for (let i = offset - 1; i >= 0; i--) {
    const d = prevUltimo.getDate() - i
    const prevMes = mes === 0 ? 11 : mes - 1
    const prevAño = mes === 0 ? año - 1 : año
    dias.push({ num: d, fecha: isoDate(prevAño, prevMes, d), otroMes: true })
  }
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push({ num: d, fecha: isoDate(año, mes, d), otroMes: false })
  }
  // Next month padding to fill grid
  const nextMes = mes === 11 ? 0 : mes + 1
  const nextAño = mes === 11 ? año + 1 : año
  let nd = 1
  while (dias.length % 7 !== 0) {
    dias.push({ num: nd, fecha: isoDate(nextAño, nextMes, nd), otroMes: true })
    nd++
  }
  return dias
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

const diasCalendarioIzq = computed(() => buildCalendario(mesIzq.value, añoIzq.value))
const diasCalendarioDer  = computed(() => buildCalendario(mesDer.value, añoDer.value))

function mesAnteriorIzq() {
  if (mesIzq.value === 0) { mesIzq.value = 11; añoIzq.value-- }
  else mesIzq.value--
}
function mesSiguienteIzq() {
  if (mesIzq.value === 11) { mesIzq.value = 0; añoIzq.value++ }
  else mesIzq.value++
}
function mesAnteriorDer() {
  if (mesDer.value === 0) { mesDer.value = 11; añoDer.value-- }
  else mesDer.value--
}
function mesSiguienteDer() {
  if (mesDer.value === 11) { mesDer.value = 0; añoDer.value++ }
  else mesDer.value++
}

function seleccionarInicio(fecha: string) {
  fechaInicio.value = fecha
  if (fechaFin.value && fechaFin.value < fecha) fechaFin.value = null
}
function seleccionarFin(fecha: string) {
  fechaFin.value = fecha
  if (fechaInicio.value && fechaFin.value < fechaInicio.value) {
    fechaInicio.value = fechaFin.value
    fechaFin.value = null
  }
}

function esFechaSeleccionada(fecha: string, tipo: 'inicio' | 'fin') {
  return tipo === 'inicio' ? fechaInicio.value === fecha : fechaFin.value === fecha
}
function estaEnRango(fecha: string) {
  if (!fechaInicio.value || !fechaFin.value) return false
  return fecha > fechaInicio.value && fecha < fechaFin.value
}

function formatRangoLabel(iso: string) {
  const [y, m, d] = iso.split('-')
  const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
  return `${d}/${meses[parseInt(m)-1]}/${y}`
}

function aplicarFiltro() {
  if (!fechaInicio.value || !fechaFin.value) return
  rangoLabel.value = `${formatRangoLabel(fechaInicio.value)} – ${formatRangoLabel(fechaFin.value)}`
  filtroAplicado.value = true
  mostrarModal.value = false
}
</script>

<style scoped>
/* ── Layout root ─────────────────────────────────────────────────────── */
.registros-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

/* ── Header ──────────────────────────────────────────────────────────── */
.reg-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.reg-logo { display: flex; align-items: center; }
.reg-titulo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 40px;
  color: #fff;
  white-space: nowrap;
}
.btn-regresar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #d92525;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 28px;
  height: 60px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 25px;
  cursor: pointer;
}

/* ── KPI Row ─────────────────────────────────────────────────────────── */
.kpi-row {
  display: flex;
  justify-content: center;
  padding: 16px 0 0;
}
.kpi-frame {
  display: flex;
  gap: 24px;
  background: #615d5d;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
  padding: 8px 32px 20px;
}
.kpi-card {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.kpi-tape {
  width: 61px;
  height: 13px;
  background: rgba(255,255,255,0.7);
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
  position: relative;
  z-index: 1;
}
.kpi-yellow-strip {
  width: 100px;
  height: 24px;
  background: #f7e05e;
}
.kpi-body {
  width: 100px;
  background: #f6e782;
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 4px 8px;
  flex: 1;
}
.kpi-label {
  font-size: 14px;
  color: #615d5d;
  text-align: center;
  line-height: 1.3;
  margin-bottom: 4px;
}
.kpi-count {
  font-size: 36px;
  color: #615d5d;
  line-height: 1;
}

/* ── Clipboard area ──────────────────────────────────────────────────── */
.clipboard-area {
  display: flex;
  justify-content: center;
  padding: 24px 24px 16px;
  flex: 1;
}
.clipboard-outer {
  position: relative;
  width: 840px;
  max-width: 100%;
}
.clip-wrap {
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 2;
}
.clip-outer {
  width: 65px;
  height: 220px;
  border: 10px solid #babcbe;
  border-radius: 17px;
  background: transparent;
}
.clip-inner {
  width: 32px;
  height: 183px;
  background: #414042;
  border-radius: 12px;
  position: absolute;
  left: 7px;
  top: 24px;
}

/* inner cream clipboard */
.clipboard-panel {
  background: #f3e9dc;
  border-radius: 5px;
  margin-left: 52px;
  padding: 16px 20px 20px;
  box-shadow: none;
  position: relative;
}
/* brown outer wrap */
.clipboard-outer::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 8px;
  background: #91634d;
  border-radius: 19px;
  z-index: 0;
}
.clipboard-panel { position: relative; z-index: 1; }

.clipboard-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.clipboard-titulo {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 32px;
  color: #615d5d;
}
.clipboard-rango {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 28px;
  color: #615d5d;
}
.btn-filtrar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #008a52;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 52px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 22px;
  cursor: pointer;
}
.btn-reiniciar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #008a52;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 52px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 22px;
  cursor: pointer;
}

/* ── Tables ──────────────────────────────────────────────────────────── */
.tables-row {
  display: flex;
  gap: 12px;
}
.table-servicios, .table-contactos {
  display: flex;
  flex-direction: column;
}
.table-servicios { flex: 3; }
.table-contactos { flex: 2; }

.table-head-row, .table-body-row {
  display: flex;
}
.table-head-row {
  background: #fff;
  border-radius: 10px 10px 0 0;
}
.th {
  flex: 1;
  padding: 4px 8px;
  text-align: center;
  font-size: 15px;
  color: #615d5d;
}
.td {
  flex: 1;
  background: #fff;
  padding: 12px 8px;
  text-align: center;
  font-size: 15px;
  color: #615d5d;
  border-radius: 2px;
  margin: 1px;
}

/* ── Footer ──────────────────────────────────────────────────────────── */
.reg-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}

/* ── Modal overlay ───────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.76);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-fecha-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px 28px;
  position: relative;
  max-width: 96vw;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
}
.modal-fecha-titulo {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 36px;
  color: #615d5d;
  text-align: center;
  margin-bottom: 24px;
}
.btn-x {
  position: absolute;
  top: 14px;
  right: 14px;
  background: #d92525;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Calendars ───────────────────────────────────────────────────────── */
.calendarios-row {
  display: flex;
  gap: 28px;
  margin-bottom: 24px;
}
.calendario {
  width: 380px;
  border: 3px solid #d9d9d9;
  border-radius: 10px;
  overflow: hidden;
}
.cal-header-bar {
  background: #635251;
  color: #fff;
  text-align: center;
  padding: 4px 0;
  font-size: 18px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}
.cal-year { font-size: 18px; }
.cal-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  background: #fff;
}
.cal-nav {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #615d5d;
  padding: 0 8px;
}
.cal-mes {
  font-size: 18px;
  color: #615d5d;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}
.cal-dias-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background: #fff;
  padding: 4px 0;
}
.cal-dias-header span {
  font-size: 15px;
  color: #615d5d;
  padding: 2px 0;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #fff;
  padding: 4px 8px 8px;
  gap: 2px;
}
.cal-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #615d5d;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  transition: background 0.15s;
}
.cal-day:hover:not(.cal-day--otro):not(.cal-day--vacio) {
  background: #e0f3eb;
}
.cal-day--otro { color: rgba(97,93,93,0.4); cursor: default; }
.cal-day--vacio { cursor: default; }
.cal-day--seleccionado {
  background: #635251 !important;
  color: #fff !important;
  font-weight: bold;
}
.cal-day--enrango { background: #d4eddf; }

/* ── Aceptar button ──────────────────────────────────────────────────── */
.btn-aceptar-modal {
  display: block;
  margin: 0 auto;
  width: 170px;
  height: 52px;
  border: none;
  border-radius: 10px;
  background: #8cc8ae;
  color: #fff;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 22px;
  cursor: not-allowed;
  transition: background 0.2s;
}
.btn-aceptar-modal--activo {
  background: #008a52;
  cursor: pointer;
}
</style>
