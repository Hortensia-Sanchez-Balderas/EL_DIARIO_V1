-- EL DIARIO - Datos de demostracion para dashboards y modulos
-- Ejecutar en Supabase SQL Editor con permisos administrativos.
-- No crea usuarios Auth ni modifica empleados, servicios o tarifas existentes.
-- Las filas quedan marcadas con DEMO_SEED para poder identificarlas y eliminarlas.

BEGIN;

-- ============================================================
-- 1. PROSPECTOS Y CLIENTES DE DEMOSTRACION
-- ============================================================

INSERT INTO public.prospectos (
  nombre_empresa,
  nombre_contacto,
  cargo_contacto,
  telefono,
  email_contacto,
  pagina_web,
  domicilio,
  estado,
  id_empleado_registro,
  fecha_registro
)
SELECT
  demo.nombre_empresa,
  demo.nombre_contacto,
  demo.cargo_contacto,
  demo.telefono,
  demo.email_contacto,
  demo.pagina_web,
  demo.domicilio,
  demo.estado,
  empleado.id,
  CURRENT_DATE + demo.dias_desde_hoy
FROM (
  VALUES
    ('DEMO - Cafe Norte', 'Laura Mendez', 'Gerente de marketing', '8441001001', 'demo.cafe.norte@demo.el-diario.local', 'https://demo-cafe-norte.local', 'Saltillo, Coahuila', 'Cliente', 'adriana.mata@diario.com', -6),
    ('DEMO - Grupo Horizonte', 'Miguel Torres', 'Director comercial', '8441001002', 'demo.grupo.horizonte@demo.el-diario.local', 'https://demo-grupo-horizonte.local', 'Torreon, Coahuila', 'Prospecto', 'adriana.mata@diario.com', -2),
    ('DEMO - Colegio del Valle', 'Sofia Ramos', 'Coordinadora', '8441001003', 'demo.colegio.valle@demo.el-diario.local', 'https://demo-colegio-valle.local', 'Saltillo, Coahuila', 'Prospecto', 'anet.ramirez@diario.com', -1),
    ('DEMO - Ferreteria Central', 'Rafael Ortega', 'Propietario', '8441001004', 'demo.ferreteria.central@demo.el-diario.local', NULL, 'Monclova, Coahuila', 'Cliente', 'anet.ramirez@diario.com', -3),
    ('DEMO - Clinica San Jose', 'Elena Fuentes', 'Administradora', '8441001005', 'demo.clinica.sanjose@demo.el-diario.local', 'https://demo-clinica-san-jose.local', 'Saltillo, Coahuila', 'Cliente', 'vanesa.martinez@diario.com', -8),
    ('DEMO - Muebles Roble', 'Daniel Castillo', 'Jefe de ventas', '8441001006', 'demo.muebles.roble@demo.el-diario.local', 'https://demo-muebles-roble.local', 'Ramos Arizpe, Coahuila', 'Prospecto', 'vanesa.martinez@diario.com', -4),
    ('DEMO - Plaza Alameda', 'Patricia Leon', 'Administradora', '8441001007', 'demo.plaza.alameda@demo.el-diario.local', 'https://demo-plaza-alameda.local', 'Saltillo, Coahuila', 'Cliente', 'camila.carvajal@diario.com', -10),
    ('DEMO - Transportes del Norte', 'Oscar Salinas', 'Director', '8441001008', 'demo.transportes.norte@demo.el-diario.local', NULL, 'Piedras Negras, Coahuila', 'Prospecto', 'camila.carvajal@diario.com', -5),
    ('DEMO - Restaurante La Plaza', 'Monica Ibarra', 'Gerente', '8441001009', 'demo.restaurante.plaza@demo.el-diario.local', 'https://demo-restaurante-plaza.local', 'Saltillo, Coahuila', 'Cliente', 'juan.garcia@diario.com', -7),
    ('DEMO - Innovacion MX', 'Alberto Neri', 'Fundador', '8441001010', 'demo.innovacion.mx@demo.el-diario.local', 'https://demo-innovacion-mx.local', 'Torreon, Coahuila', 'Prospecto', 'juan.garcia@diario.com', -1),
    ('DEMO - Mercado La Estacion', 'Gabriela Vera', 'Compras', '8441001011', 'demo.mercado.estacion@demo.el-diario.local', NULL, 'Saltillo, Coahuila', 'Cliente', 'adriana.mata@diario.com', -14),
    ('DEMO - Eventos Nova', 'Andres Ponce', 'Organizador', '8441001012', 'demo.eventos.nova@demo.el-diario.local', 'https://demo-eventos-nova.local', 'Ramos Arizpe, Coahuila', 'Prospecto', 'anet.ramirez@diario.com', -12)
) AS demo(nombre_empresa, nombre_contacto, cargo_contacto, telefono, email_contacto, pagina_web, domicilio, estado, email_empleado, dias_desde_hoy)
JOIN public.empleados AS empleado ON empleado.email = demo.email_empleado AND empleado.activo = TRUE
WHERE NOT EXISTS (
  SELECT 1
  FROM public.prospectos AS existente
  WHERE existente.email_contacto = demo.email_contacto
);

