<template>
  <div class="pend-root">
    <!-- HEADER -->
    <header class="pend-header">
      <div class="pend-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="pend-titulo">Editar Contrato</span>
      <button class="btn-regresar" @click="$router.push({ name: 'Dashboard' })">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- BODY -->
    <div class="pend-body">
      <!-- Left sidebar decoration -->
      <div class="pend-sidebar">
        <img :src="`${base}assets/a69cb.svg`" alt="" style="width:100px;height:100%;object-fit:fill;" />
      </div>

      <!-- Folder tab strip (yellow) -->
      <div class="pend-content">
        <div class="pend-folder-tab">
          <img :src="`${base}assets/56424.svg`" alt="" class="folder-tab-img" />
        </div>

        <!-- Main card -->
        <div class="pend-card-outer">
          <!-- Inner cream panel -->
          <div class="pend-card-inner">

            <!-- Table panel -->
            <div class="pend-table-panel">
              <!-- Table header -->
              <div class="pend-thead">
                <span class="pth pth-radio"></span>
                <span class="pth pth-id">ID</span>
                <span class="pth pth-cliente">Cliente</span>
                <span class="pth pth-solicitudes">Solicitudes</span>
                <span class="pth pth-scroll"></span>
              </div>

              <!-- Divider -->
              <div class="pend-divider"></div>

              <!-- Table body -->
              <div class="pend-tbody" ref="tbodyRef">
                <!-- Scroll up -->
                <div class="scroll-col">
                  <button class="scroll-btn scroll-btn--up" @click="scrollUp">
                    <span class="scroll-arrow">›</span>
                  </button>
                </div>

                <div class="pend-rows">
                  <div
                    v-for="contrato in contratos"
                    :key="contrato.id"
                    class="pend-row"
                    :class="{ 'pend-row--selected': seleccionado === contrato.id }"
                    @click="seleccionado = contrato.id"
                  >
                    <!-- Radio circle -->
                    <span class="ptd ptd-radio">
                      <span class="radio-circle" :class="{ 'radio-circle--active': seleccionado === contrato.id }">
                        <span v-if="seleccionado === contrato.id" class="radio-dot"></span>
                      </span>
                    </span>

                    <!-- ID -->
                    <span class="ptd ptd-id">{{ String(contrato.id).padStart(2, '0') }}</span>

                    <!-- Cliente -->
                    <span class="ptd ptd-cliente">{{ contrato.nombre }}</span>

                    <!-- Solicitudes / descripción -->
                    <span class="ptd ptd-solicitudes">
                      <span class="solicitud-text">{{ contrato.prioridad }} — {{ contrato.fecha_limite || 'Sin fecha' }}</span>
                    </span>

                    <!-- Spacer for scroll col -->
                    <span class="ptd ptd-scroll"></span>
                  </div>
                </div>

                <!-- Scroll down -->
                <div class="scroll-col scroll-col--bottom">
                  <button class="scroll-btn scroll-btn--down" @click="scrollDown">
                    <span class="scroll-arrow scroll-arrow--down">›</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Editar button -->
            <div class="pend-actions">
              <button
                class="btn-editar"
                :disabled="seleccionado === null"
                @click="irEditar"
              >
                <img :src="`${base}assets/70111.png`" alt="" style="width:28px;height:28px;" />
                Editar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="pend-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const base = import.meta.env.BASE_URL
const router = useRouter()
const authStore = useAuthStore()
const tbodyRef = ref<HTMLElement | null>(null)
const cargando = ref(true)

interface PendienteRow {
  id: number
  nombre: string
  descripcion: string
  prioridad: string
  fecha_limite: string
  completado: boolean
}

const contratos = ref<PendienteRow[]>([])
const seleccionado = ref<number | null>(null)

onMounted(async () => {
  const empleadoId = authStore.empleado?.id
  if (!empleadoId) { cargando.value = false; return }
  try {
    const { pendienteService } = await import("@/services/pendienteService")
    const data = await pendienteService.listarPorEmpleado(empleadoId)
    contratos.value = data
      .filter((p: any) => !p.completado)
      .map((p: any) => ({
        id: p.id,
        nombre: (p.prospectos as any)?.nombre_empresa ?? p.titulo,
        descripcion: p.descripcion ?? "",
        prioridad: p.prioridad ?? "Media",
        fecha_limite: p.fecha_limite ?? "",
        completado: p.completado ?? false,
      }))
  } catch (e) {
    console.error("Error cargando pendientes:", e)
  } finally {
    cargando.value = false
  }
})


function scrollUp() {
  tbodyRef.value?.scrollBy({ top: -80, behavior: "smooth" })
}

function scrollDown() {
  tbodyRef.value?.scrollBy({ top: 80, behavior: "smooth" })
}

function irEditar() {
  if (seleccionado.value === null) return
  const contrato = contratos.value.find(c => c.id === seleccionado.value)
  if (!contrato) return

  // Determine contract type from current solicitud text (R: = Radio, P: = Periódico)
  const esRadio = contrato.solicitudActual.includes(" R:")

  if (esRadio) {
    // Pass minimal radio contrato data so the form can prefill
    router.push({
      name: "ContratoRadioView",
      state: {
        radioContrato: JSON.stringify({
          nombreSpot: contrato.solicitudActual,
          cliente: contrato.nombre,
        }),
      },
    })
  } else {
    // Pass minimal periódico contrato data
    router.push({
      name: "ContratoPeriodicoView",
      state: {
        contrato: JSON.stringify({
          nombre: contrato.nombre,
          espacio: contrato.solicitudActual,
        }),
      },
    })
  }
}
</script>

