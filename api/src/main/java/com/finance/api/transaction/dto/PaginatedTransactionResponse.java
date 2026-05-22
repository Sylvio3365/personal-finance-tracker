package com.finance.api.transaction.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class PaginatedTransactionResponse {
    private List<TransactionData> data;
    private long totalItems;
    private int totalPages;
    private int currentPage;
    private int itemsPerPage;

    @Getter
    @AllArgsConstructor
    public static class TransactionData {
        private Long id;
        private BigDecimal montant;
        private LocalDateTime dateTransaction;
        private String note;
        private Long categorieId;
        private String categorieLibelle;
        private String categorieIcon;
        private Long transactionTypeId;
        private String transactionTypeLibelle;
        private Long utilisateurCompteId;
        private String compteNom;
    }
}
