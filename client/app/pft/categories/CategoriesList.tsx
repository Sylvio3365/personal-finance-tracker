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

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categorySpending, setCategorySpending] = useState<Record<number, number>>({});
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await ReferenceService.getCategories();
      setCategories(data);
      
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

  const handleToggleActive = async (category: Category) => {
    try {
      const updated = await ReferenceService.updateCategory(category.id, {
        active: !category.active
      });
      setCategories((prev) => prev.map((c) => c.id === updated.id ? updated : c));
      setToast({ message: `Catégorie ${updated.active ? 'activée' : 'désactivée'}`, type: "success" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erreur lors de la modification";
      setToast({ message: msg, type: "error" });
    }
  };

  if (loading && categories.length === 0) return <LoadingIndicator text="Chargement des catégories..." />;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex gap-4">
        {/* Modal Création */}
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
            onSuccess={() => { loadCategories(); }}
            closeId="category-modal"
          />
        </ModalShell>
      </div>

      {/* Modal Edition */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#f8f6f2] dark:bg-[#1a1d1e] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-lg font-semibold">Modifier la catégorie</h2>
              <button 
                onClick={() => setEditingCategory(null)}
                className="text-sm text-[var(--ink-subtle)] hover:text-[var(--foreground)]"
              >
                Fermer
              </button>
            </div>
            <CategoryFormInline
              initialData={editingCategory}
              onSuccess={() => { 
                loadCategories();
                setEditingCategory(null);
              }}
              closeId="edit-modal-close"
            />
          </div>
        </div>
      )}

      {/* Tableau des catégories */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#1a1d1e]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <tr>
              <th className="p-4 font-semibold">Catégorie</th>
              <th className="p-4 font-semibold text-right">Dépenses</th>
              <th className="p-4 font-semibold text-right">Limite</th>
              <th className="p-4 font-semibold text-center">Statut</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--ink-subtle)]">
                  Aucune catégorie. Créez votre première catégorie.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const limite = cat.limite ?? 0;
                const spent = categorySpending[cat.id] ?? 0;
                const isLimitExceeded = limite > 0 && spent >= limite;

                return (
                  <tr key={cat.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-[var(--accent)]">
                          <IconTag className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium">{cat.libelle}</p>
                          {isLimitExceeded && (
                            <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                              Limite atteinte
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {formatCurrency(spent)} Ar
                    </td>
                    <td className="p-4 text-right text-[var(--ink-subtle)]">
                      {limite > 0 ? `${formatCurrency(limite)} Ar` : "—"}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cat.active ? 'bg-[var(--accent)]' : 'bg-black/20 dark:bg-white/20'
                        }`}
                        title={cat.active ? "Désactiver" : "Activer"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cat.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="p-2 text-[var(--ink-subtle)] hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition"
                          title="Modifier"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-2 text-[var(--ink-subtle)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition disabled:opacity-40"
                          title="Supprimer"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Formulaire inline ───────────────────────────────────
function CategoryFormInline({
  onSuccess,
  closeId,
  initialData
}: {
  onSuccess: () => void;
  closeId: string;
  initialData?: Category;
}) {
  const [nom, setNom] = useState(initialData?.libelle || "");
  const [limite, setLimite] = useState(initialData?.limite ? initialData.limite.toString() : "");
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
      } else {
        payload.limite = null; // To clear limit if it was set
      }

      if (initialData) {
        await ReferenceService.updateCategory(initialData.id, payload);
      } else {
        await ReferenceService.createCategory(payload);
        setNom("");
        setLimite("");
      }
      
      onSuccess();
      if (closeId !== "edit-modal-close") {
        (document.getElementById(closeId) as HTMLInputElement | null)?.click?.();
      }
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
        {saving ? "Enregistrement..." : (initialData ? "Modifier" : "Ajouter la categorie")}
      </button>
      <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
        <IconTag className="h-4 w-4" />
        Les limites servent à générer un avertissement lors des dépenses.
      </div>
    </form>
  );
}