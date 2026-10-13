<template>
  <div class="cp-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="cp-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="cp-logo" />
      <h1 class="cp-titulo">Contrato-periodico</h1>
      <button class="cp-regresar-btn" @click="salir">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="cp-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="cp-body">
      <div class="cp-hoja">

        <!-- Fila 1: Nombre del anunciante -->
        <div class="cp-fila">
          <span class="cp-etiqueta">Nombre del anunciante:</span>
          <input v-model="datos.nombre" class="cp-campo cp-campo-flex" placeholder="Nombre del anunciante" />
        </div>

        <!-- Fila 2: Dirección + Tel -->
        <div class="cp-fila cp-fila-split">
          <div class="cp-fila-izq">
            <span class="cp-etiqueta">Dirección:</span>
            <input v-model="datos.direccion" class="cp-campo cp-campo-flex" placeholder="Calle, número, colonia" />
          </div>
          <div class="cp-fila-der">
            <span class="cp-etiqueta">Tel:</span>
            <input v-model="datos.telefono" class="cp-campo" placeholder="Teléfono" />
          </div>
        </div>

        <!-- Fila 3: Espacio + Secc -->
        <div class="cp-fila cp-fila-split">
          <div class="cp-fila-izq">
            <span class="cp-etiqueta">Espacio:</span>
            <input v-model="datos.espacio" class="cp-campo cp-campo-flex" placeholder="Tipo de espacio" />
          </div>
          <div class="cp-fila-der">
            <span class="cp-etiqueta">Secc:</span>
            <input v-model="datos.secc" class="cp-campo" placeholder="Sección" />
          </div>
        </div>

        <!-- Fila 4: Fecha de publicaciones + Pag -->
        <div class="cp-fila cp-fila-split">
          <div class="cp-fila-izq">
            <span class="cp-etiqueta">Fecha de publicaciones:</span>
            <input v-model="datos.fechaPublicaciones" class="cp-campo cp-campo-flex" placeholder="Fechas de publicación" />
          </div>
          <div class="cp-fila-der">
            <span class="cp-etiqueta">Pag:</span>
            <input v-model="datos.pag" class="cp-campo" placeholder="Pág." />
          </div>
        </div>

        <!-- Fila 5: RFC + Costo CM x COM -->
        <div class="cp-fila cp-fila-split">
          <div class="cp-fila-izq">
            <span class="cp-etiqueta">R.F.C:</span>
            <input v-model="datos.rfc" class="cp-campo cp-campo-flex" placeholder="RFC del cliente" />
          </div>
          <div class="cp-fila-der">
            <span class="cp-etiqueta">Costo C.M X COM:</span>
            <input v-model="datos.costoCM" class="cp-campo" placeholder="$0.00" />
          </div>
        </div>

        <!-- Fila 6: Factura + Posición especial -->
        <div class="cp-fila cp-fila-split">
          <div class="cp-fila-izq">
            <span class="cp-etiqueta">Factura:</span>
            <input v-model="datos.factura" class="cp-campo cp-campo-flex" placeholder="Razón social" />
          </div>
          <div class="cp-fila-der">
            <span class="cp-etiqueta">Posicion especial: $</span>
            <input v-model="datos.posicionEspecial" class="cp-campo" placeholder="0.00" />
          </div>
        </div>

        <!-- Totales (columna derecha) + Firma (columna izq) -->
        <div class="cp-fila cp-fila-split">

          <!-- Firma y aprobación -->
          <div class="cp-firma-bloque">
            <p class="cp-etiqueta">ACEPTA LA FIRMA DE CONTRATO:</p>
            <div class="cp-firma-opciones">
              <button
                class="cp-firma-btn"
                :class="firma === 'SI' ? 'cp-firma-si-activo' : 'cp-firma-si'"
                @click="firma = 'SI'"
              >SI</button>
              <button
                class="cp-firma-btn"
                :class="firma === 'NO' ? 'cp-firma-no-activo' : 'cp-firma-no'"
                @click="firma = 'NO'"
              >NO</button>
            </div>
            <p v-if="errFirma" class="cp-error-msg">Seleccione SI o NO para continuar</p>
          </div>

          <!-- Sub-Total / IVA / TOTAL -->
          <div class="cp-totales">
            <div class="cp-total-fila">
              <span class="cp-etiqueta cp-etiqueta-der">Sub-Total: $</span>
              <input
                v-model.number="datos.subtotal"
                type="number"
                min="0"
                step="0.01"
                class="cp-campo cp-campo-total"
                placeholder="0.00"
              />
            </div>
            <div class="cp-total-fila">
              <span class="cp-etiqueta cp-etiqueta-der">I.V.A: $</span>
              <div class="cp-campo cp-campo-total cp-campo-readonly">{{ ivaFmt }}</div>
            </div>
            <div class="cp-total-fila">
              <span class="cp-etiqueta cp-etiqueta-der">TOTAL: $</span>
              <div class="cp-campo cp-campo-total cp-campo-readonly">{{ totalFmt }}</div>
            </div>
          </div>
        </div>

        <!-- Aviso de obligatorios -->
        <p class="cp-aviso">Favor de agregar los campos obligatorios</p>

        <!-- Botones -->
        <div class="cp-botones">
          <button class="cp-btn-cancelar" @click="cancelar">
            <img :src="`${base}assets/7422c.png`" alt="" class="cp-btn-icon" />
            <span>Cancelar</span>
          </button>
          <button class="cp-btn-guardar" @click="abrirModalFormato">
            <img :src="`${base}assets/43b53.png`" alt="" class="cp-btn-icon" />
            <span>Guardar</span>
          </button>
        </div>

      </div>
    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="cp-footer" />

    <!-- ── MODAL FORMATO ──────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="modalVisible" class="cp-overlay" @click.self="cerrarModal">
        <div class="cp-modal">

          <!-- Header modal -->
          <div class="cp-modal-header">
            <span class="cp-modal-titulo">Formato</span>
            <button class="cp-modal-cerrar" @click="cerrarModal">✕</button>
          </div>

          <!-- Divisor -->
          <div class="cp-modal-divider" />

          <!-- Opciones -->
          <div class="cp-modal-opciones">
            <label class="cp-formato-opcion">
              <input type="checkbox" v-model="formatos.pdf" class="cp-checkbox" />
              <span class="cp-formato-label">PDF</span>
            </label>
            <div class="cp-modal-divider" />
            <label class="cp-formato-opcion">
              <input type="checkbox" v-model="formatos.word" class="cp-checkbox" />
              <span class="cp-formato-label">WORD</span>
            </label>
            <div class="cp-modal-divider" />
            <label class="cp-formato-opcion">
              <input type="checkbox" v-model="formatos.jpg" class="cp-checkbox" />
              <span class="cp-formato-label">JPG</span>
            </label>
          </div>

          <!-- Botón Guardar modal -->
          <div class="cp-modal-footer">
            <button class="cp-modal-btn-guardar" @click="guardarContrato">
              <img :src="`${base}assets/43b53.png`" alt="" class="cp-btn-icon" />
              <span>Guardar</span>
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