<style scoped>
.pend-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: "Baloo Paaji:Regular", sans-serif;
}

/* ── Header ─────────────────────────────────────────────────── */
.pend-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.pend-logo { display: flex; align-items: center; }
.pend-titulo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Lilita One:Regular", sans-serif;
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
  font-family: "Baloo Paaji:Regular", sans-serif;
  font-size: 25px;
  cursor: pointer;
}

/* ── Body ────────────────────────────────────────────────────── */
.pend-body {
  flex: 1;
  display: flex;
  position: relative;
}
.pend-sidebar {
  width: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
}
.pend-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 17px 24px 16px;
}

/* Folder tab */
.pend-folder-tab {
  align-self: flex-start;
  height: 36px;
  overflow: hidden;
  width: 943px;
  max-width: 100%;
}
.folder-tab-img {
  height: 36px;
  width: 100%;
  object-fit: fill;
}

/* Main card */
.pend-card-outer {
  width: 943px;
  max-width: 100%;
}
.pend-card-inner {
  background: #f8f4e3;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
  padding: 16px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 480px;
}

/* ── Table ────────────────────────────────────────────────────── */
.pend-table-panel {
  background: #fff;
  border: 1px solid #000;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: inset 0 4px 4px rgba(0,0,0,0.25);
  flex: 1;
}

.pend-thead {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #fff;
}
.pth {
  font-family: "Baloo Paaji:Regular", sans-serif;
  font-size: 25px;
  color: #000;
  text-align: center;
}
.pth-radio   { width: 44px; }
.pth-id      { width: 100px; text-align: center; border-right: 1px solid #000; padding-right: 10px; }
.pth-cliente { flex: 1; text-align: center; border-right: 1px solid #000; padding-right: 10px; }
.pth-solicitudes { flex: 1.4; text-align: center; }
.pth-scroll  { width: 30px; }

.pend-divider {
  height: 1px;
  background: #000;
  margin: 0 12px;
}

.pend-tbody {
  display: flex;
  align-items: stretch;
  position: relative;
  max-height: 320px;
  overflow: hidden;
}

.scroll-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 30px;
  flex-shrink: 0;
  padding-top: 6px;
}
.scroll-col--bottom { justify-content: flex-end; padding-bottom: 6px; }

.pend-rows {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
}
.pend-rows::-webkit-scrollbar { display: none; }

.pend-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #c0c0c0;
  cursor: pointer;
  transition: background 0.1s;
}
.pend-row:last-child { border-bottom: none; }
.pend-row:hover { background: #f5f5f5; }
.pend-row--selected { background: #eaf6ee; }

.ptd {
  font-family: "Baloo Paaji:Regular", sans-serif;
  font-size: 25px;
  color: #000;
  display: flex;
  align-items: center;
}
.ptd-radio   { width: 44px; justify-content: center; }
.ptd-id      { width: 100px; justify-content: center; font-weight: 700; border-right: 1px solid #000; margin-right: 8px; }
.ptd-cliente { flex: 1; font-weight: 700; border-right: 1px solid #000; margin-right: 8px; padding-right: 8px; }
.ptd-solicitudes {
  flex: 1.4;
  justify-content: center;
  gap: 6px;
  font-size: 20px;
  font-weight: 400;
}
.ptd-scroll { width: 30px; }

/* Radio circle */
.radio-circle {
  width: 24px;
  height: 24px;
  border: 2px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.radio-circle--active { border-color: #008a52; }
.radio-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #008a52;
}

/* Nav arrows */
.nav-arrow {
  background: none;
  border: none;
  color: #c0c0c0;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  font-family: "Baloo Paaji:Regular", sans-serif;
  line-height: 1;
}
.nav-arrow:hover { color: #333; }

.solicitud-text {
  font-family: "Baloo Paaji:Regular", sans-serif;
  font-size: 20px;
  color: #000;
  min-width: 180px;
  text-align: center;
}

/* Scroll arrows */
.scroll-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #c0c0c0;
}
.scroll-btn:hover { color: #333; }
.scroll-arrow {
  font-size: 20px;
  display: inline-block;
  transform: rotate(-90deg);
  line-height: 1;
}
.scroll-arrow--down {
  transform: rotate(90deg);
}

/* ── Editar button ─────────────────────────────────────────── */
.pend-actions {
  display: flex;
  justify-content: center;
}
.btn-editar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #a7d6e4;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 52px;
  width: 170px;
  font-family: "Baloo Paaji:Regular", sans-serif;
  font-size: 25px;
  cursor: pointer;
  justify-content: center;
  transition: background 0.15s, opacity 0.15s;
}
.btn-editar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-editar:not(:disabled):hover { background: #30a5ce; }

/* ── Footer ──────────────────────────────────────────────────── */
.pend-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}
</style>
