import PageHeader from "../components/PageHeader";
import { IconTag } from "../components/icons";
import CategoriesList from "./CategoriesList";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen w-full px-6 py-10 sm:px-10 lg:px-16">
      <main className="mx-auto mt-6 w-full max-w-5xl">
        <PageHeader
          eyebrow="Categories"
          title="Pilotez les limites mensuelles."
          description="Une categorie peut avoir une limite de depense mensuelle. Un avertissement apparait si une transaction depasse ce plafond, tout en restant autorisee."
          icon={<IconTag className="h-5 w-5" />}
        />

        <section className="mt-8 rounded-3xl border border-black/5 bg-[var(--surface)] p-8">
          <CategoriesList />
        </section>
      </main>
    </div>
  );
}
