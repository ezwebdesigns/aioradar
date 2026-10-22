import db from "@/lib/db"
import { getQueries, addQuery, removeQuery } from "@/analyzer/collector"
import { auth } from "@/lib/auth"

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
  let queries = await getQueries(ownerId)
  if (ownerId && queries.length === 0) {
    await db.claimQueries(ownerId)
    queries = await getQueries(ownerId)
  }
  return Response.json({ queries })
}

export async function POST(req) {
  const ownerId = await ownerIdFrom(req)
  const body = await req.json()
  if (!body?.keyword) return Response.json({ error: "keyword is required" }, { status: 400 })
  return Response.json({ queries: await addQuery(body.keyword, body, ownerId) })
}

export async function DELETE(req) {
  const ownerId = await ownerIdFrom(req)
  const id = new URL(req.url).searchParams.get("id")
  if (!id) return Response.json({ error: "id is required" }, { status: 400 })
  return Response.json({ queries: await removeQuery(id, ownerId) })
}
