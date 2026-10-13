<template>
  <div class="edit-root">
    <!-- HEADER -->
    <header class="edit-header">
      <div class="edit-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="edit-titulo">Ver detalle</span>
      <button class="btn-regresar" @click="$router.back()">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- PAGE TITLE -->
    <div class="edit-page-title-wrap">
      <div class="edit-page-title">Detalles del cliente y sus compras</div>
    </div>

    <!-- CLIPBOARD -->
    <div class="edit-body">
      <div class="edit-card-outer">
        <div class="clip-dec">
          <img :src="`${base}assets/7bd38.svg`" alt="" style="width:72px;" />
        </div>
        <div class="edit-card-inner">
          <!-- Red X -->
          <button class="btn-x" @click="$router.back()">
            <img :src="`${base}assets/7422c.png`" alt="cerrar" style="width:22px;height:22px;" />
          </button>

          <div class="edit-cols">
            <!-- LEFT: Información general (editable) -->
            <div class="edit-col edit-col-left">
              <div class="det-section-header">Información general</div>
              <div class="det-fields">
                <div class="det-field-label">Nombre del cliente</div>
                <input class="det-input" v-model="form.contacto" />

                <div class="det-field-label">Negocio</div>
                <input class="det-input" v-model="form.nombre" />

                <div class="det-field-label">Telefono</div>
                <input class="det-input" v-model="form.telefono" />

                <div class="det-field-label">Email</div>
                <input class="det-input" v-model="form.email" />

                <div class="det-field-label">Tipo de servicio</div>
                <input class="det-input" v-model="form.tipo" />
              </div>
            </div>

            <!-- RIGHT: Detalles (read-only) + Notas (editable) + Guardar -->
            <div class="edit-col edit-col-right">
              <!-- Detalles (read-only) -->
              <div class="det-section-mini">
                <div class="det-section-header">Detalles</div>
                <div class="det-mini-fields">
                  <div class="det-field-label">Total de compras</div>
                  <div class="det-field-box">${{ (form.totalCompras ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</div>
                  <div class="det-field-label">Último pedido</div>
                  <div class="det-field-box">{{ form.ultimoPedido || 'NA' }}</div>
                  <div class="det-field-label">Estado</div>
                  <div class="det-estado-box">{{ form.estado }}</div>
                </div>
              </div>

              <!-- Notas (editable) -->
              <div class="det-section-mini" style="margin-top:12px;">
                <div class="det-section-header">Notas y Observaciones</div>
                <div class="det-notas-info">
                  <span>Total de compras: {{ form.contratos ?? 0 }}</span>
                  <span>Contratos generados: {{ form.contratos ?? 0 }}</span>
                </div>
                <input class="det-input" :placeholder="form.notas || 'Sin notas'" v-model="form.notas" />
              </div>

              <!-- Guardar -->
              <div class="edit-btns">
                <button class="btn-guardar" @click="guardar">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="edit-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const base = import.meta.env.BASE_URL
const router = useRouter()
const route  = useRoute()

const cargando = ref(true)
const guardando = ref(false)
const form = ref({
  nombre_empresa: '', nombre_contacto: '', cargo_contacto: '',
  telefono: '', email_contacto: '', domicilio: '',
})
let prospectoId = 0

onMounted(async () => {
  prospectoId = Number(route.params.id)
  if (!prospectoId) { cargando.value = false; return }
  try {
    const { prospectoService } = await import('@/services/prospectoService')
    const p = await prospectoService.obtener(prospectoId)
    form.value = {
      nombre_empresa:   p.nombre_empresa,
      nombre_contacto:  p.nombre_contacto,
      cargo_contacto:   p.cargo_contacto ?? '',
      telefono:         p.telefono ?? '',
      email_contacto:   p.email_contacto ?? '',
      domicilio:        p.domicilio ?? '',
    }
  } catch (e) {
    console.error('Error cargando prospecto:', e)
  } finally {
    cargando.value = false
  }
})

async function guardar() {
  if (!prospectoId) { router.back(); return }
  guardando.value = true
  try {
    const { prospectoService } = await import('@/services/prospectoService')
    await prospectoService.actualizar(prospectoId, {
      nombre_empresa:  form.value.nombre_empresa,
      nombre_contacto: form.value.nombre_contacto,
      cargo_contacto:  form.value.cargo_contacto || null,
      telefono:        form.value.telefono || null,
      email_contacto:  form.value.email_contacto || null,
      domicilio:       form.value.domicilio || null,
    })
    router.back()
  } catch (e) {
    console.error('Error guardando prospecto:', e)
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.edit-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

/* ── Header ─────────────────────────────────────────────────── */
.edit-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.edit-logo { display: flex; align-items: center; }
.edit-titulo {
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
.edit-page-title-wrap {
  display: flex;
  justify-content: center;
}
.edit-page-title {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 36px;
  color: #615d5d;
  padding: 16px 0 8px 40px;
  background: #f9f3d2;
  width: 1030px;
  max-width: 100%;
  border-radius: 10px 10px 0 0;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
}

/* ── Clipboard ────────────────────────────────────────────────── */
.edit-body {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 24px 16px;
}
.edit-card-outer {
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
.edit-card-inner {
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
.edit-cols { display: flex; gap: 20px; margin-top: 8px; }
.edit-col-left  { flex: 1.1; }
.edit-col-right { flex: 1; display: flex; flex-direction: column; }

/* ── Section headers ──────────────────────────────────────────── */
.det-section-header {
  background: #d9d9d9;
  font-family: 'Ligconsolata:Bold', monospace;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  padding: 4px 0;
  margin-bottom: 4px;
}
.det-section-mini { display: flex; flex-direction: column; }

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
.det-input {
  background: #d9d9d9;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 16px;
  padding: 2px 8px;
  min-height: 22px;
  color: #000;
  outline: none;
  width: 100%;
}
.det-input:focus { border-color: #008a52; }
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
.det-notas-info {
  display: flex;
  flex-direction: column;
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 16px;
  margin-bottom: 4px;
}

/* ── Guardar button ───────────────────────────────────────────── */
.edit-btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.btn-guardar {
  background: #008a52;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0 24px;
  height: 50px;
  width: 135px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 20px;
  cursor: pointer;
}

/* ── Footer ──────────────────────────────────────────────────── */
.edit-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}
</style>
