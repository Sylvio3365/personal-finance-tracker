package com.finance.api.reference.query;

import com.finance.api.category.dto.CategoryResponse;
import com.finance.api.category.query.ListCategoriesQuery;
import com.finance.api.category.repository.CategorieRepository;
import com.finance.api.reference.dto.TransactionTypeResponse;
import com.finance.api.reference.dto.TypeCompteResponse;
import com.finance.api.reference.repository.TransactionTypeRepository;
import com.finance.api.reference.repository.TypeCompteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferenceQueryHandler {
    private final CategorieRepository categorieRepository;
    private final TypeCompteRepository typeCompteRepository;
    private final TransactionTypeRepository transactionTypeRepository;

    public ReferenceQueryHandler(
            CategorieRepository categorieRepository,
            TypeCompteRepository typeCompteRepository,
            TransactionTypeRepository transactionTypeRepository
    ) {
        this.categorieRepository = categorieRepository;
        this.typeCompteRepository = typeCompteRepository;
        this.transactionTypeRepository = transactionTypeRepository;
    }

    public List<CategoryResponse> listCategories(ListCategoriesQuery query) {
        return categorieRepository.findAll()
                .stream()
                .map(c -> new CategoryResponse(c.getIdCategorie(), c.getLibelle(), c.getLimite()))
                .toList();
    }

    public List<TypeCompteResponse> listTypesCompte(ListTypeCompteQuery query) {
        return typeCompteRepository.findAll()
                .stream()
                .map(t -> new TypeCompteResponse(t.getIdTypeCompte(), t.getNom()))
                .toList();
    }

    public List<TransactionTypeResponse> listTransactionTypes(ListTransactionTypesQuery query) {
        return transactionTypeRepository.findAll()
                .stream()
                .map(t -> new TransactionTypeResponse(t.getIdTransactionType(), t.getLibelle()))
                .toList();
    }
}
