const { BRAND } = require("./config")
const { domainFor } = require("./mock-serp")

function parseSnapshot(query, serp) {
  const idx = serp.aiOverview
  const hasAio = Boolean(idx && (idx.textBlocks?.length || idx.references?.length))
  const references = (idx?.references ?? []).map((r) => ({
    domain: r.domain || domainFor(r.link),
    link: r.link || null,
    title: r.title || null,
  }))
  const citedDomains = [...new Set(references.map((r) => r.domain))]
  const text = (idx?.textBlocks ?? [])
    .map((b) => b.snippet || "")
    .join(" ")
  const mentionsBrand =
    hasAio && (text.toLowerCase().includes(BRAND.name.toLowerCase()) || citedDomains.includes(BRAND.domain))
  const brandCited = hasAio && citedDomains.includes(BRAND.domain)
  const organic = serp.organicResults ?? []
  const ourResult = organic.find((r) => (r.domain || domainFor(r.link)) === BRAND.domain)
  const competitorDomain = organic.find((r) => (r.domain || domainFor(r.link)) !== BRAND.domain)

  return {
    id: `${query.id}-${query.day}`,
    queryId: query.id,
    keyword: query.keyword,
    country: query.country,
    tag: query.tag,
    day: query.day,
    source: query.source,
    hasAio,
    mentionsBrand,
    brandCited,
    citedDomains,
    aio: hasAio
      ? {
          text,
          sources: references,
        }
      : null,
    organic: organic.slice(0, 10).map((r) => ({
      position: r.position,
      title: r.title || null,
      link: r.link || null,
      domain: r.domain || domainFor(r.link),
    })),
    ourOrganicPosition: ourResult ? ourResult.position : null,
    topDomain: competitorDomain ? (competitorDomain.domain || domainFor(competitorDomain.link)) : null,
  }
}

function computeMetrics(snapshots) {
  const byDay = {}
  for (const s of snapshots) {
    (byDay[s.day] ??= []).push(s)
  }
  const days = Object.keys(byDay).sort()
  const latest = days[days.length - 1]
  const prev = days[days.length - 2] || null
  const today = byDay[latest] ?? []

  const total = today.length || 1
  const withAio = today.filter((s) => s.hasAio)
  const coverage = { value: Math.round((withAio.length / total) * 100), total: today.length, aiCount: withAio.length }
  const mentionRate = {
    value: Math.round((today.filter((s) => s.mentionsBrand).length / total) * 100),
    total: today.length,
  }
  const citationShare = {
    value: withAio.length ? Math.round((withAio.filter((s) => s.brandCited).length / withAio.length) * 100) : 0,
    total: withAio.length,
  }

  let volatility = 0
  const changes = []
  const prevMap = {}
  if (prev) {
    for (const s of byDay[prev]) prevMap[s.keyword] = s
    for (const s of today) {
      const p = prevMap[s.keyword]
      if (!p) continue
      if (p.hasAio !== s.hasAio) {
        volatility++
        changes.push({ keyword: s.keyword, type: s.hasAio ? "aio-gained" : "aio-lost", day: s.day })
      }
      if (p.brandCited !== s.brandCited) {
        volatility++
        changes.push({ keyword: s.keyword, type: s.brandCited ? "citation-gained" : "citation-lost", day: s.day })
      }
      if (p.mentionsBrand !== s.mentionsBrand) {
        volatility++
        changes.push({ keyword: s.keyword, type: s.mentionsBrand ? "mention-gained" : "mention-lost", day: s.day })
      }
      if (p.ourOrganicPosition && s.ourOrganicPosition && p.ourOrganicPosition !== s.ourOrganicPosition
          && Math.abs(p.ourOrganicPosition - s.ourOrganicPosition) >= 3) {
        volatility++
        changes.push({
          keyword: s.keyword,
          type: s.ourOrganicPosition < p.ourOrganicPosition ? "position-gained" : "position-lost",
          day: s.day,
          from: p.ourOrganicPosition,
          to: s.ourOrganicPosition,
        })
      }
    }
  }

  const share = {}
  for (const s of withAio) {
    for (const d of s.citedDomains) {
      share[d] = (share[d] ?? 0) + 1
    }
  }
  const shareTotal = Object.values(share).reduce((a, b) => a + b, 0) || 1
  const citations = Object.entries(share)
    .map(([domain, count]) => ({ domain, count, pct: Math.round((count / shareTotal) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  return {
    day: latest,
    hasPrev: days.length > 1,
    coverage,
    mentionRate,
    citationShare,
    volatility,
    changes,
    citations,
  }
}

module.exports = { parseSnapshot, computeMetrics }
