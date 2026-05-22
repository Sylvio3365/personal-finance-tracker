"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMail, IconLock, IconEye, IconEyeOff } from "../../components/icons";
import Toast from "../../components/Toast";
import { UserService } from "../../services/user";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("jean.dupont@test.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const userData = await UserService.login({
        email: email.trim(),
        password: password,
      });

      UserService.storeUser(userData);
      setStatus("success");
      setToast({ message: "Connexion réussie !", type: "success" });

      setTimeout(() => {
        router.push("/pft/accounts");
      }, 800);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      setStatus("error");
      setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16 transition-colors duration-300">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <main className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-8">
        <header className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
            Connexion
          </p>
          <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
            Accédez à votre espace financier.
          </h1>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            Consultez vos comptes, suivez vos dépenses et gardez le cap sur vos
            objectifs.
          </p>
        </header>
        <section className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_24px_70px_-40px_var(--shadow)]">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                  <IconMail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                  autoComplete="off"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-12 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--ink-subtle)]/75 hover:text-[var(--ink-subtle)] transition"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>
            <div className="flex items-center justify-between text-xs text-[var(--ink-subtle)]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-black/20"
                />
                Se souvenir de moi
              </label>
              <button
                type="button"
                className="underline decoration-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                Mot de passe oublié
              </button>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 h-12 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98] disabled:opacity-50"
            >
              {status === "loading" ? "Connexion..." : "Se connecter"}
            </button>
            <p className="mt-4 text-center text-xs text-[var(--ink-subtle)]">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Inscrivez-vous
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}