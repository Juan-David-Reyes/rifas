-- Agregar nuevas columnas a la tabla de configuración
ALTER TABLE public.config 
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '🐾 Gran Rifa para Bombillo',
ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT 'Bombillo está recuperándose de su cirugía y necesitamos tu ayuda para cubrir los gastos médicos.',
ADD COLUMN IF NOT EXISTS prize text NOT NULL DEFAULT '$300.000 COP',
ADD COLUMN IF NOT EXISTS winner_ticket_id integer DEFAULT NULL;
