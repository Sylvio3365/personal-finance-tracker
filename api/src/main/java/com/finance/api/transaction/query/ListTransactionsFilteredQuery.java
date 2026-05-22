package com.finance.api.transaction.query;

import java.math.BigDecimal;
import java.util.Objects;

public record ListTransactionsFilteredQuery(
        Long utilisateurId,
        Long compteId,
        Long transactionTypeId,
        Long categorieId,
        Integer page,
        Integer limit,
        BigDecimal minMontant,
        BigDecimal maxMontant
) {
}
