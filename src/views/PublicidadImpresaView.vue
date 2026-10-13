<template>
  <div class="pi-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="pi-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="pi-logo-img" />
      <h1 class="pi-title">PAQUETES DE PERIODICO</h1>
      <button class="pi-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="pi-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="pi-body">

      <!-- Carpeta contenedor -->
      <div class="pi-carpeta">
        <!-- Tab superior (título) -->
        <div class="pi-tab">
          <span class="pi-tab-title">Publicidad Impresa</span>
        </div>

        <!-- Hoja con la tabla -->
        <div class="pi-hoja">

          <!-- Clip de hojas: al ras del borde izquierdo del recuadro crema -->
          <img :src="`${base}assets/5faaf.svg`" alt="" class="pi-scroll-indicator" />

          <!-- Tabla de tarifas -->
          <div class="pi-tabla-wrap">
            <table class="pi-tabla">
              <colgroup>
                <col /><col /><col /><col /><col />
              </colgroup>
              <thead>
                <tr>
                  <th class="pi-th">Tipo de servicio</th>
                  <th class="pi-th">Descripcion</th>
                  <th class="pi-th">Medidas/Ejemplos</th>
                  <th class="pi-th">Tarifa (Sin IVA)</th>
                  <th class="pi-th">Aceptar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tarifa in tarifas" :key="tarifa.id" class="pi-tr">
                  <td class="pi-td">{{ tarifa.tipo }}</td>
                  <td class="pi-td">{{ tarifa.descripcion }}</td>
                  <td class="pi-td">{{ tarifa.medidas }}</td>
                  <td class="pi-td">{{ tarifa.precio }}</td>
                  <td class="pi-td pi-td-btn">
                    <button class="pi-aceptar-btn" @click="seleccionar(tarifa)">Aceptar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="pi-footer" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { paqueteService } from "@/services/paqueteService"

const router = useRouter()
const base = import.meta.env.BASE_URL

interface Tarifa {
  id: number
  tipo: string
  descripcion: string
  medidas: string
  precio: string
}

const tarifas = ref<Tarifa[]>([])

onMounted(async () => {
  try {
    const rows = await paqueteService.listarPorNombreServicio("Publicidad impresa")
    tarifas.value = rows.map((row: any) => ({
      id: row.id,
      tipo: row.pln ?? "",
      descripcion: row.descripcion ?? "",
      medidas: row.medidas_ejemplos ?? "",
      precio: row.tarifa_sin_iva == null
        ? ""
        : `$${Number(row.tarifa_sin_iva).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
    }))
  } catch (error) {
    console.error("Error cargando tarifas de publicidad impresa:", error)
  }
})

function seleccionar(tarifa: Tarifa) {
  router.push({
    name: "NuevaSolicitudRegistro",
    state: {
      tarifa: JSON.stringify({ ...tarifa, servicio: "Publicidad impresa" }),
    },
  })
}

function regresar() {
  router.push({ name: "Periodico" })
}
</script>

<style scoped>
/* ── Raíz ─────────────────────────────────────────────────── */
.pi-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.pi-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.pi-logo-img {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
  flex-shrink: 0;
}

.pi-title {
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

.pi-regresar-btn {
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
.pi-regresar-btn:hover { filter: brightness(1.1); }

.pi-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* ── Cuerpo ──────────────────────────────────────────────── */
.pi-body {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 16px 40px 16px;
}

/* ── Carpeta ─────────────────────────────────────────────── */
.pi-carpeta {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
}

/* Tab superior con título */
.pi-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  width: 610px;
  max-width: 100%;
  padding: 10px 24px 14px;
  box-shadow: 10px 0px 10px 0px rgba(0,0,0,0.25);
}

.pi-tab-title {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 38px;
  color: #000000;
  font-weight: 400;
  white-space: nowrap;
}

/* Hoja (cuerpo amarillo + hoja blanca interna) */
.pi-hoja {
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 0 7px 7px 7px;
  padding: 10px 10px 10px 0;
  display: flex;
  gap: 0;
  align-items: stretch;
  position: relative;
  flex: 1;
}

/* Clip de hojas: al ras del borde izquierdo del recuadro crema, centrado verticalmente */
.pi-scroll-indicator {
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

/* Wrap de tabla con fondo blanco — no overflow horizontal */
.pi-tabla-wrap {
  flex: 1;
  background: #ffffff;
  border: 1px solid #000000;
  overflow: hidden;
  margin-left: 80px;
  min-width: 0;
}

/* ── Tabla ────────────────────────────────────────────────── */
.pi-tabla {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Anchos de columna proporcionales para que quepan sin scroll */
.pi-tabla colgroup col:nth-child(1) { width: 14%; }
.pi-tabla colgroup col:nth-child(2) { width: 24%; }
.pi-tabla colgroup col:nth-child(3) { width: 22%; }
.pi-tabla colgroup col:nth-child(4) { width: 20%; }
.pi-tabla colgroup col:nth-child(5) { width: 20%; }

/* Encabezado gris */
.pi-th {
  background: #d9d9d9;
  border: 1px solid #000;
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #000000;
  padding: 8px 10px;
  text-align: left;
  word-break: break-word;
}

/* Filas */
.pi-tr:nth-child(even) { background: #fafafa; }

.pi-td {
  border: 1px solid #d0d0d0;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 14px;
  color: #000000;
  padding: 8px 10px;
  word-break: break-word;
}

.pi-td-btn {
  text-align: center;
}

/* Botón Aceptar */
.pi-aceptar-btn {
  background: #584848;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 13px;
  padding: 5px 16px;
  cursor: pointer;
  transition: filter 0.15s;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
}
.pi-aceptar-btn:hover { filter: brightness(1.2); }

/* ── Footer ──────────────────────────────────────────────── */
.pi-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .pi-tab { width: 100%; }
  .pi-title { font-size: clamp(18px, 2.5vw, 36px); }
  .pi-scroll-indicator { display: none; }
  .pi-tabla-wrap { margin-left: 0; }
  .pi-body { padding: 12px 16px; }
}

@media (max-width: 600px) {
  .pi-header { height: 80px; padding: 0 12px; }
  .pi-logo-img { width: 180px; height: auto; }
  .pi-regresar-btn { padding: 0 14px; font-size: 18px; height: 48px; }
  .pi-tab-title { font-size: 24px; }
  .pi-th { font-size: 13px; padding: 6px 8px; }
  .pi-td { font-size: 12px; padding: 6px 8px; }
}
</style>
