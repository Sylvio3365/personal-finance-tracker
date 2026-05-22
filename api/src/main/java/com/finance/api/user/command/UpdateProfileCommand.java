package com.finance.api.user.command;

import java.time.LocalDate;

public record UpdateProfileCommand(
    Long utilisateurId,
    String nom,
    String email,
    LocalDate dateNaissance
) {
}
