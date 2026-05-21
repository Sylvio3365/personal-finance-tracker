import PageHeader from "../components/PageHeader";
import { IconChart } from "../components/icons";
import ReportsList from "./ReportsList";

export default function ReportsPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-4xl">
        <PageHeader
          eyebrow="Rapports"
          title="Choisissez un type de rapport."
          description="Accedez aux indicateurs clefs pour chaque compte et chaque periode."
          icon={<IconChart className="h-5 w-5" />}
        />

        <ReportsList />
      </main>
    </div>
  );
}
