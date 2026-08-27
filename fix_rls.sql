-- Eliminar la política anterior
DROP POLICY IF EXISTS "Publico puede reservar" ON public.tickets;

-- Crear la política corregida que permite tanto reservar como liberar
CREATE POLICY "Publico puede reservar y liberar"
ON public.tickets
FOR UPDATE
USING (true)
WITH CHECK (
  auth.role() = 'anon' AND 
  (status = 'reservado' OR status = 'disponible') AND 
  buyer_name IS NULL AND 
  buyer_phone IS NULL
);
