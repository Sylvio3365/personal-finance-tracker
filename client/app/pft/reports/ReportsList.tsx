import Link from "next/link";
import { IconChart } from "../components/icons";

export default function ReportsList() {
  return (
    <section className="mt-8 grid gap-4">
      <Link
        className="flex items-center justify-between rounded-2xl border border-black/5 bg-[var(--surface)] p-5 text-sm font-semibold transition hover:border-[var(--accent)]"
        href="/pft/reports/monthly"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]">
            <IconChart className="h-5 w-5" />
          </span>
          Resume mensuel
        </span>
        <span className="text-xs text-[var(--ink-subtle)]">Voir</span>
      </Link>
    </section>
  );
}
