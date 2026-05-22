"use client";

import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { IconChart } from "../../components/icons";
import SummaryCards from "./SummaryCards";
import CategorySpendList from "./CategorySpendList";
import { UserService } from "../../../services/user/UserService";
import { AccountService, AccountResponse } from "../../../services/account/AccountService";
import LoadingIndicator from "../../../components/LoadingIndicator";
import CustomSelect from "../../components/CustomSelect";
import { formatCurrency } from "../../../utils/currency";

export default function MonthlyReportPage() {
  const [user, setUser] = useState<{ id: number } | null>(null);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = UserService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      loadAccounts(storedUser.id);
    }
  }, []);

  const loadAccounts = async (userId: number) => {
    try {
      setLoading(true);
      const data = await AccountService.listByUtilisateur(userId);
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      console.error("Erreur chargement comptes:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (!user || loading) return <LoadingIndicator text="Chargement..." />;

  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-5xl">
        <PageHeader
          eyebrow="Résumé mensuel"
          title="Une vue complète, mois par mois."
          description="Total revenus, total dépenses, solde net et détail par catégorie avec progression."
          icon={<IconChart className="h-5 w-5" />}
        />

        {/* ── Sélecteurs ── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Compte</label>
            <CustomSelect
              value={selectedAccount?.toString() || ""}
              onChange={(v) => setSelectedAccount(v ? Number(v) : null)}
              options={[
                { label: "Choisir un compte", value: "" },
                ...accounts.map((acc) => ({
                  label: acc.nom,
                  value: acc.id.toString(),
                })),
              ]}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Année</label>
            <CustomSelect
              value={selectedYear.toString()}
              onChange={(v) => setSelectedYear(Number(v))}
              options={years.map((y) => ({
                label: y.toString(),
                value: y.toString(),
              }))}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Mois</label>
            <CustomSelect
              value={selectedMonth.toString()}
              onChange={(v) => setSelectedMonth(Number(v))}
              options={months.map((m) => ({
                label: new Date(2000, m - 1).toLocaleDateString("fr-FR", { month: "long" }),
                value: m.toString(),
              }))}
            />
          </div>
        </div>

        {/* ── Solde de tous les comptes ── */}
        {accounts.length > 0 && (
          <div className="mt-8 rounded-3xl border border-black/5 bg-[var(--surface)] p-6">
            <h3 className="text-sm font-medium text-[var(--ink)] mb-4">Solde de tous les comptes</h3>
            <div className="grid gap-3">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                  <span className="text-sm font-medium">{account.nom}</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{formatCurrency(account.soldeActuel)} Ar</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Contenu ── */}
        {selectedAccount && user ? (
          <>
            <SummaryCards
              utilisateurId={user.id}
              compteId={selectedAccount}
              year={selectedYear}
              month={selectedMonth}
            />
            <CategorySpendList
              utilisateurId={user.id}
              compteId={selectedAccount}
              year={selectedYear}
              month={selectedMonth}
            />
          </>
        ) : (
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-2xl">
            Sélectionnez un compte pour afficher le résumé mensuel
          </div>
        )}
      </main>
    </div>
  );
}

