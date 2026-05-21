const API_BASE_URL = "http://localhost:8080";

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

export class AccountService {
  // Query operations
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

  // Command operations
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
}
