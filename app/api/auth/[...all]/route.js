import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = NextAuth(authOptions).GET;
export const POST = NextAuth(authOptions).POST;