const router = useRouter()
const base = import.meta.env.BASE_URL

// ── Datos del contrato (recibidos via history state) ────────────
interface DatosContrato {
  idPaquete?: number
  cantidad?: number
  nombre: string
  direccion: string
  telefono: string
  espacio: string
  medidas: string
  fechaPublicaciones: string
  rfc: string
  factura: string
  secc: string
  pag: string
  costoCM: string
  posicionEspecial: string
  subtotal: number
}

const datos = ref<DatosContrato>({
  nombre: "",
  direccion: "",
  telefono: "",
  espacio: "Plana",
  medidas: "53 x 5 columnas.",
  fechaPublicaciones: "",
  rfc: "",
  factura: "",
  secc: "",
  pag: "",
  costoCM: "",
  posicionEspecial: "",
  subtotal: 0,
})

// ── Cálculos ────────────────────────────────────────────────────
const IVA_RATE = 0.16

const iva = computed(() => datos.value.subtotal * IVA_RATE)
const total = computed(() => datos.value.subtotal + iva.value)

function fmt(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2 })
}

const ivaFmt  = computed(() => datos.value.subtotal ? `${fmt(iva.value)} (16%)` : "16%")
const totalFmt = computed(() => datos.value.subtotal ? fmt(total.value) : "")

// ── Firma ───────────────────────────────────────────────────────
const firma = ref<"SI" | "NO" | "">("")
const errFirma = ref(false)

