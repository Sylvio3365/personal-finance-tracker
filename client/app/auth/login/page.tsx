"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-8">
        <header className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
            Connexion
          </p>
          <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
            Accedez a votre espace financier.
          </h1>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            Consultez vos comptes, suivez vos depenses et gardez le cap sur vos objectifs.
          </p>
        </header>

        <section className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
          <form
            className="grid gap-4"
            method="post"
            onSubmit={(event) => event.preventDefault()}
          >
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
                autoComplete="current-password"
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
        </section>
      </main>
    </div>
  );
}
