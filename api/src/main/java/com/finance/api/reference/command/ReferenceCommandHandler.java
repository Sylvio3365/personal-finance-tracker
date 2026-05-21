package com.finance.api.reference.command;

import com.finance.api.reference.dto.TransactionTypeResponse;
import com.finance.api.reference.dto.TypeCompteResponse;
import com.finance.api.model.TransactionType;
import com.finance.api.model.TypeCompte;
import com.finance.api.reference.repository.TransactionTypeRepository;
import com.finance.api.reference.repository.TypeCompteRepository;
import org.springframework.stereotype.Service;

@Service
public class ReferenceCommandHandler {
    private final TypeCompteRepository typeCompteRepository;
    private final TransactionTypeRepository transactionTypeRepository;

    public ReferenceCommandHandler(TypeCompteRepository typeCompteRepository, TransactionTypeRepository transactionTypeRepository) {
        this.typeCompteRepository = typeCompteRepository;
        this.transactionTypeRepository = transactionTypeRepository;
    }

    public TypeCompteResponse createTypeCompte(CreateTypeCompteCommand command) {
        TypeCompte typeCompte = new TypeCompte();
        typeCompte.setNom(command.nom());
        TypeCompte saved = typeCompteRepository.save(typeCompte);
        return new TypeCompteResponse(saved.getIdTypeCompte(), saved.getNom());
    }

    public TransactionTypeResponse createTransactionType(CreateTransactionTypeCommand command) {
        TransactionType transactionType = new TransactionType();
        transactionType.setLibelle(command.libelle());
        TransactionType saved = transactionTypeRepository.save(transactionType);
        return new TransactionTypeResponse(saved.getIdTransactionType(), saved.getLibelle());
    }
}
