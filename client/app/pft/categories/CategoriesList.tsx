import { IconTag } from "../components/icons";

const items = [
  { label: "Nourriture", limite: "250,00" },
  { label: "Transport", limite: "120,00" },
  { label: "Loisirs", limite: "150,00" },
];

export default function CategoriesList() {
  return (
    <div className="mt-6 grid gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f6f2] dark:bg-[#1a1d1e] p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-white/10 text-[var(--accent)]">
              <IconTag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-[var(--ink-subtle)]">Limite mensuelle</p>
            </div>
          </div>
          <p className="text-sm font-semibold">{item.limite} Ar</p>
        </div>
      ))}
    </div>
  );
}
