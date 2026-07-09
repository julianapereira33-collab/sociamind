-- ============================================================
-- Social Mid IA — Schema Multi-Tenant SaaS
-- ============================================================

-- PLANS
create table if not exists public.plans (
  id          text primary key,                -- free | pro | business
  name        text not null,
  price_brl   integer not null default 0,      -- centavos
  price_usd   integer not null default 0,
  stripe_price_id text,
  features    jsonb not null default '[]',
  limits      jsonb not null default '{}',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.plans (id, name, price_brl, price_usd, features, limits) values
('free',     'Gratuito',   0,       0,     '["Scanner IA (3x/mês)","5 posts agendados","1 rede social","Geração de conteúdo básica"]',
             '{"scanner":3,"posts":5,"social_accounts":1,"campaigns":0,"team_members":1}'),
('pro',      'Pro',        9700,    1900,  '["Scanner IA ilimitado","Posts ilimitados","5 redes sociais","Campanhas WhatsApp","Aprovação via WhatsApp","Relatórios avançados"]',
             '{"scanner":-1,"posts":-1,"social_accounts":5,"campaigns":10,"team_members":3}'),
('business', 'Business',  19700,   3900,  '["Tudo do Pro","Redes ilimitadas","Campanhas ilimitadas","Multi-usuário","API access","Suporte prioritário","White-label"]',
             '{"scanner":-1,"posts":-1,"social_accounts":-1,"campaigns":-1,"team_members":10}')
on conflict (id) do nothing;

-- ORGANIZATIONS (cada cliente = 1 org)
create table if not exists public.organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique,
  plan_id       text not null references public.plans(id) default 'free',
  stripe_customer_id   text unique,
  stripe_subscription_id text unique,
  subscription_status  text default 'inactive', -- active | trialing | past_due | canceled | inactive
  trial_ends_at  timestamptz,
  plan_expires_at timestamptz,
  data          jsonb not null default '{}',   -- form data (identidade, produtos, públicos, etc.)
  settings      jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- PROFILES (user <-> org)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  org_id      uuid references public.organizations(id) on delete set null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'owner',   -- owner | admin | member | viewer
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- CONTENT (posts, reels, stories agendados)
create table if not exists public.content_items (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  created_by  uuid references auth.users(id),
  tipo        text not null,
  plataforma  text not null,
  titulo      text,
  legenda     text,
  hook        text,
  hashtags    text,
  cta         text,
  sugestao_visual text,
  data        date,
  hora        time,
  status      text not null default 'Rascunho',
  publico_id  text,
  imagens     jsonb default '[]',
  meta        jsonb default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- CAMPAIGNS
create table if not exists public.campaigns (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  created_by  uuid references auth.users(id),
  nome        text not null,
  tipo        text not null default 'whatsapp',
  assunto     text,
  mensagem    text,
  publico     text default 'todos',
  agendada    boolean default false,
  data_envio  date,
  horario     time,
  status      text not null default 'rascunho',
  enviadas    integer default 0,
  abertas     integer default 0,
  cliques     integer default 0,
  created_at  timestamptz not null default now()
);

-- USAGE (controle de limites por plano)
create table if not exists public.usage (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  month       text not null,             -- YYYY-MM
  scanner_count integer default 0,
  posts_count   integer default 0,
  campaigns_count integer default 0,
  unique(org_id, month)
);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.campaigns enable row level security;
alter table public.usage enable row level security;
alter table public.plans enable row level security;

-- Plans: leitura pública
create policy "plans_read" on public.plans for select using (true);

-- Profiles: usuário vê/edita o próprio
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- Organizations: membros da org acessam
create policy "orgs_member" on public.organizations
  for all using (
    id in (select org_id from public.profiles where id = auth.uid())
  );

-- Content: membros da org
create policy "content_org" on public.content_items
  for all using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Campaigns: membros da org
create policy "campaigns_org" on public.campaigns
  for all using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Usage: membros da org
create policy "usage_org" on public.usage
  for all using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- ── TRIGGER: updated_at ──────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger orgs_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger content_updated_at before update on public.content_items
  for each row execute function public.set_updated_at();

-- ── FUNÇÃO: criar org + profile no signup ────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name, plan_id, data)
  values (
    coalesce(new.raw_user_meta_data->>'company_name', split_part(new.email,'@',1)),
    'free',
    '{}'
  )
  returning id into new_org_id;

  insert into public.profiles (id, org_id, full_name, role)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    'owner'
  );
  return new;
end $$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
