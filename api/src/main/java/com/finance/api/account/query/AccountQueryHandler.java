package com.finance.api.account.query;

import com.finance.api.account.dto.AccountResponse;
import com.finance.api.account.dto.PaginatedAccountResponse;
import com.finance.api.model.UtilisateurCompte;
import com.finance.api.account.repository.UtilisateurCompteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    // --- Sans filtre, sans pagination (existant) ---
    public List<AccountResponse> listByUtilisateur(ListComptesByUtilisateurQuery query) {
        return compteRepository.findByUtilisateur_IdUtilisateur(query.utilisateurId())
                .stream()
                .map(this::map)
                .toList();
    }

    // --- Avec filtre + pagination (nouveau) ---
    public PaginatedAccountResponse listByUtilisateurFiltered(ListComptesByUtilisateurFilteredQuery query) {
        int page = query.page() != null && query.page() > 0 ? query.page() - 1 : 0;
        int limit = query.limit() != null && query.limit() > 0 ? query.limit() : 10;
        PageRequest pageable = PageRequest.of(page, limit);

        Page<UtilisateurCompte> result;

        // Cas 1 : filtre par type de compte seulement
        if (query.typeCompteId() != null && (query.searchTerm() == null || query.searchTerm().isBlank())) {
            result = compteRepository.findByUtilisateur_IdUtilisateurAndTypeCompte_IdTypeCompte(
                    query.utilisateurId(), query.typeCompteId(), pageable);
        }
        // Cas 2 : filtre par recherche texte seulement
        else if (query.searchTerm() != null && !query.searchTerm().isBlank()
                && query.typeCompteId() == null) {
            result = compteRepository.findByUtilisateur_IdUtilisateurAndNomContainingIgnoreCase(
                    query.utilisateurId(), query.searchTerm(), pageable);
        }
        // Cas 3 : filtre combiné (type + recherche)
        else if (query.typeCompteId() != null && query.searchTerm() != null && !query.searchTerm().isBlank()) {
            result = compteRepository.findByUtilisateur_IdUtilisateurAndTypeCompte_IdTypeCompteAndNomContainingIgnoreCase(
                    query.utilisateurId(), query.typeCompteId(), query.searchTerm(), pageable);
        }
        // Cas 4 : pas de filtre → tous les comptes paginés
        else {
            result = compteRepository.findByUtilisateur_IdUtilisateur(query.utilisateurId(), pageable);
        }

        List<PaginatedAccountResponse.AccountData> data = result.getContent()
                .stream()
                .map(c -> new PaginatedAccountResponse.AccountData(
                        c.getIdUtilisateurCompte(),
                        c.getNom(),
                        c.getSoldeActuel(),
                        c.getTypeCompte().getIdTypeCompte(),
                        c.getUtilisateur().getIdUtilisateur()
                ))
                .toList();

        return new PaginatedAccountResponse(
                data,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber() + 1,
                result.getSize()
        );
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
