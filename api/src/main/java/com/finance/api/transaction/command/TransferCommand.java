package com.finance.api.transaction.command;

import java.math.BigDecimal;

public record TransferCommand(
    Long fromAccountId,
    Long toAccountId,
    BigDecimal montant,
    String note
) {
}
