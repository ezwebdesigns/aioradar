const fs = require("fs")
const path = require("path")

const DATA_DIR = path.join(process.cwd(), "data")

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJson(name, fallback) {
  ensureDir()
  const file = path.join(DATA_DIR, name)
  if (!fs.existsSync(file)) return fallback
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch {
    return fallback
  }
}

function writeJson(name, value) {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(value, null, 2))
}

module.exports = { readJson, writeJson }
