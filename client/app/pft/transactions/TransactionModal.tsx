"use client";

import { useState, useEffect } from "react";
import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { IconList, IconPlus, IconAlertTriangle } from "../components/icons";
import Toast from "../../components/Toast";
import { AccountService, AccountResponse } from "../../services/account/AccountService";
import { ReferenceService, Category, TransactionType } from "../../services/reference/ReferenceService";
import { TransactionService } from "../../services/transaction/TransactionService";
import { UserService } from "../../services/user/UserService";
import CustomSelect from "../components/CustomSelect";

interface TransactionModalProps {
  onTransactionCreated?: () => void;
}

// Calcule le total dépenses du mois courant pour une catégorie sur un compte
async function getCategorySpendingThisMonth(compteId: number, categorieId: number): Promise<number> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const start = new Date(year, month - 1, 1).toISOString();
  const end = new Date(year, month, 0, 23, 59, 59).toISOString();
  const res = await fetch(
    `http://localhost:8080/query/transactions/sum-depense-categorie?compteId=${compteId}&categorieId=${categorieId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return typeof data === "number" ? data : parseFloat(data) || 0;
}

export default function TransactionModal({ onTransactionCreated }: TransactionModalProps) {
  const [comptes, setComptes] = useState<AccountResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [compteId, setCompteId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [montant, setMontant] = useState("");
  const [dateTransaction, setDateTransaction] = useState("");
  const [note, setNote] = useState("");

  // Warning limite catégorie
  const [limitWarning, setLimitWarning] = useState<string | null>(null);
  const [checkingLimit, setCheckingLimit] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = UserService.getStoredUser();
        if (user) {
          const userComptes = await AccountService.listByUtilisateur(parseInt(String(user.id), 10));
          setComptes(userComptes);
          if (userComptes.length > 0) setCompteId(userComptes[0].id.toString());
        }
        const [catData, typesData] = await Promise.all([
          ReferenceService.getCategories(),
          ReferenceService.getTransactionTypes(),
        ]);
        setCategories(catData);
        setTypes(typesData);
        if (catData.length > 0) setCategorieId(catData[0].id.toString());
        if (typesData.length > 0) setTypeId(typesData[0].id.toString());
        const today = new Date().toISOString().split("T")[0];
        setDateTransaction(today);
      } catch (error) {
        console.error("Erreur chargement references:", error);
      }
    };
    loadData();
  }, []);

  // Vérifie la limite quand catégorie, compte ou montant change
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!compteId || !categorieId || !montant) { setLimitWarning(null); return; }
      const cat = categories.find((c) => c.id.toString() === categorieId);
      if (!cat?.limite || cat.limite <= 0) { setLimitWarning(null); return; }
      const type = types.find((t) => t.id.toString() === typeId);
      if (type?.libelle?.toLowerCase() !== "depense") { setLimitWarning(null); return; }
      const m = parseFloat(montant.replace(",", "."));
      if (isNaN(m) || m <= 0) { setLimitWarning(null); return; }
      setCheckingLimit(true);
      try {
        const currentSpent = await getCategorySpendingThisMonth(parseInt(compteId, 10), cat.id);
        if (cancelled) return;
        const newTotal = currentSpent + m;
        if (newTotal > cat.limite) {
          const exceed = (newTotal - cat.limite).toFixed(2);
          setLimitWarning(`Attention : cette dépense dépasse la limite mensuelle de ${cat.limite.toFixed(2)} Ar de ${cat.libelle} de ${exceed} Ar.`);
        } else {
          setLimitWarning(null);
        }
      } catch { /* ignore */ } finally { if (!cancelled) setCheckingLimit(false); }
    };
    check();
    return () => { cancelled = true; };
  }, [compteId, categorieId, montant, typeId, categories, types]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      if (!compteId) throw new Error("Veuillez créer un compte d'abord.");
      const m = parseFloat(montant.replace(",", "."));
      if (isNaN(m)) throw new Error("Montant invalide");

      const response = await TransactionService.create({
        montant: m,
        dateTransaction: dateTransaction ? new Date(dateTransaction).toISOString() : undefined,
        note,
        categorieId: parseInt(categorieId, 10),
        transactionTypeId: parseInt(typeId, 10),
        utilisateurCompteId: parseInt(compteId, 10)
      });

      // Avertissement serveur si limite dépassée
      if (response.warning) {
        setToast({ message: `Transaction ajoutée. ${response.warning}`, type: "error" });
      } else {
        setToast({ message: "Transaction ajoutée avec succès", type: "success" });
      }
      setMontant("");
      setNote("");
      setLimitWarning(null);

      const modal = document.getElementById("transaction-modal") as HTMLInputElement;
      if (modal) modal.checked = false;
      onTransactionCreated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      id="transaction-modal"
      title="Historique recent"
      triggerContent={
        <>
          <IconPlus className="h-4 w-4" />
          Nouvelle transaction
        </>
      }
    >
      <ModalHeader title="Ajouter une transaction" closeId="transaction-modal" />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {/* Compte — CustomSelect */}
        <label className="grid gap-2 text-sm font-medium">
          Compte
          <CustomSelect
            value={compteId}
            onChange={setCompteId}
            options={[
              { label: "Sélectionner un compte", value: "" },
              ...comptes.map(c => ({ label: c.nom, value: c.id.toString() }))
            ]}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <label className="grid gap-2 text-sm font-medium">
            Type
            <CustomSelect
              value={typeId}
              onChange={setTypeId}
              options={types.map(t => ({ label: t.libelle, value: t.id.toString() }))}
            />
          </label>
          {/* Catégorie */}
          <label className="grid gap-2 text-sm font-medium">
            Categorie
            <CustomSelect
              value={categorieId}
              onChange={setCategorieId}
              options={[
                { label: "Sélectionner", value: "" },
                ...categories.map(c => ({ label: c.libelle, value: c.id.toString() }))
              ]}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Montant */}
          <label className="grid gap-2 text-sm font-medium">
            Montant
            <input
              type="text"
              required
              placeholder="0,00"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          {/* Date */}
          <label className="grid gap-2 text-sm font-medium">
            Date
            <input
              type="date"
              required
              value={dateTransaction}
              onChange={(e) => setDateTransaction(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        </div>
        {/* Note */}
        <label className="grid gap-2 text-sm font-medium">
          Note
          <input
            type="text"
            placeholder="Optionnel"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        {/* ── Avertissement limite catégorie ── */}
        {(limitWarning || checkingLimit) && (
          <div className={`flex items-start gap-2 p-3 rounded-xl border text-sm ${
            limitWarning
              ? "bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400"
              : "bg-black/5 border-transparent text-[var(--ink-subtle)]"
          }`}>
            <IconAlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{limitWarning || "Vérification de la limite..."}</span>
          </div>
        )}

        <button
          disabled={loading || comptes.length === 0}
          className="mt-2 h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
          <IconList className="h-4 w-4" />
          Les revenus et dépenses mettent à jour le solde.
        </div>
      </form>
    </ModalShell>
  );
}
