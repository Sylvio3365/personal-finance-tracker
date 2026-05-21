"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconUser, IconMail, IconCalendar } from "../../components/icons";
import PasswordInput from "../../components/PasswordInput";
import Toast from "../../components/Toast";
import { UserService } from "../../services/user";

export default function RegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);

    try {
      await UserService.register({
        prenom: String(formData.get("prenom") || "").trim(),
        nom: String(formData.get("nom") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        motDePasse: String(formData.get("password") || ""),
        dtn: formData.get("dtn") ? String(formData.get("dtn")) : undefined,
      });

      setStatus("success");
      setToast({
        message: "Inscription réussie. Vous pouvez vous connecter.",
        type: "success",
      });
      event.currentTarget.reset();
      setTimeout(() => {
        setStatus("idle");
      }, 1000);
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
            Inscription
          </p>
          <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
            Créez votre compte et démarrez.
          </h1>
          <p className="mt-4 text-sm text-[var(--ink-subtle)]">
            Suivez vos comptes et recevez des alertes de dépassement en temps
            réel.
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
            <PasswordInput
              name="password"
              placeholder="Au moins 8 caractères"
              required
            />
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
              En créant un compte, vous acceptez les conditions et la politique
              de confidentialité.
            </p>
            <button
              className="h-12 rounded-2xl bg-[#f2b05f] text-sm font-semibold text-[#1a1a1a] transition hover:brightness-95 disabled:opacity-70 active:scale-[0.98]"
              disabled={status === "loading"}
              type="submit"
            >
              {status === "loading"
                ? "Inscription en cours..."
                : "Créer mon compte"}
            </button>
            <p className="mt-4 text-center text-xs text-[var(--ink-subtle)]">
              Déjà inscrit ?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Se connecter
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
