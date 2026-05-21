import PageHeader from "../../components/PageHeader";
import { IconChart } from "../../components/icons";
import SummaryCards from "./SummaryCards";
import CategorySpendList from "./CategorySpendList";

export default function MonthlyReportPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-5xl">
        <PageHeader
          eyebrow="Resume mensuel"
          title="Une vue complete, mois par mois."
          description="Total revenus, total depenses, solde net et detail par categorie avec progression."
          icon={<IconChart className="h-5 w-5" />}
        />

        <SummaryCards />
        <CategorySpendList />
      </main>
    </div>
  );
}
