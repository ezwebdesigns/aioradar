const { HASDATA } = require("./config")
const { generateMockSerp, domainFor } = require("./mock-serp")

function isMockMode() {
  const mode = (process.env.HASDATA_MODE || "").toLowerCase()
  if (mode === "mock") return true
  if (mode === "live") return false
  return !process.env[HASDATA.keyEnv]
}

async function fetchSerp(keyword, { gl = "us", hl = "en", device = "desktop" } = {}) {
  if (isMockMode()) {
    const day = new Date().toISOString().slice(0, 10)
    return { source: "mock", data: generateMockSerp(keyword, day) }
  }
  const params = new URLSearchParams({ q: keyword, gl, hl, deviceType: device })
  const res = await fetch(`${HASDATA.base}${HASDATA.serpPath}?${params}`, {
    headers: { "x-api-key": process.env[HASDATA.keyEnv] },
  })
  if (!res.ok) {
    throw new Error(`HasData request failed: ${res.status} ${res.statusText}`)
  }
  return { source: "hasdata", data: await res.json() }
}

module.exports = { fetchSerp, isMockMode }
