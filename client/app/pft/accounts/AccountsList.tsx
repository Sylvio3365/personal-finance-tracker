"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconWallet,
  IconTrash,
  IconFilter,
  IconRefresh,
  IconCheck,
} from "../components/icons";
import Toast from "../../components/Toast";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  AccountService,
  AccountResponse,
  TypeCompte,
} from "../../services/account/AccountService";
import { UserService } from "../../services/user/UserService";
import { formatCurrency } from "../../utils/currency";

interface AccountsListProps {
  refreshTrigger?: number;
}

interface Filters {
  typeCompteId?: number;
  searchTerm?: string;
  minSolde?: number;
  maxSolde?: number;
}

// Formatage des nombres avec séparateurs de milliers


// Couleurs par type de compte (hardcodées, ne touche pas au thème global)
const TYPE_COLORS: Record<string, string> = {
  Courant: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Epargne:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Cash: "bg-amber-100 text-amber-700  dark:bg-amber-500/20  dark:text-amber-400",
  Crédit:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  Investissement:
    "bg-teal-100 text-teal-700    dark:bg-teal-500/20    dark:text-teal-400",
};

function getTypeColor(nom: string): string {
  return (
    TYPE_COLORS[nom] ||
    "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
  );
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

export default function AccountsList({ refreshTrigger }: AccountsListProps) {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [typeComptes, setTypeComptes] = useState<TypeCompte[]>([]);
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
  const [tempFilters, setTempFilters] = useState<Filters>({});
  const [activeFilters, setActiveFilters] = useState<Filters>({});

  // ─── Chargement ──────────────────────────────────────────
  const loadAccounts = async () => {
    try {
      setLoading(true);
      const user = UserService.getStoredUser();
      if (!user) {
        setToast({ message: "Utilisateur non trouvé", type: "error" });
        return;
      }

      if (typeComptes.length === 0) {
        const types = await AccountService.getTypeComptes();
        setTypeComptes(types);
      }

      const userId = parseInt(String(user.id), 10);

      const response = await AccountService.listByUtilisateurWithFilters(
        userId,
        currentPage,
        itemsPerPage,
        activeFilters,
      );

      setAccounts(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [refreshTrigger, currentPage, activeFilters]);

  // ─── Suppression ─────────────────────────────────────────
  const handleDelete = async (compteId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) return;
    try {
      await AccountService.delete(compteId);
      setToast({ message: "Compte supprimé avec succès !", type: "success" });
      loadAccounts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  // ─── Filtres ─────────────────────────────────────────────
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

  // ─── Pagination ──────────────────────────────────────────
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getTypeCompteName = (typeId: number): string => {
    const type = typeComptes.find((t) => t.id === typeId);
    return type?.nom || "Type inconnu";
  };

  // ─── Rendu ───────────────────────────────────────────────
  if (loading && accounts.length === 0) {
    return <LoadingIndicator text="Chargement de vos comptes..." />;
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
            Vos comptes
            {totalItems > 0 && (
              <span className="ml-2 text-xs text-[var(--ink-subtle)]">
                ({totalItems} compte{totalItems > 1 ? "s" : ""})
              </span>
            )}
          </h3>
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
          <div className="grid gap-4 md:grid-cols-2">
            {/* Type de compte — CustomSelect */}
            <label className="grid gap-2 text-sm font-medium">
              Type de compte
              <CustomSelect
                value={tempFilters.typeCompteId?.toString() || ""}
                onChange={(v) =>
                  setTempFilters({
                    ...tempFilters,
                    typeCompteId: v ? parseInt(v, 10) : undefined,
                  })
                }
                options={[
                  { label: "Tous les types", value: "" },
                  ...typeComptes.map((t) => ({
                    label: t.nom,
                    value: t.id.toString(),
                  })),
                ]}
              />
            </label>

            {/* Recherche par nom */}
            <label className="grid gap-2 text-sm font-medium">
              Rechercher un compte
              <input
                type="text"
                value={tempFilters.searchTerm || ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    searchTerm: e.target.value || undefined,
                  })
                }
                placeholder="Nom du compte..."
                className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            {/* Solde minimum */}
            <label className="grid gap-2 text-sm font-medium">
              Solde minimum (Ar)
              <input
                type="text"
                inputMode="decimal"
                value={tempFilters.minSolde ? tempFilters.minSolde.toString() : ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    minSolde: e.target.value ? parseFloat(e.target.value.replace(",", ".")) : undefined,
                  })
                }
                placeholder="0,00"
                className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            {/* Solde maximum */}
            <label className="grid gap-2 text-sm font-medium">
              Solde maximum (Ar)
              <input
                type="text"
                inputMode="decimal"
                value={tempFilters.maxSolde ? tempFilters.maxSolde.toString() : ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    maxSolde: e.target.value ? parseFloat(e.target.value.replace(",", ".")) : undefined,
                  })
                }
                placeholder="999999,99"
                className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          {/* Boutons Valider / Réinitialiser — icônes */}
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

      {/* ── Résultat vide / Liste ── */}
      {accounts.length === 0 ? (
        <div className="text-center text-sm text-[var(--ink-subtle)] py-8">
          {Object.keys(activeFilters).length > 0
            ? "Aucun compte ne correspond à vos critères."
            : "Aucun compte. Créez votre premier compte pour commencer !"}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {accounts.map((compte) => {
              const typeName = getTypeCompteName(compte.typeCompteId);
              return (
                <div
                  key={compte.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-white/10 text-[var(--accent)]">
                      <IconWallet className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{compte.nom}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium leading-tight ${getTypeColor(typeName)}`}
                      >
                        {typeName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(compte.soldeActuel)} Ar
                      </p>
                      <p className="text-[11px] text-[var(--ink-subtle)]">
                        Solde actuel
                      </p>
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
              );
            })}
          </div>

          {/* ── Pagination backend ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-black/10 dark:border-white/10">
              <div className="text-xs text-[var(--ink-subtle)]">
                Page {currentPage} sur {totalPages}
                <span className="hidden sm:inline ml-1">
                  ({totalItems} résultat{totalItems > 1 ? "s" : ""})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(pageNum)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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
