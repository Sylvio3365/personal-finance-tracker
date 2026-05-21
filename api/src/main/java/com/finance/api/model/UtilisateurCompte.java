package com.finance.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "utilisateur_compte")
public class UtilisateurCompte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateurCompte;

    @Column(length = 50)
    private String nom;

    @Column(length = 50)
    private String soldeActuel;

    @ManyToOne
    @JoinColumn(name = "id_type_compte", referencedColumnName = "idTypeCompte", nullable = false)
    private TypeCompte typeCompte;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "idUtilisateur", nullable = false)
    private Utilisateur utilisateur;

    public void setSoldeActuel(String soldeActuel) {
        if (soldeActuel != null && !soldeActuel.isBlank()) {
            try {
                if (new java.math.BigDecimal(soldeActuel).compareTo(java.math.BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Le solde ne peut pas être négatif");
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Format de solde invalide");
            }
        }
        this.soldeActuel = soldeActuel;
    }
}
