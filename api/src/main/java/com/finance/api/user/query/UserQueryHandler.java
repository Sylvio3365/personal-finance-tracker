package com.finance.api.user.query;

import com.finance.api.user.dto.UserResponse;
import com.finance.api.model.Utilisateur;
import com.finance.api.user.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserQueryHandler {
    private final UtilisateurRepository utilisateurRepository;

    public UserQueryHandler(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public UserResponse getById(GetUtilisateurByIdQuery query) {
        Utilisateur utilisateur = utilisateurRepository.findById(query.utilisateurId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        return new UserResponse(
                utilisateur.getIdUtilisateur(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getDtn()
        );
    }
}
