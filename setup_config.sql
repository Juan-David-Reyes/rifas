-- 1. Crear tabla config
CREATE TABLE public.config (
  id boolean PRIMARY KEY DEFAULT TRUE,
  lottery_name text NOT NULL DEFAULT 'Lotería de Boyacá',
  draw_date text NOT NULL DEFAULT 'Por definir',
  CONSTRAINT config_single_row CHECK (id)
);

-- 2. Insertar el registro único por defecto
INSERT INTO public.config (id, lottery_name, draw_date)
VALUES (TRUE, 'Lotería de Boyacá', 'Por definir')
ON CONFLICT (id) DO NOTHING;

-- 3. Habilitar RLS
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- 4. Política: Todos pueden leer la configuración
CREATE POLICY "Publico puede leer config"
ON public.config
FOR SELECT
USING (true);

-- 5. Política: Solo administradores pueden modificar la configuración
CREATE POLICY "Admins pueden actualizar config"
ON public.config
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
