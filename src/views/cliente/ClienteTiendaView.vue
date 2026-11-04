<template>
  <div class="ct-root">
    <ClienteHeader :title="medio === 'radio' ? 'Tienda de Radio' : 'Tienda de Periódico'" regresar-a="ClienteInicio" />

    <div class="ct-body">
      <p class="ct-subtitle">Seleccione el servicio que desea comprar</p>

      <!-- Carpetas de servicios -->
      <div class="ct-folders">
        <button
          v-for="s in servicios"
          :key="s.id"
          class="ct-folder"
          :class="{ activo: s.id === servicioSel }"
          @click="servicioSel = s.id"
        >
          <div class="ct-folder-tab" />
          <div class="ct-folder-body">
            <img :src="`${base}assets/${s.img}`" :alt="s.label" class="ct-folder-icon" />
            <span class="ct-folder-label">{{ s.label }}</span>
          </div>
        </button>
      </div>

      <!-- Productos -->
      <h2 class="ct-servicio-titulo">{{ servicioActual?.label }}</h2>
      <div class="ct-grid">
        <article v-for="prod in productos" :key="prod.id" class="ct-card">
          <div class="ct-card-head">
            <h3 class="ct-card-nombre">{{ prod.nombre }}</h3>
            <span v-if="prod.detalle" class="ct-chip">{{ prod.detalle }}</span>
          </div>
          <p class="ct-card-desc">{{ prod.descripcion }}</p>

          <!-- Clasificados: tarifa diaria / 15 días / 30 días -->
          <div v-if="prod.planes" class="ct-planes">
            <button
              v-for="pl in prod.planes"
              :key="pl.dias"
              class="ct-plan"
              :class="{ activo: planDe(prod) === pl.dias }"
              @click="planSel[prod.id] = pl.dias"
            >
              <span class="ct-plan-dias">{{ pl.dias === 1 ? "Diaria" : `${pl.dias} días` }}</span>
              <span class="ct-plan-precio">{{ formatoMXN(pl.precio) }}</span>
              <span v-if="ahorroPlan(prod, pl.dias)" class="ct-plan-ahorro">−{{ ahorroPlan(prod, pl.dias) }}%</span>
            </button>
          </div>

          <!-- Publicidad impresa: lo que se define en el contrato -->
          <ul v-if="prod.servicioId === 'impresa'" class="ct-incluye">
            <li>Medidas: {{ prod.detalle }}</li>
            <li>Eliges sección, página y fechas de publicación en el carrito</li>
            <li>Posición especial opcional (costo extra a confirmar)</li>
          </ul>

          <div class="ct-card-foot">
            <div>
              <span class="ct-precio">{{ formatoMXN(seleccion(prod).precio) }}</span>
              <span class="ct-iva">+ IVA</span>
            </div>
            <button class="ct-add-btn" :class="{ ok: recien === seleccion(prod).id }" @click="agregar(seleccion(prod))">
              {{ recien === seleccion(prod).id ? "¡Agregado!" : enCarrito(seleccion(prod).id) ? `Agregar otro (${enCarrito(seleccion(prod).id)})` : "Agregar al carrito" }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <!-- Barra resumen -->
    <div class="ct-footer">
      <template v-if="cliente.totalPiezas">
        <span class="ct-footer-txt">
          {{ cliente.totalPiezas }} producto{{ cliente.totalPiezas === 1 ? "" : "s" }} ·
          Total {{ formatoMXN(cliente.total) }} <small>(IVA incluido)</small>
        </span>
        <button class="ct-footer-btn" @click="router.push({ name: 'ClienteCarrito' })">Ver carrito y pagar</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import ClienteHeader from "@/components/ClienteHeader.vue"
import { useClienteStore } from "@/stores/cliente"
import { serviciosTienda, productosTienda, formatoMXN, varianteDePlan, ahorroPlan, type ProductoTienda } from "@/data/catalogoCliente"

const route = useRoute()
const router = useRouter()
const cliente = useClienteStore()
const base = import.meta.env.BASE_URL

const medio = computed(() => (route.params.medio === "radio" ? "radio" : "periodico"))
const servicios = computed(() => serviciosTienda.filter((s) => s.medio === medio.value))
const servicioSel = ref(servicios.value[0]!.id)
watch(medio, () => { servicioSel.value = servicios.value[0]!.id })

const servicioActual = computed(() => servicios.value.find((s) => s.id === servicioSel.value))
const productos = computed(() => productosTienda.filter((p) => p.servicioId === servicioSel.value))

// Plan elegido por producto (Clasificados) — por defecto la tarifa diaria
const planSel = ref<Record<string, number>>({})
const planDe = (prod: ProductoTienda) => planSel.value[prod.id] ?? 1
const seleccion = (prod: ProductoTienda) => (prod.planes ? varianteDePlan(prod, planDe(prod)) : prod)

const enCarrito = (id: string) => cliente.carrito.find((i) => i.producto.id === id)?.cantidad ?? 0

const recien = ref<string | null>(null)
let t: ReturnType<typeof setTimeout> | undefined
function agregar(prod: ProductoTienda) {
  cliente.agregar(prod)
  recien.value = prod.id
  clearTimeout(t)
  t = setTimeout(() => (recien.value = null), 1200)
}
</script>

<style scoped>
.ct-root { min-height: 100vh; background: #3a2422; display: flex; flex-direction: column; }

.ct-body {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 14px 40px 24px; gap: 20px;
}

.ct-subtitle, .ct-servicio-titulo {
  font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-weight: 400;
  color: #fff; margin: 0; text-align: center;
}
.ct-subtitle { font-size: 32px; }
.ct-servicio-titulo { font-size: 28px; color: #fac73c; }

/* Carpetas (mismo estilo que Paquetes de periódico, más compactas) */
.ct-folders { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; }
.ct-folder {
  background: none; border: none; padding: 0; cursor: pointer;
  display: flex; flex-direction: column; align-items: flex-start;
  transition: transform .12s, filter .12s; opacity: .75;
}
.ct-folder:hover { transform: translateY(-4px); opacity: 1; }
.ct-folder.activo { opacity: 1; transform: translateY(-4px); }
.ct-folder.activo .ct-folder-body { box-shadow: 0 0 0 4px #20c25e; }
.ct-folder-tab { width: 80px; height: 16px; background: #ffe38e; border-radius: 7px 7px 0 0; }
.ct-folder-body {
  width: 150px; background: #f5e1a4; border-radius: 0 7px 7px 7px;
  display: flex; flex-direction: column; align-items: center; padding: 12px 8px 10px; gap: 6px;
}
.ct-folder-icon { width: 72px; height: 72px; object-fit: contain; }
.ct-folder-label {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 13px; color: #000; text-align: center; line-height: 1.2;
}

/* Tarjetas de producto */
.ct-grid {
  width: 100%; max-width: 1100px;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;
}
.ct-card {
  background: #f8f4e3; border-radius: 10px; padding: 18px 18px 16px;
  display: flex; flex-direction: column; gap: 8px;
  border-top: 8px solid #008a52;
}
.ct-card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.ct-card-nombre {
  margin: 0; font-family: "Lilita One:Regular", "Lilita One", sans-serif;
  font-weight: 400; font-size: 22px; color: #3a2422;
}
.ct-chip {
  flex-shrink: 0; background: #ffe38e; color: #3a2422; border-radius: 6px;
  padding: 3px 8px; font: 600 12px "Inter", sans-serif;
}
.ct-card-desc {
  margin: 0; flex: 1; color: #555;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 15px;
}
.ct-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.ct-precio { font-family: "Oswald", sans-serif; font-weight: 700; font-size: 26px; color: #008a52; }
.ct-iva { margin-left: 4px; font: 500 12px "Inter", sans-serif; color: #777; }
.ct-add-btn {
  background: linear-gradient(180deg, #20c25e 0%, #079968 100%); color: #fff;
  border: none; border-radius: 8px; padding: 10px 14px; cursor: pointer;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 15px;
  transition: filter .15s, transform .1s; white-space: nowrap;
}
.ct-add-btn:hover { filter: brightness(1.1); }
.ct-add-btn:active { transform: scale(.96); }
.ct-add-btn.ok { background: #fac73c; color: #3a2422; }

/* Planes de días (Clasificados) */
.ct-planes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.ct-plan {
  position: relative; background: #fff; border: 2px solid #d8d1bd; border-radius: 8px;
  padding: 6px 4px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px;
}
.ct-plan.activo { border-color: #008a52; background: #e6f5ec; }
.ct-plan-dias { font: 600 12px "Inter", sans-serif; color: #3a2422; }
.ct-plan-precio { font: 700 14px "Oswald", sans-serif; color: #008a52; }
.ct-plan-ahorro {
  position: absolute; top: -9px; right: -6px; background: #ef4743; color: #fff;
  border-radius: 6px; padding: 1px 5px; font: 700 10px "Inter", sans-serif;
}
.ct-incluye {
  margin: 0; padding-left: 18px; color: #3a2422;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 14px; line-height: 1.5;
}

/* Footer con resumen */
.ct-footer {
  background: #f8f4e3; min-height: 50px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: flex-end; gap: 18px; padding: 0 20px;
  position: sticky; bottom: 0;
}
.ct-footer-txt { font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 18px; color: #3a2422; }
.ct-footer-txt small { color: #777; font-size: 13px; }
.ct-footer-btn {
  background: #008a52; color: #fff; border: none; border-radius: 8px; padding: 8px 18px; cursor: pointer;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 16px; margin: 6px 0;
}
.ct-footer-btn:hover { filter: brightness(1.1); }

@media (max-width: 700px) {
  .ct-body { padding: 12px 12px 20px; }
  .ct-subtitle { font-size: 22px; }
  .ct-folder-body { width: 120px; }
  .ct-grid { grid-template-columns: 1fr; }
  .ct-footer { justify-content: space-between; padding: 0 12px; }
  .ct-footer-txt { font-size: 14px; }
}
</style>
