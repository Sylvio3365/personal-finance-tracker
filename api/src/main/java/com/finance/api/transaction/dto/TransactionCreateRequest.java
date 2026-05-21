package com.finance.api.transaction.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionCreateRequest {
    private BigDecimal montant;
    private LocalDateTime dateTransaction;
    private String note;
    private Long categorieId;
    private Long transactionTypeId;
    private Long utilisateurCompteId;
}
