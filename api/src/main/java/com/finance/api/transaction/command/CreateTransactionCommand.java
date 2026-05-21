package com.finance.api.transaction.command;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateTransactionCommand(
        BigDecimal montant,
        LocalDateTime dateTransaction,
        String note,
        Long categorieId,
        Long transactionTypeId,
        Long utilisateurCompteId
) {
}
