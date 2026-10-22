-- AIO Radar — Neon (aio_radar)
create table if not exists queries (
  id text primary key,
  owner_id text not null default '',
  keyword text not null,
  country text not null default 'US',
  tag text not null default 'Comparison',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists queries_owner_idx on queries (owner_id);

create table if not exists snapshots (
  id text primary key,
  query_id text not null references queries(id) on delete cascade,
  day date not null,
  source text not null,
  has_aio boolean not null default false,
  mentioned boolean not null default false,
  brand_cited boolean not null default false,
  our_organic_position integer,
  top_domain text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (query_id, day)
);
create index if not exists snapshots_query_day_idx on snapshots (query_id, day desc);
create index if not exists snapshots_day_idx on snapshots (day desc);

create table if not exists alerts (
  id text primary key,
  keyword text not null default '',
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists alerts_created_idx on alerts (created_at desc);
