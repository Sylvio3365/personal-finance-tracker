package com.finance.api.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String libelle;
    private String icon;
    private BigDecimal limite;
    private Boolean active;
}
