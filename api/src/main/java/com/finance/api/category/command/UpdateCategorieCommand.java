package com.finance.api.category.command;

import java.math.BigDecimal;

public record UpdateCategorieCommand(
    Long id,
    String libelle,
    BigDecimal limite,
    Boolean active
) {}
