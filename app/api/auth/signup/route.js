import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        name,
        password: hashedPassword,
      },
    });

    // Optionally sign in the user automatically
    const auth = NextAuth(authOptions);
    // We can't directly call signIn here, but we can return a token for the client.
    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}