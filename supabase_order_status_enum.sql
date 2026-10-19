-- ==============================================================================
-- SON CANEY - ESTADO DE PEDIDOS (CAMPO SELECCIONABLE / DROPDOWN)
-- ==============================================================================
-- Este script crea el campo de selección con las opciones exactas del tracking:
--   1. confirmed -> Paso 1: Pedido confirmado
--   2. preparing -> Paso 2: En cocina (Preparing 🔥)
--   3. ready     -> Paso 3: Listo para reparto / recogida (Ready 🛵)
--   4. delivered -> Paso 4: Entregado / Completado (Completed ✅)
--   (y cancelled para pedidos cancelados)
-- ==============================================================================

-- 1. Eliminar la restricción antigua que causaba conflicto
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- 2. Quitar el valor por defecto anterior
ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;

-- 3. Crear el tipo de selección (ENUM) con las opciones exactas
DROP TYPE IF EXISTS public.order_status CASCADE;

CREATE TYPE public.order_status AS ENUM (
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'picked_up',
  'cancelled'
);

-- 4. Convertir la columna al nuevo campo de selección
ALTER TABLE public.orders 
  ALTER COLUMN status TYPE public.order_status 
  USING (
    CASE 
      WHEN status IN ('confirmed', 'preparing', 'ready', 'delivered', 'picked_up', 'cancelled') 
        THEN status::public.order_status
      ELSE 'confirmed'::public.order_status
    END
  );

-- 5. Establecer 'confirmed' como valor por defecto al entrar un pedido
ALTER TABLE public.orders 
  ALTER COLUMN status SET DEFAULT 'confirmed'::public.order_status;

-- 6. Asegurar permisos para que cocina y clientes puedan actualizar y ver el estado
DROP POLICY IF EXISTS "Public can update order status" ON public.orders;
CREATE POLICY "Public can update order status" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
