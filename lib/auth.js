import { betterAuth } from "better-auth";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 4,
});

export const auth = betterAuth({
  appName: "aio radar",
  database: pool,
  emailAndPassword: { enabled: true },
  baseURL: "https://aioradar-two.vercel.app",
  trustedOrigins: [
    "https://aioradar-two.vercel.app",
    "https://aioradar-ezwebdesigns-projects.vercel.app",
    "http://localhost:3000"
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
});
