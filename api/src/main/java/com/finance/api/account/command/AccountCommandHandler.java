package com.finance.api.account.command;

import com.finance.api.account.dto.AccountResponse;
import com.finance.api.model.TypeCompte;
import com.finance.api.model.Utilisateur;
import com.finance.api.model.UtilisateurCompte;
import com.finance.api.transaction.repository.TransactionRepository;
import com.finance.api.reference.repository.TypeCompteRepository;
import com.finance.api.account.repository.UtilisateurCompteRepository;
import com.finance.api.user.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
public class AccountCommandHandler {
    private final UtilisateurCompteRepository compteRepository;
    private final TypeCompteRepository typeCompteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final TransactionRepository transactionRepository;

    public AccountCommandHandler(
            UtilisateurCompteRepository compteRepository,
            TypeCompteRepository typeCompteRepository,
            UtilisateurRepository utilisateurRepository,
            TransactionRepository transactionRepository
    ) {
        this.compteRepository = compteRepository;
        this.typeCompteRepository = typeCompteRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.transactionRepository = transactionRepository;
    }

    public AccountResponse create(CreateCompteCommand command) {
        TypeCompte typeCompte = typeCompteRepository.findById(command.typeCompteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type compte introuvable"));
        Utilisateur utilisateur = utilisateurRepository.findById(command.utilisateurId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        BigDecimal soldeInitial = command.soldeInitial() == null ? BigDecimal.ZERO : command.soldeInitial();
        UtilisateurCompte compte = new UtilisateurCompte();
        compte.setNom(command.nom());
        compte.setTypeCompte(typeCompte);
        compte.setUtilisateur(utilisateur);
        compte.setSoldeActuel(formatSolde(soldeInitial));

        UtilisateurCompte saved = compteRepository.save(compte);
        return new AccountResponse(
                saved.getIdUtilisateurCompte(),
                saved.getNom(),
                parseSolde(saved.getSoldeActuel()),
                saved.getTypeCompte().getIdTypeCompte(),
                saved.getUtilisateur().getIdUtilisateur()
        );
    }

    public void delete(DeleteCompteCommand command) {
        UtilisateurCompte compte = compteRepository.findById(command.compteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte introuvable"));

        long transactionCount = transactionRepository.countByUtilisateurCompte_IdUtilisateurCompte(compte.getIdUtilisateurCompte());
        if (transactionCount > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Suppression impossible: le compte contient des transactions");
        }

        compteRepository.delete(compte);
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
