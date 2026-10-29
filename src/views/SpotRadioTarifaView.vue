<template>
  <div class="srt-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="srt-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="srt-logo" />
      <h1 class="srt-titulo">PAQUETES DE RADIO</h1>
      <button class="srt-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="srt-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="srt-body">
      <div class="srt-carpeta">

        <!-- Tab con nombre del servicio -->
        <div class="srt-tab">
          <span class="srt-tab-titulo">{{ servicio.label }}</span>
        </div>

        <!-- Hoja -->
        <div class="srt-hoja">
          <img :src="`${base}assets/5faaf.svg`" alt="" class="srt-clip" />

          <div class="srt-tabla-wrap">
            <table class="srt-tabla">
              <colgroup v-if="!servicio.sinDuracion">
                <col style="width:35%" /><col style="width:35%" /><col style="width:30%" />
              </colgroup>
              <colgroup v-else>
                <col style="width:70%" /><col style="width:30%" />
              </colgroup>
              <thead>
                <tr>
                  <th v-if="!servicio.sinDuracion" class="srt-th">Duración</th>
                  <th class="srt-th">Tarifa (Sin IVA)</th>
                  <th class="srt-th">Aceptar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tarifa in servicio.tarifas" :key="tarifa.duracion + tarifa.precio" class="srt-tr">
                  <td v-if="!servicio.sinDuracion" class="srt-td">{{ tarifa.duracion }}</td>
                  <td class="srt-td">{{ tarifa.precio }}</td>
                  <td class="srt-td srt-td-btn">
                    <button class="srt-aceptar-btn" @click="seleccionar(tarifa)">Aceptar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="srt-footer" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route  = useRoute()
const base   = import.meta.env.BASE_URL

type ServicioRadio = { label: string; sinDuracion?: boolean; tarifas: { id?: number; duracion: string; precio: string }[] }

const nombreServicioMap: Record<string, { label: string; busqueda: string; sinDuracion?: boolean }> = {
  spot:             { label: "Spot Publicitario", busqueda: "Spot" },
  cortinilla:       { label: "Cortinilla",        busqueda: "Cortinilla" },
  entrevista:       { label: "Entrevista",        busqueda: "Entrevista" },
  programas:        { label: "Programas",         busqueda: "Programa" },
  mencion:          { label: "Mención",           busqueda: "Mención" },
  "control-remoto": { label: "Control Remoto",   busqueda: "Control Remoto" },
  patrocinios:      { label: "Patrocinios",       busqueda: "Patrocinio", sinDuracion: true },
  blinks:           { label: "Blinks",            busqueda: "Blink" },
}

const fallbackCatalogo: Record<string, ServicioRadio> = {
  spot: {
    label: "Spot Publicitario",
    tarifas: [
      { duracion: "10 Segundos.", precio: "$93.00"  },
      { duracion: "20 Segundos.", precio: "$186.00" },
      { duracion: "30 Segundos.", precio: "$279.00" },
    ],
  },
  cortinilla: {
    label: "Cortinilla",
    tarifas: [
      { duracion: "20 Segundos.", precio: "$200.00" },
    ],
  },
  entrevista: {
    label: "Entrevista",
    tarifas: [
      { duracion: "15 Minutos.", precio: "$2,500.00" },
      { duracion: "30 Minutos.", precio: "$5,000.00" },
    ],
  },
  programas: {
    label: "Programas",
    tarifas: [
      { duracion: "30 Minutos.", precio: "$20,000.00" },
      { duracion: "1 Hora.",     precio: "$40,000.00" },
    ],
  },
  mencion: {
    label: "Mención",
    tarifas: [
      { duracion: "30 Segundos.", precio: "$382.00" },
    ],
  },
  "control-remoto": {
    label: "Control Remoto",
    tarifas: [
      { duracion: "30 Minutos.", precio: "$8,500.00" },
    ],
  },
  patrocinios: {
    label: "Patrocinios",
    sinDuracion: true,
    tarifas: [
      { duracion: "", precio: "$12,500.00" },
    ],
  },
  blinks: {
    label: "Blinks",
    tarifas: [
      { duracion: "30 Segundos.", precio: "$93.00" },
    ],
  },
}

const servicioId    = computed(() => (route.params.servicio as string) || "spot")
const servicioActual = ref<ServicioRadio>({ label: "", tarifas: [] })