-- ============================================================
-- 2. CONTRATOS DE DEMOSTRACION
--    Usa los paquetes PLN-P01/P05/P08 y PLN-R01/R02/R04/R09.
-- ============================================================

INSERT INTO public.contratos (
  id_prospecto,
  id_empleado_responsable,
  fecha_contrato,
  fecha_inicio_publicacion,
  fecha_fin_publicacion,
  observaciones,
  sub_total,
  iva_monto,
  total,
  estado,
  created_at
)
SELECT
  prospecto.id,
  empleado.id,
  CURRENT_DATE + demo.dias_desde_hoy,
  CURRENT_DATE + demo.dias_inicio,
  CURRENT_DATE + demo.dias_fin,
  demo.observaciones,
  demo.sub_total,
  ROUND(demo.sub_total * 0.16, 2),
  ROUND(demo.sub_total * 1.16, 2),
  demo.estado,
  NOW() + (demo.dias_desde_hoy || ' days')::interval
FROM (
  VALUES
    ('demo.cafe.norte@demo.el-diario.local', 'adriana.mata@diario.com', 'PLN-P05', -6, -5, 25, 'DEMO_SEED - Campana impresa Cafe Norte', 7500.00, 'Firmado'),
    ('demo.grupo.horizonte@demo.el-diario.local', 'adriana.mata@diario.com', 'PLN-R02', -2, 0, 30, 'DEMO_SEED - Cotizacion radio Grupo Horizonte', 500.00, 'Vigente'),
    ('demo.colegio.valle@demo.el-diario.local', 'anet.ramirez@diario.com', 'PLN-R04', -1, 1, 20, 'DEMO_SEED - Paquete de spots Colegio del Valle', 4500.00, 'Firmado'),
    ('demo.ferreteria.central@demo.el-diario.local', 'anet.ramirez@diario.com', 'PLN-P01', -3, -2, 20, 'DEMO_SEED - Publicidad Ferreteria Central', 1200.00, 'Vigente'),
    ('demo.clinica.sanjose@demo.el-diario.local', 'vanesa.martinez@diario.com', 'PLN-R09', -8, -7, 10, 'DEMO_SEED - Micronoticiero Clinica San Jose', 1800.00, 'Terminado'),
    ('demo.muebles.roble@demo.el-diario.local', 'vanesa.martinez@diario.com', 'PLN-P08', -4, -3, 15, 'DEMO_SEED - Franja Muebles Roble', 900.00, 'Firmado'),
    ('demo.plaza.alameda@demo.el-diario.local', 'camila.carvajal@diario.com', 'PLN-R01', -10, -9, 10, 'DEMO_SEED - Spot Plaza Alameda', 350.00, 'Vigente'),
    ('demo.transportes.norte@demo.el-diario.local', 'camila.carvajal@diario.com', 'PLN-P01', -5, -4, 18, 'DEMO_SEED - Propuesta Transportes del Norte', 1200.00, 'Firmado'),
    ('demo.restaurante.plaza@demo.el-diario.local', 'juan.garcia@diario.com', 'PLN-R02', -7, -6, 22, 'DEMO_SEED - Spot Restaurante La Plaza', 500.00, 'Vigente'),
    ('demo.mercado.estacion@demo.el-diario.local', 'adriana.mata@diario.com', 'PLN-P05', -14, -13, 5, 'DEMO_SEED - Campana Mercado La Estacion', 7500.00, 'Terminado')
) AS demo(email_prospecto, email_empleado, pln, dias_desde_hoy, dias_inicio, dias_fin, observaciones, sub_total, estado)
JOIN public.prospectos AS prospecto ON prospecto.email_contacto = demo.email_prospecto
JOIN public.empleados AS empleado ON empleado.email = demo.email_empleado AND empleado.activo = TRUE
JOIN public.paquetes_tarifas AS paquete ON paquete.pln = demo.pln
WHERE NOT EXISTS (
  SELECT 1
  FROM public.contratos AS existente
  WHERE existente.observaciones = demo.observaciones
);

