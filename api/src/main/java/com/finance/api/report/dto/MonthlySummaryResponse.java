package com.finance.api.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class MonthlySummaryResponse {
    private Long compteId;
    private int annee;
    private int mois;
    private BigDecimal totalRevenus;
    private BigDecimal totalDepenses;
    private BigDecimal soldeNet;
    private List<CategorySpendResponse> depensesParCategorie;
}
