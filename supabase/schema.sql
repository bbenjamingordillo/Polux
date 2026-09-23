-- ============================================================
-- POLUX — Esquema de base de datos (Supabase / Postgres)
-- Pegar y ejecutar esto una sola vez en:
--   Supabase → tu proyecto → SQL Editor → New query → Run
-- ============================================================

-- Perfiles de usuarios y administradores.
-- Se crea automáticamente uno por cada persona que se registra
-- (ver el trigger al final de este archivo).
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  brand text check (brand in ('gym', 'kine')),
  plan text,
  preferred_trainer text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Función auxiliar: evita la recursión infinita al chequear
-- "¿este usuario es admin?" dentro de las políticas de profiles.
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

create policy "Ver mi propio perfil"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Actualizar mi propio perfil"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Crea el perfil automáticamente cuando alguien se registra.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Consultas del formulario de contacto (antes se guardaban
-- solo en el navegador con localStorage; ahora quedan acá para
-- que el panel de admin las pueda ver).
-- ============================================================
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone text,
  email text,
  goal text,
  trainer text,
  message text,
  source text,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

create policy "Cualquiera puede enviar una consulta"
  on public.leads for insert
  with check (true);

create policy "Solo los admins ven las consultas"
  on public.leads for select
  using (public.is_admin());

-- ============================================================
-- Para convertir a alguien en administrador (hacelo vos mismo
-- una vez que esa persona ya se haya registrado en el sitio):
--
--   update public.profiles set role = 'admin' where email = 'tu@email.com';
-- ============================================================
