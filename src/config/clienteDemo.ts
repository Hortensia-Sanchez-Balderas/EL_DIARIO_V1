// ─────────────────────────────────────────────────────────────
// Rol CLIENTE (temporal, solo frontend)
// Aún no existe una tabla de clientes en la BD, así que el acceso
// al portal de compras en línea se hace con este correo fijo.
// La sesión del cliente se guarda localmente (no usa Supabase Auth).
// Cuando exista la tabla `clientes`, reemplazar esta lógica.
// ─────────────────────────────────────────────────────────────
export const CLIENTE_DEMO = {
  email: "cliente@eldiario.com",
  password: "Cliente2026",
  nombre: "Cliente Demo",
} as const

export function esCorreoCliente(email: string) {
  return email.trim().toLowerCase() === CLIENTE_DEMO.email
}
