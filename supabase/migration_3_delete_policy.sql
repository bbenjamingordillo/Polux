-- ============================================================
-- POLUX — Migración #3: permitir borrar consultas resueltas
-- Pegar y ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

create policy "Solo los admins eliminan las consultas"
  on public.leads for delete
  using (public.is_admin());
