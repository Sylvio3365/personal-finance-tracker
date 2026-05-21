package com.finance.api.transaction.controller.query;

import com.finance.api.transaction.query.ListTransactionsByCompteQuery;
import com.finance.api.transaction.query.TransactionQueryHandler;
import com.finance.api.transaction.dto.TransactionResponse;
import org.springframework.web.bind.annotation.*;

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
}
