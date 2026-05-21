"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMail } from "../../components/icons";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { UserService } from "../../services/user";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);

    try {
      const userData = await UserService.login({
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || ""),
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
                  name="email"
                  placeholder="vous@exemple.com"
                  className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </div>
            </label>
            <PasswordInput
              name="password"
              placeholder="Votre mot de passe"
              required
            />
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
