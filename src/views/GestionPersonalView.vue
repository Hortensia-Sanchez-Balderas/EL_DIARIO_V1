<template>
  <div class="gp-viewport">
    <div class="gp-canvas">

      <!-- BG marrón -->
      <div style="position:absolute;inset:0;background:#3a2422;" />

      <!-- Footer crema -->
      <div style="position:absolute;left:0;top:670px;width:1280px;height:50px;background:#f8f4e3;" />

      <!-- Header verde -->
      <div style="position:absolute;left:0;top:0;width:1280px;height:100px;background:#008a52;" />

      <!-- Logo -->
      <img :src="`${base}Logo.png`"
        style="position:absolute;left:20px;top:16px;height:68px;width:auto;object-fit:contain;"
        alt="El Diario de Coahuila" />

      <!-- Título -->
      <p
        style="position:absolute;left:50%;top:50px;transform:translate(-50%,-50%);font-family:'Lilita One:Regular','Lilita One',cursive;font-size:40px;color:#ffffff;white-space:nowrap;margin:0;font-weight:400;">
        Gestión de personal
      </p>

      <!-- Botón Regresar -->
      <button
        style="position:absolute;left:1020px;top:17px;width:210px;height:60px;background:#d92525;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;padding:0 36px;box-sizing:border-box;"
        @click="regresar">
        <img :src="`${base}assets/f79f1.png`" style="width:36px;height:36px;object-fit:cover;flex-shrink:0;" alt="" />
        <span
          style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:25px;color:#ffffff;white-space:nowrap;">Regresar</span>
      </button>

      <!-- Contenedor principal -->
      <div
        style="position:absolute;left:57px;top:141px;width:1165px;height:486px;border-radius:10px;background:linear-gradient(112.64deg,rgb(224,222,207) 0%,rgb(171,170,152) 100%);" />

      <!-- Grid de tarjetas -->
      <template v-for="(slot, i) in slots" :key="i">
        <template v-if="slot">
          <!-- Fondo de color -->
          <div
            :style="`position:absolute;left:${cardX(i)}px;top:${cardY(i)}px;width:265px;height:215px;border-radius:5px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(to bottom,${COLORES[i].from},${COLORES[i].to});`" />

          <!-- Pill nombre -->
          <div
            :style="`position:absolute;left:${cardX(i) + 16}px;top:${cardY(i) + 13}px;width:233px;height:34px;background:#fff;border-radius:16px;display:flex;align-items:center;justify-content:center;`">
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:13px;color:rgba(0,0,0,0.75);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;">{{
                slot.nombre }}</span>
          </div>

          <!-- Pill email -->
          <div
            :style="`position:absolute;left:${cardX(i) + 16}px;top:${cardY(i) + 51}px;width:233px;height:34px;background:#fff;border-radius:16px;display:flex;align-items:center;justify-content:center;`">
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:11px;color:rgba(0,0,0,0.75);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;">{{
                slot.email }}</span>
          </div>

          <!-- Pill teléfono -->
          <div
            :style="`position:absolute;left:${cardX(i) + 16}px;top:${cardY(i) + 89}px;width:233px;height:34px;background:#fff;border-radius:16px;display:flex;align-items:center;justify-content:center;`">
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:13px;color:rgba(0,0,0,0.75);text-align:center;">{{
                slot.telefono || "Sin teléfono" }}</span>
          </div>

          <!-- Franja inferior decorativa -->
          <div
            :style="`position:absolute;left:${cardX(i) + 16}px;top:${cardY(i) + 130}px;width:233px;height:22px;border-radius:0 0 17px 17px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(to bottom,${COLORES[i].from},${COLORES[i].to});`" />

          <!-- Ícono persona -->
          <div
            :style="`position:absolute;left:${cardX(i) + 9}px;top:${cardY(i) + 159}px;width:40px;height:45px;border-radius:10px;background:linear-gradient(138.37deg,rgb(87,91,93) 0%,rgb(83,83,83) 44.7%,rgb(45,50,44) 100%);`" />
          <div
            :style="`position:absolute;left:${cardX(i) + 27}px;top:${cardY(i) + 173}px;width:32px;height:17px;border-radius:5px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(117.98deg,rgb(90,90,90) 0%,rgb(69,69,69) 100%);`" />

          <!-- Botón Editar -->
          <button
            :style="`position:absolute;left:${cardX(i) + 62}px;top:${cardY(i) + 174}px;width:93px;height:30px;background:#1e88e5;border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;`"
            @click="abrirEditar(slot)">
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:15px;color:#fff;white-space:nowrap;">Editar</span>
          </button>

          <!-- Botón Eliminar -->
          <button
            :style="`position:absolute;left:${cardX(i) + 162}px;top:${cardY(i) + 174}px;width:93px;height:30px;background:#d92525;border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;`"
            @click="confirmarEliminar(slot)">
            <img :src="`${base}assets/355e9.png`" style="width:20px;height:20px;object-fit:cover;" alt="" />
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:15px;color:#fff;white-space:nowrap;">Eliminar</span>
          </button>
        </template>

        <!-- Tarjeta vacía -->
        <template v-else>
          <div
            :style="`position:absolute;left:${cardX(i)}px;top:${cardY(i)}px;width:265px;height:215px;border-radius:5px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(to bottom,${COLORES[i].from},${COLORES[i].to});`" />

          <div
            :style="`position:absolute;left:${cardX(i) + 44}px;top:${cardY(i) + 27}px;width:176px;height:34px;background:#fff;border-radius:17px;display:flex;align-items:center;justify-content:center;`">
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:13px;color:rgba(0,0,0,0.75);">Sin
              empleado</span>
          </div>

          <div
            :style="`position:absolute;left:${cardX(i) + 44}px;top:${cardY(i) + 75}px;width:176px;height:22px;border-radius:0 0 17px 17px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(to bottom,${COLORES[i].from},${COLORES[i].to});`" />
          <div
            :style="`position:absolute;left:${cardX(i) + 44}px;top:${cardY(i) + 101}px;width:176px;height:22px;border-radius:0 0 17px 17px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(to bottom,${COLORES[i].from},${COLORES[i].to});`" />
          <div
            :style="`position:absolute;left:${cardX(i) + 44}px;top:${cardY(i) + 127}px;width:176px;height:22px;border-radius:0 0 17px 17px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(to bottom,${COLORES[i].from},${COLORES[i].to});`" />

          <div
            :style="`position:absolute;left:${cardX(i) + 9}px;top:${cardY(i) + 159}px;width:40px;height:45px;border-radius:10px;background:linear-gradient(138.37deg,rgb(87,91,93) 0%,rgb(83,83,83) 44.7%,rgb(45,50,44) 100%);`" />
          <div
            :style="`position:absolute;left:${cardX(i) + 27}px;top:${cardY(i) + 173}px;width:32px;height:17px;border-radius:5px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:linear-gradient(117.98deg,rgb(90,90,90) 0%,rgb(69,69,69) 100%);`" />

          <!-- Botón Agregar -->
          <button
            :style="`position:absolute;left:${cardX(i) + 137}px;top:${cardY(i) + 164}px;width:120px;height:35px;background:#1e88e5;border:none;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;`"
            @click="abrirAgregar">
            <div style="width:25px;height:35px;position:relative;overflow:hidden;flex-shrink:0;">
              <img :src="`${base}assets/95a54.png`"
                style="position:absolute;height:100%;left:-20%;top:0;width:140%;max-width:none;" alt="" />
            </div>
            <span
              style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:15px;color:#fff;white-space:nowrap;">Agregar</span>
          </button>
        </template>
      </template>

      <!-- Paginación -->
      <button
        :style="`position:absolute;left:580px;top:636px;width:25px;height:25px;background:${pagina === 1 ? '#a79c95' : '#635251'};border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;`"
        @click="pagina > 1 && pagina--">
        <img :src="`${base}assets/adf9a.png`" style="width:14px;height:14px;object-fit:cover;" alt="←" />
      </button>

      <div
        style="position:absolute;left:640px;top:649px;transform:translate(-50%,-50%);font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:16px;color:#fff;white-space:nowrap;text-align:center;">
        <template v-for="p in totalPaginas" :key="p">
          <span :style="`color:${p === pagina ? '#fff' : 'rgba(255,255,255,0.35)'};cursor:pointer;margin:0 4px;`"
            @click="pagina = p">{{ p }}</span>
        </template>
      </div>

      <button
        :style="`position:absolute;left:674px;top:636px;width:25px;height:25px;background:${pagina === totalPaginas ? '#a79c95' : '#635251'};border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;`"
        @click="pagina < totalPaginas && pagina++">
        <img :src="`${base}assets/adf9a.png`" style="width:14px;height:14px;object-fit:cover;transform:rotate(180deg);"
          alt="→" />
      </button>

      <!-- MODAL AGREGAR EMPLEADO -->
      <template v-if="showAgregar">
        <div style="position:absolute;left:0;top:100px;width:1280px;height:572px;background:rgba(0,0,0,0.76);" />

        <div
          style="position:absolute;left:265px;top:110px;width:750px;height:500px;background:#fff;border-radius:12px;overflow:hidden;" />

        <p
          style="position:absolute;left:640px;top:163.5px;transform:translate(-50%,-50%);font-family:'Lilita One:Regular','Lilita One',cursive;font-size:48px;color:#615d5d;text-align:center;margin:0;font-weight:400;white-space:nowrap;">
          Agregar Nuevo Empleado
        </p>

        <button
          style="position:absolute;left:955px;top:130px;width:40px;height:40px;background:#d92525;border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;"
          @click="cerrarAgregar">
          <span style="color:#fff;font-size:20px;font-weight:bold;line-height:1;">✕</span>
        </button>

        <div style="position:absolute;left:382px;top:240px;width:517px;height:48px;">
          <input v-model="nuevoEmpleado.nombre" placeholder="Nombre completo"
            style="width:100%;height:100%;border:1px solid #2e2e2e;border-radius:10px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:#f6f6f6;padding:0 16px;box-sizing:border-box;font-family:'Inconsolata',monospace;font-size:19px;color:#2e2e2e;outline:none;" />
        </div>

        <div style="position:absolute;left:382px;top:303px;width:517px;height:48px;">
          <input v-model="nuevoEmpleado.email" placeholder="Correo electronico" type="email"
            style="width:100%;height:100%;border:1px solid #2e2e2e;border-radius:10px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:#f6f6f6;padding:0 16px;box-sizing:border-box;font-family:'Inconsolata',monospace;font-size:19px;color:#2e2e2e;outline:none;" />
        </div>

        <div style="position:absolute;left:382px;top:367px;width:517px;height:48px;">
          <input v-model="nuevoEmpleado.telefono" placeholder="Numero de telefono"
            style="width:100%;height:100%;border:1px solid #2e2e2e;border-radius:10px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:#f6f6f6;padding:0 16px;box-sizing:border-box;font-family:'Inconsolata',monospace;font-size:19px;color:#2e2e2e;outline:none;" />
        </div>

        <div style="position:absolute;left:382px;top:429px;width:517px;height:48px;">
          <input v-model="nuevoEmpleado.password" placeholder="Contraseña" type="password"
            style="width:100%;height:100%;border:1px solid #2e2e2e;border-radius:10px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:#f6f6f6;padding:0 16px;box-sizing:border-box;font-family:'Inconsolata',monospace;font-size:19px;color:#2e2e2e;outline:none;" />
        </div>

        <button
          style="position:absolute;left:542px;top:522px;width:173px;height:60px;background:#008a52;border:none;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;"
          @click="guardarEmpleado">
          <span
            style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:20px;color:#fff;">Guardar</span>
        </button>
      </template>

      <!-- MODAL EDITAR EMPLEADO -->
      <template v-if="showEditar">
        <div style="position:absolute;left:0;top:100px;width:1280px;height:572px;background:rgba(0,0,0,0.76);" />

        <div
          style="position:absolute;left:265px;top:110px;width:750px;height:500px;background:#fff;border-radius:12px;overflow:hidden;" />

        <p
          style="position:absolute;left:640px;top:163.5px;transform:translate(-50%,-50%);font-family:'Lilita One:Regular','Lilita One',cursive;font-size:48px;color:#615d5d;text-align:center;margin:0;font-weight:400;white-space:nowrap;">
          Editar Empleado
        </p>

        <button
          style="position:absolute;left:955px;top:130px;width:40px;height:40px;background:#d92525;border:none;border-radius:5px;cursor:pointer;"
          @click="showEditar = false">
          <span style="color:#fff;font-size:20px;font-weight:bold;">✕</span>
        </button>

        <input v-model="empleadoEditar.nombre" placeholder="Nombre completo"
          style="position:absolute;left:382px;top:250px;width:517px;height:48px;border:1px solid #2e2e2e;border-radius:10px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:#f6f6f6;padding:0 16px;box-sizing:border-box;font-family:'Inconsolata',monospace;font-size:19px;color:#2e2e2e;outline:none;" />

        <select v-model="empleadoEditar.rol"
          style="position:absolute;left:382px;top:325px;width:517px;height:48px;border:1px solid #2e2e2e;border-radius:10px;box-shadow:0 4px 4px rgba(0,0,0,0.25);background:#f6f6f6;padding:0 16px;box-sizing:border-box;font-family:'Inconsolata',monospace;font-size:19px;color:#2e2e2e;outline:none;">
          <option value="Vendedor">Vendedor</option>
          <option value="Gerente">Gerente</option>
          <option value="Administrador">Administrador</option>
        </select>

        <button
          style="position:absolute;left:542px;top:430px;width:173px;height:60px;background:#008a52;border:none;border-radius:7px;cursor:pointer;"
          @click="guardarEdicion">
          <span style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:20px;color:#fff;">Guardar
            cambios</span>
        </button>
      </template>

      <!-- MODAL CONFIRMAR ELIMINAR -->
      <template v-if="showEliminar.show">
        <div style="position:absolute;left:0;top:100px;width:1280px;height:572px;background:rgba(0,0,0,0.76);" />

        <div
          style="position:absolute;left:265px;top:150px;width:750px;height:380px;background:#f5f5f0;border-radius:12px;" />

        <button
          style="position:absolute;left:955px;top:168px;width:40px;height:40px;background:#d92525;border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;"
          @click="showEliminar.show = false">
          <span style="color:#fff;font-size:20px;font-weight:bold;line-height:1;">✕</span>
        </button>

        <p
          style="position:absolute;left:640px;top:280px;transform:translate(-50%,-50%);font-family:'Lilita One:Regular','Lilita One',cursive;font-size:36px;color:#3a2422;text-align:center;margin:0;font-weight:400;width:580px;line-height:1.15;">
          ¿ESTÁ SEGURO DE ELIMINAR EL EMPLEADO?
        </p>

        <div
          style="position:absolute;left:382px;top:350px;width:517px;height:40px;background:#fff;border:1px solid #c0bbb0;border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="font-family:'Inconsolata',monospace;font-size:17px;color:#333;">{{
            showEliminar.nombre }}</span>
        </div>

        <button
          style="position:absolute;left:382px;top:420px;width:173px;height:55px;background:#9e9e9e;border:none;border-radius:7px;cursor:pointer;"
          @click="showEliminar.show = false">
          <span
            style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:20px;color:#fff;">Cancelar</span>
        </button>

        <button
          style="position:absolute;left:726px;top:420px;width:173px;height:55px;background:#d92525;border:none;border-radius:7px;cursor:pointer;"
          @click="eliminarEmpleado">
          <span
            style="font-family:'Baloo Paaji:Regular','Baloo Paaji 2',sans-serif;font-size:20px;color:#fff;">Eliminar</span>
        </button>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const base = import.meta.env.BASE_URL

