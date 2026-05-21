"use client";

import { useState } from "react";
import AppLogo from "./components/AppLogo";

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

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16 transition-colors duration-300">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo className="h-10 w-10" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink-subtle)]">
              Personal Finance Tracker
            </p>
            <p className="text-lg font-semibold">Accès sécurisé</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm text-[var(--ink-subtle)] lg:flex">
          <span>Support 24/7</span>
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          <span>Version 1.0</span>
        </div>
      </header>

      <main className="mx-auto mt-12 grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Left Section: Branding & Info */}
        <section className="flex flex-col justify-center gap-10">
          <div className="rounded-3xl border border-black/5 bg-[var(--surface)] p-10 shadow-[0_24px_60px_-40px_var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
              Tableau de bord clair
            </p>
            <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
              Gardez chaque ariary sous contrôle avec des flux propres.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--ink-subtle)]">
              Suivez vos comptes, catégories et transactions depuis une interface minimale,
              rapide et rassurante. Tout est pensé pour des décisions immédiates.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-5">
                <p className="text-sm font-semibold">Alertes de dépenses</p>
                <p className="mt-2 text-sm text-[var(--ink-subtle)]">
                  Visualisez les limites mensuelles avant qu'elles ne débordent.
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-[#f4f7f1] dark:bg-[#1e231d] p-5">
                <p className="text-sm font-semibold">Résumé mensuel</p>
                <p className="mt-2 text-sm text-[var(--ink-subtle)]">
                  Revenus, dépenses, solde net et détail par catégorie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Toggleable Forms with Animation */}
        <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_24px_70px_-40px_var(--shadow)] min-h-[520px] flex flex-col justify-between">
          <div className="relative flex-1 flex flex-col justify-center">

            {/* Connexion (Login) Form */}
            <div
              className={`w-full transition-all duration-500 ease-out transform ${isLogin
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-12 pointer-events-none absolute"
                }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Connexion</h2>
                <span className="rounded-full bg-[#f3efe6] dark:bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--ink-subtle)]">
                  Espace sécurisé
                </span>
              </div>

              <form className="mt-6 grid gap-4">
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
                      placeholder="Votre mot de passe"
                      className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                      required
                    />
                  </div>
                </label>
                <div className="flex items-center justify-between text-xs text-[var(--ink-subtle)]">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
                    Se souvenir de moi
                  </label>
                  <button type="button" className="underline decoration-[var(--accent)]">
                    Mot de passe oublié
                  </button>
                </div>
                <button className="mt-2 h-12 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98]">
                  Se connecter
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-[var(--ink-subtle)]">
                  Nouveau sur l'application ?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="font-semibold text-[var(--accent)] hover:underline ml-1 cursor-pointer transition active:scale-95"
                  >
                    Créer un compte
                  </button>
                </p>
              </div>
            </div>

            {/* Inscription (Register) Form */}
            <div
              className={`w-full transition-all duration-500 ease-out transform ${!isLogin
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-12 pointer-events-none absolute"
                }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Inscription</h2>
                <span className="rounded-full bg-[#f3efe6] dark:bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--ink-subtle)]">
                  Nouveau compte
                </span>
              </div>

              <form className="mt-6 grid gap-4">
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
                      placeholder="Au moins 8 caracteres"
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
                <button className="h-12 w-full rounded-2xl bg-[#f2b05f] text-sm font-semibold text-[#1a1a1a] transition hover:brightness-95 active:scale-[0.98]">
                  Créer mon compte
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-[var(--ink-subtle)]">
                  Déjà inscrit ?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="font-semibold text-[var(--accent)] hover:underline ml-1 cursor-pointer transition active:scale-95"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
