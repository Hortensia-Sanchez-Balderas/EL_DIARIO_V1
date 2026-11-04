// Catálogo que ve el cliente en la tienda en línea.
// Basado en las tarifas de respaldo de TarifaPeriodicoView / SpotRadioTarifaView.
// (Precios sin IVA — el IVA se calcula en el carrito.)

export type Medio = "periodico" | "radio"

export interface ProductoTienda {
  id: string
  medio: Medio
  servicioId: string
  nombre: string
  descripcion: string
  detalle?: string // medidas o duración
  precio: number
  /** Paquetes por días (Clasificados): tarifa diaria, 15 y 30 días */
  planes?: { dias: number; precio: number }[]
}

export interface ServicioTienda {
  id: string
  medio: Medio
  label: string
  img: string // en /public/assets
}

export const serviciosTienda: ServicioTienda[] = [
  { id: "digital",        medio: "periodico", label: "Publicidad digital",  img: "b777b.png" },
  { id: "clasificados",   medio: "periodico", label: "Clasificados",        img: "cc13e.png" },
  { id: "eventos",        medio: "periodico", label: "Eventos sociales",    img: "4263c.png" },
  { id: "impresa",        medio: "periodico", label: "Publicidad impresa",  img: "ba78e.png" },
  { id: "spot",           medio: "radio",     label: "Spot Publicitario",   img: "418b4.png" },
  { id: "cortinilla",     medio: "radio",     label: "Cortinilla",          img: "f6801.png" },
  { id: "entrevista",     medio: "radio",     label: "Entrevista",          img: "33737.png" },
  { id: "programas",      medio: "radio",     label: "Programas",           img: "5ce8d.png" },
  { id: "mencion",        medio: "radio",     label: "Mención",             img: "95853.png" },
  { id: "control-remoto", medio: "radio",     label: "Control Remoto",      img: "06ab8.png" },
  { id: "patrocinios",    medio: "radio",     label: "Patrocinios",         img: "3c2c6.png" },
  { id: "blinks",         medio: "radio",     label: "Blinks",              img: "f5d9f.png" },
]

const p = (
  medio: Medio, servicioId: string, nombre: string, descripcion: string, precio: number, detalle?: string,
): ProductoTienda => ({
  id: `${servicioId}-${nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  medio, servicioId, nombre, descripcion, precio, detalle,
})

const conPlanes = (prod: ProductoTienda, p15: number, p30: number): ProductoTienda => ({
  ...prod,
  planes: [
    { dias: 1, precio: prod.precio },
    { dias: 15, precio: p15 },
    { dias: 30, precio: p30 },
  ],
})

/** Convierte un producto con planes en la variante del plan elegido (lo que va al carrito) */
export function varianteDePlan(prod: ProductoTienda, dias: number): ProductoTienda {
  const plan = prod.planes?.find((x) => x.dias === dias)
  if (!plan || dias === 1) return { ...prod, id: `${prod.id}-1d`, detalle: "1 día", planes: undefined }
  return { ...prod, id: `${prod.id}-${dias}d`, nombre: `${prod.nombre} · ${dias} días`, detalle: `${dias} días`, precio: plan.precio, planes: undefined }
}

/** % de ahorro de un plan contra pagar la tarifa diaria todos esos días */
export function ahorroPlan(prod: ProductoTienda, dias: number) {
  const plan = prod.planes?.find((x) => x.dias === dias)
  if (!plan || dias === 1) return 0
  return Math.round((1 - plan.precio / (prod.precio * dias)) * 100)
}

export const productosTienda: ProductoTienda[] = [
  // ── Periódico: digital
  p("periodico", "digital", "Top Banner (Leaderboard)", "Banner superior.", 754, "1107 × 207 px"),
  p("periodico", "digital", "Medio Banner", "Rectángulo medio.", 481, "708 × 166 px"),
  p("periodico", "digital", "Full Banner", "Medio vertical (Halfpage).", 441, "300 × 600 px"),
  p("periodico", "digital", "Box Banner", "Banner cuadrado.", 285, "250 × 250 px"),
  p("periodico", "digital", "Banner", "Cuadrado pequeño.", 250, "250 × 250 px"),
  p("periodico", "digital", "Banner GIF", "Animado vertical.", 250, "300 × 553 px"),
  // ── Periódico: clasificados
  conPlanes(p("periodico", "clasificados", "Clasificado Simple", "Texto 5x1.", 88), 513, 955.5),
  conPlanes(p("periodico", "clasificados", "Clasificado Medio", "Texto 10x1.", 164), 1010, 1856),
  conPlanes(p("periodico", "clasificados", "Clasificado Amplio", "Texto 15x1.", 240), 1508, 2796),
  conPlanes(p("periodico", "clasificados", "Clasificado Doble", "Texto 10x2.", 317), 2010, 3724),
  conPlanes(p("periodico", "clasificados", "Clasificado Triple", "Texto 15x3.", 699), 4499.5, 8364),
  // ── Periódico: eventos sociales
  p("periodico", "eventos", "Plana", "Bodas, aniversarios, graduaciones.", 9086),
  p("periodico", "eventos", "1/2 Plana", "Versión reducida para eventos sociales.", 4543),
  p("periodico", "eventos", "1/4 Plana", "Formato económico para mensajes breves.", 2272),
  // ── Periódico: impresa
  p("periodico", "impresa", "Plana Completa", "Anuncio impreso en plana entera.", 5000, "34 × 52 cm"),
  // ── Radio
  p("radio", "spot", "Spot 10 s", "Spot publicitario al aire.", 93, "10 segundos"),
  p("radio", "spot", "Spot 20 s", "Spot publicitario al aire.", 186, "20 segundos"),
  p("radio", "spot", "Spot 30 s", "Spot publicitario al aire.", 279, "30 segundos"),
  p("radio", "cortinilla", "Cortinilla", "Entrada / salida de sección.", 200, "20 segundos"),
  p("radio", "entrevista", "Entrevista 15 min", "Entrevista en cabina.", 2500, "15 minutos"),
  p("radio", "entrevista", "Entrevista 30 min", "Entrevista en cabina.", 5000, "30 minutos"),
  p("radio", "programas", "Programa 30 min", "Programa patrocinado.", 20000, "30 minutos"),
  p("radio", "programas", "Programa 1 h", "Programa patrocinado.", 40000, "1 hora"),
  p("radio", "mencion", "Mención", "Mención en vivo por el locutor.", 382, "30 segundos"),
  p("radio", "control-remoto", "Control Remoto", "Transmisión desde tu negocio.", 8500, "30 minutos"),
  p("radio", "patrocinios", "Patrocinio", "Patrocinio de sección.", 12500),
  p("radio", "blinks", "Blink", "Mensaje corto de marca.", 93, "30 segundos"),
]

export const IVA = 0.16

export function formatoMXN(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
}
