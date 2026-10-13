<template>
  <div class="rg-viewport">
    <div class="rg-canvas">

      <!-- 1. Background marrón -->
      <div style="position:absolute;left:0;top:0;width:1280px;height:720px;background:#3a2422;" />
      <!-- Footer bar -->
      <div style="position:absolute;left:0;top:670px;width:1280px;height:50px;background:#f8f4e3;" />

      <!-- 2. Tablero gris (fondo de los post-its) -->
      <div style="position:absolute;left:100px;top:80px;width:1080px;height:270px;background:#615d5d;border:3px solid #1e1e1e;border-radius:7px;box-shadow:10px 0 10px rgba(0,0,0,0.25);" />

      <!-- 3. Tabs de respaldo (f8f4e3) — DEBEN ir ANTES de la barra amarilla -->
      <div style="position:absolute;left:133px;top:90px;width:178px;height:233px;background:#f8f4e3;border-radius:0 0 15px 15px;" />
      <div style="position:absolute;left:342px;top:90px;width:178px;height:233px;background:#f8f4e3;border-radius:0 0 15px 15px;" />
      <div style="position:absolute;left:551px;top:90px;width:178px;height:233px;background:#f8f4e3;border-radius:0 0 15px 15px;" />
      <div style="position:absolute;left:760px;top:90px;width:178px;height:233px;background:#f8f4e3;border-radius:0 0 15px 15px;" />
      <div style="position:absolute;left:969px;top:90px;width:178px;height:233px;background:#f8f4e3;border-radius:0 0 15px 15px;" />

      <!-- 4. Header verde -->
      <div style="position:absolute;left:0;top:0;width:1280px;height:100px;background:#008a52;" />

      <!-- 5. Título de página -->
      <p style="position:absolute;left:calc(50% - 174px);top:31px;font-family:'Lilita One:Regular',serif;font-size:40px;color:white;white-space:nowrap;margin:0;">
        Monitoreo de Actividad
      </p>

      <!-- 6. Barra amarilla "Registros generales de la semana" -->
      <div style="position:absolute;left:160px;top:100px;width:960px;height:40px;background:#f7e05e;border:1px solid #c8c135;border-radius:0 0 15px 15px;" />
      <p style="position:absolute;left:640px;top:120px;transform:translateX(-50%,-50%);font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;white-space:nowrap;text-align:center;margin:0;">
        Registros generales de la semana
      </p>

      <!-- 7. Logo -->
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila"
           style="position:absolute;left:20px;top:18px;height:64px;object-fit:contain;" />

      <!-- 8. Post-it cards — orden: body → yellow top → white tape → texts -->
      <!-- Card 1: Prospectos Registrados (left=161) -->
      <div style="position:absolute;left:161px;top:145.66px;width:122px;height:132.342px;background:#f6e782;box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:161px;top:145.66px;width:122px;height:29.684px;background:#f7e05e;" />
      <div style="position:absolute;left:185px;top:138px;width:74.42px;height:16.079px;background:rgba(255,255,255,0.7);box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:221.39px;top:176.58px;transform:translateX(-50%);width:108.58px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">
        <p style="margin:0;">Prospectos</p><p style="margin:0;">Registrados</p>
      </div>
      <div style="position:absolute;left:221.39px;top:252.64px;transform:translate(-50%,-50%);width:59.78px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:36px;color:#615d5d;">
        {{ totales.prospectos !== undefined ? pad(totales.prospectos) : "--" }}
      </div>

      <!-- Card 2: Contratos Firmados (left=370) -->
      <div style="position:absolute;left:370px;top:145.66px;width:122px;height:132.342px;background:#f6e782;box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:370px;top:145.66px;width:122px;height:29.684px;background:#f7e05e;" />
      <div style="position:absolute;left:394px;top:138px;width:74.42px;height:16.079px;background:rgba(255,255,255,0.7);box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:430.39px;top:176.58px;transform:translateX(-50%);width:108.58px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">
        <p style="margin:0;">Contratos</p><p style="margin:0;">Firmados</p>
      </div>
      <div style="position:absolute;left:430.39px;top:252.64px;transform:translate(-50%,-50%);width:59.78px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:36px;color:#615d5d;">
        {{ totales.contratos !== undefined ? pad(totales.contratos) : "--" }}
      </div>

      <!-- Card 3: Paquetes de Radio (left=579) -->
      <div style="position:absolute;left:579px;top:145.66px;width:122px;height:132.342px;background:#f6e782;box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:579px;top:145.66px;width:122px;height:29.684px;background:#f7e05e;" />
      <div style="position:absolute;left:603px;top:138px;width:74.42px;height:16.079px;background:rgba(255,255,255,0.7);box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:639.39px;top:176.58px;transform:translateX(-50%);width:108.58px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">
        <p style="margin:0;">Paquetes</p><p style="margin:0;">de Radio</p>
      </div>
      <div style="position:absolute;left:639.39px;top:252.64px;transform:translate(-50%,-50%);width:59.78px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:36px;color:#615d5d;">
        {{ totales.radio !== undefined ? pad(totales.radio) : "--" }}
      </div>

      <!-- Card 4: Paquetes de Periódico (left=788) -->
      <div style="position:absolute;left:788px;top:145.66px;width:122px;height:132.342px;background:#f6e782;box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:788px;top:145.66px;width:122px;height:29.684px;background:#f7e05e;" />
      <div style="position:absolute;left:812px;top:138px;width:74.42px;height:16.079px;background:rgba(255,255,255,0.7);box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:848.39px;top:176.58px;transform:translateX(-50%);width:108.58px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">
        <p style="margin:0;">Paquetes</p><p style="margin:0;">de Periódico</p>
      </div>
      <div style="position:absolute;left:848.39px;top:252.64px;transform:translate(-50%,-50%);width:59.78px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:36px;color:#615d5d;">
        {{ totales.periodico !== undefined ? pad(totales.periodico) : "--" }}
      </div>

      <!-- Card 5: Ventas Totales (left=997) -->
      <div style="position:absolute;left:997px;top:145.66px;width:122px;height:132.342px;background:#f6e782;box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:997px;top:145.66px;width:122px;height:29.684px;background:#f7e05e;" />
      <div style="position:absolute;left:1021px;top:138px;width:74.42px;height:16.079px;background:rgba(255,255,255,0.7);box-shadow:0 4px 4px rgba(0,0,0,0.25);" />
      <div style="position:absolute;left:1057.39px;top:176.58px;transform:translateX(-50%);width:108.58px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">
        <p style="margin:0;">Ventas</p><p style="margin:0;">Totales</p>
      </div>
      <div style="position:absolute;left:1057.39px;top:252.64px;transform:translate(-50%,-50%);width:59.78px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:36px;color:#615d5d;">
        {{ totales.ventas !== undefined ? pad(totales.ventas) : "--" }}
      </div>

      <!-- 9. Clipboard (tablero marrón) -->
      <div style="position:absolute;left:120px;top:341px;width:1039px;height:320px;background:#91634d;border-radius:19px;" />
      <!-- Papel interior -->
      <div style="position:absolute;left:178px;top:362px;width:964px;height:280px;background:#f3e9dc;border-radius:5px;" />

      <!-- 10. Título mes / rango de fechas -->
      <div style="position:absolute;left:calc(50% - 195.5px);top:397.5px;transform:translate(-50%,-50%);width:507px;height:33px;display:flex;align-items:center;justify-content:center;">
        <span style="font-family:'Lilita One:Regular',serif;font-size:35px;color:#615d5d;white-space:nowrap;">
          {{ filtroActivo ? rangoLabel : mesLabel }}
        </span>
      </div>

      <!-- 11. Botón Filtrar / Reiniciar -->
      <button v-if="!filtroActivo" @click="abrirFiltro"
        style="position:absolute;left:934px;top:363px;width:170px;height:60px;background:#008a52;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;">
        <img :src="`${base}assets/e1814.png`" style="width:31px;height:31px;object-fit:cover;flex-shrink:0;" alt="" />
        <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:25px;color:white;">Filtrar</span>
      </button>
      <button v-else @click="reiniciarFiltro"
        style="position:absolute;left:934px;top:363px;width:170px;height:60px;background:#008a52;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;">
        <img :src="`${base}assets/46558.png`" style="width:31px;height:31px;object-fit:cover;flex-shrink:0;" alt="" />
        <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:25px;color:white;">Reiniciar</span>
      </button>

      <!-- 12. Header fila de tabla (blanca redondeada arriba) -->
      <div style="position:absolute;left:215px;top:426px;width:889px;height:43px;background:white;border-radius:10px 10px 0 0;" />

      <!-- Textos encabezados columnas -->
      <div style="position:absolute;left:284px;top:448px;transform:translate(-50%,-50%);width:132px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;">Empleado</div>
      <div style="position:absolute;left:432.5px;top:447.5px;transform:translate(-50%,-50%);width:129px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">Prospectos<br>Registrados</div>
      <div style="position:absolute;left:581px;top:447.5px;transform:translate(-50%,-50%);width:134px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">Contratos<br>Firmados</div>
      <div style="position:absolute;left:733px;top:447.5px;transform:translate(-50%,-50%);width:134px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">Paquetes de<br>Radio</div>
      <div style="position:absolute;left:882.5px;top:447.5px;transform:translate(-50%,-50%);width:99px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;line-height:20px;">Paquetes de<br>Periódico</div>
      <div style="position:absolute;left:1034px;top:449px;transform:translate(-50%,-50%);width:134px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;">Ventas Totales</div>

      <!-- 13. Filas de empleados (3 filas fijas por página) -->
      <template v-for="(emp, ri) in paginaEmpleados" :key="`row-${emp.nombre}`">
        <!-- Celdas blancas -->
        <div :style="`position:absolute;left:215px;top:${479+ri*48}px;width:137px;height:38px;background:white;border-radius:2px;`" />
        <div :style="`position:absolute;left:362px;top:${479+ri*48}px;width:140px;height:38px;background:white;border-radius:2px;`" />
        <div :style="`position:absolute;left:512px;top:${479+ri*48}px;width:140px;height:38px;background:white;border-radius:2px;`" />
        <div :style="`position:absolute;left:662px;top:${479+ri*48}px;width:140px;height:38px;background:white;border-radius:2px;`" />
        <div :style="`position:absolute;left:812px;top:${479+ri*48}px;width:140px;height:38px;background:white;border-radius:2px;`" />
        <div :style="`position:absolute;left:963px;top:${479+ri*48}px;width:140px;height:38px;background:white;border-radius:2px;`" />
        <!-- Datos -->
        <div :style="`position:absolute;left:284px;top:${498+ri*48}px;transform:translate(-50%,-50%);width:144px;text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;`">{{ emp.nombre }}</div>
        <div :style="`position:absolute;left:433px;top:${499.5+ri*48}px;transform:translate(-50%,-50%);text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;`">{{ emp.prospectos !== undefined ? pad(emp.prospectos) : "--" }}</div>
        <div :style="`position:absolute;left:581px;top:${499.5+ri*48}px;transform:translate(-50%,-50%);text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;`">{{ emp.contratos !== undefined ? pad(emp.contratos) : "--" }}</div>
        <div :style="`position:absolute;left:733px;top:${500.5+ri*48}px;transform:translate(-50%,-50%);text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;`">{{ emp.radio !== undefined ? pad(emp.radio) : "--" }}</div>
        <div :style="`position:absolute;left:883px;top:${500.5+ri*48}px;transform:translate(-50%,-50%);text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;`">{{ emp.periodico !== undefined ? pad(emp.periodico) : "--" }}</div>
        <div :style="`position:absolute;left:1034px;top:${500.5+ri*48}px;transform:translate(-50%,-50%);text-align:center;font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;color:#615d5d;`">{{ emp.ventas !== undefined ? pad(emp.ventas) : "--" }}</div>
      </template>

      <!-- 14. Argolla del clipboard (Union SVG) -->
      <div style="position:absolute;left:129px;top:406px;width:69.001px;height:186.484px;">
        <img :src="`${base}assets/3e155.svg`" style="width:100%;height:100%;" alt="" />
      </div>

      <!-- 15. Paginación -->
      <!-- Flecha izquierda -->
      <div style="position:absolute;left:599px;top:618px;width:20px;height:20px;cursor:pointer;" @click="pagina = Math.max(1, pagina-1)">
        <img :src="`${base}assets/10d17.png`" style="width:100%;height:100%;object-fit:contain;" alt="" />
      </div>
      <!-- Números -->
      <div style="position:absolute;left:660px;top:628px;transform:translate(-50%,-50%);font-family:'Baloo Paaji:Regular',sans-serif;font-size:16px;text-align:center;white-space:pre;">
        <span v-for="p in totalPaginas" :key="p"
          @click="pagina = p"
          :style="`cursor:pointer;color:${p===pagina ? 'black' : 'rgba(97,93,93,0.65)'};margin:0 3px;`">{{ p }}</span>
      </div>
      <!-- Flecha derecha -->
      <div style="position:absolute;left:701px;top:618px;width:20px;height:20px;cursor:pointer;transform:rotate(180deg);" @click="pagina = Math.min(totalPaginas, pagina+1)">
        <img :src="`${base}assets/10d17.png`" style="width:100%;height:100%;object-fit:contain;" alt="" />
      </div>

      <!-- 16. Botón Regresar -->
      <button @click="regresar"
        style="position:absolute;left:1020px;top:17px;width:210px;height:60px;background:#d92525;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;">
        <img :src="`${base}assets/f79f1.png`" style="width:36px;height:36px;object-fit:cover;flex-shrink:0;" alt="" />
        <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:25px;color:white;">Regresar</span>
      </button>

      <!-- ── Modal rango de fechas ── -->
      <template v-if="showModal">
        <div style="position:absolute;left:0;top:100px;width:1280px;height:620px;background:rgba(0,0,0,0.76);" @click.self="cerrarModal" />
        <div style="position:absolute;left:136px;top:111px;width:1007px;height:548px;background:#f3e9dc;border-radius:15px;overflow:hidden;">

          <!-- Botón X cerrar -->
          <button @click="cerrarModal"
            style="position:absolute;right:24px;top:20px;width:40px;height:40px;background:#d92525;border:none;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:20px;font-weight:bold;line-height:1;">✕</span>
          </button>

          <!-- Título modal -->
          <p style="text-align:center;margin-top:28px;font-family:'Lilita One:Regular',serif;font-size:48px;color:#615d5d;margin-bottom:0;">
            Seleccione el rango de fechas
          </p>

          <!-- Dos calendarios -->
          <div style="display:flex;gap:64px;justify-content:center;margin-top:12px;">
            <!-- Calendario izquierdo (fecha inicio) -->
            <div style="width:472px;border:4px solid #d9d9d9;border-radius:10px;overflow:hidden;background:white;">
              <div style="background:#635251;height:35px;display:flex;align-items:center;justify-content:center;">
                <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:white;">{{ calLeft.year }}</span>
              </div>
              <div style="padding:8px 12px;background:white;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="prevMonthLeft">&lt;</span>
                  <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;">{{ MESES[calLeft.month] }}</span>
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="nextMonthLeft">&gt;</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;">
                  <span v-for="d in DIAS" :key="d" style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;padding:2px 0;">{{ d }}</span>
                  <span v-for="_ in firstDayLeft" :key="`el${_}`" />
                  <span v-for="day in daysInMonthLeft" :key="day"
                    @click="selectDay('start', day)"
                    :style="`font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;padding:2px 0;cursor:pointer;border-radius:50%;${dayStyle('start', day, calLeft)}`">{{ day }}</span>
                </div>
              </div>
            </div>
            <!-- Calendario derecho (fecha fin) -->
            <div style="width:472px;border:4px solid #d9d9d9;border-radius:10px;overflow:hidden;background:white;">
              <div style="background:#635251;height:35px;display:flex;align-items:center;justify-content:center;">
                <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:white;">{{ calRight.year }}</span>
              </div>
              <div style="padding:8px 12px;background:white;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="prevMonthRight">&lt;</span>
                  <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;">{{ MESES[calRight.month] }}</span>
                  <span style="cursor:pointer;font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;" @click="nextMonthRight">&gt;</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;">
                  <span v-for="d in DIAS" :key="d" style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;color:#615d5d;padding:2px 0;">{{ d }}</span>
                  <span v-for="_ in firstDayRight" :key="`er${_}`" />
                  <span v-for="day in daysInMonthRight" :key="day"
                    @click="selectDay('end', day)"
                    :style="`font-family:'Baloo Paaji:Regular',sans-serif;font-size:20px;padding:2px 0;cursor:pointer;border-radius:50%;${dayStyle('end', day, calRight)}`">{{ day }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón Aceptar -->
          <div style="display:flex;justify-content:center;margin-top:20px;">
            <button @click="aplicarFiltro"
              :style="`display:flex;align-items:center;justify-content:center;gap:10px;width:170px;height:60px;background:${selStart&&selEnd?'#008a52':'#8cc8ae'};border:none;border-radius:10px;cursor:pointer;`">
              <span style="font-family:'Baloo Paaji:Regular',sans-serif;font-size:25px;color:white;">Aceptar</span>
            </button>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const base = import.meta.env.BASE_URL

function updateScale() {
  const el = document.querySelector(".rg-canvas") as HTMLElement | null
  if (!el) return
  const sx = window.innerWidth / 1280
  const sy = window.innerHeight / 720
  el.style.transform = `scale(${sx}, ${sy})`
}
onMounted(async () => {
  updateScale()
  window.addEventListener("resize", updateScale)
  try {
    const { dashboardService } = await import("@/services/dashboardService")
    const { empleadoService } = await import("@/services/empleadoService")
    const [stats, emps] = await Promise.all([
      dashboardService.registrosSemanaGerente(),
      empleadoService.listarActivos(),
    ])
    totales.value = {
      prospectos: stats.prospectos,
      contratos: stats.contratos,
      radio: stats.paquetesRadio,
      periodico: stats.paquetesPeriodico,
      ventas: stats.ventasTotales,
    }
    empleados.value = emps
      .filter(e => e.rol === "Vendedor")
      .map(e => ({ nombre: e.nombre }))
  } catch (e) {
    console.error("Error cargando registros gerente:", e)
  }
})
onUnmounted(() => { window.removeEventListener("resize", updateScale) })

type Empleado = {
  nombre: string
  prospectos?: number
  contratos?: number
  radio?: number
  periodico?: number
  ventas?: number
}

const empleados = ref<Empleado[]>([])

type TotalesKey = "prospectos" | "contratos" | "radio" | "periodico" | "ventas"
const totales = ref<Record<TotalesKey, number | undefined>>({
  prospectos: undefined, contratos: undefined,
  radio: undefined, periodico: undefined, ventas: undefined,
})

const POR_PAGINA = 3
const pagina = ref(1)
const totalPaginas = computed(() => Math.max(1, Math.ceil(empleados.value.length / POR_PAGINA)))
const paginaEmpleados = computed(() =>
  empleados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA)
)

