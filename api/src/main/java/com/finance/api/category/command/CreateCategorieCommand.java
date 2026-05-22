package com.finance.api.category.command;

import java.math.BigDecimal;

public record CreateCategorieCommand(String libelle, String icon, BigDecimal limite) {
}
