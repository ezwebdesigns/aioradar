import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function getUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email]
    );
    return res.rows[0];
  } finally {
    client.release();
  }
}

export const authOptions = {
  providers: [
    
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@aioradar.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await getUserByEmail(email);
        if (!user) {
          return null;
        }
        const passwordsMatch = await compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }
        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);