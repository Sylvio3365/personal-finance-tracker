package com.finance.api.transaction.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionCreateRequest {
    private BigDecimal montant;

    @JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING)
    private LocalDateTime dateTransaction;

    private String note;
    private Long categorieId;
    private Long transactionTypeId;
    private Long utilisateurCompteId;
}