-- ============================================================
-- 3. DETALLES DE CONTRATO
-- ============================================================

INSERT INTO public.contrato_detalles (
  id_contrato,
  id_paquete,
  cantidad,
  precio_unitario,
  importe
)
SELECT
  contrato.id,
  paquete.id,
  demo.cantidad,
  demo.precio_unitario,
  demo.cantidad * demo.precio_unitario
FROM (
  VALUES
    ('DEMO_SEED - Campana impresa Cafe Norte', 'PLN-P05', 1, 7500.00),
    ('DEMO_SEED - Cotizacion radio Grupo Horizonte', 'PLN-R02', 12, 500.00),
    ('DEMO_SEED - Paquete de spots Colegio del Valle', 'PLN-R04', 1, 4500.00),
    ('DEMO_SEED - Publicidad Ferreteria Central', 'PLN-P01', 1, 1200.00),
    ('DEMO_SEED - Micronoticiero Clinica San Jose', 'PLN-R09', 1, 1800.00),
    ('DEMO_SEED - Franja Muebles Roble', 'PLN-P08', 1, 900.00),
    ('DEMO_SEED - Spot Plaza Alameda', 'PLN-R01', 8, 350.00),
    ('DEMO_SEED - Propuesta Transportes del Norte', 'PLN-P01', 1, 1200.00),
    ('DEMO_SEED - Spot Restaurante La Plaza', 'PLN-R02', 10, 500.00),
    ('DEMO_SEED - Campana Mercado La Estacion', 'PLN-P05', 1, 7500.00)
) AS demo(observaciones, pln, cantidad, precio_unitario)
JOIN public.contratos AS contrato ON contrato.observaciones = demo.observaciones
JOIN public.paquetes_tarifas AS paquete ON paquete.pln = demo.pln
WHERE NOT EXISTS (
  SELECT 1
  FROM public.contrato_detalles AS existente
  WHERE existente.id_contrato = contrato.id
    AND existente.id_paquete = paquete.id
);

-- ============================================================
-- 4. AGENDA
-- ============================================================

INSERT INTO public.agenda_eventos (
  id_empleado,
  id_prospecto,
  titulo,
  descripcion,
  fecha,
  hora_inicio,
  hora_fin,
  tipo,
  color,
  completado
)
SELECT
  empleado.id,
  prospecto.id,
  demo.titulo,
  demo.descripcion,
  CURRENT_DATE + demo.dias_desde_hoy,
  demo.hora_inicio::time,
  demo.hora_fin::time,
  demo.tipo,
  demo.color,
  FALSE
