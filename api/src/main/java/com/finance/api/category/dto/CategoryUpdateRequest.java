package com.finance.api.category.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CategoryUpdateRequest {
    private String libelle;
    private String icon;
    private BigDecimal limite;
    private Boolean active;
}