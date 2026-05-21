import { IconWallet } from "../components/icons";

const accounts = [
  { nom: "Courant", type: "Compte courant", solde: "1 240,50" },
  { nom: "Epargne", type: "Livret", solde: "3 820,00" },
  { nom: "Cash", type: "Liquide", solde: "95,20" },
];

export default function AccountsList() {
  return (
    <div className="mt-6 grid gap-4">
      {accounts.map((compte) => (
        <div
          key={compte.nom}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#f8f6f2] p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--accent)]">
              <IconWallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{compte.nom}</p>
              <p className="text-xs text-[var(--ink-subtle)]">{compte.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{compte.solde} EUR</p>
            <p className="text-[11px] text-[var(--ink-subtle)]">Solde actuel</p>
          </div>
        </div>
      ))}
    </div>
  );
}
