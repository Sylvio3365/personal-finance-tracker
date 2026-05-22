package com.finance.api.account.query;

import java.math.BigDecimal;

public record ListComptesByUtilisateurFilteredQuery(
    Long utilisateurId,
    Integer page,
    Integer limit,
    Long typeCompteId,
    String searchTerm,
    BigDecimal minSolde,
    BigDecimal maxSolde
) {
}
