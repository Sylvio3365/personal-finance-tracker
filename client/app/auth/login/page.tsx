"use client";

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

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16 transition-colors duration-300">
      <main className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-8">
        <header className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
            Connexion
          </p>
          <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
            Accédez à votre espace financier.
          </h1>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            Consultez vos comptes, suivez vos dépenses et gardez le cap sur vos objectifs.
          </p>
        </header>

        <section className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_24px_70px_-40px_var(--shadow)]">
          <form
            className="grid gap-4"
            method="post"
            onSubmit={(event) => event.preventDefault()}
          >
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
                  autoComplete="current-password"
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
              <button type="button" className="underline decoration-[var(--accent)] hover:text-[var(--accent)] transition">
                Mot de passe oublié
              </button>
            </div>
            <button className="mt-2 h-12 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98]">
              Se connecter
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
