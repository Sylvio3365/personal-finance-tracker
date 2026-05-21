package com.finance.api.transaction.query;

import com.finance.api.transaction.dto.TransactionResponse;
import com.finance.api.transaction.dto.PaginatedTransactionResponse;
import com.finance.api.model.Transaction;
import com.finance.api.transaction.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
                .map(this::toSimpleResponse)
                .toList();
    }

    public List<TransactionResponse> listFiltered(Long utilisateurId, Long compteId, Long categorieId, Long transactionTypeId) {
        List<Transaction> transactions = transactionRepository.findFiltered(utilisateurId, compteId, categorieId, transactionTypeId);
        return transactions.stream()
                .map(this::toSimpleResponse)
                .toList();
    }

    public PaginatedTransactionResponse listByUtilisateurPaginated(ListTransactionsFilteredQuery query) {
        int page = query.page() != null && query.page() > 0 ? query.page() - 1 : 0;
        int limit = query.limit() != null && query.limit() > 0 ? query.limit() : 10;
        PageRequest pageable = PageRequest.of(page, limit);

        Page<Transaction> result;

        if (query.compteId() != null && query.transactionTypeId() == null && query.categorieId() == null) {
            // Compte seul
            result = transactionRepository.findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateur(
                    query.compteId(), query.utilisateurId(), pageable);
        } else if (query.transactionTypeId() != null && query.compteId() == null && query.categorieId() == null) {
            // Type seul
            result = transactionRepository.findByUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionType(
                    query.utilisateurId(), query.transactionTypeId(), pageable);
        } else if (query.categorieId() != null && query.compteId() == null && query.transactionTypeId() == null) {
            // Catégorie seule
            result = transactionRepository.findByUtilisateurCompte_Utilisateur_IdUtilisateurAndCategorie_IdCategorie(
                    query.utilisateurId(), query.categorieId(), pageable);
        } else if (query.compteId() != null && query.transactionTypeId() != null && query.categorieId() == null) {
            // Compte + type
            result = transactionRepository.findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionType(
                    query.compteId(), query.utilisateurId(), query.transactionTypeId(), pageable);
        } else if (query.compteId() != null && query.categorieId() != null && query.transactionTypeId() == null) {
            // Compte + catégorie
            result = transactionRepository.findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateurAndCategorie_IdCategorie(
                    query.compteId(), query.utilisateurId(), query.categorieId(), pageable);
        } else if (query.transactionTypeId() != null && query.categorieId() != null && query.compteId() == null) {
            // Type + catégorie
            result = transactionRepository.findByUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionTypeAndCategorie_IdCategorie(
                    query.utilisateurId(), query.transactionTypeId(), query.categorieId(), pageable);
        } else if (query.compteId() != null && query.transactionTypeId() != null && query.categorieId() != null) {
            // Compte + type + catégorie
            result = transactionRepository.findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionTypeAndCategorie_IdCategorie(
                    query.compteId(), query.utilisateurId(), query.transactionTypeId(), query.categorieId(), pageable);
        } else {
            // Par utilisateur seulement
            result = transactionRepository.findByUtilisateurCompte_Utilisateur_IdUtilisateur(query.utilisateurId(), pageable);
        }

        List<PaginatedTransactionResponse.TransactionData> data = result.getContent()
                .stream()
                .map(this::toPaginatedResponse)
                .toList();

        return new PaginatedTransactionResponse(
                data,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber() + 1,
                result.getSize()
        );
    }

    private PaginatedTransactionResponse.TransactionData toPaginatedResponse(Transaction t) {
        return new PaginatedTransactionResponse.TransactionData(
                t.getIdTransaction(),
                t.getMontant(),
                t.getDateTransaction(),
                t.getNote(),
                t.getCategorie().getIdCategorie(),
                t.getCategorie().getLibelle(),
                t.getTransactionType().getIdTransactionType(),
                t.getTransactionType().getLibelle(),
                t.getUtilisateurCompte().getIdUtilisateurCompte(),
                t.getUtilisateurCompte().getNom()
        );
    }

    private TransactionResponse toSimpleResponse(Transaction t) {
        return new TransactionResponse(
                t.getIdTransaction(),
                t.getMontant(),
                t.getDateTransaction(),
                t.getNote(),
                t.getCategorie().getIdCategorie(),
                t.getTransactionType().getIdTransactionType(),
                t.getUtilisateurCompte().getIdUtilisateurCompte(),
                null
        );
    }
}
