package com.finance.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "type_compte")
public class TypeCompte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTypeCompte;

    @Column(length = 50)
    private String nom;
}