// Colores de los 8 slots por página
const COLORES = [
  { from: "#339672", to: "#1c7655" },
  { from: "#77bdfe", to: "#538fbf" },
  { from: "#ffa84a", to: "#b3712d" },
  { from: "#339672", to: "#1c7655" },
  { from: "#f1c530", to: "#c68900" },
  { from: "#dc3f76", to: "#c73b68" },
  { from: "#965091", to: "#763568" },
  { from: "#f1c530", to: "#c68900" },
]

// Posiciones de las tarjetas
const COLS = [78, 364, 650, 937]
const ROWS = [161, 392]

function cardX(i: number) {
  return COLS[i % 4]
}

function cardY(i: number) {
  return ROWS[Math.floor(i / 4)]
}

// Estado de empleados
type RolEmpleado = "Vendedor" | "Gerente" | "Administrador"

interface Empleado {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: RolEmpleado
}

const empleados = ref<Empleado[]>([])

// Paginación
const POR_PAGINA = 8
const pagina = ref(1)

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(empleados.value.length / POR_PAGINA))
)

const slots = computed<Array<Empleado | null>>(() => {
  const inicio = (pagina.value - 1) * POR_PAGINA
  const pageEmps = empleados.value.slice(inicio, inicio + POR_PAGINA)
  const result: Array<Empleado | null> = [...pageEmps]

  while (result.length < POR_PAGINA) {
    result.push(null)
  }

  return result
})

