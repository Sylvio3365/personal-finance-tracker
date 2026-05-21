package com.finance.api.transaction.controller.command;

import com.finance.api.transaction.command.CreateTransactionCommand;
import com.finance.api.transaction.command.TransactionCommandHandler;
import com.finance.api.transaction.dto.TransactionCreateRequest;
import com.finance.api.transaction.dto.TransactionResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/command/transactions")
public class TransactionCommandController {
    private final TransactionCommandHandler transactionCommandHandler;

    public TransactionCommandController(TransactionCommandHandler transactionCommandHandler) {
        this.transactionCommandHandler = transactionCommandHandler;
    }

    @PostMapping
    public TransactionResponse create(@RequestBody TransactionCreateRequest request) {
        CreateTransactionCommand command = new CreateTransactionCommand(
                request.getMontant(),
                request.getDateTransaction(),
                request.getNote(),
                request.getCategorieId(),
                request.getTransactionTypeId(),
                request.getUtilisateurCompteId()
        );
        return transactionCommandHandler.create(command);
    }
}
