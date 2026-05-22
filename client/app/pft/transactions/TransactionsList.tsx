"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  IconWallet,
  IconTrash,
  IconFilter,
  IconRefresh,
  IconCheck,
  IconPlus,
  IconTag,
} from "../components/icons";
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
  AccountService,
  AccountResponse,
  TypeCompte,
} from "../../services/account/AccountService";
import {
  TransactionService,
  TransactionData,
  TransactionFilters,
} from "../../services/transaction/TransactionService";
import { UserService } from "../../services/user/UserService";
import { formatCurrency } from "../../utils/currency";
import { ReferenceService, Category } from "../../services/reference/ReferenceService";

interface TransactionsListProps {
  refreshTrigger?: number;
}

// ── Icon Map ──
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

function getTypeAmountColor(libelle: string): string {
  return libelle.toLowerCase() === "revenu"
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Select réutilisable avec menu déroulant personnalisé (pas de <select> natif).
 */
function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="h-11 w-full rounded-2xl border border-[var(--accent)]/30 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 pr-10 text-sm outline-none transition-all duration-200 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/5 dark:hover:bg-[var(--accent)]/10 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 cursor-pointer text-left flex items-center justify-between"
      >
        <span
          className={`truncate ${!value ? "text-[var(--ink-subtle)]" : ""}`}
        >
          {selectedLabel}
        </span>
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-subtle)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-2xl border border-[var(--accent)]/20 bg-white dark:bg-[#1a1d1e] shadow-lg shadow-black/5 dark:shadow-black/30 py-1 text-sm">
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 transition-colors ${
                      selected
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                        : "text-[var(--foreground)] hover:bg-[var(--accent)]/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selected && (
                      <svg
                        className="h-4 w-4 text-[var(--accent)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default function TransactionsList({
  refreshTrigger,
}: TransactionsListProps) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [comptes, setComptes] = useState<AccountResponse[]>([]);
  const [typesCompte, setTypesCompte] = useState<TypeCompte[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<TransactionFilters>({});
  const [activeFilters, setActiveFilters] = useState<TransactionFilters>({});

  // ─── Chargement des références (comptes) ───────────────────
  const loadReferences = async () => {
    const user = UserService.getStoredUser();
    if (!user) return;

    if (comptes.length === 0) {
      const raw = await AccountService.listByUtilisateur(
        parseInt(String(user.id), 10),
      );
      setComptes(raw);
    }
    if (typesCompte.length === 0) {
      setTypesCompte(await AccountService.getTypeComptes());
    }
    if (categories.length === 0) {
      setCategories(await ReferenceService.getCategories());
    }
  };

  // ─── Chargement des transactions ──────────────────────────
  const loadTransactions = async () => {
    try {
      setLoading(true);
      await loadReferences();

      const user = UserService.getStoredUser();
      if (!user) {
        setToast({ message: "Utilisateur non trouvé", type: "error" });
        return;
      }

      const userId = parseInt(String(user.id), 10);
      const response = await TransactionService.listPaginated(
        userId,
        currentPage,
        itemsPerPage,
        activeFilters,
      );

      setTransactions(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);

      // Display warnings for transactions with warnings
      const transactionsWithWarnings = response.data.filter((tx) => tx.warning);
      if (transactionsWithWarnings.length > 0) {
        const warningMessages = transactionsWithWarnings.map((tx) => tx.warning).filter((w): w is string => Boolean(w));
        if (warningMessages.length > 0) {
          setToast({ message: warningMessages[0], type: "error" });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [refreshTrigger, currentPage, activeFilters]);

  // ─── Filtres ──────────────────────────────────────────────
  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setTempFilters({});
    setActiveFilters({});
    setCurrentPage(1);
    setShowFilters(false);
  };

  const getCompteName = (compteId: number): string => {
    return comptes.find((c) => c.id === compteId)?.nom || "Compte inconnu";
  };

  // ─── Rendu ────────────────────────────────────────────────
  if (loading) {
    return <LoadingIndicator text="Chargement des transactions..." />;
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

      {/* ── Header + bouton Filtrer ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--ink)]">
            Toutes les transactions
            {totalItems > 0 && (
              <span className="ml-2 text-xs text-[var(--ink-subtle)]">
                ({totalItems} entrée{totalItems > 1 ? "s" : ""})
              </span>
            )}
          </h3>
          <a
            href="/pft/categories"
            className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline mt-1"
          >
            <IconTag className="h-3 w-3" />
            Voir liste catégories
          </a>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
            Object.keys(activeFilters).length > 0
              ? "bg-[var(--accent)] text-white"
              : "border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          }`}
        >
          <IconFilter className="h-4 w-4" />
          Filtrer
          {Object.keys(activeFilters).length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </button>
      </div>

      {/* ── Panneau de filtres ── */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8f6f2] dark:bg-[#1a1d1e]">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Compte */}
            <label className="grid gap-2 text-sm font-medium">
              Compte
              <CustomSelect
                value={tempFilters.compteId?.toString() || ""}
                onChange={(v) =>
                  setTempFilters({
                    ...tempFilters,
                    compteId: v ? parseInt(v, 10) : undefined,
                  })
                }
                options={[
                  { label: "Tous les comptes", value: "" },
                  ...comptes.map((c) => ({
                    label: c.nom,
                    value: c.id.toString(),
                  })),
                ]}
              />
            </label>

            {/* Type de transaction */}
            <label className="grid gap-2 text-sm font-medium">
              Type
              <CustomSelect
                value={tempFilters.transactionTypeId?.toString() || ""}
                onChange={(v) =>
                  setTempFilters({
                    ...tempFilters,
                    transactionTypeId: v ? parseInt(v, 10) : undefined,
                  })
                }
                options={[
                  { label: "Tous les types", value: "" },
                  { label: "Revenu", value: "1" },
                  { label: "Dépense", value: "2" },
                ]}
              />
            </label>

            {/* Catégorie */}
            <label className="grid gap-2 text-sm font-medium">
              Catégorie
              <CustomSelect
                value={tempFilters.categorieId?.toString() || ""}
                onChange={(v) =>
                  setTempFilters({
                    ...tempFilters,
                    categorieId: v ? parseInt(v, 10) : undefined,
                  })
                }
                options={[
                  { label: "Toutes les catégories", value: "" },
                  ...categories.map((cat) => ({
                    label: cat.libelle,
                    value: cat.id.toString(),
                  })),
                ]}
              />
            </label>

            {/* Montant minimum */}
            <label className="grid gap-2 text-sm font-medium">
              Montant minimum (Ar)
              <input
                type="text"
                inputMode="decimal"
                value={tempFilters.minMontant ? tempFilters.minMontant.toString() : ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    minMontant: e.target.value ? parseFloat(e.target.value.replace(",", ".")) : undefined,
                  })
                }
                placeholder="0,00"
                className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            {/* Montant maximum */}
            <label className="grid gap-2 text-sm font-medium">
              Montant maximum (Ar)
              <input
                type="text"
                inputMode="decimal"
                value={tempFilters.maxMontant ? tempFilters.maxMontant.toString() : ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    maxMontant: e.target.value ? parseFloat(e.target.value.replace(",", ".")) : undefined,
                  })
                }
                placeholder="999999,99"
                className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          {/* Boutons Valider / Réinitialiser avec icônes */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-2xl text-sm font-semibold transition hover:brightness-95 active:scale-[0.98]"
            >
              <IconCheck className="h-4 w-4" />
              Valider les filtres
            </button>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-2xl text-sm transition hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98]"
            >
              <IconRefresh className="h-4 w-4" />
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* ── Liste des transactions ── */}
      {transactions.length === 0 ? (
        <div className="text-center text-sm text-[var(--ink-subtle)] py-8">
          {Object.keys(activeFilters).length > 0
            ? "Aucune transaction ne correspond à vos critères."
            : "Aucune transaction. Ajoutez votre première transaction pour commencer !"}
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {transactions.map((tx) => {
              const isRevenu =
                tx.transactionTypeLibelle.toLowerCase() === "revenu";
              const amountColor = isRevenu
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400";
              return (
                <div
                  key={tx.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 text-[var(--accent)] shadow-sm">
                      {tx.categorieIcon && ICON_MAP[tx.categorieIcon] ? (
                        <Icon path={ICON_MAP[tx.categorieIcon]} size={1} color="var(--accent)" />
                      ) : (
                        <IconWallet className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--foreground)]">{tx.categorieLibelle}</span>
                      <span className="text-xs text-[var(--ink-subtle)] flex items-center gap-1">
                        <IconWallet className="h-3 w-3" />
                        {getCompteName(tx.utilisateurCompteId)}
                      </span>
                      {tx.note && (
                        <p className="text-xs text-[var(--ink-subtle)] italic truncate max-w-[200px]">
                          {tx.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-semibold whitespace-nowrap ${amountColor}`}
                    >
                      {isRevenu ? "+" : "-"}
                      {formatCurrency(Math.abs(tx.montant))}
                    </span>
                    <span className="text-[11px] text-[var(--ink-subtle)] whitespace-nowrap">
                      {formatDate(tx.dateTransaction)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination backend ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-black/10 dark:border-white/10">
              <div className="text-xs text-[var(--ink-subtle)]">
                Page {currentPage} sur {totalPages}
                <span className="hidden sm:inline ml-1">
                  ({totalItems} entrée{totalItems > 1 ? "s" : ""})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-black/10 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  Précédent
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`hidden sm:block px-3 py-1.5 rounded-lg text-sm transition ${
                          currentPage === pageNum
                            ? "bg-[var(--accent)] text-white"
                            : "border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm border border-black/10 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
