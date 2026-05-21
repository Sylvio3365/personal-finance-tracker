package com.finance.api.category.command;

import com.finance.api.category.dto.CategoryResponse;
import com.finance.api.model.Categorie;
import com.finance.api.category.repository.CategorieRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryCommandHandler {
    private final CategorieRepository categorieRepository;

    public CategoryCommandHandler(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public CategoryResponse create(CreateCategorieCommand command) {
        Categorie categorie = new Categorie();
        categorie.setLibelle(command.libelle());
        categorie.setLimite(command.limite());

        Categorie saved = categorieRepository.save(categorie);
        return new CategoryResponse(saved.getIdCategorie(), saved.getLibelle(), saved.getLimite());
    }
}
