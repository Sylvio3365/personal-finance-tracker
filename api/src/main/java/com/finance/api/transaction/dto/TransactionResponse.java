package com.finance.api.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private BigDecimal montant;
    private LocalDateTime dateTransaction;
    private String note;
    private Long categorieId;
    private Long transactionTypeId;
    private Long utilisateurCompteId;
    private String warning;
}
