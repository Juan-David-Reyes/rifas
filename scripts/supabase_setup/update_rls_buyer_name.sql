-- 1. Eliminar la política actual que restringe modificar el nombre
DROP POLICY IF EXISTS "Publico puede reservar y liberar" ON public.tickets;

-- 2. Crear la nueva política que permite guardar el nombre del comprador
CREATE POLICY "Publico puede reservar y liberar"
ON public.tickets
FOR UPDATE
USING (true)
WITH CHECK (
  auth.role() = 'anon' AND 
  (status = 'reservado' OR status = 'disponible')
);
