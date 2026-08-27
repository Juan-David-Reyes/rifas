-- 1. Añadir columnas opcionales de contacto
ALTER TABLE public.tickets
ADD COLUMN buyer_name text,
ADD COLUMN buyer_phone text;

-- 2. Actualizar las Políticas de Seguridad (RLS)

-- Primero, eliminamos la política anterior que permitía todo
DROP POLICY IF EXISTS "Permitir reserva publica" ON public.tickets;

-- Política 1: Público general solo puede cambiar de 'disponible' a 'reservado'
CREATE POLICY "Publico puede reservar"
ON public.tickets
FOR UPDATE
USING (true)
WITH CHECK (
  auth.role() = 'anon' AND 
  status = 'reservado' AND 
  buyer_name IS NULL AND 
  buyer_phone IS NULL
);

-- Política 2: Administrador (autenticado) puede hacer cualquier cambio (aprobar, liberar, guardar info)
CREATE POLICY "Admin tiene control total"
ON public.tickets
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Política 3: Todos pueden leer (igual que antes, si no existía, asegúrate de crearla)
CREATE POLICY "Todos pueden leer"
ON public.tickets
FOR SELECT
USING (true);
