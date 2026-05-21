package com.finance.api.account.command;

import java.math.BigDecimal;

public record CreateCompteCommand(
        String nom,
        Long typeCompteId,
        Long utilisateurId,
        BigDecimal soldeInitial
) {
}
