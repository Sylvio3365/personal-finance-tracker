package com.finance.api.transaction.controller.query;

import com.finance.api.transaction.dto.PaginatedTransactionResponse;
import com.finance.api.transaction.dto.SumDepenseCategorieResponse;
import com.finance.api.transaction.dto.TransactionResponse;
import com.finance.api.transaction.query.ListTransactionsByCompteQuery;
import com.finance.api.transaction.query.ListTransactionsFilteredQuery;
import com.finance.api.transaction.query.TransactionQueryHandler;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/query/transactions")
public class TransactionQueryController {
    private final TransactionQueryHandler transactionQueryHandler;

    public TransactionQueryController(TransactionQueryHandler transactionQueryHandler) {
        this.transactionQueryHandler = transactionQueryHandler;
    }

    @GetMapping
    public List<TransactionResponse> listByCompte(@RequestParam Long compteId) {
        return transactionQueryHandler.listByCompte(new ListTransactionsByCompteQuery(compteId));
    }

    @GetMapping("/filter")
    public List<TransactionResponse> listFiltered(
            @RequestParam Long utilisateurId,
            @RequestParam(required = false) Long compteId,
            @RequestParam(required = false) Long categorieId,
            @RequestParam(required = false) Long transactionTypeId) {
        return transactionQueryHandler.listFiltered(utilisateurId, compteId, categorieId, transactionTypeId);
    }

    @GetMapping("/paginated")
    public PaginatedTransactionResponse listPaginated(
            @RequestParam Long utilisateurId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Long compteId,
            @RequestParam(required = false) Long transactionTypeId,
            @RequestParam(required = false) Long categorieId,
            @RequestParam(required = false) BigDecimal minMontant,
            @RequestParam(required = false) BigDecimal maxMontant) {
        return transactionQueryHandler.listByUtilisateurPaginated(
                new ListTransactionsFilteredQuery(utilisateurId, compteId, transactionTypeId, categorieId, page,
                        limit, minMontant, maxMontant));
    }

    @GetMapping("/sum-depense-categorie")
    public SumDepenseCategorieResponse getSumDepenseCategorie(
            @RequestParam Long categorieId,
            @RequestParam(required = false) Long compteId) {
        BigDecimal sum = transactionQueryHandler.getSumDepenseByCategorie(categorieId, compteId);
        return new SumDepenseCategorieResponse(sum);
    }

}