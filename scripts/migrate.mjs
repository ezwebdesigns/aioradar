import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const sql = neon(process.env.DATABASE_URL || "");
const DATA = path.join(process.cwd(), "data");

const TABLES = [
  `create table if not exists queries (
  id text primary key,
  owner_id text not null default '',
  keyword text not null,
  country text not null default 'US',
  tag text not null default 'Comparison',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
)`,
  `create index if not exists queries_owner_idx on queries (owner_id)`,
  `create table if not exists snapshots (
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
)`,
  `create index if not exists snapshots_query_day_idx on snapshots (query_id, day desc)`,
  `create index if not exists snapshots_day_idx on snapshots (day desc)`,
  `create table if not exists alerts (
  id text primary key,
  keyword text not null default '',
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
)`,
  `create index if not exists alerts_created_idx on alerts (created_at desc)`,
];

const q1 = [
  "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9",
];

async function importQueries() {
  const queries = JSON.parse(fs.readFileSync(path.join(DATA, "queries.json"), "utf8"));
  for (const row of queries) {
    await sql`
      insert into queries (id, keyword, country, tag) values (${row.id}, ${row.keyword}, ${row.country}, ${row.tag})
      on conflict (id) do update set keyword = excluded.keyword, country = excluded.country, tag = excluded.tag`;
  }
  console.log(`[seed] queries inserted: ${queries.map((row) => q1.includes(row.id) ? "-" : row.id).join(",")}`);
}

async function importSnapshots() {
  const snapshots = JSON.parse(fs.readFileSync(path.join(DATA, "snapshots.json"), "utf8"));
  for (const snap of snapshots) {
    const payload = {
      keyword: snap.keyword,
      country: snap.country,
      tag: snap.tag,
      citedDomains: snap.citedDomains,
      aio: snap.aio,
      organic: snap.organic,
    };
    if (!snap.hasAio) payload.citedDomains = [];
    const queryId = snap.queryId;
    const day = snap.day;
    if (!q1.includes(queryId)) {
      console.log(`[migrate] skipping snapshot for unknown query_id=${queryId}`);
      continue;
    }
    await sql`
      insert into snapshots (id, query_id, day, source, has_aio, mentioned, brand_cited, our_organic_position, top_domain, payload)
      values (${snap.id}, ${queryId}, ${day}, ${snap.source}, ${snap.hasAio}, ${snap.mentionsBrand},
              ${snap.brandCited}, ${snap.ourOrganicPosition}, ${snap.topDomain}, ${JSON.stringify(payload)}::jsonb)
      on conflict (id) do update set
        source = excluded.source, has_aio = excluded.has_aio,
        mentioned = excluded.mentioned, brand_cited = excluded.brand_cited,
        our_organic_position = excluded.our_organic_position,
        top_domain = excluded.top_domain, payload = excluded.payload`;
  }
  console.log(`[migrate] snapshots exported: ${snapshots.length}`);
}

async function main() {
  for (const ddl of TABLES) await sql.query(ddl);
  await importQueries();
  await importSnapshots();
  const [{ count: qc }] = await sql`select count(*)::int as count from queries`;
  const [{ count: sc }] = await sql`select count(*)::int as count from snapshots`;
  console.log(`[db] final counts: queries=${qc}, snapshots=${sc}`);
}

main().catch((err) => {
  console.error("[db] migration failed:", err);
  process.exit(1);
});
