import db from "@/lib/db"
import { BRAND } from "@/analyzer/config"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

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

  const days = [...new Set(snapshots.map(s => s.day))].sort()
  const latest = days[days.length - 1] ?? null

  // URLs cited for our domain across all days
  const pageStats = {}
  const domainStats = {}
  const domainsByDay = {}
  for (const s of snapshots) {
    (domainsByDay[s.day] ??= new Set())
    const raw = (s.aio?.sources ?? []).filter(x => x?.domain || x?.link)
    const rawDomains = new Set(raw.map(x => x.domain ?? null).filter(Boolean))
    const sources = raw.map(x => ({ domain: x.domain ?? null, link: x.link ?? null, title: x.title ?? null }))
      .concat((s.citedDomains ?? []).filter(Boolean).filter(d => !rawDomains.has(d)).map(d => ({ domain: d, link: null, title: null })))
    for (const src of sources) {
      if (!src?.link && !src?.domain) continue
      domainsByDay[s.day].add(src.domain)
      const st = domainStats[src.domain] ?? (domainStats[src.domain] = { count: 0 })
      st.count++
      if (src.domain === BRAND.domain && src.link) {
        const p = pageStats[src.link] ?? (pageStats[src.link] = { count: 0, first: s.day, last: s.day, latest: false, title: src.title ?? "" })
        p.count++
        if (p.first > s.day) p.first = s.day
        if (p.last < s.day) { p.last = s.day; p.latest = false }
        if (s.day === latest) p.latest = true
        if (!p.title && src.title) p.title = src.title
      }
    }
  }

  const thirdParty = Object.entries(domainStats)
    .filter(([d]) => d !== BRAND.domain)
    .map(([domain, st]) => ({ domain, count: st.count }))
    .sort((a, b) => b.count - a.count)
  const totalCitations = Object.values(domainStats).reduce((a, s) => a + s.count, 0)
  for (const t of thirdParty) t.pct = totalCitations ? Math.round((t.count / totalCitations) * 100) : 0

  const citedPages = Object.entries(pageStats)
    .map(([link, p]) => ({ link, title: p.title, times: p.count, first: p.first, last: p.last, state: p.latest ? "active" : "lost" }))
    .sort((a, b) => b.times - a.times || b.last.localeCompare(a.last))

  const latestDomains = domainsByDay[latest] ?? new Set()
  const everSeen = new Set(Object.keys(domainsByDay).filter(d => d !== latest).flatMap(d => [...(domainsByDay[d] ?? [])]))
  const lostCount = [...everSeen].filter(d => !latestDomains.has(d)).length

  return Response.json({
    day: latest,
    snapshotsCount: snapshots.length,
    allCitations: totalCitations,
    uniquePages: citedPages.length,
    uniqueDomains: thirdParty.length + (domainStats[BRAND.domain] ? 1 : 0),
    lostCitations: lostCount,
    hasPrev: days.length > 1,
    thirdParty,
    citedPages,
  })
}
