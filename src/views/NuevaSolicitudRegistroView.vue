<template>
  <div class="nsr-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="nsr-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="nsr-logo" />
      <h1 class="nsr-titulo">PAQUETES DE PERIODICO</h1>
      <button class="nsr-regresar-btn" @click="salir">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="nsr-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="nsr-body">

      <!-- Carpeta -->
      <div class="nsr-carpeta">
        <!-- Tab -->
        <div class="nsr-tab">
          <span class="nsr-tab-titulo">Nueva Solicitud De Registro</span>
        </div>

        <!-- Hoja blanca -->
        <div class="nsr-hoja">
          <!-- Clip de hojas lateral -->
          <img :src="`${base}assets/5faaf.svg`" alt="" class="nsr-clip" />

          <!-- Formulario -->
          <div class="nsr-form">

            <!-- Columna izquierda -->
            <div class="nsr-col">

              <!-- Cliente / Prospecto -->
              <div class="nsr-campo">
                <label class="nsr-label">Cliente / Prospecto</label>
                <select v-model="form.idProspecto" class="nsr-select" :class="{ 'nsr-error-borde': errores.idProspecto }">
                  <option value="">--Seleccionar--</option>
                  <option v-for="p in prospectos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
                </select>
                <p v-if="errores.idProspecto" class="nsr-error-msg">Seleccione un cliente / prospecto</p>
              </div>

              <!-- Nombre Del Banner -->
              <div class="nsr-campo">
                <label class="nsr-label">Nombre Del Banner</label>
                <div class="nsr-field-readonly">{{ tarifa.tipo }}</div>
              </div>

              <!-- Tarifa Comercial -->
              <div class="nsr-campo">
                <label class="nsr-label">Tarifa Comercial <span class="nsr-label-sm">2025</span></label>
                <div class="nsr-field-readonly">{{ tarifa.precio }}</div>
              </div>

              <!-- Notas -->
              <div class="nsr-campo">
                <label class="nsr-label">Notas</label>
                <input
                  v-model="form.notas"
                  type="text"
                  class="nsr-input"
                  placeholder="Completar"
                />
              </div>

            </div>

            <!-- Columna derecha -->
            <div class="nsr-col">

              <!-- Servicio -->
              <div class="nsr-campo">
                <label class="nsr-label">Servicio</label>
                <div class="nsr-field-readonly">{{ tarifa.servicio }}</div>
              </div>

              <!-- Medidas Del Banner -->
              <div class="nsr-campo">
                <label class="nsr-label">Medidas Del Banner <span class="nsr-label-sm">(px)</span>:</label>
                <div class="nsr-field-readonly">{{ tarifa.medidas }}</div>
              </div>

              <!-- Cantidad + Total -->
              <div class="nsr-campo">
                <div class="nsr-row-labels">
                  <label class="nsr-label">Cantidad</label>
                  <label class="nsr-label">Total <span class="nsr-label-sm">(MXN)</span></label>
                </div>
                <div class="nsr-row-inputs">
                  <input
                    v-model.number="form.cantidad"
                    type="number"
                    min="1"
                    class="nsr-input nsr-input-cantidad"
                    :class="{ 'nsr-error-borde': errores.cantidad }"
                    placeholder="###"
                    @input="calcularTotal"
                  />
                  <div class="nsr-field-readonly nsr-field-total">{{ totalFormateado }}</div>
                </div>
                <p v-if="errores.cantidad" class="nsr-error-msg">Ingrese una cantidad válida</p>
              </div>

              <!-- Botones Cancelar / Contrato -->
              <div class="nsr-botones">
                <button class="nsr-btn-cancelar" @click="cancelar">
                  <img :src="`${base}assets/7422c.png`" alt="" class="nsr-btn-icon" />
                  <span>Cancelar</span>
                </button>
                <button class="nsr-btn-contrato" @click="generarContrato">
                  <img :src="`${base}assets/82a6f.png`" alt="" class="nsr-btn-icon" />
                  <span>Contrato</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="nsr-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { prospectoService } from "@/services/prospectoService"

interface Prospecto { id: string; nombre: string }

