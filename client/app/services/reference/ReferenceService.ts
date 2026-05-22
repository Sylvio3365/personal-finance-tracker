const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Category {
  id: number;
  libelle: string;
  icon?: string;
  limite?: number;
  active: boolean;
}

export interface TransactionType {
  id: number;
  libelle: string;
}

export class ReferenceService {
  static async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/query/references/categories`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des catégories");
    }
    return response.json();
  }

  static async getTransactionTypes(): Promise<TransactionType[]> {
    const response = await fetch(`${API_BASE_URL}/query/references/types-transaction`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des types de transaction");
    }
    return response.json();
  }

  static async createCategory(payload: { libelle: string; icon?: string; limite?: number }): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/command/references/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erreur création catégorie");
    }
    return response.json();
  }

  static async updateCategory(id: number, payload: { libelle?: string; icon?: string; limite?: number | null; active?: boolean }): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/command/references/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erreur mise à jour catégorie");
    }
    return response.json();
  }

  static async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/command/references/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erreur suppression catégorie");
    }
  }
}