const servicio = computed(() =>
  servicioActual.value.tarifas.length > 0
    ? servicioActual.value
    : fallbackCatalogo[servicioId.value] ?? fallbackCatalogo["spot"]!
)

onMounted(async () => {
  const sid  = servicioId.value
  const meta = nombreServicioMap[sid]
  if (!meta) return
  servicioActual.value.label = meta.label
  if (meta.sinDuracion) servicioActual.value.sinDuracion = true
  try {
    const { paqueteService } = await import("@/services/paqueteService")
    const rows = await paqueteService.listarPorNombreServicio(meta.busqueda)
    if (rows.length > 0) {
      servicioActual.value.tarifas = rows.map((r: any) => ({
        id:       r.id,
        duracion: r.medidas_ejemplos ?? r.descripcion ?? "",
        precio:   r.tarifa_sin_iva != null
          ? `$${Number(r.tarifa_sin_iva).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
          : "",
      }))
    }
  } catch (e) {
    console.error("Error cargando tarifas radio:", e)
  }
})

function seleccionar(tarifa: { id?: number; duracion: string; precio: string }) {
  router.push({
    name: "NuevaSolicitudRadio",
    state: {
      radioTarifa: JSON.stringify({
        servicio: servicio.value.label,
        idPaquete: tarifa.id,
        duracion: tarifa.duracion,
        precio:   tarifa.precio,
      }),
    },
  })
}

function regresar() {
  router.push({ name: "Radio" })
}
</script>

<style scoped>
.srt-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* Header */
.srt-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}
.srt-logo {
  width: 296px; height: 69px;
  object-fit: contain; object-position: left center;
  display: block; flex-shrink: 0;
}
.srt-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 400; color: #fff; margin: 0;
  position: absolute; left: 50%; transform: translateX(-50%);
  white-space: nowrap;
}
.srt-regresar-btn {
  display: flex; align-items: center; gap: 10px;
  background: #d92525; border: none; border-radius: 10px;
  padding: 0 24px; height: 60px; cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap;
  transition: filter 0.15s;
}
.srt-regresar-btn:hover { filter: brightness(1.1); }
.srt-regresar-icon { width: 36px; height: 36px; object-fit: contain; }

/* Cuerpo */
.srt-body {
  flex: 1; display: flex; align-items: stretch;
  justify-content: center; padding: 16px 40px;
}

/* Carpeta */
.srt-carpeta { width: 100%; max-width: 1030px; display: flex; flex-direction: column; }

.srt-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  width: 560px; max-width: 100%;
  padding: 10px 24px 14px;
  box-shadow: 10px 0px 10px 0px rgba(0,0,0,0.25);
}
.srt-tab-titulo {
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 38px; color: #000; font-weight: 400; white-space: nowrap;
}

.srt-hoja {
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 0 7px 7px 7px;
  padding: 16px 16px 16px 0;
  display: flex; align-items: stretch;
  position: relative; flex: 1;
}

/* Clip */
.srt-clip {
  position: absolute; left: 0; top: 50%;
  transform: translateY(-50%);
  width: 72px; height: auto;
  object-fit: contain; z-index: 2; pointer-events: none;
}

/* Tabla */
.srt-tabla-wrap {
  flex: 1; background: #fff;
  border: 1px solid #000; overflow: hidden;
  margin-left: 80px;
}
.srt-tabla { width: 100%; border-collapse: collapse; table-layout: fixed; }

.srt-th {
  background: #d9d9d9; border: 1px solid #000;
  font-family: 'Ligconsolata:Bold', 'Inconsolata', monospace;
  font-size: 18px; font-weight: 700; color: #000;
  padding: 10px 16px; text-align: left;
}

.srt-tr:nth-child(even) { background: #fafafa; }

.srt-td {
  border: 1px solid #d0d0d0;
  font-family: 'Ligconsolata:Regular', 'Inconsolata', monospace;
  font-size: 16px; color: #000;
  padding: 10px 16px;
}
.srt-td-btn { text-align: center; }

.srt-aceptar-btn {
  background: #584848; color: #fff;
  border: none; border-radius: 7px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 14px; padding: 5px 0; width: 100%;
  cursor: pointer; transition: filter 0.15s;
}
.srt-aceptar-btn:hover { filter: brightness(1.2); }

/* Footer */
.srt-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

@media (max-width: 860px) {
  .srt-clip { display: none; }
  .srt-tabla-wrap { margin-left: 0; }
  .srt-body { padding: 12px 16px; }
}
</style>
