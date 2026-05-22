"use client";

import { useState, useEffect } from "react";
import { IconTag, IconTrash, IconPlus } from "../components/icons";
import Toast from "../../components/Toast";
import LoadingIndicator from "../../components/LoadingIndicator";
import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { ReferenceService, Category } from "../../services/reference/ReferenceService";
import { TransactionService } from "../../services/transaction/TransactionService";
import { formatCurrency } from "../../utils/currency";

// ── Barre de limite visuelle ──────────────────────────────
function LimitBar({ current, limit }: { current: number; limit: number }) {
  if (!limit || limit <= 0) return null;
  const pct = Math.min((current / limit) * 100, 100);
  const barColor =
    pct >= 100 ? "bg-red-500" :
    pct >= 80 ? "bg-orange-500" :
    pct >= 50 ? "bg-amber-400" :
                "bg-emerald-500";
  return (
    <div className="mt-2">
      <div className="relative h-6 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden flex items-center">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-sm">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-[var(--ink-subtle)]">
          {formatCurrency(current)} / {formatCurrency(limit)}
        </span>
      </div>
    </div>
  );
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categorySpending, setCategorySpending] = useState<Record<number, number>>({}); // Map categoryId -> spent amount

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await ReferenceService.getCategories();
      setCategories(data);
      
      // Load spending for each category
      const spending: Record<number, number> = {};
      for (const cat of data) {
        try {
          const sum = await TransactionService.getSumDepenseByCategory(cat.id);
          spending[cat.id] = sum;
        } catch (error) {
          console.warn(`Failed to load spending for category ${cat.id}:`, error);
          spending[cat.id] = 0;
        }
      }
      setCategorySpending(spending);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erreur";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      setDeletingId(id);
      await ReferenceService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setToast({ message: "Catégorie supprimée", type: "success" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erreur";
      setToast({ message: msg, type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && categories.length === 0) return <LoadingIndicator text="Chargement des catégories..." />;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Modal + Bouton ── */}
      <ModalShell
        id="category-modal"
        title="Categories actives"
        triggerContent={
          <>
            <IconPlus className="h-4 w-4" />
            Nouvelle categorie
          </>
        }
      >
        <ModalHeader title="Ajouter une catégorie" closeId="category-modal" />
        <CategoryFormInline
          onCreated={() => { loadCategories(); }}
          closeId="category-modal"
        />
      </ModalShell>

      {/* ── Liste ── */}
      <div className="mt-4 grid gap-4">
        {categories.length === 0 && (
          <p className="text-center text-sm text-[var(--ink-subtle)] py-8">Aucune catégorie. Créez votre première catégorie.</p>
        )}

        {categories.map((cat) => {
          const limite = cat.limite ?? 0;
          const spent = categorySpending[cat.id] ?? 0;
          const isLimitExceeded = limite > 0 && spent >= limite;

          return (
            <div
              key={cat.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-white/10 text-[var(--accent)]">
                  <IconTag className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{cat.libelle}</p>
                    {isLimitExceeded && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                        Limite atteinte
                      </span>
                    )}
                  </div>
                  {limite > 0 && <LimitBar current={spent} limit={limite} />}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold whitespace-nowrap">{limite > 0 ? `${formatCurrency(limite)} Ar` : "—"}</p>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition disabled:opacity-40"
                  title="Supprimer la catégorie"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Formulaire inline ───────────────────────────────────
function CategoryFormInline({
  onCreated,
  closeId,
}: {
  onCreated: () => void;
  closeId: string;
}) {
  const [nom, setNom] = useState("");
  const [limite, setLimite] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: any = { libelle: nom };
      if (limite.trim() !== "") {
        const val = parseFloat(limite.replace(",", "."));
        if (isNaN(val) || val < 0) { setError("Limite invalide"); setSaving(false); return; }
        payload.limite = val;
      }
      await ReferenceService.createCategory(payload);
      setNom("");
      setLimite("");
      onCreated();
      (document.getElementById(closeId) as HTMLInputElement | null)?.click?.();
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Nom de la categorie
        <input
          type="text"
          placeholder="Ex: Nourriture"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Limite mensuelle (optionnel)
        <input
          type="text"
          placeholder="0,00"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="mt-2 h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
      >
        {saving ? "Création..." : "Ajouter la categorie"}
      </button>
      <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
        <IconTag className="h-4 w-4" />
        Les limites servent à générer un avertissement lors des dépenses.
      </div>
    </form>
  );
}
