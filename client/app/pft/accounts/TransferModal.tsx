"use client";

import { useState, useEffect } from "react";
import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { IconWallet } from "../components/icons";
import Toast from "../../components/Toast";
import {
  AccountService,
  AccountResponse,
} from "../../services/account/AccountService";
import { UserService } from "../../services/user/UserService";
import CustomSelect from "../components/CustomSelect";

interface TransferModalProps {
  onTransferCompleted?: () => void;
}

export default function TransferModal({ onTransferCompleted }: TransferModalProps) {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [montant, setMontant] = useState("");
  const [note, setNote] = useState("");

  // Charger les comptes au montage
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const user = UserService.getStoredUser();
        if (user) {
          const data = await AccountService.listByUtilisateur(user.id);
          setAccounts(data);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur";
        setToast({ message: errorMessage, type: "error" });
      }
    };
    loadAccounts();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (fromAccountId === toAccountId) {
        setToast({ message: "Impossible de transférer vers le même compte", type: "error" });
        setLoading(false);
        return;
      }

      const amount = montant ? parseFloat(montant.replace(",", ".")) : 0;

      if (amount <= 0) {
        setToast({ message: "Le montant doit être supérieur à 0", type: "error" });
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/command/transactions/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: parseInt(fromAccountId, 10),
          toAccountId: parseInt(toAccountId, 10),
          montant: amount,
          note: note || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "Erreur lors du transfert";
        throw new Error(errorMessage);
      }

      setToast({ message: "Transfert effectué avec succès !", type: "success" });
      setFromAccountId("");
      setToAccountId("");
      setMontant("");
      setNote("");

      const modal = document.getElementById("transfer-modal") as HTMLInputElement;
      if (modal) modal.checked = false;
      onTransferCompleted?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du transfert";
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
        id="transfer-modal"
        title=""
        triggerContent={
          <>
            <IconWallet className="h-4 w-4" />
            Transférer
          </>
        }
      >
        <ModalHeader title="Transférer de l'argent" closeId="transfer-modal" />
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Compte source
            <CustomSelect
              value={fromAccountId}
              onChange={setFromAccountId}
              options={[
                { label: "Sélectionner un compte", value: "" },
                ...accounts.map((acc) => ({
                  label: `${acc.nom} (${acc.soldeActuel} Ar)`,
                  value: acc.id.toString(),
                })),
              ]}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Compte destination
            <CustomSelect
              value={toAccountId}
              onChange={setToAccountId}
              options={[
                { label: "Sélectionner un compte", value: "" },
                ...accounts.map((acc) => ({
                  label: `${acc.nom} (${acc.soldeActuel} Ar)`,
                  value: acc.id.toString(),
                })),
              ]}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Montant (Ar)
            <input
              type="text"
              placeholder="0,00"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Note (optionnel)
            <input
              type="text"
              placeholder="Ex: Paiement facture"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                const modal = document.getElementById("transfer-modal") as HTMLInputElement;
                if (modal) modal.checked = false;
              }}
              className="flex-1 h-11 rounded-2xl border border-black/10 dark:border-white/10 text-sm font-semibold text-[var(--foreground)] transition hover:bg-black/5 dark:hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-2xl bg-purple-500 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:opacity-70"
            >
              {loading ? "Transfert en cours..." : "Effectuer le transfert"}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}