// ── Modal formato ────────────────────────────────────────────────
const modalVisible = ref(false)
const formatos = ref({ pdf: false, word: false, jpg: false })

function abrirModalFormato() {
  if (!firma.value) {
    errFirma.value = true
    return
  }
  errFirma.value = false
  modalVisible.value = true
}

function cerrarModal() {
  modalVisible.value = false
}

const guardando = ref(false)

async function guardarContrato() {
  guardando.value = true
  try {
    const state = window.history.state as any
    const prospectoId: number | undefined = state?.prospectoId
    const paqueteId = Number(datos.value.idPaquete)
    const cantidad = datos.value.cantidad ?? 1
    if (!prospectoId || !Number.isInteger(paqueteId) || paqueteId <= 0) {
      throw new Error("La solicitud no contiene un paquete valido")
    }
    const { contratoService } = await import("@/services/contratoService")
    const { useAuthStore } = await import("@/stores/auth")
    const authStore = useAuthStore()
    const empleadoId = authStore.empleado?.id ?? ""

    await contratoService.crear(
      {
        id_prospecto: prospectoId,
        id_empleado_responsable: empleadoId,
        fecha_contrato: new Date().toISOString().slice(0, 10),
        fecha_inicio_publicacion: null,
        fecha_fin_publicacion: null,
        observaciones: datos.value.posicionEspecial || null,
        sub_total: datos.value.subtotal,
        iva_monto: iva.value,
        total: total.value,
        estado: firma.value === "SI" ? "Firmado" : "Vigente",
      },
      [{
        id_paquete: paqueteId,
        cantidad,
        precio_unitario: datos.value.subtotal / cantidad,
        importe: datos.value.subtotal,
      }],
    )
    cerrarModal()
    router.push({ name: "Dashboard" })
  } catch (e) {
    console.error("Error guardando contrato periódico:", e)
    alert(e instanceof Error ? e.message : "No se pudo guardar el contrato")
  }
  guardando.value = false
}

function cancelar() {
  router.back()
}

function salir() {
  router.push({ name: "Dashboard" })
}

onMounted(() => {
  const state = window.history.state as any
  if (state?.contrato) {
    const c = JSON.parse(state.contrato)
    datos.value = { ...datos.value, ...c }
  }
})
</script>

<style scoped>
/* ── Raíz ─────────────────────────────────────────────────── */
.cp-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.cp-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.cp-logo {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
  flex-shrink: 0;
}

