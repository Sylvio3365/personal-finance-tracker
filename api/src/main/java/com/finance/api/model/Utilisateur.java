package com.finance.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "utilisateur")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;

    @Column(length = 50)
    private String nom;

    @Column(length = 50)
    private String prenom;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    private LocalDate dtn;

    @Column(name = "mot_de_passe", nullable = false, length = 255)
    private String motDePasse;
}
