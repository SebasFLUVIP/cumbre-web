-- ═══════════════════════════════════════════════════════════════════════════
--  Esquema de Cumbre para Supabase
--  Correr una sola vez en: Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Los campos que se consultan o filtran van como columnas; el resto del objeto
-- viaja en `data` como JSONB. Así el tipo de TypeScript sigue siendo la única
-- fuente de verdad de la forma del producto y no hay que migrar la tabla cada
-- vez que se agrega un campo a la ficha.

create table if not exists products (
  id          text primary key,
  slug        text        not null unique,
  category    text        not null,
  active      boolean     not null default true,
  price_cop   integer     not null,
  data        jsonb       not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists products_category_idx on products (category) where active;

create table if not exists orders (
  id          text primary key,
  reference   text        not null unique,
  status      text        not null,
  total_cop   integer     not null,
  data        jsonb       not null,
  created_at  timestamptz not null default now()
);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists leads (
  id          text primary key,
  status      text        not null,
  data        jsonb       not null,
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_idx on leads (created_at desc);

create table if not exists settings (
  id   smallint primary key default 1,
  data jsonb    not null,
  constraint settings_single_row check (id = 1)
);

-- ── Seguridad ──────────────────────────────────────────────────────────────
-- RLS activo y sin políticas: nadie llega desde el navegador. Todo el acceso
-- pasa por el servidor de Next con la service role key, que salta RLS.
-- Si alguna vez se expone la llave anónima al cliente, estas tablas quedan
-- cerradas igual.
alter table products enable row level security;
alter table orders   enable row level security;
alter table leads    enable row level security;
alter table settings enable row level security;
