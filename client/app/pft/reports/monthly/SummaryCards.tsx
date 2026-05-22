"use client";

import { useState, useEffect } from "react";
import { ReportService, MonthlySummary } from "../../../services/report/ReportService";
import { formatCurrency } from "../../../utils/currency";
import LoadingIndicator from "../../../components/LoadingIndicator";

export default function SummaryCards({
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
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSummary();
  }, [utilisateurId, compteId, year, month]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ReportService.getMonthlySummary(
        utilisateurId,
        compteId,
        year,
        month
      );
      setSummary(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator text="Chargement du résumé..." />;

  if (error)
    return (
      <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl">
        {error}
      </div>
    );

  const cards = [
    {
      label: "Total revenus",
      value: summary ? formatCurrency(summary.totalRevenue) : "0,00",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total dépenses",
      value: summary ? `−${formatCurrency(summary.totalDepense)}` : "0,00",
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Solde net",
      value: summary
        ? `${summary.soldeNet >= 0 ? "+" : ""}${formatCurrency(summary.soldeNet)}`
        : "0,00",
      color:
        summary && summary.soldeNet >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-black/5 bg-[var(--surface)] p-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-subtle)]">
            {card.label}
          </p>
          <p className={`mt-4 text-2xl font-semibold ${card.color}`}>
            {card.value} Ar
          </p>
        </div>
      ))}
    </section>
  );
}

