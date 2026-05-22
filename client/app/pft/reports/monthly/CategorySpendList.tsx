"use client";

import { useState, useEffect } from "react";
import { ReportService, CategorySpending } from "../../../services/report/ReportService";
import { formatCurrency } from "../../../utils/currency";
import LoadingIndicator from "../../../components/LoadingIndicator";

export default function CategorySpendList({
  utilisateurId,
  compteId,
  year,
  month,
}: {
  utilisateurId: number;
  compteId: number;
  year: number;
  month: number;
}) {
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, [utilisateurId, compteId, year, month]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ReportService.getCategorySpendingForMonth(
        utilisateurId,
        compteId,
        year,
        month
      );
      setCategories(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator text="Chargement des dépenses..." />;

  if (error)
    return (
      <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl">
        {error}
      </div>
    );

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return "bg-red-500";
    if (pct >= 80) return "bg-orange-500";
    if (pct >= 50) return "bg-amber-400";
    return "bg-emerald-500";
  };

  return (
    <section className="mt-8 rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
      <h2 className="text-lg font-semibold">Dépenses par catégorie</h2>
      <div className="mt-5 grid gap-4">
        {categories.length === 0 ? (
          <p className="text-center text-sm text-[var(--ink-subtle)] py-6">
            Aucune dépense pour cette période
          </p>
        ) : (
          categories.map((item) => {
            const pct = item.limit > 0 ? Math.min((item.spent / item.limit) * 100, 100) : 0;
            return (
              <div
                key={item.categoryId}
                className="rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{item.categoryName}</p>
                    <p className="text-xs text-[var(--ink-subtle)]">
                      {formatCurrency(item.spent)} Ar / {formatCurrency(item.limit)} Ar
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{Math.round(pct)}%</p>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(pct)} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

