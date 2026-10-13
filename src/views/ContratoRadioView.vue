<template>
  <div class="crv-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="crv-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="crv-logo" />
      <h1 class="crv-titulo">Contrato-radio</h1>
      <button class="crv-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="crv-body">
      <div class="crv-hoja">

        <p class="crv-encabezado">ORDEN DE PUBLICIDAD • RADIO</p>

        <!-- Fila 1: Producto | Por orden de | Conducto | Fecha | Tel. Cliente -->
        <div class="crv-row crv-row-5">
          <div class="crv-field">
            <label class="crv-label">Producto</label>
            <input v-model="c.nombreSpot" class="crv-input" placeholder="Nombre del producto" />
          </div>
          <div class="crv-field">
            <label class="crv-label">Por orden de</label>
            <input v-model="c.cliente" class="crv-input" placeholder="Cliente" />
          </div>
          <div class="crv-field">
            <label class="crv-label">Conducto</label>
            <input v-model="c.conducto" class="crv-input" placeholder="Agencia o directo" />
          </div>
          <div class="crv-field">
            <label class="crv-label">Fecha contrato</label>
            <input type="date" v-model="c.fechaContrato" class="crv-input" />
          </div>
          <div class="crv-field">
            <label class="crv-label">Tel. Cliente</label>
            <input v-model="c.telCliente" class="crv-input" placeholder="Teléfono" />
          </div>
        </div>

        <!-- Fila 2: Cliente (amplio) | Inicia -->
        <div class="crv-row crv-row-2wide">
          <div class="crv-field crv-field-grow">
            <label class="crv-label">Cliente</label>
            <input v-model="c.cliente" class="crv-input" placeholder="Nombre del cliente" />
          </div>
          <div class="crv-field crv-field-date">
            <label class="crv-label">Inicia (D/M/A)</label>
            <input type="date" v-model="c.fechaInicio" class="crv-input" />
          </div>
        </div>

        <!-- Fila 3: Factura a | Termina -->
        <div class="crv-row crv-row-2wide">
          <div class="crv-field crv-field-grow">
            <label class="crv-label">Factura a</label>
            <input v-model="c.facturaA" class="crv-input" placeholder="Razón social para factura" />
          </div>
          <div class="crv-field crv-field-date">
            <label class="crv-label">Termina (D/M/A)</label>
            <input type="date" v-model="c.fechaTermina" class="crv-input" />
          </div>
        </div>

        <!-- Fila 4: RFC -->
        <div class="crv-row">
          <div class="crv-field crv-field-grow">
            <label class="crv-label">R.F.C.</label>
            <input v-model="c.rfc" class="crv-input" placeholder="RFC del cliente" />
          </div>
        </div>

        <!-- Fila 5: Domicilio -->
        <div class="crv-row">
          <div class="crv-field crv-field-grow">
            <label class="crv-label">Domicilio</label>
            <input v-model="c.domicilio" class="crv-input" placeholder="Calle, número, colonia, ciudad" />
          </div>
        </div>

        <!-- Separador visual -->
        <div class="crv-sep" />

        <!-- Fila 6: Programa | Duración | Precio unit. | # Días | Días semana | # Spots | Importe -->
        <div class="crv-row crv-row-spots">
          <div class="crv-field">
            <label class="crv-label">Programa / Emisora</label>
            <input :value="c.emisora" readonly class="crv-input crv-readonly" />
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label">Duración</label>
            <input :value="c.duracion" readonly class="crv-input crv-readonly" />
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label">Precio unit.</label>
            <input :value="formatMXN(c.precioUnitario)" readonly class="crv-input crv-readonly" />
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label"># De días</label>
            <input :value="c.dias" readonly class="crv-input crv-readonly" />
          </div>
          <!-- Checkboxes días de la semana -->
          <div class="crv-field crv-field-dias-sem">
            <label class="crv-label">L M M J V S D</label>
            <div class="crv-dias-checks">
              <label v-for="d in diasSemana" :key="d.val" class="crv-dia-chk">
                <input type="checkbox" v-model="c.diasSemana" :value="d.val" />
                {{ d.label }}
              </label>
            </div>
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label"># De spots</label>
            <input :value="c.cantidad" readonly class="crv-input crv-readonly" />
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label">Importe</label>
            <input :value="formatMXN(c.subtotal)" readonly class="crv-input crv-readonly crv-importe" />
          </div>
        </div>

        <!-- Fila 7: Observaciones -->
        <div class="crv-row">
          <div class="crv-field crv-field-grow">
            <label class="crv-label">Observaciones</label>
            <textarea v-model="c.observaciones" class="crv-input crv-textarea" rows="2" placeholder="Observaciones adicionales" />
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label">Sub-Total</label>
            <input :value="formatMXN(c.subtotal)" readonly class="crv-input crv-readonly" />
          </div>
        </div>

        <!-- Fila 8: Firma | IVA -->
        <div class="crv-row crv-row-firma">
          <div class="crv-field">
            <label class="crv-label">ACEPTA — Firma del cliente</label>
            <div class="crv-firma-btns">
              <button
                class="crv-firma-btn"
                :class="{ active: c.firma === true }"
                @click="c.firma = true"
              >SI</button>
              <button
                class="crv-firma-btn crv-firma-no"
                :class="{ active: c.firma === false }"
                @click="c.firma = false"
              >NO</button>
            </div>
          </div>
          <div class="crv-field crv-field-sm">
            <label class="crv-label">I.V.A. (16%)</label>
            <input :value="formatMXN(iva)" readonly class="crv-input crv-readonly" />
          </div>
        </div>

        <!-- TOTAL -->
        <div class="crv-row crv-row-total">
          <span class="crv-total-lbl">TOTAL</span>
          <span class="crv-total-val">{{ formatMXN(totalFinal) }}</span>
        </div>

        <!-- Botones finales -->
        <div class="crv-botones">
          <button class="crv-btn crv-btn-cancelar" @click="regresar">
            <img :src="`${base}assets/7422c.png`" alt="" class="crv-btn-icon" />
            Cancelar
          </button>
          <button class="crv-btn crv-btn-guardar" @click="guardar">
            <img :src="`${base}assets/43b53.png`" alt="" class="crv-btn-icon" />
            Guardar
          </button>
        </div>

      </div>
    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="crv-footer" />

    <!-- ── MODAL FORMATO ──────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showModal" class="crv-modal-overlay" @click.self="showModal = false">
        <div class="crv-modal">
          <div class="crv-modal-header">
            <span class="crv-modal-titulo">Formato</span>
            <button class="crv-modal-cerrar" @click="showModal = false">✕</button>
          </div>
          <div class="crv-modal-divider" />
          <div class="crv-modal-opciones">
            <label class="crv-modal-chk">
              <input type="checkbox" v-model="formatos" value="PDF" class="crv-checkbox" />
              <span class="crv-formato-label">PDF</span>
            </label>
            <div class="crv-modal-divider" />
            <label class="crv-modal-chk">
              <input type="checkbox" v-model="formatos" value="WORD" class="crv-checkbox" />
              <span class="crv-formato-label">WORD</span>
            </label>
            <div class="crv-modal-divider" />
            <label class="crv-modal-chk">
              <input type="checkbox" v-model="formatos" value="JPG" class="crv-checkbox" />
              <span class="crv-formato-label">JPG</span>
            </label>
          </div>
          <div class="crv-modal-footer">
            <button class="crv-btn crv-btn-guardar crv-modal-guardar" @click="confirmarGuardar">
              <img :src="`${base}assets/43b53.png`" alt="" class="crv-btn-icon" />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const base   = import.meta.env.BASE_URL