FROM (
  VALUES
    ('adriana.mata@diario.com', 'demo.grupo.horizonte@demo.el-diario.local', 'Llamada Grupo Horizonte', 'Revisar propuesta de radio y confirmar cantidad de spots', 0, '10:00', '10:30', 'Llamada', '#008a52'),
    ('anet.ramirez@diario.com', 'demo.colegio.valle@demo.el-diario.local', 'Reunion Colegio del Valle', 'Presentar paquete de radio y resolver dudas', 1, '11:00', '12:00', 'Reunion', '#fa8c3c'),
    ('vanesa.martinez@diario.com', 'demo.muebles.roble@demo.el-diario.local', 'Visita Muebles Roble', 'Llevar propuesta de franja impresa', 2, '13:00', '14:00', 'Visita', '#0059ff'),
    ('camila.carvajal@diario.com', 'demo.transportes.norte@demo.el-diario.local', 'Seguimiento Transportes del Norte', 'Confirmar decision sobre la propuesta', 3, '09:30', '10:00', 'Seguimiento', '#6464f0'),
    ('juan.garcia@diario.com', 'demo.innovacion.mx@demo.el-diario.local', 'Llamada Innovacion MX', 'Primer contacto comercial', 4, '15:00', '15:30', 'Llamada', '#008a52')
) AS demo(email_empleado, email_prospecto, titulo, descripcion, dias_desde_hoy, hora_inicio, hora_fin, tipo, color)
JOIN public.empleados AS empleado ON empleado.email = demo.email_empleado
JOIN public.prospectos AS prospecto ON prospecto.email_contacto = demo.email_prospecto
WHERE NOT EXISTS (
  SELECT 1
  FROM public.agenda_eventos AS existente
  WHERE existente.titulo = demo.titulo
    AND existente.fecha = CURRENT_DATE + demo.dias_desde_hoy
);

-- ============================================================
-- 5. SEGUIMIENTO
-- ============================================================

INSERT INTO public.seguimiento (
  id_prospecto,
  id_empleado,
  tipo_accion,
  descripcion,
  resultado,
  fecha_accion,
  proxima_accion
)
SELECT
  prospecto.id,
  empleado.id,
  demo.tipo_accion,
  demo.descripcion,
  demo.resultado,
  NOW() + (demo.dias_desde_hoy || ' days')::interval,
  CURRENT_DATE + demo.dias_proxima_accion
FROM (
  VALUES
    ('demo.grupo.horizonte@demo.el-diario.local', 'adriana.mata@diario.com', 'Llamada', 'Contacto inicial para campana de radio', 'Solicito propuesta con spots diarios', -2, 2),
    ('demo.colegio.valle@demo.el-diario.local', 'anet.ramirez@diario.com', 'Reunion', 'Presentacion de paquete de radio', 'Interesado en contratar este mes', -1, 3),
    ('demo.muebles.roble@demo.el-diario.local', 'vanesa.martinez@diario.com', 'Visita', 'Revision de opciones de publicidad impresa', 'Solicito ajuste de medidas', -3, 1),
    ('demo.transportes.norte@demo.el-diario.local', 'camila.carvajal@diario.com', 'Email', 'Envio de cotizacion impresa', 'Pendiente de respuesta', -4, 2),
    ('demo.innovacion.mx@demo.el-diario.local', 'juan.garcia@diario.com', 'Llamada', 'Primer contacto con la empresa', 'Acepto recibir el tarifario', -1, 4)
) AS demo(email_prospecto, email_empleado, tipo_accion, descripcion, resultado, dias_desde_hoy, dias_proxima_accion)
JOIN public.prospectos AS prospecto ON prospecto.email_contacto = demo.email_prospecto
JOIN public.empleados AS empleado ON empleado.email = demo.email_empleado
WHERE NOT EXISTS (
  SELECT 1
  FROM public.seguimiento AS existente
  WHERE existente.descripcion = demo.descripcion
    AND existente.id_prospecto = prospecto.id
);

-- ============================================================
-- 6. PENDIENTES
-- ============================================================

