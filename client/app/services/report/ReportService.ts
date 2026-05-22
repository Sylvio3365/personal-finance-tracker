const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface MonthlySummary {
  totalRevenue: number;
  totalDepense: number;
  soldeNet: number;
}

export interface CategorySpending {
  categoryId: number;
  categoryName: string;
  icon?: string;
  spent: number;
  limit: number;
  depassement?: boolean;
}

interface BackendCategorySpendResponse {
  categorieId: number;
  libelle: string;
  icon?: string;
  totalDepense: number | string;
  limite: number | string | null;
  depassement: boolean;
}

interface BackendMonthlySummaryResponse {
  compteId: number;
  annee: number;
  mois: number;
  totalRevenus: number | string;
  totalDepenses: number | string;
  soldeNet: number | string;
  depensesParCategorie: BackendCategorySpendResponse[];
}

export class ReportService {
  static async getMonthlySummary(
    utilisateurId: number,
    compteId: number | null,
    year: number,
    month: number
  ): Promise<MonthlySummary> {
    const params = new URLSearchParams({
      utilisateurId: utilisateurId.toString(),
      annee: year.toString(),
      mois: month.toString(),
    });
    if (compteId !== null) {
      params.append("compteId", compteId.toString());
    }
    const response = await fetch(
      `${API_BASE_URL}/query/reports/monthly-summary?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement du résumé mensuel");
    }
    const data: BackendMonthlySummaryResponse = await response.json();
    return {
      totalRevenue: Number(data.totalRevenus) || 0,
      totalDepense: Number(data.totalDepenses) || 0,
      soldeNet: Number(data.soldeNet) || 0,
    };
  }

  static async getCategorySpendingForMonth(
    utilisateurId: number,
    compteId: number | null,
    year: number,
    month: number
  ): Promise<CategorySpending[]> {
    const params = new URLSearchParams({
      utilisateurId: utilisateurId.toString(),
      annee: year.toString(),
      mois: month.toString(),
    });
    if (compteId !== null) {
      params.append("compteId", compteId.toString());
    }
    const response = await fetch(
      `${API_BASE_URL}/query/reports/monthly-summary?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des dépenses par catégorie");
    }
    const data: BackendMonthlySummaryResponse = await response.json();
    return data.depensesParCategorie.map((item) => ({
      categoryId: item.categorieId,
      categoryName: item.libelle,
      icon: item.icon,
      spent: Number(item.totalDepense) || 0,
      limit: Number(item.limite) || 0,
      depassement: item.depassement,
    }));
  }
}

