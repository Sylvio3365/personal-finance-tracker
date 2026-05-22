package com.finance.api.report.query;

import com.finance.api.report.dto.CategorySpendResponse;
import com.finance.api.report.dto.MonthlySummaryResponse;
import com.finance.api.model.Categorie;
import com.finance.api.category.repository.CategorieRepository;
import com.finance.api.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportQueryHandler {
    private final TransactionRepository transactionRepository;
    private final CategorieRepository categorieRepository;

    public ReportQueryHandler(TransactionRepository transactionRepository, CategorieRepository categorieRepository) {
        this.transactionRepository = transactionRepository;
        this.categorieRepository = categorieRepository;
    }

    public MonthlySummaryResponse getMonthlySummary(GetMonthlySummaryQuery query) {
        YearMonth month = YearMonth.of(query.annee(), query.mois());
        LocalDateTime start = month.atDay(1).atStartOfDay();
        LocalDateTime end = month.atEndOfMonth().atTime(23, 59, 59);

        // Assuming transaction type ID 1 is revenue and ID 2 is expense
        BigDecimal totalRevenus;
        BigDecimal totalDepenses;
        List<Object[]> raw;

        if (query.compteId() != null) {
            // Specific account
            totalRevenus = transactionRepository.sumByCompteAndTypeBetween(
                    query.compteId(),
                    1L,
                    start,
                    end
            );
            totalDepenses = transactionRepository.sumByCompteAndTypeBetween(
                    query.compteId(),
                    2L,
                    start,
                    end
            );
            raw = transactionRepository.sumDepenseByCategorie(query.compteId(), start, end);
        } else {
            // All accounts
            totalRevenus = transactionRepository.sumByTypeBetween(
                    1L,
                    start,
                    end
            );
            totalDepenses = transactionRepository.sumByTypeBetween(
                    2L,
                    start,
                    end
            );
            raw = transactionRepository.sumDepenseByCategorieAll(start, end);
        }

        BigDecimal soldeNet = totalRevenus.subtract(totalDepenses);

        List<CategorySpendResponse> categories = new ArrayList<>();
        for (Object[] row : raw) {
            Long categorieId = (Long) row[0];
            String libelle = (String) row[1];
            BigDecimal total = (BigDecimal) row[2];
            Categorie categorie = categorieRepository.findById(categorieId).orElse(null);
            BigDecimal limite = categorie == null ? null : categorie.getLimite();
            boolean depassement = limite != null && total.compareTo(limite) > 0;
            categories.add(new CategorySpendResponse(categorieId, libelle, total, limite, depassement));
        }

        return new MonthlySummaryResponse(
                query.compteId(),
                query.annee(),
                query.mois(),
                totalRevenus,
                totalDepenses,
                soldeNet,
                categories
        );
    }
}
