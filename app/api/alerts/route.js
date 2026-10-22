import db from "@/lib/db"
import { computeMetrics } from "@/analyzer/extract"
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
  const metrics = computeMetrics(snapshots)
  const queries = await db.listQueries(ownerId)
  return Response.json({ ...metrics, queryCount: queries.length })
}
