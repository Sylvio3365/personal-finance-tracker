const categories = [
  { label: "Nourriture", total: "210,00", limite: "250,00", pct: 84 },
  { label: "Transport", total: "95,00", limite: "120,00", pct: 79 },
  { label: "Loisirs", total: "135,30", limite: "150,00", pct: 90 },
];

export default function CategorySpendList() {
  return (
    <section className="mt-8 rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
      <h2 className="text-lg font-semibold">Depenses par categorie</h2>
      <div className="mt-5 grid gap-4">
        {categories.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-black/5 bg-[#f8f6f2] p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-[var(--ink-subtle)]">
                  {item.total} EUR / {item.limite} EUR
                </p>
              </div>
              <p className="text-sm font-semibold">{item.pct}%</p>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-[var(--accent)]"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