const MESES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
const now = new Date()
const mesLabel = computed(() => `${MESES_ES[now.getMonth()]} ${now.getFullYear()}`)

const filtroActivo = ref(false)
const rangoLabel = ref("")

function pad(n: number | undefined) {
  if (n === undefined) return "--"
  return String(n).padStart(2, "0")
}
function regresar() { router.push({ name: "DashboardGerente" }) }
function reiniciarFiltro() { filtroActivo.value = false; rangoLabel.value = "" }

const showModal = ref(false)
const DIAS = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"]
const MESES = MESES_ES

interface CalState { year: number; month: number }

const calLeft = ref<CalState>({
  year: now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
  month: now.getMonth() === 0 ? 11 : now.getMonth() - 1,
})
const calRight = ref<CalState>({ year: now.getFullYear(), month: now.getMonth() })

const selStart = ref<{ year: number; month: number; day: number } | null>(null)
const selEnd   = ref<{ year: number; month: number; day: number } | null>(null)

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }

const daysInMonthLeft  = computed(() => daysInMonth(calLeft.value.year,  calLeft.value.month))
const daysInMonthRight = computed(() => daysInMonth(calRight.value.year, calRight.value.month))
const firstDayLeft     = computed(() => firstWeekday(calLeft.value.year,  calLeft.value.month))
const firstDayRight    = computed(() => firstWeekday(calRight.value.year, calRight.value.month))

