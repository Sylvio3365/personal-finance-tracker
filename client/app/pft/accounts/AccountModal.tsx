"use client";

import { useState, useEffect } from "react";
import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { IconPlus, IconWallet } from "../components/icons";
import Toast from "../../components/Toast";
import {
  AccountService,
  TypeCompte,
} from "../../services/account/AccountService";
import { UserService } from "../../services/user/UserService";
import CustomSelect from "../components/CustomSelect";

interface AccountModalProps {
  onAccountCreated?: () => void;
}

export default function AccountModal({ onAccountCreated }: AccountModalProps) {
  const [typeComptes, setTypeComptes] = useState<TypeCompte[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [nom, setNom] = useState("");
  const [typeCompteId, setTypeCompteId] = useState("");
  const [soldeInitial, setSoldeInitial] = useState("");

  // Charger les types de compte au montage
  useEffect(() => {
    const loadTypeComptes = async () => {
      try {
        const types = await AccountService.getTypeComptes();
        setTypeComptes(types);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur";
        setToast({ message: errorMessage, type: "error" });
      }
    };
    loadTypeComptes();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = UserService.getStoredUser();
      if (!user) {
        setToast({ message: "Utilisateur non trouvé", type: "error" });
        setLoading(false);
        return;
      }

      const solde = soldeInitial
        ? parseFloat(soldeInitial.replace(",", "."))
        : 0;

      await AccountService.create({
        nom,
        typeCompteId: parseInt(typeCompteId, 10),
        utilisateurId: parseInt(String(user.id), 10),
        soldeInitial: solde,
      });

      setToast({ message: "Compte créé avec succès !", type: "success" });
      setNom("");
      setTypeCompteId("");
      setSoldeInitial("");

      const modal = document.getElementById(
        "account-modal",
      ) as HTMLInputElement;
      if (modal) modal.checked = false;
      onAccountCreated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <ModalShell
        id="account-modal"
        title=""
        triggerContent={
          <>
            <IconPlus className="h-4 w-4" />
            Nouveau compte
          </>
        }
      >
        <ModalHeader title="Ajouter un compte" closeId="account-modal" />
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Nom du compte
            <input
              type="text"
              placeholder="Ex: Courant"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Type
            <CustomSelect
              value={typeCompteId}
              onChange={setTypeCompteId}
              options={[
                { label: "Sélectionnez un type", value: "" },
                ...typeComptes.map((type) => ({
                  label: type.nom,
                  value: type.id.toString(),
                })),
              ]}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Solde initial
            <input
              type="text"
              placeholder="0,00"
              value={soldeInitial}
              onChange={(e) => setSoldeInitial(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-70"
          >
            {loading ? "Création en cours..." : "Ajouter le compte"}
          </button>
          <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
            <IconWallet className="h-4 w-4" />
            Le compte apparaitra dans la liste principale.
          </div>
        </form>
      </ModalShell>
    </>
  );
}
