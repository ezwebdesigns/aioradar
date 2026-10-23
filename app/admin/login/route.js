import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const adminPassword = formData.get("adminPassword") as string | null;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return new Response("Configuration ADMIN_PASSWORD manquante", { status: 500 });
  }

  if (adminPassword === expected) {
    const res = NextResponse.redirect(new URL("/", request.url));
    // Définir le cookie pour qu'il persiste sur le domaine
    res.cookies.set("adminPassword", expected, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 an
    });
    return res;
  }

  // Échec : rediriger vers la page de login avec un paramètre d'erreur
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", "invalid");
  return NextResponse.redirect(url);
}