"use client";

import { useEffect, useState } from "react";
import PageHeader from "./components/PageHeader";
import { IconChart } from "./components/icons";
import SummaryCards from "./reports/monthly/SummaryCards";
import CategorySpendList from "./reports/monthly/CategorySpendList";
import { UserService } from "../services/user/UserService";
import { AccountService, AccountResponse } from "../services/account/AccountService";
import LoadingIndicator from "../components/LoadingIndicator";
import CustomSelect from "./components/CustomSelect";

export default function DashboardPage() {
    const [user, setUser] = useState<{ id: number } | null>(null);
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [tempAccount, setTempAccount] = useState<string>("all");
    const [tempYear, setTempYear] = useState(new Date().getFullYear());
    const [tempMonth, setTempMonth] = useState(new Date().getMonth() + 1);
    const [selectedAccount, setSelectedAccount] = useState<string>("all");
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
                setTempAccount("all");
                setSelectedAccount("all");
                setSelectedYear(new Date().getFullYear());
                setSelectedMonth(new Date().getMonth() + 1);
            }
        } catch (error) {
            console.error("Erreur chargement comptes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = () => {
        setSelectedAccount(tempAccount);
        setSelectedYear(tempYear);
        setSelectedMonth(tempMonth);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    if (!user) return <LoadingIndicator text="Chargement..." />;

    return (
        <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
            <main className="mx-auto mt-6 w-full max-w-5xl">
                <PageHeader
                    eyebrow="Dashboard"
                    title="Une vue complète, mois par mois."
                    description="Total revenus, total dépenses, solde net et détail par catégorie avec progression."
                    icon={<IconChart className="h-5 w-5" />}
                />

                <div className="mt-8 grid gap-4 sm:grid-cols-4 items-end">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Compte</label>
                        <CustomSelect
                            value={tempAccount}
                            onChange={setTempAccount}
                            options={[
                                { label: "Tous les comptes", value: "all" },
                                ...accounts.map((account) => ({
                                    label: account.nom,
                                    value: account.id.toString(),
                                })),
                            ]}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Année</label>
                        <CustomSelect
                            value={tempYear.toString()}
                            onChange={(v) => setTempYear(Number(v))}
                            options={years.map((year) => ({
                                label: year.toString(),
                                value: year.toString(),
                            }))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Mois</label>
                        <CustomSelect
                            value={tempMonth.toString()}
                            onChange={(v) => setTempMonth(Number(v))}
                            options={months.map((month) => ({
                                label: new Date(2000, month - 1).toLocaleDateString("fr-FR", { month: "long" }),
                                value: month.toString(),
                            }))}
                        />
                    </div>

                    <div>
                        <button
                            onClick={handleValidate}
                            className="h-11 w-full rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-95 active:scale-[0.98] transition shadow-md shadow-[var(--accent)]/20"
                        >
                            Filtrer
                        </button>
                    </div>
                </div>

                {user ? (
                    <>
                        <SummaryCards
                            utilisateurId={user.id}
                            compteId={selectedAccount === "all" ? null : Number(selectedAccount)}
                            year={selectedYear}
                            month={selectedMonth}
                        />
                        <CategorySpendList
                            utilisateurId={user.id}
                            compteId={selectedAccount === "all" ? null : Number(selectedAccount)}
                            year={selectedYear}
                            month={selectedMonth}
                        />
                    </>
                ) : (
                    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200">
                        Sélectionnez un compte et cliquez sur Filtrer pour afficher le dashboard.
                    </div>
                )}
            </main>
        </div>
    );
}
