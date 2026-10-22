import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://aioradar-two.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;
