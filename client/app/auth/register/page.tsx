"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      prenom: String(formData.get("prenom") || "").trim(),
      nom: String(formData.get("nom") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      motDePasse: String(formData.get("password") || ""),
      dtn: formData.get("dtn") ? String(formData.get("dtn")) : null,
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    try {
      const response = await fetch(`${baseUrl}/command/utilisateurs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Inscription impossible");
      }

      setStatus("success");
      setMessage("Inscription reussie. Vous pouvez vous connecter.");
      event.currentTarget.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-8">
        <header className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
            Inscription
          </p>
          <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
            Creez votre compte et demarrez.
          </h1>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            Suivez vos comptes et recevez des alertes de depassement en temps reel.
          </p>
        </header>

        <section className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Prenom
                <input
                  type="text"
                  name="prenom"
                  placeholder="Amina"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Nom
                <input
                  type="text"
                  name="nom"
                  placeholder="Diallo"
                  className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                type="email"
                name="email"
                placeholder="vous@exemple.com"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Mot de passe
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Au moins 8 caracteres"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Date de naissance
              <input
                type="date"
                name="dtn"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <p className="text-xs text-[var(--ink-subtle)]">
              En creant un compte, vous acceptez les conditions et la politique de confidentialite.
            </p>
            <button
              className="h-12 rounded-2xl bg-[#f2b05f] text-sm font-semibold text-[#1a1a1a] transition hover:brightness-95 disabled:opacity-70"
              disabled={status === "loading"}
              type="submit"
            >
              {status === "loading" ? "Inscription en cours..." : "Creer mon compte"}
            </button>
            {message ? (
              <p
                className={`text-xs ${
                  status === "success" ? "text-[var(--accent)]" : "text-red-600"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </section>
      </main>
    </div>
  );
}
