import { IconList } from "../components/icons";

const items = [
  { label: "Salaire", type: "Revenu", montant: "+2 200,00" },
  { label: "Courses", type: "Depense", montant: "-74,20" },
  { label: "Transport", type: "Depense", montant: "-34,00" },
];

export default function TransactionsList() {
  return (
    <div className="mt-6 grid gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f6f2] p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--accent)]">
              <IconList className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-[var(--ink-subtle)]">{item.type}</p>
            </div>
          </div>
          <p className="text-sm font-semibold">{item.montant} EUR</p>
        </div>
      ))}
    </div>
  );
}
