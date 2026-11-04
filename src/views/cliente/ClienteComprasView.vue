<template>
  <div class="cm-root">
    <ClienteHeader title="Mis Compras" regresar-a="ClienteInicio" />

    <div class="cm-body">
      <div v-if="!cliente.pedidos.length" class="cm-vacio">
        <p class="cm-vacio-titulo">Aún no tienes compras</p>
        <p class="cm-vacio-txt">Cuando compres un paquete, aquí verás tu folio y el estado del pedido.</p>
        <button class="cm-btn" @click="router.push('/cliente/tienda/periodico')">Ir a la tienda</button>
      </div>

      <div v-else class="cm-lista">
        <article v-for="p in cliente.pedidos" :key="p.folio" class="cm-pedido">
          <button class="cm-pedido-head" @click="abierto = abierto === p.folio ? null : p.folio">
            <div class="cm-folio">
              <span class="cm-folio-num">{{ p.folio }}</span>
              <span class="cm-fecha">{{ fecha(p.fecha) }} · {{ p.metodoPago }}</span>
            </div>
            <span class="cm-estado" :class="clase(p.estado)">{{ p.estado }}</span>
            <span class="cm-total">{{ formatoMXN(p.total) }}</span>
            <svg class="cm-chev" :class="{ rot: abierto === p.folio }" viewBox="0 0 24 24" width="24" height="24" fill="#3a2422"><path d="M7 10l5 5 5-5z" /></svg>
          </button>

          <div v-if="abierto === p.folio" class="cm-detalle">
            <table class="cm-tabla">
              <thead><tr><th>Producto</th><th>Medio</th><th>Inicio</th><th>Cant.</th><th>Importe</th></tr></thead>
              <tbody>
                <tr v-for="i in p.items" :key="i.producto.id">
                  <td>
                    {{ i.producto.nombre }}<small v-if="i.producto.detalle"> · {{ i.producto.detalle }}</small>
                    <small v-if="i.impresa" class="cm-impresa">
                      Secc. {{ i.impresa.seccion || "—" }} · Pág. {{ i.impresa.pagina || "—" }}
                      <template v-if="i.impresa.fechasPublicacion"> · {{ i.impresa.fechasPublicacion }}</template>
                      <template v-if="i.impresa.posicionEspecial"> · Posición especial</template>
                    </small>
                  </td>
                  <td>{{ i.producto.medio === "radio" ? "Radio" : "Periódico" }}</td>
                  <td>{{ i.fechaInicio }}</td>
                  <td>{{ i.cantidad }}</td>
                  <td>{{ formatoMXN(i.producto.precio * i.cantidad) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="cm-pie">
              <div class="cm-fact">
                <strong>Facturación:</strong> {{ p.facturacion.razonSocial }} · {{ p.facturacion.rfc }}<br />
                <template v-if="p.notas"><strong>Indicaciones:</strong> {{ p.notas }}</template>
              </div>
              <div class="cm-montos">
                <span>Subtotal {{ formatoMXN(p.subtotal) }}</span>
                <span>IVA {{ formatoMXN(p.iva) }}</span>
                <strong>Total {{ formatoMXN(p.total) }}</strong>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="cm-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import ClienteHeader from "@/components/ClienteHeader.vue"
import { useClienteStore, type Pedido } from "@/stores/cliente"
import { formatoMXN } from "@/data/catalogoCliente"

const router = useRouter()
const cliente = useClienteStore()
const abierto = ref<string | null>(cliente.pedidos[0]?.folio ?? null)

const fecha = (iso: string) =>
  new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })
const clase = (e: Pedido["estado"]) => ({ pagado: e === "Pagado", revision: e === "En revisión", publicado: e === "Publicado" })
</script>

<style scoped>
.cm-root { min-height: 100vh; background: #3a2422; display: flex; flex-direction: column; }
.cm-body { flex: 1; padding: 20px 40px 28px; display: flex; justify-content: center; }
.cm-lista { width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 14px; }

.cm-pedido { background: #f8f4e3; border-radius: 10px; border-left: 8px solid #008a52; overflow: hidden; }
.cm-pedido-head {
  width: 100%; background: none; border: none; cursor: pointer; text-align: left;
  display: grid; grid-template-columns: 1fr auto auto 24px; align-items: center; gap: 18px; padding: 14px 18px;
}
.cm-folio { display: flex; flex-direction: column; }
.cm-folio-num { font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-size: 22px; color: #3a2422; }
.cm-fecha { font: 400 13px "Inter", sans-serif; color: #777; }
.cm-estado { border-radius: 6px; padding: 4px 10px; font: 700 12px "Inter", sans-serif; color: #fff; }
.cm-estado.pagado { background: #079968; }
.cm-estado.revision { background: #fac73c; color: #3a2422; }
.cm-estado.publicado { background: #0059ff; }
.cm-total { font-family: "Oswald", sans-serif; font-weight: 700; font-size: 22px; color: #008a52; }
.cm-chev { transition: transform .15s; }
.cm-chev.rot { transform: rotate(180deg); }

.cm-detalle { padding: 0 18px 16px; }
.cm-tabla { width: 100%; border-collapse: collapse; font: 400 14px "Inter", sans-serif; color: #333; }
.cm-tabla th { background: #008a52; color: #fff; text-align: left; padding: 8px 10px; font-weight: 600; }
.cm-tabla td { padding: 8px 10px; border-bottom: 1px dashed #d8d1bd; }
.cm-tabla small { color: #888; }
.cm-tabla .cm-impresa { display: block; color: #079968; }
.cm-pie { display: flex; justify-content: space-between; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
.cm-fact { font: 400 13px "Inter", sans-serif; color: #555; line-height: 1.6; }
.cm-montos { display: flex; flex-direction: column; align-items: flex-end; font: 500 14px "Inter", sans-serif; color: #555; }
.cm-montos strong { font-family: "Oswald", sans-serif; font-size: 20px; color: #008a52; }

.cm-vacio { align-self: center; text-align: center; background: #f8f4e3; border-radius: 12px; padding: 36px 40px; max-width: 520px; }
.cm-vacio-titulo { margin: 0 0 8px; font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-size: 30px; color: #3a2422; }
.cm-vacio-txt { margin: 0 0 18px; font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 16px; color: #555; }
.cm-btn { border: none; border-radius: 10px; padding: 12px 22px; color: #fff; cursor: pointer; background: linear-gradient(180deg,#20c25e,#079968); font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 16px; }

.cm-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

@media (max-width: 640px) {
  .cm-body { padding: 12px; }
  .cm-pedido-head { grid-template-columns: 1fr auto; gap: 8px; }
  .cm-chev { display: none; }
  .cm-tabla th:nth-child(2), .cm-tabla td:nth-child(2) { display: none; }
}
</style>
