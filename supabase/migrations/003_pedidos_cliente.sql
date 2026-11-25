CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.pedidos_cliente (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  folio TEXT NOT NULL UNIQUE DEFAULT ('ED-' || upper(substr(replace(extensions.gen_random_uuid()::text, '-', ''), 1, 8))),
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_token_hash TEXT NOT NULL,
  items JSONB NOT NULL CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) > 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  iva NUMERIC(12, 2) NOT NULL CHECK (iva >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  metodo_pago TEXT NOT NULL,
  facturacion JSONB NOT NULL DEFAULT '{}'::jsonb,
  notas TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'En revisión'
    CHECK (estado IN ('En revisión', 'Pagado', 'Publicado', 'Cancelado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_created_at
  ON public.pedidos_cliente (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_email
  ON public.pedidos_cliente (lower(cliente_email));

ALTER TABLE public.pedidos_cliente ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pedidos_cliente_select_gerente ON public.pedidos_cliente;
CREATE POLICY pedidos_cliente_select_gerente
  ON public.pedidos_cliente FOR SELECT TO authenticated
  USING (public.es_gerente_o_administrador());

REVOKE ALL ON public.pedidos_cliente FROM anon, authenticated;
GRANT SELECT ON public.pedidos_cliente TO authenticated;

CREATE OR REPLACE FUNCTION public.crear_pedido_cliente(p_token TEXT, p_pedido JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_pedido public.pedidos_cliente;
BEGIN
  IF p_token IS NULL OR length(p_token) < 32 OR length(p_token) > 200 THEN
    RAISE EXCEPTION 'Token de cliente invalido.';
  END IF;
  IF jsonb_typeof(p_pedido->'items') IS DISTINCT FROM 'array'
     OR jsonb_array_length(COALESCE(p_pedido->'items', '[]'::jsonb)) = 0 THEN
    RAISE EXCEPTION 'El pedido debe incluir al menos un producto.';
  END IF;
  IF NULLIF(trim(p_pedido->>'cliente_nombre'), '') IS NULL
     OR NULLIF(trim(p_pedido->>'cliente_email'), '') IS NULL THEN
    RAISE EXCEPTION 'Faltan los datos de contacto del cliente.';
  END IF;

  INSERT INTO public.pedidos_cliente (
    cliente_nombre, cliente_email, cliente_token_hash, items,
    subtotal, iva, total, metodo_pago, facturacion, notas, estado
  ) VALUES (
    trim(p_pedido->>'cliente_nombre'),
    lower(trim(p_pedido->>'cliente_email')),
    encode(extensions.digest(p_token, 'sha256'), 'hex'),
    p_pedido->'items',
    (p_pedido->>'subtotal')::numeric,
    (p_pedido->>'iva')::numeric,
    (p_pedido->>'total')::numeric,
    COALESCE(NULLIF(trim(p_pedido->>'metodo_pago'), ''), 'Por confirmar'),
    COALESCE(p_pedido->'facturacion', '{}'::jsonb),
    COALESCE(p_pedido->>'notas', ''),
    'En revisión'
  ) RETURNING * INTO v_pedido;

  RETURN jsonb_build_object(
    'id', v_pedido.id,
    'folio', v_pedido.folio,
    'created_at', v_pedido.created_at,
    'items', v_pedido.items,
    'subtotal', v_pedido.subtotal,
    'iva', v_pedido.iva,
    'total', v_pedido.total,
    'metodo_pago', v_pedido.metodo_pago,
    'facturacion', v_pedido.facturacion,
    'notas', v_pedido.notas,
    'estado', v_pedido.estado
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.listar_mis_pedidos_cliente(p_token TEXT)
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'folio', p.folio,
        'created_at', p.created_at,
        'items', p.items,
        'subtotal', p.subtotal,
        'iva', p.iva,
        'total', p.total,
        'metodo_pago', p.metodo_pago,
        'facturacion', p.facturacion,
        'notas', p.notas,
        'estado', p.estado
      ) ORDER BY p.created_at DESC
    ),
    '[]'::jsonb
  )
  FROM public.pedidos_cliente AS p
  WHERE p_token IS NOT NULL
    AND length(p_token) BETWEEN 32 AND 200
    AND p.cliente_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');
$$;

REVOKE ALL ON FUNCTION public.crear_pedido_cliente(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.listar_mis_pedidos_cliente(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_pedido_cliente(TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.listar_mis_pedidos_cliente(TEXT) TO anon, authenticated;
