-- 1. Respaldar las tablas antiguas (para no perder la data histórica de Bombillo)
ALTER TABLE IF EXISTS tickets RENAME TO tickets_legacy;
ALTER TABLE IF EXISTS config RENAME TO config_legacy;

-- 2. Crear tabla de Rifas (Raffles)
CREATE TABLE raffles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL, -- El organizador de la rifa
  slug TEXT UNIQUE NOT NULL, -- La URL de la rifa (ej. 'miprimerarifa')
  title TEXT NOT NULL,
  description TEXT,
  prize TEXT,
  lottery_name TEXT,
  draw_date TEXT,
  winner_ticket_id INT,
  ticket_price INT DEFAULT 10000,
  total_tickets INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear nueva tabla de Tickets (relacionada a la Rifa)
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id UUID REFERENCES raffles ON DELETE CASCADE NOT NULL,
  ticket_number INT NOT NULL,
  status TEXT DEFAULT 'disponible',
  buyer_name TEXT,
  buyer_phone TEXT,
  reserved_at TIMESTAMPTZ,
  UNIQUE(raffle_id, ticket_number) -- Un número no puede repetirse en la misma rifa
);

-- 4. Habilitar Seguridad de Nivel de Fila (RLS)
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Seguridad (Raffles)
-- Todo el mundo puede ver las rifas (Página pública)
CREATE POLICY "Public raffles are viewable by everyone" ON raffles FOR SELECT USING (true);
-- Solo los usuarios logueados pueden crear sus rifas
CREATE POLICY "Users can create raffles" ON raffles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Solo el dueño puede modificar su propia rifa (Configuración)
CREATE POLICY "Users can update own raffles" ON raffles FOR UPDATE USING (auth.uid() = user_id);

-- 6. Políticas de Seguridad (Tickets)
-- Todo el mundo puede ver los tickets
CREATE POLICY "Tickets are viewable by everyone" ON tickets FOR SELECT USING (true);
-- El dueño de la rifa puede insertar los 100 tickets iniciales
CREATE POLICY "Admin can insert tickets" ON tickets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM raffles WHERE id = tickets.raffle_id AND user_id = auth.uid())
);
-- El dueño de la rifa puede modificar cualquier ticket (ej. Aprobar pago)
CREATE POLICY "Admin can update all tickets" ON tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM raffles WHERE id = tickets.raffle_id AND user_id = auth.uid())
);
-- El público solo puede reservar tickets si están disponibles o si la reserva caducó
CREATE POLICY "Public can reserve tickets" ON tickets FOR UPDATE USING (
  status = 'disponible' OR status = 'reservado'
);
