import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Simple stub: just acknowledge receipt; no DB creation.
    return NextResponse.json({ success: true, userId: "stub-user" });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}