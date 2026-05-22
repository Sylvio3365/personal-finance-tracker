package com.finance.api.account.controller.command;

import com.finance.api.account.command.AccountCommandHandler;
import com.finance.api.account.command.CreateCompteCommand;
import com.finance.api.account.command.DeleteCompteCommand;
import com.finance.api.account.command.UpdateCompteCommand;
import com.finance.api.account.dto.AccountCreateRequest;
import com.finance.api.account.dto.AccountResponse;
import com.finance.api.account.dto.AccountUpdateRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/command/comptes")
public class AccountCommandController {
    private final AccountCommandHandler accountCommandHandler;

    public AccountCommandController(AccountCommandHandler accountCommandHandler) {
        this.accountCommandHandler = accountCommandHandler;
    }

    @PostMapping
    public AccountResponse create(@RequestBody AccountCreateRequest request) {
        CreateCompteCommand command = new CreateCompteCommand(
                request.getNom(),
                request.getTypeCompteId(),
                request.getUtilisateurId(),
                request.getSoldeInitial()
        );
        return accountCommandHandler.create(command);
    }

    @PutMapping("/{compteId}")
    public AccountResponse update(@PathVariable Long compteId, @RequestBody AccountUpdateRequest request) {
        return accountCommandHandler.update(new UpdateCompteCommand(compteId, request.getNom()));
    }

    @DeleteMapping("/{compteId}")
    public void delete(@PathVariable Long compteId) {
        accountCommandHandler.delete(new DeleteCompteCommand(compteId));
    }
}
