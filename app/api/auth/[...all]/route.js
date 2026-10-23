export const runtime = "nodejs";

export async function GET(request) {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  return new Response(null, { status: 405 });
}