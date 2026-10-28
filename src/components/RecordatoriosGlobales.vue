<template>
  <aside v-if="pendientes.length" class="recordatorios">
    <div class="encabezado">
      <strong>Recordatorios pendientes</strong>
      <span>{{ pendientes.length }}</span>
    </div>

    <article
      v-for="evento in pendientes"
      :key="evento.id"
      class="recordatorio"
    >
      <strong>{{ evento.titulo }}</strong>

      <p>
        {{ evento.fecha }}
        <span v-if="evento.hora_inicio">
          · {{ evento.hora_inicio.slice(0, 5) }}
        </span>
      </p>

      <p v-if="evento.descripcion">
        {{ evento.descripcion }}
      </p>

      <button
        type="button"
        :disabled="procesando.has(evento.id)"
        @click="atender(evento.id)"
      >
        Marcar como atendido
      </button>
    </article>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue"
import { useAuthStore } from "@/stores/auth"
import { agendaService } from "@/services/agendaService"
import type { AgendaEvento } from "@/types"

const auth = useAuthStore()

const pendientes = ref<AgendaEvento[]>([])
const procesando = ref(new Set<number>())

let intervalo: ReturnType<typeof setInterval> | undefined
let consultaEnCurso = false
let empleadoActual: string | null = null

function detenerRevision() {
  if (intervalo) clearInterval(intervalo)
  intervalo = undefined
}

async function revisarRecordatorios() {
  const idEmpleado = auth.empleado?.id

  if (!idEmpleado || consultaEnCurso) return

  consultaEnCurso = true

  try {
    const eventos = await agendaService.listarPorEmpleado(idEmpleado)
    const ahora = new Date()

    const hoy = [
      ahora.getFullYear(),
      String(ahora.getMonth() + 1).padStart(2, "0"),
      String(ahora.getDate()).padStart(2, "0")
    ].join("-")

    for (const evento of eventos) {
      if (
        !evento.recordatorio_activo ||
        evento.recordatorio_disparado ||
        evento.recordatorio_atendido ||
        evento.completado ||
        !evento.hora_inicio ||
        evento.fecha !== hoy
      ) {
        continue
      }

      const hora = evento.hora_inicio.slice(0, 8)
      const inicio = new Date(`${evento.fecha}T${hora}`)

      const momentoAlerta = new Date(
        inicio.getTime() -
        (evento.recordatorio_minutos ?? 10) * 60_000
      )

      if (ahora >= momentoAlerta) {
        await agendaService.marcarRecordatorioDisparado(evento.id)
      }
    }

    pendientes.value =
      await agendaService.listarRecordatoriosPendientes(idEmpleado)
  } catch (error) {
    console.error(
      "[EL DIARIO] Error al revisar recordatorios:",
      error
    )
  } finally {
    consultaEnCurso = false
  }
}

async function atender(id: number) {
  if (procesando.value.has(id)) return

  procesando.value = new Set(procesando.value).add(id)

  try {
    await agendaService.marcarRecordatorioAtendido(id)

    pendientes.value = pendientes.value.filter(
      evento => evento.id !== id
    )
  } catch (error) {
    console.error(
      "[EL DIARIO] No se pudo atender el recordatorio:",
      error
    )
  } finally {
    const nuevos = new Set(procesando.value)
    nuevos.delete(id)
    procesando.value = nuevos
  }
}

watch(
  () => auth.empleado?.id ?? null,
  idEmpleado => {
    detenerRevision()
    pendientes.value = []
    empleadoActual = idEmpleado

    if (idEmpleado) {
      void revisarRecordatorios()

      intervalo = setInterval(() => {
        if (empleadoActual === auth.empleado?.id) {
          void revisarRecordatorios()
        }
      }, 30_000)
    }
  },
  { immediate: true }
)

onUnmounted(detenerRevision)
</script>

<style scoped>
.recordatorios {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  width: min(360px, calc(100vw - 32px));
  max-height: 65vh;
  overflow-y: auto;
  padding: 16px;
  background: white;
  color: #222;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgb(0 0 0 / 15%);
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.encabezado span {
  background: #b42318;
  color: white;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
}

.recordatorio {
  border-top: 1px solid #eee;
  padding: 12px 0;
}

.recordatorio p {
  margin: 6px 0;
  font-size: 13px;
}

.recordatorio button {
  margin-top: 8px;
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: #008a52;
  color: white;
  cursor: pointer;
}

.recordatorio button:disabled {
  opacity: 0.6;
  cursor: wait;
}
</style>