INSERT INTO public.pendientes (
  id_empleado,
  id_prospecto,
  id_contrato,
  titulo,
  descripcion,
  prioridad,
  completado,
  fecha_limite
)
SELECT
  empleado.id,
  prospecto.id,
  contrato.id,
  demo.titulo,
  demo.descripcion,
  demo.prioridad,
  FALSE,
  CURRENT_DATE + demo.dias_limite
FROM (
  VALUES
    ('adriana.mata@diario.com', 'demo.grupo.horizonte@demo.el-diario.local', 'Enviar propuesta radio Grupo Horizonte', 'Preparar propuesta con 12 spots por semana', 'Alta', 2),
    ('anet.ramirez@diario.com', 'demo.colegio.valle@demo.el-diario.local', 'Confirmar reunion Colegio del Valle', 'Llamar para confirmar horario de la reunion', 'Media', 3),
    ('vanesa.martinez@diario.com', 'demo.muebles.roble@demo.el-diario.local', 'Actualizar cotizacion Muebles Roble', 'Aplicar medidas solicitadas por el cliente', 'Alta', 1),
    ('camila.carvajal@diario.com', 'demo.transportes.norte@demo.el-diario.local', 'Dar seguimiento a propuesta', 'Confirmar si el cliente acepta la campana', 'Media', 4),
    ('juan.garcia@diario.com', 'demo.innovacion.mx@demo.el-diario.local', 'Enviar tarifario Innovacion MX', 'Enviar opciones de radio y periodico', 'Baja', 5)
) AS demo(email_empleado, email_prospecto, titulo, descripcion, prioridad, dias_limite)
JOIN public.empleados AS empleado ON empleado.email = demo.email_empleado
JOIN public.prospectos AS prospecto ON prospecto.email_contacto = demo.email_prospecto
LEFT JOIN public.contratos AS contrato ON contrato.id_prospecto = prospecto.id AND contrato.observaciones LIKE 'DEMO_SEED%'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.pendientes AS existente
  WHERE existente.titulo = demo.titulo
    AND existente.id_empleado = empleado.id
);

-- ============================================================
-- 7. ACTIVIDAD LOG
-- ============================================================

INSERT INTO public.actividad_log (id_empleado, tipo_actividad, descripcion, fecha_hora)
SELECT
  empleado.id,
  'Demo seed',
  demo.descripcion,
  NOW() + (demo.dias_desde_hoy || ' days')::interval
FROM (
  VALUES
    ('adriana.mata@diario.com', 'DEMO_SEED - Registro de prospecto y contrato para Cafe Norte', -6),
    ('anet.ramirez@diario.com', 'DEMO_SEED - Registro de contrato de radio para Colegio del Valle', -1),
    ('vanesa.martinez@diario.com', 'DEMO_SEED - Seguimiento comercial de Muebles Roble', -3),
    ('camila.carvajal@diario.com', 'DEMO_SEED - Cotizacion de Transportes del Norte', -4),
    ('juan.garcia@diario.com', 'DEMO_SEED - Primer contacto con Innovacion MX', -1)
) AS demo(email_empleado, descripcion, dias_desde_hoy)
JOIN public.empleados AS empleado ON empleado.email = demo.email_empleado
WHERE NOT EXISTS (
  SELECT 1
  FROM public.actividad_log AS existente
  WHERE existente.descripcion = demo.descripcion
);

COMMIT;

-- Consultas de verificacion opcionales:
-- SELECT estado, COUNT(*) FROM public.prospectos GROUP BY estado ORDER BY estado;
-- SELECT estado, COUNT(*) FROM public.contratos GROUP BY estado ORDER BY estado;
-- SELECT COUNT(*) AS contratos_demo FROM public.contratos WHERE observaciones LIKE 'DEMO_SEED%';
-- SELECT COUNT(*) AS detalles_demo FROM public.contrato_detalles d JOIN public.contratos c ON c.id = d.id_contrato WHERE c.observaciones LIKE 'DEMO_SEED%';
-- SELECT COUNT(*) AS agenda_demo FROM public.agenda_eventos WHERE titulo LIKE '%DEMO%' OR descripcion LIKE '%DEMO%';
