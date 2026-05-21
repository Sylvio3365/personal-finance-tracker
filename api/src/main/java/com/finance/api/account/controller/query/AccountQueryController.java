package com.finance.api.account.controller.query;

import com.finance.api.account.query.AccountQueryHandler;
import com.finance.api.account.query.GetCompteByIdQuery;
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

    @GetMapping
    public List<AccountResponse> listByUtilisateur(@RequestParam Long utilisateurId) {
        return accountQueryHandler.listByUtilisateur(new ListComptesByUtilisateurQuery(utilisateurId));
    }
}