// Modal Agregar
const showAgregar = ref(false)

const nuevoEmpleado = ref({
  nombre: "",
  email: "",
  telefono: "",
  password: "",
})

function abrirAgregar() {
  showAgregar.value = true
}

function resetForm() {
  nuevoEmpleado.value = {
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  }
}

function cerrarAgregar() {
  showAgregar.value = false
  resetForm()
}

async function guardarEmpleado() {
  const { nombre, email, telefono, password } = nuevoEmpleado.value

  if (!nombre.trim() || !email.trim() || !telefono.trim() || !password.trim()) {
    alert("Completa todos los campos.")
    return
  }

  try {
    const { supabase } = await import("@/lib/supabase")

    const { data, error } = await supabase.functions.invoke("crear-empleado", {
      body: {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        rol: "Vendedor",
      },
    })

    if (error) {
      throw new Error(error.message || "No se pudo registrar el empleado.")
    }

    if (data?.error) {
      throw new Error(data.error)
    }

    const empleadoCreado = data?.empleado

    if (!empleadoCreado) {
      throw new Error("No se recibió la información del empleado.")
    }

    const nuevoRegistro: Empleado = {
      id: empleadoCreado.id,
      nombre: empleadoCreado.nombre,
      email: empleadoCreado.email,
      telefono: telefono.trim(),
      rol: empleadoCreado.rol ?? "Vendedor",
    }

    empleados.value.push(nuevoRegistro)

    pagina.value = totalPaginas.value

    alert("Empleado registrado correctamente.")
    cerrarAgregar()
  } catch (e) {
    console.error("Error guardando empleado:", e)
    alert(e instanceof Error ? e.message : "Error al registrar el empleado.")
  }
}

