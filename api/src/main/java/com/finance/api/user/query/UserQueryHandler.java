package com.finance.api.user.query;

import com.finance.api.user.dto.UserResponse;
import com.finance.api.user.dto.LoginRequest;
import com.finance.api.model.Utilisateur;
import com.finance.api.user.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserQueryHandler {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UserQueryHandler(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));

        if (!passwordEncoder.matches(request.getPassword(), utilisateur.getMotDePasse())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        return new UserResponse(
                utilisateur.getIdUtilisateur(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getNom() + " " + utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getDtn()
        );
    }

    public UserResponse getById(GetUtilisateurByIdQuery query) {
        Utilisateur utilisateur = utilisateurRepository.findById(query.utilisateurId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        return new UserResponse(
                utilisateur.getIdUtilisateur(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getNom() + " " + utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getDtn()
        );
    }
}
