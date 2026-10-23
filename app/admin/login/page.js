import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const password = (form.querySelector('input[name="adminPassword"]') as HTMLInputElement).value;
    const res = await fetch("/admin/login", {
      method: "POST",
      body: new FormData(form),
    });
    if (res.ok) {
      router.push("/");
    } else {
      // stay on page with error
      const url = new URL(window.location.href);
      url.searchParams.set("error", "invalid");
      router.push(url.pathname);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Connexion admin</h2>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Mot de passe admin
          <input type="password" name="adminPassword" required />
        </label>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}