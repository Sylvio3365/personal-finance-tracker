package com.finance.api.transaction.dto;

import java.math.BigDecimal;

public class SumDepenseCategorieResponse {

    public BigDecimal sum;

    public SumDepenseCategorieResponse(BigDecimal sum) {
        this.sum = sum != null ? sum : BigDecimal.ZERO;
    }

    public BigDecimal getSum() {
        return sum;
    }

    public void setSum(BigDecimal sum) {
        this.sum = sum;
    }
}
