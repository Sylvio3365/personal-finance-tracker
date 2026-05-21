package com.finance.api.account.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PaginatedAccountResponse {
    private List<AccountData> data;
    private long totalItems;
    private int totalPages;
    private int currentPage;
    private int itemsPerPage;

    @Getter
    @AllArgsConstructor
    public static class AccountData {
        private Long id;
        private String nom;
        private String soldeActuel;
        private Long typeCompteId;
        private Long utilisateurId;
    }
}