const rawContrato = window.history.state?.radioContrato ?? "{}"
const src = JSON.parse(rawContrato) || {}

const c = ref({
  idPaquete:      src.idPaquete ?? null,
  nombreSpot:    src.nombreSpot    ?? "",
  cliente:       src.cliente       ?? "",
  conducto:      src.conducto      ?? "",
  fechaContrato: src.fechaContrato ?? new Date().toISOString().slice(0, 10),
  telCliente:    src.telCliente    ?? "",
  facturaA:      src.facturaA      ?? "",
  fechaInicio:   src.fechaInicio   ?? "",
  fechaTermina:  src.fechaTermina  ?? "",
  rfc:           src.rfc           ?? "",
  domicilio:     src.domicilio     ?? "",
  emisora:       src.emisora       ?? "",
  duracion:      src.duracion      ?? "",
  precioUnitario: src.precioUnitario ?? 0,
  dias:          src.dias          ?? 1,
  cantidad:      src.cantidad      ?? 1,
  subtotal:      src.subtotal      ?? 0,
  observaciones: src.observaciones ?? "",
  diasSemana:    [] as string[],
  firma:         null as boolean | null,
})

const diasSemana = [
  { val: "L", label: "L" },
  { val: "Ma", label: "M" },
  { val: "Mi", label: "M" },
  { val: "J", label: "J" },
  { val: "V", label: "V" },
  { val: "S", label: "S" },
  { val: "D", label: "D" },
]

