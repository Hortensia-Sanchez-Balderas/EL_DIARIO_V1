<template>
  <div class="nsr-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="nsr-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="nsr-logo" />
      <h1 class="nsr-titulo">PAQUETES DE RADIO</h1>
      <button class="nsr-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="nsr-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="nsr-body">
      <div class="nsr-carpeta">

        <div class="nsr-tab">
          <span class="nsr-tab-titulo">Nueva Solicitud de Registro</span>
        </div>

        <div class="nsr-hoja">
          <div class="nsr-form-grid">

            <!-- Columna izquierda -->
            <div class="nsr-col">
              <!-- Cliente / Prospecto -->
              <div class="nsr-field">
                <label class="nsr-label">Cliente / Prospecto</label>
                <select v-model="form.idProspecto" class="nsr-select">
                  <option value="">-- Selecciona --</option>
                  <option v-for="p in prospectos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
                </select>
              </div>

              <!-- Nombre del Spot -->
              <div class="nsr-field">
                <label class="nsr-label">Nombre del Spot</label>
                <input type="text" v-model="form.nombreSpot" class="nsr-input" placeholder="Nombre del producto o empresa" />
              </div>

              <!-- Tiempo -->
              <div class="nsr-field">
                <label class="nsr-label">Tiempo</label>
                <input type="text" :value="tarifa.duracion" readonly class="nsr-input nsr-readonly" />
              </div>

              <!-- Tarifa Comercial -->
              <div class="nsr-field">
                <label class="nsr-label">Tarifa Comercial</label>
                <input type="text" :value="tarifa.precio" readonly class="nsr-input nsr-readonly" />
              </div>

              <!-- Notas -->
              <div class="nsr-field">
                <label class="nsr-label">Notas</label>
                <input type="text" v-model="form.notas" class="nsr-input" placeholder="Observaciones adicionales" />
              </div>
            </div>

            <!-- Columna derecha -->
            <div class="nsr-col">
              <!-- Servicio -->
              <div class="nsr-field">
                <label class="nsr-label">Servicio</label>
                <input type="text" :value="tarifa.servicio" readonly class="nsr-input nsr-readonly" />
              </div>

              <!-- Lugar / Emisora -->
              <div class="nsr-field">
                <label class="nsr-label">Lugar / Emisora</label>
                <select v-model="form.emisora" class="nsr-select">
                  <option value="">-- Selecciona emisora --</option>
                  <option value="EXA FM">EXA FM</option>
                  <option value="Los 40">Los 40</option>
                  <option value="La Ke Buena">La Ke Buena</option>
                  <option value="El Diario Radio">El Diario Radio</option>
                  <option value="XHEM">XHEM</option>
                </select>
              </div>

              <!-- Días -->
              <div class="nsr-field">
                <label class="nsr-label">Días de transmisión</label>
                <input type="number" v-model.number="form.dias" min="1" class="nsr-input" placeholder="Número de días" />
              </div>

              <!-- Cantidad de spots por día -->
              <div class="nsr-field">
                <label class="nsr-label">Spots por día</label>
                <input type="number" v-model.number="form.cantidad" min="1" class="nsr-input" placeholder="Cantidad de spots" />
              </div>

              <!-- Total -->
              <div class="nsr-field">
                <label class="nsr-label">Total MXN</label>
                <input type="text" :value="totalFormateado" readonly class="nsr-input nsr-readonly nsr-total" />
              </div>
            </div>

          </div>

          <!-- Botones -->
          <div class="nsr-botones">
            <button class="nsr-btn nsr-btn-cancelar" @click="regresar">
              <img :src="`${base}assets/7422c.png`" alt="" class="nsr-btn-icon" />
              Cancelar
            </button>
            <button class="nsr-btn nsr-btn-contrato" @click="generarContrato">
              <img :src="`${base}assets/82a6f.png`" alt="" class="nsr-btn-icon" />
              Contrato
            </button>
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

const router = useRouter()
const base   = import.meta.env.BASE_URL

// Tarifa traída desde SpotRadioTarifaView via history.state
const tarifaRaw = window.history.state?.radioTarifa ?? "{}"
const tarifa = ref<{ idPaquete?: number; servicio: string; duracion: string; precio: string }>(
  JSON.parse(tarifaRaw) || { servicio: "Spot Publicitario", duracion: "", precio: "" }
)

const prospectos = ref<{ id: string; nombre: string }[]>([])

onMounted(async () => {
  const lista = await prospectoService.listar()
  prospectos.value = lista.map((p: any) => ({ id: p.id, nombre: p.nombre_empresa }))
})

const form = ref({
  idProspecto: "",
  nombreSpot:  "",
  emisora:     "",
  dias:        1,
  cantidad:    1,
  notas:       "",
})

function parsePrecio(p: string): number {
  return parseFloat(p.replace(/[$,]/g, "")) || 0
}

