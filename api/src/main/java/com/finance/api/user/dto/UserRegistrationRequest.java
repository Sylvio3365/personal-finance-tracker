package com.finance.api.user.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserRegistrationRequest {
    private String nom;
    private String prenom;
    private String email;
    private LocalDate dtn;
    private String motDePasse;
}