// Modal Editar
const showEditar = ref(false)

const empleadoEditar = ref({
  id: "",
  nombre: "",
  rol: "Vendedor" as RolEmpleado,
})

function abrirEditar(emp: Empleado) {
  const original = empleados.value.find(e => e.id === emp.id)

  if (!original) return

  empleadoEditar.value = {
    id: original.id,
    nombre: original.nombre,
    rol: original.rol,
  }

  showEditar.value = true
}

async function guardarEdicion() {
  const { id, nombre, rol } = empleadoEditar.value

  if (!nombre.trim()) {
    alert("Ingresa el nombre del empleado.")
    return
  }

  try {
    const { empleadoService } = await import("@/services/empleadoService")

    const empleadoActualizado = await empleadoService.actualizar(id, {
      nombre: nombre.trim(),
      rol,
    })

    const empleado = empleados.value.find(e => e.id === id)

    if (empleado) {
      empleado.nombre = empleadoActualizado.nombre
      empleado.rol = empleadoActualizado.rol
    }

    alert("Empleado actualizado correctamente.")
    showEditar.value = false
  } catch (e) {
    console.error("Error actualizando empleado:", e)
    alert(e instanceof Error ? e.message : "Error al actualizar el empleado.")
  }
}

// Modal Eliminar
const showEliminar = ref<{
  show: boolean
  id: string
  nombre: string
}>({
  show: false,
  id: "",
  nombre: "",
})

