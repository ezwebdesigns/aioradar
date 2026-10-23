import db from "@/lib/db"
import { BRAND } from "@/analyzer/config"
const auth = { api: { getSession: async () => Promise.resolve(null) } }

export const dynamic = "force-dynamic"

const NAMES = {
  "yourbrand.com": "Your brand",
  "rivalcrm.com": "RivalCRM",
  "hubspot.com": "HubSpot",
  "zoho.com": "Zoho",
  "freshworks.com": "Freshworks",
  "pipedrive.com": "Pipedrive",
  "salesforce.com": "Salesforce",
}

export async function GET(req) {
  let ownerId = null
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    ownerId = session?.user?.id ?? null
  } catch {}

  let snapshots = await db.listSnapshots(ownerId)
  if (ownerId && snapshots.length === 0) {
    await db.claimQueries(ownerId)
    snapshots = await db.listSnapshots(ownerId)
  }
  const queries = await db.listQueries(ownerId)

  const days = [...new Set(snapshots.map(s => s.day))].sort()
  const stats = {}
  for (const s of snapshots) {
    for (const d of s.citedDomains) {
      const name = NAMES[d] ?? d
      const row = stats[name] ?? (stats[name] = { name, domain: d, citations: 0, mentions: 0, first: s.day, daysSeen: new Set(), competitor: name !== "Your brand" })
      row.citations++
      row.daysSeen.add(s.day)
      if (row.first > s.day) row.first = s.day
    }
    if (s.mentionsBrand) {
      const me = stats["Your brand"] ?? (stats["Your brand"] = { name: "Your brand", domain: BRAND.domain, citations: 0, mentions: 0, first: s.day, daysSeen: new Set(), competitor: false })
      me.mentions++
    }
  }

  const total = Object.values(stats).reduce((a, r) => a + r.citations, 0)
  const rows = Object.values(stats)
    .map(r => ({
      name: r.name,
      domain: r.domain,
      share: total ? Math.round((r.citations / total) * 100) : 0,
      citations: r.citations,
      mentions: r.mentions,
      first: r.first,
      move: r.daysSeen.size > 1 ? "gained" : "stable",
      competitor: r.competitor,
    }))
    .sort((a, b) => b.citations - a.citations)

  return Response.json({
    day: days[days.length - 1] ?? null,
    hasPrev: days.length > 1,
    totalCitations: total,
    queryCount: queries.length,
    snapshotCount: snapshots.length,
    rows,
  })
}
