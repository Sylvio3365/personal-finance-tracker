import ModalShell from "../components/ModalShell";
import ModalHeader from "../components/ModalHeader";
import { IconPlus, IconTag } from "../components/icons";

export default function CategoryModal() {
  return (
    <ModalShell
      id="category-modal"
      title="Categories actives"
      triggerContent={
        <>
          <IconPlus className="h-4 w-4" />
          Nouvelle categorie
        </>
      }
    >
      <ModalHeader title="Ajouter une categorie" closeId="category-modal" />
      <form className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Nom de la categorie
          <input
            type="text"
            placeholder="Ex: Nourriture"
            className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Limite mensuelle (optionnel)
          <input
            type="text"
            placeholder="0,00"
            className="h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <button className="mt-2 h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition hover:brightness-95">
          Ajouter la categorie
        </button>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
          <IconTag className="h-4 w-4" />
          Les limites servent a generer un avertissement.
        </div>
      </form>
    </ModalShell>
  );
}
