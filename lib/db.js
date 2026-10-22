const { readJson, writeJson } = require("@/analyzer/store");
const { BRAND } = require("@/analyzer/config");

let neonClient = null;

function getNeon() {
  if (!process.env.DATABASE_URL) return null;
  if (neonClient === null) {
    const { neon } = require("@neondatabase/serverless");
    neonClient = neon(process.env.DATABASE_URL);
  }
  return neonClient;
}

/** Notable: when PostgreSQL fails and jsonFallback is allowed,
 * falls back to data/*.json (also mirrored with writes). */

async function withFallback(fn, jsonFn) {
  try {
    return await fn();
  } catch (err) {
    if (jsonFn) {
      console.error("[db] neon failed -> json fallback:", err.message || err);
      return jsonFn(err);
    }
    throw err;
  }
}

async function checkMode() {
  try {
    await getNeon()`select 1`;
    return "neon";
  } catch {
    return "json-fallback";
  }
}

function toSnapshotShape(row) {
  const payload = row.payload || {};
  return {
    id: row.id,
    queryId: row.query_id,
    keyword: payload.keyword ?? "",
    country: payload.country ?? null,
    tag: payload.tag ?? null,
    day: row.day instanceof Date ? row.day.toISOString().slice(0, 10) : String(row.day).slice(0, 10),
    source: row.source,
    hasAio: row.has_aio,
    mentionsBrand: row.mentioned,
    brandCited: row.brand_cited,
    citedDomains: payload.citedDomains ?? [],
    aio: payload.aio ?? null,
    organic: payload.organic ?? [],
    ourOrganicPosition: row.our_organic_position,
    topDomain: row.top_domain,
  };
}

async function listQueries(ownerId = null) {
  return withFallback(
    async () => {
      const rows = ownerId
        ? await getNeon()`select id, keyword, country, tag from queries where owner_id = ${ownerId} and is_active order by created_at`
        : await getNeon()`select id, keyword, country, tag from queries where is_active order by created_at`;
      return rows.map((r) => ({ id: r.id, keyword: r.keyword, country: r.country, tag: r.tag }));
    },
    () => readJson("queries.json", []) ?? [],
  );
}

async function listSnapshots(ownerId = null) {
  return withFallback(
    async () => {
      const rows = ownerId
        ? await getNeon()`
            select s.* from snapshots s
            join queries q on q.id = s.query_id
            where q.owner_id = ${ownerId}
            order by s.day desc, s.query_id`
        : await getNeon()`select * from snapshots order by day desc, query_id`;
      return rows.map(toSnapshotShape);
    },
    () => readJson("snapshots.json", []),
  );
}

async function insertQuery({ id, keyword, country = "US", tag = "Comparison", ownerId = null }) {
  return withFallback(
    async () => {
      await getNeon()`
        insert into queries (id, keyword, country, tag, owner_id)
        values (${id}, ${keyword}, ${country}, ${tag}, ${ownerId})
        on conflict (id) do nothing`;
    },
    () => {
      const queries = readJson("queries.json", []);
      if (!queries.some((x) => x.id === id)) {
        queries.push({ id, keyword, country, tag });
        writeJson("queries.json", queries);
      }
    },
  );
}

async function deleteQuery(id) {
  return withFallback(
    async () => {
      await getNeon()`update queries set is_active = false where id = ${id}`;
    },
    () => {
      const queries = readJson("queries.json", []).filter((x) => x.id !== id);
      writeJson("queries.json", queries);
    },
  );
}

async function upsertSnapshot(snapshot) {
  const payload = {
    keyword: snapshot.keyword,
    country: snapshot.country,
    tag: snapshot.tag,
    citedDomains: snapshot.citedDomains,
    aio: snapshot.aio,
    organic: snapshot.organic,
  };
  await getNeon()`
    insert into snapshots (id, query_id, day, source, has_aio, mentioned, brand_cited, our_organic_position, top_domain, payload)
    values (${snapshot.id}, ${snapshot.queryId}, ${snapshot.day}, ${snapshot.source}, ${snapshot.hasAio},
            ${snapshot.mentionsBrand}, ${snapshot.brandCited}, ${snapshot.ourOrganicPosition},
            ${snapshot.topDomain}, ${JSON.stringify(payload)}::jsonb)
    on conflict (id) do update set
      source = excluded.source,
      has_aio = excluded.has_aio,
      mentioned = excluded.mentioned,
      brand_cited = excluded.brand_cited,
      our_organic_position = excluded.our_organic_position,
      top_domain = excluded.top_domain,
      payload = excluded.payload`;
}

async function upsertQuery({ id, keyword, country = "US", tag = "Comparison", ownerId = null }) {
  return withFallback(
    async () => {
      await getNeon()`
        insert into queries (id, keyword, country, tag, owner_id)
        values (${id}, ${keyword}, ${country}, ${tag}, ${ownerId})
        on conflict (id) do update set keyword = excluded.keyword, country = excluded.country, tag = excluded.tag`;
    },
    () => {},
  );
}

/** First real user claims previously unowned rows (single-tenant bootstrap). */
async function claimQueries(ownerId) {
  if (!ownerId) return
  return withFallback(
    async () => {
      await getNeon()`
        update queries set owner_id = ${ownerId}
        where (owner_id is null or owner_id = '')
        and not exists (select 1 from queries where owner_id is not null and owner_id <> '')`;
    },
    () => {},
  );
}

module.exports = {
  listQueries,
  listSnapshots,
  insertQuery,
  upsertQuery,
  deleteQuery,
  upsertSnapshot,
  claimQueries,
  checkMode,
  BRAND,
};
