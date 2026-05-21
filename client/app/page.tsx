export default function Home() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
            PFT
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink-subtle)]">
              Personal Finance Tracker
            </p>
            <p className="text-lg font-semibold">Acces securise</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm text-[var(--ink-subtle)] lg:flex">
          <span>Support 24/7</span>
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          <span>Version beta</span>
        </div>
      </header>

      <main className="mx-auto mt-12 grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr]">
        <section className="flex flex-col justify-between gap-10">
          <div className="rounded-3xl border border-black/5 bg-[var(--surface)] p-10 shadow-[0_24px_60px_-40px_var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
              Tableau de bord clair
            </p>
            <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
              Gardez chaque euro sous controle avec des flux propres.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--ink-subtle)]">
              Suivez vos comptes, categories et transactions depuis une interface minimale,
              rapide, et rassurante. Tout est pense pour des decisions immediates.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-[#f8f6f2] p-5">
                <p className="text-sm font-semibold">Alertes de depense</p>
                <p className="mt-2 text-sm text-[var(--ink-subtle)]">
                  Visualisez les limites mensuelles avant qu'elles ne debordent.
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-[#f4f7f1] p-5">
                <p className="text-sm font-semibold">Resume mensuel</p>
                <p className="mt-2 text-sm text-[var(--ink-subtle)]">
                  Revenus, depenses, solde net et detail par categorie.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
            <p className="text-sm text-[var(--ink-subtle)]">
              Pas encore convaincu ? Essayez un compte demo pre-rempli avec des transactions
              realistes et une vision mensuelle complete.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Demarrer la demo
              <span aria-hidden>→</span>
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_24px_70px_-40px_var(--shadow)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Connexion</h2>
            <span className="rounded-full bg-[#f3efe6] px-3 py-1 text-xs font-semibold text-[var(--ink-subtle)]">
              Espace securise
            </span>
          </div>
          <form className="mt-6 grid gap-4">
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
                placeholder="Votre mot de passe"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                required
              />
            </label>
            <div className="flex items-center justify-between text-xs text-[var(--ink-subtle)]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
                Se souvenir de moi
              </label>
              <button type="button" className="underline decoration-[var(--accent)]">
                Mot de passe oublie
              </button>
            </div>
            <button className="mt-2 h-12 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95">
              Se connecter
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs text-[var(--ink-subtle)]">
            <div className="h-px flex-1 bg-black/10" />
            <span>Ou creer un compte</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <h2 className="text-xl font-semibold">Inscription</h2>
          <form className="mt-6 grid gap-4">
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
            <button className="h-12 rounded-2xl bg-[#f2b05f] text-sm font-semibold text-[#1a1a1a] transition hover:brightness-95">
              Creer mon compte
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
