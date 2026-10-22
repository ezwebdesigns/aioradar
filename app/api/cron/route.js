import { collect } from "@/analyzer/collector"
import { computeMetrics } from "@/analyzer/extract"
import db from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(req) {
  const secret = process.env.CRON_SECRET
  const provided = req.headers.get("authorization")
  if (!secret || provided !== "Bearer " + secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }
  const result = await collect(null)
  const snapshots = await db.listSnapshots(null)
  const metrics = computeMetrics(snapshots)
  const lastDay = snapshots.length ? Math.max(...snapshots.map((s) => s.day)) : null
  return Response.json({ ok: true, day: lastDay, ...result, metrics })
}
