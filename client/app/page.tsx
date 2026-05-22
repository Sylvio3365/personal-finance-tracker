"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLogo from "./components/AppLogo";
import LandingHero from "./components/LandingHero";
import Toast from "./components/Toast";
import { IconUser, IconMail, IconLock, IconCalendar } from "./components/icons";
import PasswordInput from "./components/PasswordInput";
import { UserService } from "./services/user";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If user already logged in, go to dashboard
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/pft/accounts");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const userData = await UserService.login({
        email: data.email as string,
        password: data.password as string,
      });
      UserService.storeUser(userData);
      setStatus("success");
      setToast({ message: "Connexion réussie !", type: "success" });
      setTimeout(() => {
        router.push("/pft/accounts");
      }, 1000);
    } catch (err: any) {
      setStatus("error");
      setToast({ message: err.message || "Échec de la connexion", type: "error" });
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const userData = await UserService.register({
        nom: data.nom as string,
        prenom: data.prenom as string,
        email: data.email as string,
        dtn: data.dtn as string,
        motDePasse: data.password as string, // Map 'password' from form to 'motDePasse' for API
      });
      setStatus("success");
      setToast({ message: "Compte créé avec succès ! Connectez-vous.", type: "success" });
      setTimeout(() => {
        setIsLogin(true);
        setStatus("idle");
      }, 1000);
    } catch (err: any) {
      setStatus("error");
      setToast({ message: err.message || "Échec de l'inscription", type: "error" });
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
        <LandingHero />

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

              <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
                <label className="grid gap-2 text-sm font-medium">
                  Email
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ink-subtle)]/75">
                      <IconMail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      defaultValue="jean.dupont@test.com"
                      placeholder="vous@exemple.com"
                      className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] pl-12 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
                      required
                      autoComplete="off"
                    />
                  </div>
                </label>
                <PasswordInput
                  name="password"
                  defaultValue="password123"
                  placeholder="Votre mot de passe"
                  required
                />
                <div className="flex items-center justify-between text-xs text-[var(--ink-subtle)]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
                    Se souvenir de moi
                  </label>
                  <button type="button" className="underline decoration-[var(--accent)]">
                    Mot de passe oublié
                  </button>
                </div>
                <button 
                  disabled={status === "loading"}
                  className="mt-2 h-12 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98] disabled:opacity-50"
                >
                  {status === "loading" ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-[var(--ink-subtle)]">
                  {/* Nouveau sur l'application ?{" "} */}
                  {/* <button
                    type="button"
                    onClick={() => { setIsLogin(false); setToast(null); setStatus("idle"); }}
                    className="font-semibold text-[var(--accent)] hover:underline ml-1 cursor-pointer transition active:scale-95"
                  >
                    Créer un compte
                  </button> */}
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

              <form className="mt-6 grid gap-4" onSubmit={handleRegister}>
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
                  placeholder="Au moins 8 caracteres"
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
                  En créant un compte, vous acceptez les conditions et la politique de confidentialité.
                </p>
                <button 
                  disabled={status === "loading"}
                  className="h-12 w-full rounded-2xl bg-[#f2b05f] text-sm font-semibold text-[#1a1a1a] transition hover:brightness-95 active:scale-[0.98] disabled:opacity-50"
                >
                  {status === "loading" ? "Création..." : "Créer mon compte"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-[var(--ink-subtle)]">
                  Déjà inscrit ?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setToast(null); setStatus("idle"); }}
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
