import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { IconPlus, IconWallet } from "../components/icons";

export default function AccountModal() {
  return (
    <ModalShell
      id="account-modal"
      title="Vos comptes"
      triggerContent={
        <>
          <IconPlus className="h-4 w-4" />
          Nouveau compte
        </>
      }
    >
      <ModalHeader title="Ajouter un compte" closeId="account-modal" />
      <form className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Nom du compte
          <input
            type="text"
            placeholder="Ex: Courant"
            className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Type
          <select className="select-field h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-[var(--accent)]">
            <option>Compte courant</option>
            <option>Epargne</option>
            <option>Cash</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Solde initial
          <input
            type="text"
            placeholder="0,00"
            className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <button className="mt-2 h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95">
          Ajouter le compte
        </button>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
          <IconWallet className="h-4 w-4" />
          Le compte apparaitra dans la liste principale.
        </div>
      </form>
    </ModalShell>
  );
}
