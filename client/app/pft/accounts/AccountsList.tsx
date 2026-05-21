"use client";

import { useState, useEffect } from "react";
import { IconWallet, IconTrash } from "../components/icons";
import Toast from "../../components/Toast";
import LoadingIndicator from "../../components/LoadingIndicator";
import { AccountService, AccountResponse, TypeCompte } from "../../services/account/AccountService";
import { UserService } from "../../services/user/UserService";

interface AccountsListProps {
  refreshTrigger?: number;
}

export default function AccountsList({ refreshTrigger }: AccountsListProps) {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [typeComptes, setTypeComptes] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Charger les comptes de l'utilisateur
  const loadAccounts = async () => {
    try {
      setLoading(true);
      const user = UserService.getStoredUser();
      if (!user) {
        setToast({ message: "Utilisateur non trouvé", type: "error" });
        return;
      }

      const [accountsData, typeComptesData] = await Promise.all([
        AccountService.listByUtilisateur(parseInt(user.id as string, 10)),
        AccountService.getTypeComptes(),
      ]);

      setAccounts(accountsData);
      
      // Créer une map id -> nom
      const typeMap = new Map<number, string>();
      typeComptesData.forEach((type) => {
        typeMap.set(type.id, type.nom);
      });
      setTypeComptes(typeMap);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [refreshTrigger]);

  const handleDelete = async (compteId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      return;
    }

    try {
      await AccountService.delete(compteId);
      setToast({ message: "Compte supprimé avec succès !", type: "success" });
      loadAccounts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  if (loading && accounts.length === 0) {
    return <LoadingIndicator text="Chargement de vos comptes..." />;
  }

  if (accounts.length === 0) {
    return (
      <div className="mt-6 text-center text-sm text-[var(--ink-subtle)]">
        Aucun compte. Créez votre premier compte pour commencer !
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="mt-6 grid gap-4">
        {accounts.map((compte) => (
          <div
            key={compte.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-white/10 text-[var(--accent)]">
                <IconWallet className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{compte.nom}</p>
                <p className="text-xs text-[var(--ink-subtle)]">{typeComptes.get(compte.typeCompteId) || "Type inconnu"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{compte.soldeActuel.toFixed(2)} Ar</p>
                <p className="text-[11px] text-[var(--ink-subtle)]">Solde actuel</p>
              </div>
              <button
                onClick={() => handleDelete(compte.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                title="Supprimer le compte"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
