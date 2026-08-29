-- 1. Eliminar los números mayores a 99 (ya que ahora la rifa es del 0 al 99)
DELETE FROM public.tickets WHERE id > 99;

-- 2. Reiniciar todos los números restantes a su estado original (blanco)
UPDATE public.tickets 
SET 
  status = 'disponible', 
  reserved_at = NULL, 
  buyer_name = NULL, 
  buyer_phone = NULL;