function prevMonthLeft()  { if (calLeft.value.month===0) { calLeft.value.month=11; calLeft.value.year-- } else calLeft.value.month-- }
function nextMonthLeft()  { if (calLeft.value.month===11){ calLeft.value.month=0;  calLeft.value.year++ } else calLeft.value.month++ }
function prevMonthRight() { if (calRight.value.month===0){ calRight.value.month=11;calRight.value.year--} else calRight.value.month-- }
function nextMonthRight() { if (calRight.value.month===11){calRight.value.month=0; calRight.value.year++} else calRight.value.month++ }

function selectDay(which: "start"|"end", day: number) {
  const cal = which === "start" ? calLeft.value : calRight.value
  const obj = { year: cal.year, month: cal.month, day }
  if (which === "start") selStart.value = obj
  else selEnd.value = obj
}
function dayStyle(which: "start"|"end", day: number, cal: CalState) {
  const sel = which === "start" ? selStart.value : selEnd.value
  if (sel && sel.year===cal.year && sel.month===cal.month && sel.day===day)
    return "background:#635251;color:white;"
  return ""
}

function abrirFiltro() { selStart.value=null; selEnd.value=null; showModal.value=true }
function cerrarModal() { showModal.value=false }
function aplicarFiltro() {
  if (!selStart.value || !selEnd.value) return
  const fmt = (d: {year:number;month:number;day:number}) =>
    `${String(d.day).padStart(2,"0")}/${MESES[d.month].slice(0,3).toUpperCase()}/${d.year}`
  rangoLabel.value = `${fmt(selStart.value)} – ${fmt(selEnd.value)}`
  filtroActivo.value = true
  showModal.value = false
}
</script>

<style scoped>
.rg-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #3a2422;
}
.rg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 1280px;
  height: 720px;
  transform-origin: top left;
}
</style>
