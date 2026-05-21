import PageHeader from "../components/PageHeader";
import { IconWallet } from "../components/icons";
import AccountModal from "./AccountModal";
import AccountsList from "./AccountsList";

export default function AccountsPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-5xl">
        <PageHeader
          eyebrow="Gestion des comptes"
          title="Creez, consultez et organisez vos comptes."
          description="Chaque compte possede un nom, un type et un solde courant. Un compte avec des transactions existantes ne peut pas etre supprime."
          icon={<IconWallet className="h-5 w-5" />}
        />

        <section className="mt-8 rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
          <AccountModal />
          <AccountsList />
        </section>
      </main>
    </div>
  );
}
