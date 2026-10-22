const { readJson, writeJson } = require("@/analyzer/store");
const { fetchSerp, isMockMode } = require("@/analyzer/hasdata");
const { parseSnapshot } = require("@/analyzer/extract");
const db = require("@/lib/db");

const SEED_QUERIES = [
  { id: "q1", keyword: "best CRM for real estate agencies", country: "US", tag: "Comparison" },
  { id: "q2", keyword: "CRM alternatives to HubSpot", country: "US", tag: "Comparison" },
  { id: "q3", keyword: "how to automate client follow-ups", country: "CA", tag: "Question" },
  { id: "q4", keyword: "affordable CRM for small teams", country: "US", tag: "Feature" },
  { id: "q5", keyword: "yourbrand pricing", country: "FR", tag: "Brand" },
  { id: "q6", keyword: "yourbrand vs rivalcrm", country: "FR", tag: "Brand" },
  { id: "q7", keyword: "what does a CRM cost per month", country: "CA", tag: "Question" },
  { id: "q8", keyword: "best CRM integrations with WhatsApp", country: "GB", tag: "Feature" },
  { id: "q9", keyword: "mermaid chart generator reviews", country: "GB", tag: "Comparison" },
]

function jsonQueries(fallback = null) {
  let queries = readJson("queries.json", null)
  if (!queries && fallback) {
    writeJson("queries.json", fallback)
    queries = fallback
  }
  return queries
}

async function getQueries(ownerId = null) {
  try {
    let rows = await db.listQueries(ownerId)
    if (!rows.length && ownerId) {
      await db.claimQueries(ownerId)
      rows = await db.listQueries(ownerId)
    }
    if (rows.length) return rows
    const seed = readJson("queries.json", null) ?? SEED_QUERIES
    for (const s of seed) await db.insertQuery(s)
    return await db.listQueries(ownerId)
  } catch (err) {
    console.error("[collector] getQueries neon failed -> json fallback:", err.message || err)
    return jsonQueries(SEED_QUERIES) ?? []
  }
}

async function addQuery(keyword, { country = "US", tag = "Comparison" } = {}, ownerId = null) {
  const id = `q${Date.now()}`
  try {
    await db.insertQuery({ id, keyword, country, tag, ownerId })
  } catch (err) {
    console.error("[collector] addQuery neon failed -> json fallback:", err.message || err)
  }
  return getQueries(ownerId)
}

async function removeQuery(id, ownerId = null) {
  try {
    await db.deleteQuery(id)
  } catch (err) {
    console.error("[collector] removeQuery neon failed -> json fallback:", err.message || err)
  }
  try {
    const queries = readJson("queries.json", []).filter((x) => x.id !== id)
    writeJson("queries.json", queries)
  } catch {}
  return getQueries(ownerId)
}

/** Mirror JSON fallback (data/snapshots.json) in coherence with Neon. */
async function mirrorSnapshots(incoming) {
  let snapshots = readJson("snapshots.json", [])
  const seen = new Set(incoming.map((s) => s.id))
  snapshots = snapshots.filter(
    (s) => !(seen.has(s.id) || (s.source !== "error" && incoming.some((i) => i.queryId === s.queryId && i.day === s.day && s.source !== "error"))),
  )
  snapshots.push(...incoming)
  const deduped = []
  const dedupKeys = new Set()
  for (const s of snapshots.reverse()) {
    const key = `${s.queryId}-${s.day}`
    if (dedupKeys.has(key)) continue
    dedupKeys.add(key)
    deduped.push(s)
  }
  writeJson("snapshots.json", deduped.reverse())
}

async function collect(ownerId = null) {
  const queries = await getQueries(ownerId)
  const day = new Date().toISOString().slice(0, 10)
  const mode = isMockMode() ? "mock" : "live"
  const incoming = []
  let storeMode = "neon"

  try {
    storeMode = await db.checkMode()
  } catch {
    storeMode = "json-fallback"
  }

  for (const q of queries) {
    try {
      const { source, data } = await fetchSerp(q.keyword)
      const snapshot = parseSnapshot({ ...q, day, source }, data)
      incoming.push(snapshot)
      try {
        await db.upsertSnapshot(snapshot)
      } catch (err) {
        storeMode = storeMode === "neon" ? "json-fallback" : storeMode
        console.error("[collector] upsertSnapshot neon failed:", err.message || err)
      }
    } catch (err) {
      incoming.push({
        id: `${q.id}-${day}`,
        queryId: q.id,
        keyword: q.keyword,
        day,
        source: "error",
        error: String(err.message || err),
      })
    }
  }

  try {
    await mirrorSnapshots(incoming)
  } catch (err) {
    console.error("[collector] json mirror failed:", err.message || err)
  }

  return { day, mode, storeMode, collected: queries.length }
}

module.exports = { SEED_QUERIES, getQueries, addQuery, removeQuery, collect }
