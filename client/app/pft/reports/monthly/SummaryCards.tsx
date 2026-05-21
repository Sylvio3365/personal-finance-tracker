const cards = [
  { label: "Total revenus", value: "2 200,00 Ar" },
  { label: "Total depenses", value: "-540,30 Ar" },
  { label: "Solde net", value: "+1 659,70 Ar" },
];

export default function SummaryCards() {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-black/5 bg-[var(--surface)] p-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-subtle)]">
            {card.label}
          </p>
          <p className="mt-4 text-2xl font-semibold">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
