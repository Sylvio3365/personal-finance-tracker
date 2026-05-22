package com.finance.api.report.controller.query;

import com.finance.api.report.query.GetMonthlySummaryQuery;
import com.finance.api.report.query.ReportQueryHandler;
import com.finance.api.report.dto.MonthlySummaryResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/query/reports")
public class ReportQueryController {
    private final ReportQueryHandler reportQueryHandler;

    public ReportQueryController(ReportQueryHandler reportQueryHandler) {
        this.reportQueryHandler = reportQueryHandler;
    }

    @GetMapping("/monthly-summary")
    public MonthlySummaryResponse getMonthlySummary(
            @RequestParam Long utilisateurId,
            @RequestParam(required = false) Long compteId,
            @RequestParam int annee,
            @RequestParam int mois
    ) {
        // utilisateurId can be used for validation/authorization if needed
        return reportQueryHandler.getMonthlySummary(new GetMonthlySummaryQuery(compteId, annee, mois));
    }
}

