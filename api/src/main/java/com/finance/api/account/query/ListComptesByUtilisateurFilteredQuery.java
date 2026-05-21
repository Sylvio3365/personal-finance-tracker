package com.finance.api.account.query;

public record ListComptesByUtilisateurFilteredQuery(
    Long utilisateurId,
    Integer page,
    Integer limit,
    Long typeCompteId,
    String searchTerm
) {
}
