const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface TypeCompte {
  id: number;
  nom: string;
}

export interface CreateAccountPayload {
  nom: string;
  typeCompteId: number;
  utilisateurId: number;
  soldeInitial?: number;
}

export interface AccountResponse {
  id: number;
  nom: string;
  soldeActuel: number;
  typeCompteId: number;
  utilisateurId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface AccountFilters {
  typeCompteId?: number;
  searchTerm?: string;
  minSolde?: number;
  maxSolde?: number;
}

export class AccountService {

  static async getTypeComptes(): Promise<TypeCompte[]> {
    const response = await fetch(`${API_BASE_URL}/query/references/types-compte`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des types de compte");
    }
    return response.json();
  }

  static async getAccountById(compteId: number): Promise<AccountResponse> {
    const response = await fetch(`${API_BASE_URL}/query/comptes/${compteId}`);
    if (!response.ok) {
      throw new Error("Compte introuvable");
    }
    return response.json();
  }

  static async listByUtilisateur(utilisateurId: number): Promise<AccountResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/query/comptes?utilisateurId=${utilisateurId}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des comptes");
    }
    return response.json();
  }

  static async listByUtilisateurWithFilters(
    utilisateurId: number,
    page: number = 1,
    limit: number = 10,
    filters: AccountFilters = {}
  ): Promise<PaginatedResponse<AccountResponse>> {
    const params = new URLSearchParams({
      utilisateurId: utilisateurId.toString(),
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.typeCompteId) {
      params.append('typeCompteId', filters.typeCompteId.toString());
    }

    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      params.append('searchTerm', filters.searchTerm.trim());
    }

    if (filters.minSolde !== undefined && filters.minSolde !== null) {
      params.append('minSolde', filters.minSolde.toString());
    }

    if (filters.maxSolde !== undefined && filters.maxSolde !== null) {
      params.append('maxSolde', filters.maxSolde.toString());
    }

    const response = await fetch(`${API_BASE_URL}/query/comptes/filter?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des comptes");
    }

    const data = await response.json() as {
      data: { id: number; nom: string; soldeActuel: string | number; typeCompteId: number; utilisateurId: number }[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };

    return {
      data: data.data.map((item) => ({
        id: item.id,
        nom: item.nom,
        soldeActuel: typeof item.soldeActuel === "number" ? item.soldeActuel : parseFloat(item.soldeActuel) || 0,
        typeCompteId: item.typeCompteId,
        utilisateurId: item.utilisateurId,
      })),
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      itemsPerPage: data.itemsPerPage
    };
  }

  static async create(payload: CreateAccountPayload): Promise<AccountResponse> {
    const response = await fetch(`${API_BASE_URL}/command/comptes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let error = "Erreur lors de la création du compte";
      try {
        const data = await response.json();
        error = data.message || data.error || error;
      } catch {
        error = await response.text() || error;
      }
      throw new Error(error);
    }

    return response.json();
  }

  static async delete(compteId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/command/comptes/${compteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let error = "Erreur lors de la suppression du compte";
      try {
        const data = await response.json();
        error = data.message || data.error || error;
      } catch {
        error = await response.text() || error;
      }
      throw new Error(error);
    }
  }

  static async update(compteId: number, payload: { nom: string }): Promise<AccountResponse> {
    const response = await fetch(`${API_BASE_URL}/command/comptes/${compteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let error = "Erreur lors de la modification du compte";
      try {
        const data = await response.json();
        error = data.message || data.error || error;
      } catch {
        error = await response.text() || error;
      }
      throw new Error(error);
    }

    return response.json();
  }
}
