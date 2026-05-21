package com.finance.api.transaction.query;

import com.finance.api.transaction.dto.TransactionResponse;
import com.finance.api.model.Transaction;
import com.finance.api.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionQueryHandler {
    private final TransactionRepository transactionRepository;

    public TransactionQueryHandler(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<TransactionResponse> listByCompte(ListTransactionsByCompteQuery query) {
        List<Transaction> transactions = transactionRepository.findByUtilisateurCompte_IdUtilisateurCompte(query.compteId());
        return transactions.stream()
                .map(t -> new TransactionResponse(
                        t.getIdTransaction(),
                        t.getMontant(),
                        t.getDateTransaction(),
                        t.getNote(),
                        t.getCategorie().getIdCategorie(),
                        t.getTransactionType().getIdTransactionType(),
                        t.getUtilisateurCompte().getIdUtilisateurCompte(),
                        null
                ))
                .toList();
    }
}
