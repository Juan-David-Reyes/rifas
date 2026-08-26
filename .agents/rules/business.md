---
trigger: always_on
---

Contexto del Proyecto: Rifa para Bombillo
Objetivo: Crear una plataforma web ultra rápida y segura para vender 200 números de una rifa (del 1 al 200) para cubrir los gastos de la cirugía de un gato llamado Bombillo. El premio es de $300.000 COP.
Prioridad: Excelente UX (intuitiva, clara) y prevención de selección duplicada de números (concurrencia).

Stack Tecnológico
Frontend: React + Vite + Tailwind CSS v4.

Backend / Base de datos: Supabase (PostgreSQL con Realtime habilitado).

Librerías extra: date-fns (para manejar tiempos), @supabase/supabase-js.

Lógica de Negocio y Flujo (El Acuerdo)
Se implementó un sistema de "Evaluación Perezosa" (Lazy Evaluation) para manejar las reservas sin necesidad de usar cron jobs en la base de datos:

Estados del Número:

disponible (Blanco).

reservado (Amarillo): Bloqueado temporalmente por 15 minutos mientras el usuario paga.

comprado (Gris): Pago confirmado, bloqueado permanentemente.

Flujo del Usuario:

El usuario selecciona números en la grilla (TicketGrid).

Aparece una Sticky Bar en la parte inferior con el total y un botón "Reservar y Pagar".

Al hacer clic, se abrirá un Modal de Checkout (Paso pendiente a desarrollar).

En este Modal, el sistema actualiza Supabase poniendo el estado en reservado con un reserved_at (timestamp actual). Se muestra un contador visual de 15 minutos y los datos bancarios (Nequi/Daviplata).

Si el usuario transfiere, hace clic en "Enviar comprobante", lo que abre WhatsApp con un mensaje pre-armado.

El administrador verifica el pago manualmente y cambia el estado a comprado.

Auto-liberación: Si el usuario no paga y pasan 15 minutos, el frontend calcula la diferencia de tiempo con date-fns y vuelve a pintar el número como disponible para que otra persona lo pueda tomar.