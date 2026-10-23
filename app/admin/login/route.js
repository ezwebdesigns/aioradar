import { NextResponse } from "next/server";

export async function GET(request) {
  // Return the login form as HTML
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Connexion admin</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f2f5; }
        .container { background: #fff; padding: 2rem; border-radius: 8; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 320px; }
        h2 { margin-top: 0; }
        .error { color: red; margin-bottom: 1rem; }
        form { display: flex; flex-direction: column; gap: 0.5rem; }
        input { padding: 0.5rem; }
        button { padding: 0.5rem; background: #0066ff; color: #fff; border: none; border-radius: 4; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Connexion admin</h2>
        {error && <p class="error">{error}</p>}
        <form action="/admin/login" method="POST">
          <label>
            Mot de passe admin
            <input type="password" name="adminPassword" required />
          </label>
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </body>
    </html>
  `;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}

export async function POST(request) {
  const formData = await request.formData();
  const adminPassword = formData.get("adminPassword");
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