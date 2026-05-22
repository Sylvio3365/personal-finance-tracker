"use client";

import React, { useState, useEffect } from "react";
import { IconList, IconPlus, IconTag } from "../components/icons";
import Icon from "@mdi/react";
import {
  mdiShopping,
  mdiHome,
  mdiCar,
  mdiSilverwareForkKnife,
  mdiHeart,
  mdiBriefcase,
  mdiSchool,
  mdiAirplane,
  mdiPhone,
  mdiTshirtCrew,
  mdiLightningBolt,
  mdiDumbbell,
  mdiMusic,
  mdiBook,
  mdiCoffee,
  mdiGift,
  mdiFilmstrip,
  mdiGamepadVariant,
  mdiMedicalBag,
  mdiBabyCarriage,
  mdiPaw,
  mdiFood,
  mdiWallet,
  mdiHeartPulse,
  mdiCash,
  mdiCreditCard,
  mdiBank,
  mdiChartLine,
  mdiTag,
} from "@mdi/js";
import Toast from "../../components/Toast";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  ReferenceService,
  Category,
} from "../../services/reference/ReferenceService";
import { TransactionService } from "../../services/transaction/TransactionService";
import { formatCurrency } from "../../utils/currency";

const ICON_MAP: Record<string, string> = {
  "mdi:shopping": mdiShopping,
  "mdi:home": mdiHome,
  "mdi:car": mdiCar,
  "mdi:silverware-fork-knife": mdiSilverwareForkKnife,
  "mdi:heart": mdiHeart,
  "mdi:briefcase": mdiBriefcase,
  "mdi:school": mdiSchool,
  "mdi:airplane": mdiAirplane,
  "mdi:phone": mdiPhone,
  "mdi:tshirt-crew": mdiTshirtCrew,
  "mdi:lightning-bolt": mdiLightningBolt,
  "mdi:dumbbell": mdiDumbbell,
  "mdi:music": mdiMusic,
  "mdi:book": mdiBook,
  "mdi:coffee": mdiCoffee,
  "mdi:gift": mdiGift,
  "mdi:filmstrip": mdiFilmstrip,
  "mdi:gamepad-variant": mdiGamepadVariant,
  "mdi:medical-bag": mdiMedicalBag,
  "mdi:baby-carriage": mdiBabyCarriage,
  "mdi:paw": mdiPaw,
  "mdi:food": mdiFood,
  "mdi:wallet": mdiWallet,
  "mdi:heart-pulse": mdiHeartPulse,
  "mdi:cash": mdiCash,
  "mdi:credit-card": mdiCreditCard,
  "mdi:bank": mdiBank,
  "mdi:chart-line": mdiChartLine,
  "mdi:tag": mdiTag,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categorySpending, setCategorySpending] = useState<
    Record<number, number>
  >({});
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await ReferenceService.getCategories();
      setCategories(data);
      setCurrentPage(1);

      const spending: Record<number, number> = {};
      for (const cat of data) {
        try {
          const sum = await TransactionService.getSumDepenseByCategory(cat.id);
          spending[cat.id] = sum;
        } catch (error) {
          console.warn(
            `Failed to load spending for category ${cat.id}:`,
            error,
          );
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

  useEffect(() => {
    loadCategories();
  }, []);

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
    const newActive = !category.active;
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, active: newActive } : c)),
    );

    try {
      const updated = await ReferenceService.updateCategory(category.id, {
        active: newActive,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      setToast({
        message: `Catégorie ${updated.active ? "activée" : "désactivée"}`,
        type: "success",
      });
    } catch (error) {
      // Revert on error
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? category : c)),
      );
      const msg =
        error instanceof Error
          ? error.message
          : "Erreur lors de la modification";
      setToast({ message: msg, type: "error" });
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  if (loading && categories.length === 0)
    return <LoadingIndicator text="Chargement des catégories..." />;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95"
        >
          <IconPlus className="h-4 w-4" />
          Nouvelle categorie
        </button>
      </div>

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#f8f6f2] dark:bg-[#1a1d1e] p-8 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between pb-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Ajouter une catégorie</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-subtle)] transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CategoryFormInline
              onSuccess={() => {
                loadCategories();
                setShowCreateModal(false);
              }}
              closeId=""
            />
          </div>
        </div>
      )}

      {/* Modal Edition */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#f8f6f2] dark:bg-[#1a1d1e] p-8 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between pb-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Modifier la catégorie</h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-subtle)] transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CategoryFormInline
              initialData={editingCategory}
              onSuccess={() => {
                loadCategories();
                setEditingCategory(null);
                setToast({ message: "Catégorie modifiée avec succès", type: "success" });
              }}
              closeId="edit-modal-close"
            />
          </div>
        </div>
      )}

      {/* Tableau des catégories */}
      <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#1a1d1e] shadow-xl shadow-black/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.02]">
            <tr>
              <th className="px-6 py-4 font-semibold text-[var(--ink-subtle)]">Icône</th>
              <th className="px-6 py-4 font-semibold text-[var(--ink-subtle)]">Catégorie</th>
              <th className="px-6 py-4 font-semibold text-right text-[var(--ink-subtle)]">Dépenses</th>
              <th className="px-6 py-4 font-semibold text-right text-[var(--ink-subtle)]">Limite</th>
              <th className="px-6 py-4 font-semibold text-center text-[var(--ink-subtle)]">Statut</th>
              <th className="px-6 py-4 font-semibold text-center text-[var(--ink-subtle)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/10">
                      <IconTag className="h-8 w-8 text-[var(--ink-subtle)]" />
                    </div>
                    <p className="text-[var(--ink-subtle)]">Aucune catégorie. Créez votre première catégorie.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => {
                const limite = cat.limite ?? 0;
                const spent = categorySpending[cat.id] ?? 0;
                const isLimitExceeded = limite > 0 && spent >= limite;

                return (
                  <tr
                    key={cat.id}
                    className="border-b border-black/5 dark:border-white/5 last:border-0 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 text-[var(--accent)] shadow-sm">
                        {cat.icon && ICON_MAP[cat.icon] ? (
                          <Icon path={ICON_MAP[cat.icon]} size={1.25} color="var(--accent)" />
                        ) : (
                          <IconList className="h-5 w-5" />
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{cat.libelle}</p>
                          {isLimitExceeded && (
                            <span className="inline-flex items-center gap-1.5 mt-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Limite atteinte
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[var(--foreground)]">
                      {formatCurrency(spent)} Ar
                    </td>
                    <td className="px-6 py-4 text-right text-[var(--ink-subtle)]">
                      {limite > 0 ? `${formatCurrency(limite)} Ar` : "—"}
                    </td>

                    {/* ── STATUT ── */}
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`relative inline-flex h-7 w-13 items-center rounded-full transition-all duration-200 ${
                          cat.active
                            ? "bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/30"
                            : "bg-black/15 dark:bg-white/15"
                        }`}
                        title={cat.active ? "Désactiver" : "Activer"}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            cat.active ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    {/* ── ACTIONS ── */}
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--ink-subtle)] transition-all hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
                        title="Modifier"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-[var(--ink-subtle)]">
            Affichage {startIndex + 1}-{Math.min(endIndex, categories.length)} sur {categories.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 text-[var(--ink-subtle)] transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30"
                    : "border border-black/10 dark:border-white/10 text-[var(--ink-subtle)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 text-[var(--ink-subtle)] transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Icon Picker Component ───────────────────────────────────
function IconPicker({ selectedIcon, onSelect }: { selectedIcon?: string; onSelect: (icon: string) => void }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {ICON_OPTIONS.map((iconName) => {
        const iconPath = ICON_MAP[iconName];
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onSelect(iconName)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              selectedIcon === iconName
                ? "bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/30"
                : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15"
            }`}
            title={iconName}
          >
            <Icon
              path={iconPath}
              size={1.25}
              color={selectedIcon === iconName ? "white" : "var(--ink-subtle)"}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Formulaire inline ───────────────────────────────────
function CategoryFormInline({
  onSuccess,
  closeId,
  initialData,
}: {
  onSuccess: () => void;
  closeId: string;
  initialData?: Category;
}) {
  const [nom, setNom] = useState(initialData?.libelle || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [limite, setLimite] = useState(
    initialData?.limite ? initialData.limite.toString() : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: any = { libelle: nom, icon };
      if (limite.trim() !== "") {
        const val = parseFloat(limite.replace(",", "."));
        if (isNaN(val) || val < 0) {
          setError("Limite invalide");
          setSaving(false);
          return;
        }
        payload.limite = val;
      } else {
        payload.limite = null;
      }

      if (initialData) {
        await ReferenceService.updateCategory(initialData.id, payload);
      } else {
        await ReferenceService.createCategory(payload);
        setNom("");
        setIcon("");
        setLimite("");
      }

      onSuccess();
      if (closeId !== "edit-modal-close") {
        (
          document.getElementById(closeId) as HTMLInputElement | null
        )?.click?.();
      }
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[var(--foreground)]">Nom de la catégorie</label>
        <input
          type="text"
          placeholder="Ex: Nourriture"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] px-4 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[var(--foreground)]">Icône</label>
        <IconPicker selectedIcon={icon} onSelect={setIcon} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[var(--foreground)]">Limite mensuelle (optionnel)</label>
        <input
          type="text"
          placeholder="0,00"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          className="h-12 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] px-4 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={saving}
        className="mt-2 h-12 w-full rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/20 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-[var(--accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving
          ? "Enregistrement..."
          : initialData
            ? "Modifier"
            : "Ajouter la catégorie"}
      </button>
      <div className="flex items-center gap-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-xs text-[var(--ink-subtle)]">
        <IconTag className="h-4 w-4" />
        Les limites servent à générer un avertissement lors des dépenses.
      </div>
    </form>
  );
}