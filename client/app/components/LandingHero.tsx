"use client";

import AppLogo from "./AppLogo";

export default function LandingHero() {
  return (
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
  );
}
