package com.finance.api.reference.controller.command;

import com.finance.api.category.command.CategoryCommandHandler;
import com.finance.api.category.command.CreateCategorieCommand;
import com.finance.api.reference.command.CreateTransactionTypeCommand;
import com.finance.api.reference.command.CreateTypeCompteCommand;
import com.finance.api.reference.command.ReferenceCommandHandler;
import com.finance.api.category.dto.CategoryCreateRequest;
import com.finance.api.category.dto.CategoryUpdateRequest;
import com.finance.api.category.command.UpdateCategorieCommand;
import com.finance.api.category.dto.CategoryResponse;
import com.finance.api.reference.dto.TransactionTypeCreateRequest;
import com.finance.api.reference.dto.TransactionTypeResponse;
import com.finance.api.reference.dto.TypeCompteCreateRequest;
import com.finance.api.reference.dto.TypeCompteResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/command/references")
public class ReferenceCommandController {
    private final CategoryCommandHandler categoryCommandHandler;
    private final ReferenceCommandHandler referenceCommandHandler;

    public ReferenceCommandController(
            CategoryCommandHandler categoryCommandHandler,
            ReferenceCommandHandler referenceCommandHandler
    ) {
        this.categoryCommandHandler = categoryCommandHandler;
        this.referenceCommandHandler = referenceCommandHandler;
    }

    @PostMapping("/categories")
    public CategoryResponse createCategory(@RequestBody CategoryCreateRequest request) {
        return categoryCommandHandler.create(new CreateCategorieCommand(request.getLibelle(), request.getLimite()));
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @RequestBody CategoryUpdateRequest request) {
        return categoryCommandHandler.update(new UpdateCategorieCommand(id, request.getLibelle(), request.getLimite(), request.getActive()));
    }

    @PostMapping("/types-compte")
    public TypeCompteResponse createTypeCompte(@RequestBody TypeCompteCreateRequest request) {
        return referenceCommandHandler.createTypeCompte(new CreateTypeCompteCommand(request.getNom()));
    }

    @PostMapping("/types-transaction")
    public TransactionTypeResponse createTransactionType(@RequestBody TransactionTypeCreateRequest request) {
        return referenceCommandHandler.createTransactionType(new CreateTransactionTypeCommand(request.getLibelle()));
    }
}