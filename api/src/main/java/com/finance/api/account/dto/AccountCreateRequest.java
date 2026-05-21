package com.finance.api.account.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AccountCreateRequest {
    private String nom;
    private Long typeCompteId;
    private Long utilisateurId;
    private BigDecimal soldeInitial;
}
