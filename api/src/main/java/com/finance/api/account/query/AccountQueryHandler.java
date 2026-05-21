package com.finance.api.account.query;

import com.finance.api.account.dto.AccountResponse;
import com.finance.api.model.UtilisateurCompte;
import com.finance.api.account.repository.UtilisateurCompteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountQueryHandler {
    private final UtilisateurCompteRepository compteRepository;

    public AccountQueryHandler(UtilisateurCompteRepository compteRepository) {
        this.compteRepository = compteRepository;
    }

    public AccountResponse getById(GetCompteByIdQuery query) {
        UtilisateurCompte compte = compteRepository.findById(query.compteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte introuvable"));

        return map(compte);
    }

    public List<AccountResponse> listByUtilisateur(ListComptesByUtilisateurQuery query) {
        return compteRepository.findByUtilisateur_IdUtilisateur(query.utilisateurId())
                .stream()
                .map(this::map)
                .toList();
    }

    private AccountResponse map(UtilisateurCompte compte) {
        return new AccountResponse(
                compte.getIdUtilisateurCompte(),
                compte.getNom(),
                parseSolde(compte.getSoldeActuel()),
                compte.getTypeCompte().getIdTypeCompte(),
                compte.getUtilisateur().getIdUtilisateur()
        );
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
}
