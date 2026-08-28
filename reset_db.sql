-- 1. Eliminar los números del 51 en adelante (ya que ahora la rifa es solo de 1 a 50)
DELETE FROM public.tickets WHERE id > 50;

-- 2. Reiniciar todos los números restantes a su estado original (blanco)
UPDATE public.tickets 
SET 
  status = 'disponible', 
  reserved_at = NULL, 
  buyer_name = NULL, 
  buyer_phone = NULL;
