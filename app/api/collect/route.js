import db from "@/lib/db"
import { computeMetrics } from "@/analyzer/extract"
import { collect } from "@/analyzer/collector"
import { isMockMode } from "@/analyzer/hasdata"
const auth = { api: { getSession: async () => Promise.resolve(null) } }

export const dynamic = "force-dynamic"

async function ownerIdFrom(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export async function GET(req) {
  const ownerId = await ownerIdFrom(req)
  const [snapshots, storeMode] = await Promise.all([
    db.listSnapshots(ownerId),
    db.checkMode().catch(() => "json-fallback"),
  ])
  return Response.json({
    hasData: snapshots.length > 0,
    mode: isMockMode() ? "mock" : "live",
    storeMode,
    metrics: computeMetrics(snapshots),
    snapshots,
  })
}

export async function POST(req) {
  const ownerId = await ownerIdFrom(req)
  const result = await collect(ownerId)
  const snapshots = await db.listSnapshots(ownerId)
  return Response.json({ ...result, metrics: computeMetrics(snapshots) })
}
