"use client";

import { useState, useEffect } from "react";
import { ReportService, CategorySpending } from "../../../services/report/ReportService";
import { formatCurrency } from "../../../utils/currency";
import LoadingIndicator from "../../../components/LoadingIndicator";
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
  mdiSwapHorizontal,
} from "@mdi/js";

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
  "mdi:swap-horizontal": mdiSwapHorizontal,
};

export default function CategorySpendList({
  utilisateurId,
  compteId,
  year,
  month,
}: {
  utilisateurId: number;
  compteId: number | null;
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
            const isLimitReached = pct >= 100 || item.depassement;
            return (
              <div
                key={item.categoryId}
                className="rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon && ICON_MAP[item.icon] ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 text-[var(--accent)] shadow-sm">
                        <Icon path={ICON_MAP[item.icon]} size={1} color="var(--accent)" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 text-[var(--accent)] shadow-sm">
                        <Icon path={mdiTag} size={1} color="var(--accent)" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{item.categoryName}</p>
                        {isLimitReached && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                            Limite atteinte
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--ink-subtle)]">
                        {formatCurrency(item.spent)} Ar / {formatCurrency(item.limit)} Ar
                      </p>
                    </div>
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

