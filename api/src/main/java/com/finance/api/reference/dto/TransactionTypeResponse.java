package com.finance.api.reference.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TransactionTypeResponse {
    private Long id;
    private String libelle;
}
