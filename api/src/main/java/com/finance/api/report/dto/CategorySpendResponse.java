package com.finance.api.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class CategorySpendResponse {
    private Long categorieId;
    private String libelle;
    private String icon;
    private BigDecimal totalDepense;
    private BigDecimal limite;
    private boolean depassement;
}
