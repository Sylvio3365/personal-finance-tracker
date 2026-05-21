package com.finance.api.category.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CategoryCreateRequest {
    private String libelle;
    private BigDecimal limite;
}