const total = computed(() => parsePrecio(tarifa.value.precio) * (form.value.dias || 1) * (form.value.cantidad || 1))
const totalFormateado = computed(() => `$${total.value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)

function validar(): boolean {
  if (!form.value.idProspecto) { alert("Selecciona un cliente o prospecto."); return false }
  if (!form.value.nombreSpot.trim()) { alert("Escribe el nombre del spot."); return false }
  if (!form.value.emisora) { alert("Selecciona la emisora."); return false }
  if (!form.value.dias || form.value.dias < 1) { alert("Indica los días de transmisión."); return false }
  if (!form.value.cantidad || form.value.cantidad < 1) { alert("Indica la cantidad de spots por día."); return false }
  return true
}

function generarContrato() {
  if (!validar()) return
  const idNum = Number(form.value.idProspecto)
  const prospecto = prospectos.value.find(p => Number(p.id) === idNum)
  router.push({
    name: "ContratoRadioView",
    state: {
      prospectoId: idNum,
      radioContrato: JSON.stringify({
        idPaquete:      tarifa.value.idPaquete,
        cliente:        prospecto?.nombre ?? "",
        nombreSpot:     form.value.nombreSpot,
        servicio:       tarifa.value.servicio,
        duracion:       tarifa.value.duracion,
        emisora:        form.value.emisora,
        dias:           form.value.dias,
        cantidad:       form.value.cantidad,
        precioUnitario: parsePrecio(tarifa.value.precio),
        subtotal:       total.value,
        notas:          form.value.notas,
      }),
    },
  })
}

function regresar() {
  router.back()
}
</script>

<style scoped>
.nsr-root {
  min-height: 100vh; background: #3a2422;
  display: flex; flex-direction: column;
}

/* Header */
.nsr-header {
  background: #008a52; height: 100px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; flex-shrink: 0; position: relative;
}
.nsr-logo { width: 296px; height: 69px; object-fit: contain; object-position: left center; display: block; flex-shrink: 0; }
.nsr-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: clamp(22px, 3vw, 40px); font-weight: 400; color: #fff; margin: 0;
  position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap;
}
.nsr-regresar-btn {
  display: flex; align-items: center; gap: 10px;
  background: #d92525; border: none; border-radius: 10px;
  padding: 0 24px; height: 60px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap; transition: filter 0.15s;
}
.nsr-regresar-btn:hover { filter: brightness(1.1); }
.nsr-regresar-icon { width: 36px; height: 36px; object-fit: contain; }

/* Body */
.nsr-body { flex: 1; display: flex; align-items: stretch; justify-content: center; padding: 16px 40px; }

/* Carpeta */
.nsr-carpeta { width: 100%; max-width: 1030px; display: flex; flex-direction: column; }

.nsr-tab {
  background: #f9f3d2; border-radius: 10px 10px 0 0;
  width: 640px; max-width: 100%;
  padding: 10px 24px 14px;
  box-shadow: 10px 0px 10px 0px rgba(0,0,0,0.25);
}
.nsr-tab-titulo {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 32px; color: #000; font-weight: 400;
}

.nsr-hoja {
  background: #f5e1a4; border-radius: 0 7px 7px 7px;
  padding: 24px 28px; flex: 1; display: flex; flex-direction: column; gap: 20px;
}

/* Form grid */
.nsr-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 32px; }
.nsr-col { display: flex; flex-direction: column; gap: 14px; }

.nsr-field { display: flex; flex-direction: column; gap: 4px; }

.nsr-label {
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 14px; font-weight: 700; color: #3a2422;
}

.nsr-input, .nsr-select {
  border: 1px solid #584848; border-radius: 6px;
  padding: 8px 12px; font-size: 15px;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  background: #fff; color: #000; outline: none;
}
.nsr-input:focus, .nsr-select:focus { border-color: #008a52; box-shadow: 0 0 0 2px rgba(0,138,82,0.15); }

.nsr-readonly { background: #ede3c8; color: #555; cursor: not-allowed; }
.nsr-total { font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace; font-size: 17px; color: #1a4f2e; }

/* Botones */
.nsr-botones { display: flex; justify-content: flex-end; gap: 16px; }
.nsr-btn {
  display: flex; align-items: center; gap: 10px;
  border: none; border-radius: 10px; padding: 0 24px; height: 52px;
  cursor: pointer; font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 20px; color: #fff; transition: filter 0.15s; white-space: nowrap;
}
.nsr-btn:hover { filter: brightness(1.1); }
.nsr-btn-icon { width: 28px; height: 28px; object-fit: contain; }
.nsr-btn-cancelar { background: #d92525; }
.nsr-btn-contrato { background: #584848; }

/* Footer */
.nsr-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

@media (max-width: 700px) {
  .nsr-form-grid { grid-template-columns: 1fr; }
  .nsr-body { padding: 12px 16px; }
}
</style>