const iva       = computed(() => c.value.subtotal * 0.16)
const totalFinal = computed(() => c.value.subtotal + iva.value)

function formatMXN(val: number): string {
  return `$${val.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const showModal = ref(false)
const formatos  = ref<string[]>([])

function guardar() {
  if (c.value.firma === null) {
    alert("Indica si el cliente acepta (Firma: SI / NO).")
    return
  }
  showModal.value = true
}

const guardando = ref(false)

async function confirmarGuardar() {
  if (formatos.value.length === 0) {
    alert("Selecciona al menos un formato.")
    return
  }
  guardando.value = true
  try {
    const state = window.history.state as any
    const prospectoId: number | undefined = state?.prospectoId
    const paqueteId = Number(c.value.idPaquete)
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
        fecha_contrato: c.value.fechaContrato || new Date().toISOString().slice(0, 10),
        fecha_inicio_publicacion: c.value.fechaInicio || null,
        fecha_fin_publicacion: c.value.fechaTermina || null,
        observaciones: c.value.observaciones || null,
        sub_total: c.value.subtotal,
        iva_monto: iva.value,
        total: totalFinal.value,
        estado: c.value.firma ? "Firmado" : "Vigente",
      },
      [{
        id_paquete: paqueteId,
        cantidad: c.value.cantidad,
        precio_unitario: c.value.precioUnitario,
        importe: c.value.subtotal,
      }],
    )
    showModal.value = false
    router.push({ name: "Dashboard" })
  } catch (e) {
    console.error("Error guardando contrato radio:", e)
    alert(e instanceof Error ? e.message : "No se pudo guardar el contrato")
  }
  guardando.value = false
}

function regresar() {
  router.back()
}
</script>

<style scoped>
.crv-root {
  min-height: 100vh; background: #3a2422;
  display: flex; flex-direction: column;
}

/* Header */
.crv-header {
  background: #008a52; height: 100px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; flex-shrink: 0; position: relative;
}
.crv-logo { width: 296px; height: 69px; object-fit: contain; object-position: left center; display: block; flex-shrink: 0; }
.crv-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: clamp(22px, 3vw, 40px); font-weight: 400; color: #fff; margin: 0;
  position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap;
}
.crv-regresar-btn {
  display: flex; align-items: center; gap: 10px;
  background: #d92525; border: none; border-radius: 10px;
  padding: 0 24px; height: 60px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap; transition: filter 0.15s;
}
.crv-regresar-btn:hover { filter: brightness(1.1); }
.crv-regresar-btn img { width: 36px; height: 36px; object-fit: contain; }

/* Body */
.crv-body { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 16px 30px; }

/* Hoja de contrato */
.crv-hoja {
  width: 100%; max-width: 1100px;
  background: #e8e8e8; border-radius: 8px;
  padding: 20px 28px; display: flex; flex-direction: column; gap: 12px;
}

.crv-encabezado {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 20px; color: #3a2422; margin: 0 0 4px; text-align: center;
}

/* Filas */
.crv-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
.crv-row-5 > .crv-field { flex: 1; min-width: 120px; }
.crv-row-2wide { flex-wrap: nowrap; }
.crv-row-spots { flex-wrap: wrap; align-items: flex-end; gap: 8px; }
.crv-row-firma  { gap: 20px; align-items: center; }
.crv-row-total  { justify-content: flex-end; align-items: center; gap: 16px; background: #d0d0d0; border-radius: 6px; padding: 8px 16px; }

/* Campos */
.crv-field { display: flex; flex-direction: column; gap: 3px; }
.crv-field-grow { flex: 1; }
.crv-field-date { width: 180px; flex-shrink: 0; }
.crv-field-sm   { width: 110px; flex-shrink: 0; }
.crv-field-dias-sem { flex-shrink: 0; }

.crv-label {
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 11px; font-weight: 700; color: #444; text-transform: uppercase; letter-spacing: 0.03em;
}
.crv-input {
  border: 1px solid #aaa; border-radius: 4px; padding: 6px 8px;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 13px; background: #fff; color: #000; outline: none; width: 100%; box-sizing: border-box;
}
.crv-input:focus { border-color: #008a52; }
.crv-readonly { background: #d4d4d4; color: #333; cursor: default; }
.crv-importe  { font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace; color: #1a4f2e; }
.crv-textarea { resize: vertical; min-height: 50px; }

/* Días de la semana */
.crv-dias-checks { display: flex; gap: 4px; padding: 4px 0; }
.crv-dia-chk {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace; font-size: 11px;
}

/* Separador */
.crv-sep { height: 1px; background: #bbb; }

/* Firma */
.crv-firma-btns { display: flex; gap: 8px; }
.crv-firma-btn {
  width: 52px; height: 36px; border: 2px solid #aaa;
  border-radius: 6px; font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 16px; font-weight: 700; cursor: pointer;
  background: #fff; color: #333; transition: all 0.15s;
}
.crv-firma-btn.active { background: #008a52; border-color: #008a52; color: #fff; }
.crv-firma-no.active  { background: #d92525; border-color: #d92525; color: #fff; }

/* Total */
.crv-total-lbl {
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 18px; font-weight: 700; color: #3a2422;
}
.crv-total-val {
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 22px; font-weight: 700; color: #1a4f2e;
}

/* Botones */
.crv-botones { display: flex; justify-content: flex-end; gap: 14px; margin-top: 4px; }
.crv-btn {
  display: flex; align-items: center; gap: 10px;
  border: none; border-radius: 10px; padding: 0 22px; height: 50px;
  cursor: pointer; font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 18px; color: #fff; transition: filter 0.15s; white-space: nowrap;
}
.crv-btn:hover { filter: brightness(1.1); }
.crv-btn-icon { width: 26px; height: 26px; object-fit: contain; }
.crv-btn-cancelar { background: #d92525; }
.crv-btn-guardar  { background: #584848; }

/* Footer */
.crv-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

/* Modal */
.crv-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.76);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.crv-modal {
  background: #fff; border-radius: 14px; width: 331px; overflow: hidden;
  box-shadow: inset 0px 4px 4px rgba(0,0,0,0.25);
}
.crv-modal-header {
  display: flex; align-items: center; justify-content: space-between; padding: 14px 16px;
}
.crv-modal-titulo {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; font-weight: 700; color: #000; margin: 0;
}
.crv-modal-cerrar {
  background: #d92525; border: none; border-radius: 5px;
  width: 40px; height: 40px; color: #fff; font-size: 20px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.crv-modal-cerrar:hover { filter: brightness(1.1); }
.crv-modal-divider { height: 1px; background: #000; margin: 0; }
.crv-modal-opciones { display: flex; flex-direction: column; }
.crv-modal-chk {
  display: flex; align-items: center; gap: 20px; padding: 16px 24px; cursor: pointer;
}
.crv-checkbox { width: 18px; height: 18px; accent-color: #008a52; cursor: pointer; flex-shrink: 0; }
.crv-formato-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; font-weight: 700; color: #000;
}
.crv-modal-footer { padding: 16px 24px; display: flex; justify-content: center; }
.crv-modal-guardar { width: 100%; justify-content: center; background: #008a52; }

@media (max-width: 900px) {
  .crv-row-5 { flex-wrap: wrap; }
  .crv-row-2wide { flex-wrap: wrap; }
  .crv-field-date { width: 100%; }
  .crv-row-spots { flex-wrap: wrap; }
  .crv-body { padding: 12px 12px; }
}
</style>
