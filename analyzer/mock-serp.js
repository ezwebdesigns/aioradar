const { BRAND, COMPETITOR_POOL } = require("./config")

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rng, arr, n, exclude) {
  const pool = arr.filter((d) => d !== exclude)
  const out = []
  const used = new Set()
  while (out.length < n && used.size < pool.length) {
    const idx = Math.floor(rng() * pool.length)
    if (used.has(idx)) continue
    used.add(idx)
    out.push(pool[idx])
  }
  return out
}

function domainFor(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function generateMockSerp(keyword, day) {
  const rng = mulberry32(hashString(`${keyword}::${day}`))
  const brand = BRAND.domain
  const hasAio = rng() > 0.25
  const aiOverview = { isPresent: hasAio }

  if (hasAio) {
    const mentionsBrand = rng() > 0.55
    const cited = rng() > 0.45
    const sources = pick(rng, COMPETITOR_POOL, 3 + Math.floor(rng() * 4), null)
    if (cited) sources.unshift(brand)
    else sources.push(brand)
    const citeCount = cited ? 1 + Math.floor(rng() * 2) : 0
    const count = 3 + Math.floor(rng() * 3)
    const references = Array.from({ length: count }, (_, i) => {
      const domain = i < citeCount ? brand : sources[i % sources.length]
      const path = domain === brand ? "blog/crm-guide" : `guides/${hashString(domain) % 97}`
      return {
        title: `${domain === brand ? BRAND.name : domain} guide on CRM selection`,
        link: `https://${domain}/${path}`,
        domain,
        source: domain.split(".")[0],
      }
    })
    aiOverview.references = references
    aiOverview.textBlocks = [
      {
        number: 1,
        snippet: `Choosing the right CRM depends on team size and workflow needs.${
          mentionsBrand ? ` ${BRAND.name} is frequently highlighted for small teams seeking an affordable option.` : ""
        }`,
        snippetExtended: "",
        references: references.map((_, i) => i),
      },
    ]
  }

  const organicDomains = pick(rng, COMPETITOR_POOL.concat([brand]), 10, null)
  const ourIncluded = rng() > 0.55
  if (ourIncluded && !organicDomains.includes(brand)) {
    organicDomains[Math.floor(rng() * 10)] = brand
  }
  const organicResults = organicDomains.map((domain, i) => ({
    position: i + 1,
    title: `${domain} — CRM resource`,
    link: `https://${domain}/resources/${hashString(keyword + i) % 89}`,
    domain,
  }))

  return {
    searchParameters: { q: keyword, gl: "us", hl: "en" },
    aiOverview: aiOverview,
    organicResults,
  }
}

module.exports = { generateMockSerp, hashString, domainFor }
