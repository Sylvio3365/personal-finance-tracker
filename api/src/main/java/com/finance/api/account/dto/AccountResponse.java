package com.finance.api.account.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class AccountResponse {
    private Long id;
    private String nom;
    private BigDecimal soldeActuel;
    private Long typeCompteId;
    private Long utilisateurId;
}
