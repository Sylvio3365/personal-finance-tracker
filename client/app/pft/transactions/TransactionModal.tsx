import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { IconList, IconPlus } from "../components/icons";

export default function TransactionModal() {
  return (
    <ModalShell
      id="transaction-modal"
      title="Historique recent"
      triggerContent={
        <>
          <IconPlus className="h-4 w-4" />
          Nouvelle transaction
        </>
      }
    >
      <ModalHeader title="Ajouter une transaction" closeId="transaction-modal" />
      <form className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Type
          <select className="select-field h-11 rounded-2xl border border-black/10 dark:border-white/10 px-4 text-sm outline-none transition focus:border-[var(--accent)]">
            <option>Revenu</option>
            <option>Depense</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Categorie
          <select className="select-field h-11 rounded-2xl border border-black/10 dark:border-white/10 px-4 text-sm outline-none transition focus:border-[var(--accent)]">
            <option>Nourriture</option>
            <option>Transport</option>
            <option>Salaire</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Montant
          <input
            type="text"
            placeholder="0,00"
            className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Date
          <input
            type="date"
            className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Note
          <input
            type="text"
            placeholder="Optionnel"
            className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <button className="mt-2 h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95">
          Enregistrer
        </button>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
          <IconList className="h-4 w-4" />
          Les revenus et depenses mettent a jour le solde.
        </div>
      </form>
    </ModalShell>
  );
}
