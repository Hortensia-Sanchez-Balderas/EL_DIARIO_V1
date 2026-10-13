<template>
  <div class="hist-root">
    <!-- HEADER -->
    <header class="hist-header">
      <div class="hist-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="hist-titulo">Ver detalle</span>
      <button class="btn-regresar" @click="$router.back()">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- BODY -->
    <div class="hist-body">
      <!-- Folder tab (yellow upper-left) -->
      <div class="hist-folder-tab">
        <span class="hist-page-title">Historial de pedidos</span>
      </div>

      <!-- Main card -->
      <div class="hist-card-outer">
        <div class="clip-dec">
          <img :src="`${base}assets/ea70e.svg`" alt="" style="width:72px;" />
        </div>

        <div class="hist-card-inner">
          <!-- Red X close -->
          <button class="btn-x" @click="$router.back()">
            <img :src="`${base}assets/7422c.png`" alt="cerrar" style="width:22px;height:22px;" />
          </button>

          <!-- Table panel -->
          <div class="hist-table-panel">
            <!-- Table header -->
            <div class="hist-thead">
              <span class="hth hth-fecha">Fecha</span>
              <span class="hth hth-servicio">Servicio</span>
              <span class="hth hth-desc">Descripción</span>
              <span class="hth hth-monto">Monto</span>
            </div>

            <!-- Table body -->
            <div class="hist-tbody">
              <div v-if="pedidos.length === 0" class="hist-empty">
                Sin pedidos en el historial
              </div>
              <div
                v-for="p in pedidos"
                :key="p.id"
                class="hist-row"
              >
                <span class="htd htd-fecha">{{ p.fecha }}</span>
                <span class="htd htd-servicio">{{ p.servicio }}</span>
                <span class="htd htd-desc">{{ p.descripcion }}</span>
                <span class="htd htd-monto">${{ p.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </div>

          <!-- Nueva Solicitud button -->
          <div class="hist-actions">
            <button class="btn-nueva" @click="$router.push({ name: 'NuevaSolicitudSeleccion', state: { cliente: clienteRaw } })">
              <img :src="`${base}assets/b9f9b.png`" alt="" style="width:28px;height:28px;" />
              Nueva Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="hist-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const base = import.meta.env.BASE_URL
const router = useRouter()

const clienteRaw = window.history.state?.cliente || ''

interface Pedido {
  id: number
  fecha: string
  servicio: string
  descripcion: string
  monto: number
}

const pedidos = ref<Pedido[]>([])
const cargando = ref(true)

onMounted(async () => {
  try {
    const clienteData = clienteRaw ? JSON.parse(clienteRaw) : null
    const prospectoId: number | undefined = clienteData?.id
    if (!prospectoId) { cargando.value = false; return }

    const { contratoService } = await import('@/services/contratoService')
    const contratos = await contratoService.listar()
    const propios = contratos.filter((c: any) => c.id_prospecto === prospectoId)

    pedidos.value = propios.map((c: any) => ({
      id: c.id,
      fecha: c.fecha_contrato ?? c.created_at?.slice(0, 10) ?? '-',
      servicio: c.estado ?? '-',
      descripcion: c.observaciones ?? `Contrato #${c.id}`,
      monto: c.total ?? 0,
    }))
  } catch (e) {
    console.error('Error cargando historial:', e)
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.hist-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

/* ── Header ─────────────────────────────────────────────────── */
.hist-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.hist-logo { display: flex; align-items: center; }
.hist-titulo {
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

/* ── Body ────────────────────────────────────────────────────── */
.hist-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px 16px;
}
.hist-folder-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  padding: 16px 24px 12px;
  align-self: center;
  width: 1030px;
  max-width: 100%;
  box-sizing: border-box;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
}
.hist-page-title {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 40px;
  color: #615d5d;
}

/* Outer card */
.hist-card-outer {
  width: 1030px;
  max-width: 100%;
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 7px;
  position: relative;
}
.clip-dec {
  position: absolute;
  left: -20px;
  bottom: 8px;
  z-index: 2;
}
.hist-card-inner {
  background: #f8f4e3;
  border: 3px solid #1e1e1e;
  margin: 8px 12px;
  border-radius: 7px;
  padding: 68px 20px 16px;
  position: relative;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Red X ────────────────────────────────────────────────────── */
.btn-x {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: #d92525;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ── Table ────────────────────────────────────────────────────── */
.hist-table-panel {
  border: 1px solid #000;
  border-radius: 3px;
  overflow: hidden;
  flex: 1;
}
.hist-thead {
  display: flex;
  background: #d9d9d9;
  padding: 6px 8px;
}
.hth {
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 18px;
  color: #000;
}
.hth-fecha    { width: 130px; }
.hth-servicio { width: 110px; }
.hth-desc     { flex: 1; }
.hth-monto    { width: 120px; text-align: right; }

.hist-tbody { min-height: 180px; }
.hist-empty {
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 22px;
  color: #1e1e1e;
  text-align: center;
  padding: 48px 0;
}
.hist-row {
  display: flex;
  padding: 8px 8px;
  border-bottom: 1px solid #e0e0e0;
}
.htd {
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 18px;
  color: #1e1e1e;
}
.htd-fecha    { width: 130px; }
.htd-servicio { width: 110px; }
.htd-desc     { flex: 1; }
.htd-monto    { width: 120px; text-align: right; }

/* ── Actions ──────────────────────────────────────────────────── */
.hist-actions {
  display: flex;
  justify-content: center;
}
.btn-nueva {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #30a5ce;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 60px;
  width: 240px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 25px;
  cursor: pointer;
  justify-content: center;
}

/* ── Footer ──────────────────────────────────────────────────── */
.hist-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}
</style>
