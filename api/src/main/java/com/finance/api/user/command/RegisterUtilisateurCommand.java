package com.finance.api.user.command;

import java.time.LocalDate;

public record RegisterUtilisateurCommand(
        String nom,
        String prenom,
        String email,
        LocalDate dtn,
        String motDePasse
) {
}
