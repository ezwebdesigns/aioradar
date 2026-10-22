import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    cookieStore.set("__Secure-better-auth.session_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: "aioradar-two.vercel.app",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set session cookie error:", error);
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}