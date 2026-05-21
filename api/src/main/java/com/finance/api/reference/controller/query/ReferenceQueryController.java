package com.finance.api.reference.controller.query;

import com.finance.api.category.dto.CategoryResponse;
import com.finance.api.category.query.ListCategoriesQuery;
import com.finance.api.reference.dto.TransactionTypeResponse;
import com.finance.api.reference.dto.TypeCompteResponse;
import com.finance.api.reference.query.ListTransactionTypesQuery;
import com.finance.api.reference.query.ListTypeCompteQuery;
import com.finance.api.reference.query.ReferenceQueryHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/query/references")
public class ReferenceQueryController {
    private final ReferenceQueryHandler referenceQueryHandler;

    public ReferenceQueryController(ReferenceQueryHandler referenceQueryHandler) {
        this.referenceQueryHandler = referenceQueryHandler;
    }

    @GetMapping("/categories")
    public List<CategoryResponse> listCategories() {
        return referenceQueryHandler.listCategories(new ListCategoriesQuery());
    }

    @GetMapping("/types-compte")
    public List<TypeCompteResponse> listTypesCompte() {
        return referenceQueryHandler.listTypesCompte(new ListTypeCompteQuery());
    }

    @GetMapping("/types-transaction")
    public List<TransactionTypeResponse> listTransactionTypes() {
        return referenceQueryHandler.listTransactionTypes(new ListTransactionTypesQuery());
    }
}
