DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 0..99 LOOP
        IF NOT EXISTS (SELECT 1 FROM public.tickets WHERE id = i) THEN
            INSERT INTO public.tickets (id, status) VALUES (i, 'disponible');
        END IF;
    END LOOP;
END $$;