interface TarifaSeleccionada {
  idPaquete?: number
  tipo: string
  descripcion: string
  medidas: string
  precio: string
  servicio: string
}

const router = useRouter()
const base = import.meta.env.BASE_URL

// Tarifa recibida desde la pantalla anterior via history state
const tarifa = ref<TarifaSeleccionada>({
  tipo: "",
  descripcion: "",
  medidas: "",
  precio: "",
  servicio: "Publicidad impresa",
})

const prospectos = ref<Prospecto[]>([])

const form = ref({
  idProspecto: "",
  notas: "",
  cantidad: null as number | null,
})

const errores = ref({
  idProspecto: false,
  cantidad: false,
})

// Convierte precio "$36,115.00" a número
function parsePrecio(p: string): number {
  return parseFloat(p.replace(/[$,]/g, "")) || 0
}

const totalFormateado = computed(() => {
  if (!form.value.cantidad || form.value.cantidad <= 0) return "Autocompletar"
  const total = parsePrecio(tarifa.value.precio) * form.value.cantidad
  return `$${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
})

function calcularTotal() {
  errores.value.cantidad = false
}

function validar(): boolean {
  errores.value.idProspecto = !form.value.idProspecto
  errores.value.cantidad = !form.value.cantidad || form.value.cantidad <= 0
  return !errores.value.idProspecto && !errores.value.cantidad
}

async function cargarProspectos() {
  try {
    const lista = await prospectoService.listar()
    prospectos.value = lista.map((p: any) => ({ id: p.id, nombre: p.nombre_empresa }))
  } catch (e) {
    console.warn("Error cargando prospectos:", e)
  }
}

function generarContrato() {
  if (!validar()) return
  const idNum = Number(form.value.idProspecto)
  const prospecto = prospectos.value.find(p => Number(p.id) === idNum)
  const subtotal = parsePrecio(tarifa.value.precio) * (form.value.cantidad ?? 1)
  router.push({
    name: "ContratoPeriodicoView",
    state: {
      prospectoId: idNum,
      contrato: JSON.stringify({
        idPaquete: tarifa.value.idPaquete,
        cantidad: form.value.cantidad,
        nombre: prospecto?.nombre ?? "",
        direccion: "",
        telefono: "",
        espacio: tarifa.value.tipo,
        medidas: tarifa.value.medidas,
        fechaPublicaciones: "",
        rfc: "",
        factura: "",
        secc: "",
        pag: "",
        costoCM: "",
        posicionEspecial: "",
        subtotal,
      }),
    },
  })
}

function cancelar() {
  const servicioActual = tarifa.value.servicio?.toLowerCase() || ""

  if (servicioActual.includes("clasificado")) {
    router.push({ name: "TarifaPeriodico", params: { servicio: "clasificados" } })
  } else if (servicioActual.includes("evento")) {
    router.push({ name: "TarifaPeriodico", params: { servicio: "eventos" } })
  } else if (servicioActual.includes("digital") || servicioActual.includes("banner")) {
    router.push({ name: "TarifaPeriodico", params: { servicio: "digital" } })
  } else {
    router.push({ name: "TarifaPeriodico", params: { servicio: "impresos" } })
  }
}

function salir() {
  router.push({ name: "Dashboard" })
}

onMounted(async () => {
  // Leer tarifa desde history.state (pasado por router.push con state)
  const state = window.history.state as any
  if (state?.tarifa) {
    tarifa.value = JSON.parse(state.tarifa)
  }
  await cargarProspectos()
})
</script>

<style scoped>
/* ── Raíz ─────────────────────────────────────────────────── */
.nsr-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.nsr-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.nsr-logo {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
  flex-shrink: 0;
}

.nsr-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.nsr-regresar-btn {
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
  color: #ffffff;
  white-space: nowrap;
  transition: filter 0.15s;
}
.nsr-regresar-btn:hover { filter: brightness(1.1); }

.nsr-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* ── Cuerpo ──────────────────────────────────────────────── */
.nsr-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px 16px;
}

/* ── Carpeta ─────────────────────────────────────────────── */
.nsr-carpeta {
  width: 100%;
  max-width: 1030px;
  display: flex;
  flex-direction: column;
}

.nsr-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  width: 560px;
  max-width: 100%;
  padding: 10px 24px 14px;
  box-shadow: 10px 0px 10px 0px rgba(0,0,0,0.25);
}

.nsr-tab-titulo {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 34px;
  color: #000000;
  font-weight: 400;
  white-space: nowrap;
}

/* Hoja crema + contenido */
.nsr-hoja {
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 0 7px 7px 7px;
  padding: 16px 16px 16px 0;
  display: flex;
  align-items: stretch;
  position: relative;
}

/* Clip rojo al ras del borde izquierdo */
.nsr-clip {
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

/* Hoja blanca interna */
.nsr-form {
  flex: 1;
  background: #ffffff;
  border: 1px solid #000000;
  margin-left: 80px;
  padding: 28px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;
}

/* ── Columnas ────────────────────────────────────────────── */
.nsr-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Campo ───────────────────────────────────────────────── */
.nsr-campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nsr-label {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 18px;
  color: #000000;
  font-weight: 400;
}

.nsr-label-sm {
  font-size: 15px;
}

/* Campo solo lectura */
.nsr-field-readonly {
  background: #f6f6f6;
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 20px;
  color: #584848;
  padding: 0 16px;
  text-align: center;
}

/* Select editable */
.nsr-select {
  background: #f6f6f6;
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0px 4px 2px rgba(0,0,0,0.25);
  height: 48px;
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 18px;
  color: rgba(67,61,61,0.8);
  padding: 0 16px;
  cursor: pointer;
  appearance: auto;
  width: 100%;
}
.nsr-select:focus { outline: 2px solid #008a52; }

/* Input de texto */
.nsr-input {
  background: #f6f6f6;
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 0px 4px 2px rgba(0,0,0,0.25);
  height: 48px;
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 18px;
  color: rgba(88,72,72,0.8);
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
}
.nsr-input:focus { outline: 2px solid #008a52; }
.nsr-input::placeholder { color: rgba(88,72,72,0.5); }

/* Fila cantidad + total */
.nsr-row-labels {
  display: flex;
  gap: 12px;
}
.nsr-row-labels .nsr-label:first-child { flex: 0 0 120px; }
.nsr-row-labels .nsr-label:last-child  { flex: 1; }

.nsr-row-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nsr-input-cantidad {
  flex: 0 0 120px;
  width: 120px;
  text-align: center;
}

.nsr-field-total {
  flex: 1;
  font-size: 18px;
}

/* ── Botones ─────────────────────────────────────────────── */
.nsr-botones {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
}

.nsr-btn-cancelar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #a1a4a9;
  border: none;
  border-radius: 10px;
  padding: 0 20px;
  height: 52px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 22px;
  color: #ffffff;
  transition: filter 0.15s;
  flex: 1;
  justify-content: center;
}
.nsr-btn-cancelar:hover { filter: brightness(1.1); }

.nsr-btn-contrato {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #008a52;
  border: none;
  border-radius: 10px;
  padding: 0 20px;
  height: 52px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 22px;
  color: #ffffff;
  transition: filter 0.15s;
  flex: 1;
  justify-content: center;
}
.nsr-btn-contrato:hover { filter: brightness(1.1); }

.nsr-btn-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

/* ── Errores ─────────────────────────────────────────────── */
.nsr-error-borde { border-color: #d92525 !important; }
.nsr-error-msg {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 13px;
  color: #d92525;
  margin: 0;
}

/* ── Footer ──────────────────────────────────────────────── */
.nsr-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 860px) {
  .nsr-form { grid-template-columns: 1fr; }
  .nsr-clip  { display: none; }
  .nsr-form  { margin-left: 0; }
  .nsr-body  { padding: 12px 16px; }
}

@media (max-width: 600px) {
  .nsr-header { height: 80px; padding: 0 12px; }
  .nsr-logo   { width: 180px; height: auto; }
  .nsr-regresar-btn { padding: 0 14px; font-size: 18px; height: 48px; }
  .nsr-tab-titulo   { font-size: 22px; }
}
</style>
