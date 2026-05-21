const API_BASE_URL = "http://localhost:8080";

export interface CreateTransactionPayload {
  montant: number;
  dateTransaction?: string;
  note?: string;
  categorieId: number;
  transactionTypeId: number;
  utilisateurCompteId: number;
}

export interface TransactionResponse {
  id: number;
  montant: number;
  dateTransaction: string;
  note: string;
  categorieId: number;
  transactionTypeId: number;
  utilisateurCompteId: number;
  warning?: string;
}

export interface TransactionData {
  id: number;
  montant: number;
  dateTransaction: string;
  note: string;
  categorieId: number;
  categorieLibelle: string;
  transactionTypeId: number;
  transactionTypeLibelle: string;
  utilisateurCompteId: number;
  compteNom: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface TransactionFilters {
  compteId?: number;
  transactionTypeId?: number;
  categorieId?: number;
  searchTerm?: string;
}

export class TransactionService {
  static async create(payload: CreateTransactionPayload): Promise<TransactionResponse> {
    const response = await fetch(`${API_BASE_URL}/command/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      let message = "Erreur lors de la création de la transaction";
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) message = errorJson.message;
      } catch { /* empty */ }
      throw new Error(message);
    }
    return response.json();
  }

  // Paginated list via backend /query/transactions/paginated
  static async listPaginated(
    utilisateurId: number,
    page: number = 1,
    limit: number = 10,
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<TransactionData>> {
    const params = new URLSearchParams({
      utilisateurId: utilisateurId.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });
    if (filters.compteId) params.append("compteId", filters.compteId.toString());
    if (filters.transactionTypeId) params.append("transactionTypeId", filters.transactionTypeId.toString());
    if (filters.categorieId) params.append("categorieId", filters.categorieId.toString());
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      params.append("searchTerm", filters.searchTerm.trim());
    }

    const response = await fetch(`${API_BASE_URL}/query/transactions/paginated?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des transactions");
    }

    const data = await response.json() as {
      data: { id: number; montant: number; dateTransaction: string; note: string; categorieId: number; categorieLibelle: string; transactionTypeId: number; transactionTypeLibelle: string; utilisateurCompteId: number; compteNom: string }[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };

    return {
      data: data.data.map((item) => ({
        id: item.id,
        montant: item.montant,
        dateTransaction: item.dateTransaction,
        note: item.note,
        categorieId: item.categorieId,
        categorieLibelle: item.categorieLibelle,
        transactionTypeId: item.transactionTypeId,
        transactionTypeLibelle: item.transactionTypeLibelle,
        utilisateurCompteId: item.utilisateurCompteId,
        compteNom: item.compteNom,
      })),
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      itemsPerPage: data.itemsPerPage,
    };
  }

  // Kept for backward compat (used in TransactionModal)
  static async listByCompte(compteId: number): Promise<TransactionResponse[]> {
    const response = await fetch(`${API_BASE_URL}/query/transactions?compteId=${compteId}`);
    if (!response.ok) throw new Error("Erreur lors du chargement des transactions");
    return response.json();
  }

  static async listFiltered(filters: {
    utilisateurId: number;
    compteId?: number;
    categorieId?: number;
    transactionTypeId?: number;
  }): Promise<TransactionResponse[]> {
    const params = new URLSearchParams();
    params.set("utilisateurId", filters.utilisateurId.toString());
    if (filters.compteId) params.set("compteId", filters.compteId.toString());
    if (filters.categorieId) params.set("categorieId", filters.categorieId.toString());
    if (filters.transactionTypeId) params.set("transactionTypeId", filters.transactionTypeId.toString());

    const response = await fetch(`${API_BASE_URL}/query/transactions/filter?${params.toString()}`);
    if (!response.ok) throw new Error("Erreur lors du chargement des transactions");
    return response.json();
  }
}