.cp-titulo {
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

.cp-regresar-btn {
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
.cp-regresar-btn:hover { filter: brightness(1.1); }

.cp-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* ── Cuerpo ──────────────────────────────────────────────── */
.cp-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
}

/* ── Hoja gris ───────────────────────────────────────────── */
.cp-hoja {
  background: #e8e8e8;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0px 10px 0px rgba(0,0,0,0.25);
  width: 100%;
  max-width: 1030px;
  padding: 20px 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Filas del formulario ────────────────────────────────── */
.cp-fila {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cp-fila-split {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.cp-fila-izq {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.cp-fila-der {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 280px;
}

.cp-etiqueta {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 16px;
  color: #000000;
  white-space: nowrap;
  flex-shrink: 0;
}

.cp-etiqueta-der {
  text-align: right;
}

/* Campo editable */
.cp-campo {
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 5px;
  height: 26px;
  min-width: 80px;
  padding: 0 6px;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 16px;
  color: #000000;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.cp-campo:focus { border-color: #008a52; background: #f6fff9; }
.cp-campo::placeholder { color: #aaa; }

/* Campos calculados (sólo lectura) */
.cp-campo-total {
  width: 174px;
  height: 26px;
  text-align: right;
  padding: 0 6px;
}
.cp-campo-readonly {
  background: #d9d9d9 !important;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
}
/* Remove number input spinners */
.cp-campo[type=number]::-webkit-inner-spin-button,
.cp-campo[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.cp-campo[type=number] { -moz-appearance: textfield; }

.cp-campo-flex { flex: 1; }

/* ── Totales ─────────────────────────────────────────────── */
.cp-totales {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  align-items: flex-end;
}

.cp-total-fila {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cp-campo-total {
  width: 174px;
  justify-content: flex-end;
}

/* ── Firma ───────────────────────────────────────────────── */
.cp-firma-bloque {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 0 0 auto;
}

.cp-firma-opciones {
  display: flex;
  gap: 16px;
  align-items: center;
}

.cp-firma-btn {
  width: 47px;
  height: 20px;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 16px;
  cursor: pointer;
  transition: filter 0.15s;
}

.cp-firma-si       { background: #d8d8d8; color: #000; }
.cp-firma-si-activo{ background: #1ba547; color: #fff; }
.cp-firma-no       { background: #d8d8d8; color: #000; }
.cp-firma-no-activo{ background: #ff1631; color: #fff; }

.cp-error-msg {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 13px;
  color: #d92525;
  margin: 0;
}

/* ── Aviso ───────────────────────────────────────────────── */
.cp-aviso {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 14px;
  color: #000000;
  text-align: right;
  margin: 0;
}

/* ── Botones ─────────────────────────────────────────────── */
.cp-botones {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 4px;
}

.cp-btn-cancelar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #a1a4a9;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 52px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 22px;
  color: #ffffff;
  transition: filter 0.15s;
}
.cp-btn-cancelar:hover { filter: brightness(1.1); }

.cp-btn-guardar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #008a52;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 52px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 22px;
  color: #ffffff;
  transition: filter 0.15s;
}
.cp-btn-guardar:hover { filter: brightness(1.1); }

.cp-btn-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* ── Footer ──────────────────────────────────────────────── */
.cp-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Modal overlay ───────────────────────────────────────── */
.cp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.76);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.cp-modal {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: inset 0px 4px 4px rgba(0,0,0,0.25);
  width: 331px;
  overflow: hidden;
}

.cp-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.cp-modal-titulo {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  color: #000000;
  font-weight: 700;
}

.cp-modal-cerrar {
  background: #d92525;
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.15s;
}
.cp-modal-cerrar:hover { filter: brightness(1.1); }

.cp-modal-divider {
  height: 1px;
  background: #000000;
  margin: 0;
}

.cp-modal-opciones {
  display: flex;
  flex-direction: column;
}

.cp-formato-opcion {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  cursor: pointer;
}

.cp-checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #000;
  accent-color: #008a52;
  cursor: pointer;
  flex-shrink: 0;
}

.cp-formato-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  color: #000000;
  font-weight: 700;
}

.cp-modal-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: center;
}

.cp-modal-btn-guardar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #008a52;
  border: none;
  border-radius: 5px;
  padding: 6px 24px;
  height: 45px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 20px;
  color: #ffffff;
  transition: filter 0.15s;
  width: 100%;
  justify-content: center;
}
.cp-modal-btn-guardar:hover { filter: brightness(1.1); }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 860px) {
  .cp-fila-split { flex-direction: column; gap: 8px; }
  .cp-fila-der   { flex: 1; }
  .cp-totales    { align-items: flex-start; }
  .cp-body       { padding: 12px 16px; }
}

@media (max-width: 600px) {
  .cp-header { height: 80px; padding: 0 12px; }
  .cp-logo   { width: 180px; height: auto; }
  .cp-regresar-btn { padding: 0 14px; font-size: 18px; height: 48px; }
  .cp-titulo { font-size: clamp(18px, 4vw, 32px); }
}
</style>
