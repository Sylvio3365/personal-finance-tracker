package com.finance.api.transaction.command;

import com.finance.api.transaction.dto.TransactionResponse;
import com.finance.api.model.Categorie;
import com.finance.api.model.Transaction;
import com.finance.api.model.TransactionType;
import com.finance.api.model.UtilisateurCompte;
import com.finance.api.category.repository.CategorieRepository;
import com.finance.api.transaction.repository.TransactionRepository;
import com.finance.api.reference.repository.TransactionTypeRepository;
import com.finance.api.account.repository.UtilisateurCompteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
public class TransactionCommandHandler {
    private final TransactionRepository transactionRepository;
    private final UtilisateurCompteRepository compteRepository;
    private final CategorieRepository categorieRepository;
    private final TransactionTypeRepository transactionTypeRepository;

    public TransactionCommandHandler(
            TransactionRepository transactionRepository,
            UtilisateurCompteRepository compteRepository,
            CategorieRepository categorieRepository,
            TransactionTypeRepository transactionTypeRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.compteRepository = compteRepository;
        this.categorieRepository = categorieRepository;
        this.transactionTypeRepository = transactionTypeRepository;
    }

    public TransactionResponse create(CreateTransactionCommand command) {
        UtilisateurCompte compte = compteRepository.findById(command.utilisateurCompteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte introuvable"));
        Categorie categorie = categorieRepository.findById(command.categorieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categorie introuvable"));
        TransactionType transactionType = transactionTypeRepository.findById(command.transactionTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type de transaction introuvable"));

        BigDecimal montant = command.montant();
        if (montant == null || montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Montant invalide");
        }

        BigDecimal soldeActuel = parseSolde(compte.getSoldeActuel());
        boolean isDepense = isDepense(transactionType.getLibelle());

        if (isDepense && soldeActuel.subtract(montant).compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solde insuffisant");
        }

        BigDecimal nouveauSolde = isDepense ? soldeActuel.subtract(montant) : soldeActuel.add(montant);
        compte.setSoldeActuel(formatSolde(nouveauSolde));

        Transaction transaction = new Transaction();
        transaction.setMontant(montant);
        transaction.setDateTransaction(command.dateTransaction() == null ? LocalDateTime.now() : command.dateTransaction());
        transaction.setNote(command.note());
        transaction.setCategorie(categorie);
        transaction.setTransactionType(transactionType);
        transaction.setUtilisateurCompte(compte);

        Transaction saved = transactionRepository.save(transaction);
        compteRepository.save(compte);

        String warning = null;
        if (isDepense && categorie.getLimite() != null) {
            YearMonth month = YearMonth.from(saved.getDateTransaction());
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.atEndOfMonth().atTime(23, 59, 59);
            BigDecimal totalCategorie = transactionRepository.sumDepenseByCategorieBetween(
                    compte.getIdUtilisateurCompte(),
                    categorie.getIdCategorie(),
                    start,
                    end
            );
            if (totalCategorie.compareTo(categorie.getLimite()) > 0) {
                warning = "Limite de categorie depassee";
            }
        }

        return new TransactionResponse(
                saved.getIdTransaction(),
                saved.getMontant(),
                saved.getDateTransaction(),
                saved.getNote(),
                saved.getCategorie().getIdCategorie(),
                saved.getTransactionType().getIdTransactionType(),
                saved.getUtilisateurCompte().getIdUtilisateurCompte(),
                warning
        );
    }

    public void transfer(TransferCommand command) {
        UtilisateurCompte fromAccount = compteRepository.findById(command.fromAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte source introuvable"));
        UtilisateurCompte toAccount = compteRepository.findById(command.toAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte destination introuvable"));

        if (command.fromAccountId().equals(command.toAccountId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible de transférer vers le même compte");
        }

        BigDecimal montant = command.montant();
        if (montant == null || montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Montant invalide");
        }

        BigDecimal soldeFrom = parseSolde(fromAccount.getSoldeActuel());
        if (soldeFrom.subtract(montant).compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solde insuffisant");
        }

        // Get transaction types
        TransactionType depenseType = transactionTypeRepository.findByLibelle("depense")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type de transaction introuvable"));
        TransactionType revenuType = transactionTypeRepository.findByLibelle("revenu")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type de transaction introuvable"));

        // Get or create transfer category
        Categorie transferCategory = categorieRepository.findByLibelle("Transfert")
                .orElseGet(() -> {
                    Categorie newCategory = new Categorie();
                    newCategory.setLibelle("Transfert");
                    newCategory.setIcon("mdi:swap-horizontal");
                    return categorieRepository.save(newCategory);
                });

        // Create expense transaction for source account
        Transaction expenseTransaction = new Transaction();
        expenseTransaction.setMontant(montant);
        expenseTransaction.setDateTransaction(LocalDateTime.now());
        expenseTransaction.setNote(command.note() != null ? command.note() + " (Transfert vers " + toAccount.getNom() + ")" : "Transfert vers " + toAccount.getNom());
        expenseTransaction.setCategorie(transferCategory);
        expenseTransaction.setTransactionType(depenseType);
        expenseTransaction.setUtilisateurCompte(fromAccount);
        transactionRepository.save(expenseTransaction);

        // Create income transaction for destination account
        Transaction incomeTransaction = new Transaction();
        incomeTransaction.setMontant(montant);
        incomeTransaction.setDateTransaction(LocalDateTime.now());
        incomeTransaction.setNote(command.note() != null ? command.note() + " (Transfert de " + fromAccount.getNom() + ")" : "Transfert de " + fromAccount.getNom());
        incomeTransaction.setCategorie(transferCategory);
        incomeTransaction.setTransactionType(revenuType);
        incomeTransaction.setUtilisateurCompte(toAccount);
        transactionRepository.save(incomeTransaction);

        // Update balances
        fromAccount.setSoldeActuel(formatSolde(soldeFrom.subtract(montant)));
        BigDecimal soldeTo = parseSolde(toAccount.getSoldeActuel());
        toAccount.setSoldeActuel(formatSolde(soldeTo.add(montant)));

        compteRepository.save(fromAccount);
        compteRepository.save(toAccount);
    }

    private boolean isDepense(String libelle) {
        return libelle != null && libelle.trim().equalsIgnoreCase("depense");
    }

    private BigDecimal parseSolde(String solde) {
        if (solde == null || solde.isBlank()) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(solde);
        } catch (NumberFormatException ex) {
            return BigDecimal.ZERO;
        }
    }

    private String formatSolde(BigDecimal solde) {
        return solde == null ? BigDecimal.ZERO.toPlainString() : solde.toPlainString();
    }
}
