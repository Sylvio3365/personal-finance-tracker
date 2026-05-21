package com.finance.api.account.controller.query;

import com.finance.api.account.dto.PaginatedAccountResponse;
import com.finance.api.account.query.AccountQueryHandler;
import com.finance.api.account.query.GetCompteByIdQuery;
import com.finance.api.account.query.ListComptesByUtilisateurFilteredQuery;
import com.finance.api.account.query.ListComptesByUtilisateurQuery;
import com.finance.api.account.dto.AccountResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/query/comptes")
public class AccountQueryController {
    private final AccountQueryHandler accountQueryHandler;

    public AccountQueryController(AccountQueryHandler accountQueryHandler) {
        this.accountQueryHandler = accountQueryHandler;
    }

    @GetMapping("/{compteId}")
    public AccountResponse getById(@PathVariable Long compteId) {
        return accountQueryHandler.getById(new GetCompteByIdQuery(compteId));
    }

    // --- Liste simple sans filtre, sans pagination ---
    @GetMapping
    public List<AccountResponse> listByUtilisateur(@RequestParam Long utilisateurId) {
        return accountQueryHandler.listByUtilisateur(new ListComptesByUtilisateurQuery(utilisateurId));
    }

    // --- Liste avec filtre + pagination ---
    @GetMapping("/filter")
    public PaginatedAccountResponse listByUtilisateurFiltered(
            @RequestParam Long utilisateurId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Long typeCompteId,
            @RequestParam(required = false) String searchTerm
    ) {
        return accountQueryHandler.listByUtilisateurFiltered(
                new ListComptesByUtilisateurFilteredQuery(utilisateurId, page, limit, typeCompteId, searchTerm));
    }
}
