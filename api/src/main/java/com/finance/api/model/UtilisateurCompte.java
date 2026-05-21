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

    @OneToOne
    @JoinColumn(name = "id_type_compte", referencedColumnName = "idTypeCompte", nullable = false, unique = true)
    private TypeCompte typeCompte;

    @OneToOne
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "idUtilisateur", nullable = false, unique = true)
    private Utilisateur utilisateur;
}
