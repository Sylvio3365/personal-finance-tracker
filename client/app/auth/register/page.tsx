"use client";

import { useState } from "react";

function IconUser({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

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
      setMessage("Inscription réussie. Vous pouvez vous connecter.");
      event.currentTarget.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16 transition-colors duration-300">
      <main className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-8">
        <header className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
            Inscription
          </p>
          <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
            Créez votre compte et démarrez.
          </h1>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            Suivez vos comptes et recevez des alertes de dépassement en temps réel.
          </p>
        </header>

        <section className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_24px_70px_-40px_var(--shadow)]">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Prénom
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                    <IconUser className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Amina"
                    className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    required
                  />
                </div>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Nom
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                    <IconUser className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Diallo"
                    className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    required
                  />
                </div>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                  <IconMail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="vous@exemple.com"
                  className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Mot de passe
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                  <IconLock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Au moins 8 caractères"
                  className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Date de naissance
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                  <IconCalendar className="h-5 w-5" />
                </span>
                <input
                  type="date"
                  name="dtn"
                  className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </div>
            </label>
            <p className="text-xs text-[var(--ink-subtle)]">
              En créant un compte, vous acceptez les conditions et la politique de confidentialité.
            </p>
            <button
              className="h-12 rounded-2xl bg-[#f2b05f] text-sm font-semibold text-[#1a1a1a] transition hover:brightness-95 disabled:opacity-70 active:scale-[0.98]"
              disabled={status === "loading"}
              type="submit"
            >
              {status === "loading" ? "Inscription en cours..." : "Créer mon compte"}
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
