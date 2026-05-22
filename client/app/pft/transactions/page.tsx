"use client";

import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { IconList } from "../components/icons";
import TransactionModal from "./TransactionModal";
import TransactionsList from "./TransactionsList";

export default function TransactionsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-5xl">
        <PageHeader
          eyebrow="Transactions"
          title="Suivez revenus et depenses, compte par compte."
          description="Chaque transaction a un montant, une date, une note optionnelle et une categorie. Le solde se met a jour automatiquement, sans jamais passer sous zero."
          icon={<IconList className="h-5 w-5" />}
        />

        <section className="mt-8 rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
          <TransactionModal onTransactionCreated={() => setRefreshTrigger((prev) => prev + 1)} />
          <TransactionsList refreshTrigger={refreshTrigger} />
        </section>
      </main>
    </div>
  );
}