function confirmarEliminar(emp: Empleado) {
  showEliminar.value = {
    show: true,
    id: emp.id,
    nombre: emp.nombre,
  }
}

async function eliminarEmpleado() {
  try {
    const { empleadoService } = await import("@/services/empleadoService")

    await empleadoService.desactivar(showEliminar.value.id)

    empleados.value = empleados.value.filter(
      e => e.id !== showEliminar.value.id
    )

    showEliminar.value = {
      show: false,
      id: "",
      nombre: "",
    }

    if (pagina.value > totalPaginas.value) {
      pagina.value = totalPaginas.value
    }

    alert("Empleado desactivado correctamente.")
  } catch (e) {
    console.error("Error desactivando empleado:", e)
    alert(e instanceof Error ? e.message : "Error al desactivar el empleado.")
  }
}

// Navegación
function regresar() {
  router.push({ name: "DashboardGerente" })
}

// Escala del viewport
function updateScale() {
  const el = document.querySelector(".gp-canvas") as HTMLElement | null

  if (!el) return

  const sx = window.innerWidth / 1280
  const sy = window.innerHeight / 720

  el.style.transform = `scale(${sx}, ${sy})`
}

// Carga inicial
onMounted(async () => {
  updateScale()
  window.addEventListener("resize", updateScale)

  try {
    const { empleadoService } = await import("@/services/empleadoService")
    const data = await empleadoService.listarActivos()

    empleados.value = data.map(e => ({
      id: e.id,
      nombre: e.nombre,
      email: e.email,
      telefono: "",
      rol: e.rol as RolEmpleado,
    }))
  } catch (e) {
    console.error("Error cargando empleados:", e)
    alert("No fue posible cargar la lista de empleados.")
  }
})

onUnmounted(() => {
  window.removeEventListener("resize", updateScale)
})
</script>

<style scoped>
.gp-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #3a2422;
}

.gp-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 1280px;
  height: 720px;
  transform-origin: top left;
}
</style>
