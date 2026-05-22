"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../components/PageHeader";
import { IconChart } from "../components/icons";
import { UserService } from "../../services/user/UserService";
import LoadingIndicator from "../../components/LoadingIndicator";
import Toast from "../../components/Toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; fullName: string; email: string; dateNaissance?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = UserService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setFullName(storedUser.fullName || "");
      setEmail(storedUser.email || "");
      setDateNaissance(storedUser.dateNaissance || "");
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/command/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: fullName,
          email: email,
          dateNaissance: dateNaissance || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setToast({ message: "Profil mis à jour avec succès", type: "success" });
    } catch (error) {
      setToast({ message: "Erreur lors de la mise à jour du profil", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setToast({ message: "Les mots de passe ne correspondent pas", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: "Le mot de passe doit contenir au moins 6 caractères", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/command/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du mot de passe");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ message: "Mot de passe mis à jour avec succès", type: "success" });
    } catch (error) {
      setToast({ message: "Erreur lors de la mise à jour du mot de passe", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingIndicator text="Chargement..." />;

  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-5xl">
        <PageHeader
          eyebrow="Profil"
          title="Gérer vos informations personnelles"
          description="Modifiez votre nom, email, date de naissance et mot de passe."
          icon={<IconChart className="h-5 w-5" />}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Informations personnelles */}
          <div className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
            <h2 className="text-lg font-semibold mb-6">Informations personnelles</h2>
            <form onSubmit={handleUpdateProfile} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nom complet</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Date de naissance</label>
                <input
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 h-11 w-full rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-95 active:scale-[0.98] transition shadow-md shadow-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mise à jour..." : "Mettre à jour le profil"}
              </button>
            </form>
          </div>

          {/* Mot de passe */}
          <div className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
            <h2 className="text-lg font-semibold mb-6">Mot de passe</h2>
            <form onSubmit={handleUpdatePassword} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Mot de passe actuel</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 h-11 w-full rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-95 active:scale-[0.98] transition shadow-md shadow-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
