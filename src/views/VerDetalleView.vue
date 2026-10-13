<template>
  <div class="det-root">
    <!-- HEADER -->
    <header class="det-header">
      <div class="det-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="det-titulo">Ver detalle</span>
      <button class="btn-regresar" @click="$router.back()">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- PAGE TITLE -->
    <div class="det-page-title">Detalles del cliente y sus compras</div>

    <!-- CLIPBOARD -->
    <div class="det-body">
      <!-- Folder yellow outer -->
      <div class="det-card-outer">
        <!-- Clip decoration -->
        <div class="clip-dec">
          <img :src="`${base}assets/bfee9.svg`" alt="" style="width:72px;" />
        </div>

        <!-- White inner panel -->
        <div class="det-card-inner">
          <!-- Red X close -->
          <button class="btn-x" @click="$router.back()">
            <img :src="`${base}assets/7422c.png`" alt="cerrar" style="width:22px;height:22px;" />
          </button>

          <!-- Three column layout -->
          <div class="det-cols">

            <!-- LEFT: Información general -->
            <div class="det-col det-col-left">
              <div class="det-section-header">Información general</div>
              <div class="det-fields">
                <div class="det-field-label">Nombre del cliente</div>
                <div class="det-field-box">{{ cliente.contacto }}</div>

                <div class="det-field-label">Negocio</div>
                <div class="det-field-box">{{ cliente.nombre }}</div>

                <div class="det-field-label">Telefono</div>
                <div class="det-field-box">{{ cliente.telefono || '—' }}</div>

                <div class="det-field-label">Email</div>
                <div class="det-field-box">{{ cliente.email || '—' }}</div>

                <div class="det-field-label">Tipo de servicio</div>
                <div class="det-field-box">{{ cliente.tipo }}</div>

                <div class="det-field-label">Fecha de registro</div>
                <div class="det-field-box">{{ cliente.fechaRegistro || '—' }}</div>
              </div>
            </div>

            <!-- CENTER: Detalles + Notas -->
            <div class="det-col det-col-right">
              <!-- Detalles -->
              <div class="det-section-mini">
                <div class="det-section-header">Detalles</div>
                <div class="det-mini-fields">
                  <div class="det-field-label">Total de compras</div>
                  <div class="det-field-box">${{ (cliente.totalCompras ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</div>

                  <div class="det-field-label">Último pedido</div>
                  <div class="det-field-box">{{ cliente.ultimoPedido || 'NA' }}</div>

                  <div class="det-field-label">Estado</div>
                  <div class="det-estado-box">{{ cliente.estado }}</div>
                </div>
              </div>

              <!-- Notas y Observaciones -->
              <div class="det-section-mini" style="margin-top:12px;">
                <div class="det-section-header">Notas y Observaciones</div>
                <div class="det-notas-info">
                  <span>Total de compras: {{ cliente.contratos ?? 0 }}</span>
                  <span>Contratos generados: {{ cliente.contratos ?? 0 }}</span>
                </div>
                <div v-if="!editando" class="det-field-box det-notas-box">
                  {{ cliente.notas || 'Sin notas' }}
                </div>
                <textarea
                  v-else
                  v-model="notasEdit"
                  class="det-notas-textarea"
                  rows="2"
                ></textarea>
              </div>

              <!-- Buttons -->
              <div class="det-btns">
                <button class="btn-editar" @click="irEditar">
                  <img :src="`${base}assets/70111.png`" alt="" style="width:20px;height:20px;" />
                  Editar
                </button>
                <button class="btn-siguiente" @click="irHistorial">
                  Siguiente
                  <img :src="`${base}assets/adf9a.png`" alt="" style="width:20px;height:20px;" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="det-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const base = import.meta.env.BASE_URL
const router = useRouter()
const route  = useRoute()

interface ClienteDetalle {
  id: number
  nombre: string
  contacto: string
  tipo: string
  estado: string
  telefono?: string
  email?: string
  fechaRegistro?: string
  totalCompras?: number
  contratos?: number
}

const cargando = ref(true)
const cliente = ref<ClienteDetalle>({
  id: 0, nombre: '', contacto: '', tipo: '', estado: ''
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) { cargando.value = false; return }
  try {
    const { prospectoService } = await import('@/services/prospectoService')
    const { contratoService } = await import('@/services/contratoService')
    const [p, contratos] = await Promise.all([
      prospectoService.obtener(id),
      contratoService.listarPorEmpleado('').catch(() => []),
    ])
    const contratosProspecto = (await contratoService.listar()).filter((c: any) => c.id_prospecto === id)
    const totalCompras = contratosProspecto.reduce((s: number, c: any) => s + (c.total ?? 0), 0)
    cliente.value = {
      id: p.id,
      nombre: p.nombre_empresa,
      contacto: p.nombre_contacto,
      tipo: p.cargo_contacto ?? '-',
      estado: p.estado,
      telefono: p.telefono ?? undefined,
      email: p.email_contacto ?? undefined,
      fechaRegistro: p.fecha_registro,
      totalCompras,
      contratos: contratosProspecto.length,
    }
  } catch (e) {
    console.error('Error cargando detalle:', e)
  } finally {
    cargando.value = false
  }
})

const editando = ref(false)
const notasEdit = ref('')

function irEditar() {
  router.push({ name: 'EditarCliente', params: { id: cliente.value.id } })
}
function irHistorial() {
  router.push({ name: 'HistorialPedidos', state: { cliente: JSON.stringify(cliente.value) } })
}
</script>

<style scoped>
.det-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

/* ── Header ─────────────────────────────────────────────────── */
.det-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.det-logo { display: flex; align-items: center; }
.det-titulo {
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

/* ── Page title ──────────────────────────────────────────────── */
.det-page-title {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 36px;
  color: #615d5d;
  padding: 16px 0 8px 160px;
  background: #f9f3d2;
  margin: 16px auto 0;
  width: 1030px;
  max-width: 100%;
  border-radius: 10px 10px 0 0;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
}

/* ── Clipboard ────────────────────────────────────────────────── */
.det-body {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 24px 16px;
}
.det-card-outer {
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
.det-card-inner {
  background: #fff;
  border: 1px solid #000;
  margin: 8px 12px;
  padding: 20px 20px 16px;
  position: relative;
  min-height: 420px;
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

/* ── Layout ───────────────────────────────────────────────────── */
.det-cols {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}
.det-col-left {
  flex: 1.1;
}
.det-col-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── Section header ───────────────────────────────────────────── */
.det-section-header {
  background: #d9d9d9;
  font-family: 'Ligconsolata:Bold', monospace;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  padding: 4px 0;
  margin-bottom: 4px;
}

/* ── Fields ───────────────────────────────────────────────────── */
.det-fields { display: flex; flex-direction: column; gap: 6px; }
.det-mini-fields { display: flex; flex-direction: column; gap: 6px; }
.det-field-label {
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 18px;
  color: #000;
  margin-top: 4px;
}
.det-field-box {
  background: #d9d9d9;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 16px;
  padding: 2px 8px;
  min-height: 22px;
  color: #000;
}
.det-estado-box {
  background: #f6f6f6;
  border: 1px solid #000;
  border-radius: 10px;
  font-family: 'Ligconsolata:Bold', monospace;
  font-weight: 700;
  font-size: 20px;
  color: #433d3d;
  text-align: center;
  padding: 8px 0;
}

/* ── Notas ────────────────────────────────────────────────────── */
.det-notas-info {
  display: flex;
  flex-direction: column;
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 16px;
  margin-bottom: 4px;
}
.det-notas-box {
  min-height: 32px;
}
.det-notas-textarea {
  width: 100%;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 16px;
  padding: 4px 8px;
  resize: vertical;
  background: #d9d9d9;
}

/* ── Buttons ──────────────────────────────────────────────────── */
.det-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  align-items: flex-end;
}
.btn-editar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #059fce;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0 24px;
  height: 50px;
  width: 135px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 20px;
  cursor: pointer;
  justify-content: center;
}
.btn-siguiente {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #635251;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0 24px;
  height: 50px;
  width: 135px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 20px;
  cursor: pointer;
  justify-content: center;
}

/* ── Footer ──────────────────────────────────────────────────── */
.det-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}
</style>
