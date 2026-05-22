const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    nom: string;
    prenom: string;
    email: string;
    dtn?: string;
    motDePasse: string;
}

export interface UserResponse {
    id: number;
    nom: string;
    prenom: string;
    fullName?: string;
    email: string;
    dtn?: string;
}

export class UserService {
    /**
     * Login user
     */
    static async login(payload: LoginPayload): Promise<UserResponse> {
        const response = await fetch(`${BASE_URL}/query/utilisateurs/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let error = "Échec de la connexion";
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

    /**
     * Register user
     */
    static async register(payload: RegisterPayload): Promise<UserResponse> {
        const response = await fetch(`${BASE_URL}/command/utilisateurs/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let error = "Échec de l'inscription";

            try {
                const data = await response.json();
                // Spring renvoie le message dans le champ 'message'
                if (data.message) {
                    error = data.message;
                } else if (data.error) {
                    error = data.error;
                }
            } catch {
                try {
                    error = await response.text() || error;
                } catch (err) {
                    console.error(err);
                }
            }

            // Messages personnalisés pour codes d'erreur spécifiques
            if (response.status === 409) {
                error = error.includes("Email") ? error : "Cet email est déjà utilisé";
            } else if (response.status === 400) {
                // Le message de Spring contient déjà le détail
                error = error || "Veuillez vérifier vos informations";
            }

            throw new Error(error);
        }

        return response.json();
    }

    /**
     * Get user from localStorage
     */
    static getStoredUser(): UserResponse | null {
        if (typeof window === "undefined") return null;
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    /**
     * Store user in localStorage
     */
    static storeUser(user: UserResponse): void {
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }

    /**
     * Clear user from localStorage
     */
    static clearUser(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
    }
}
