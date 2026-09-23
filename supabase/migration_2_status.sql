-- ============================================================
-- POLUX — Migración #2: estado de las consultas
-- Pegar y ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

alter table public.leads
  add column status text not null default 'pendiente' check (status in ('pendiente', 'resuelta'));

create policy "Solo los admins actualizan las consultas"
  on public.leads for update
  using (public.is_admin());
