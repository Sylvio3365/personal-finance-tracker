package com.finance.api.user.command;

import com.finance.api.user.dto.UserResponse;
import com.finance.api.model.Utilisateur;
import com.finance.api.user.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserCommandHandler {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UserCommandHandler(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterUtilisateurCommand command) {
        if (command.email() == null || command.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email obligatoire");
        }
        if (command.motDePasse() == null || command.motDePasse().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe obligatoire");
        }
        if (utilisateurRepository.findByEmail(command.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email deja utilise");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(command.nom());
        utilisateur.setPrenom(command.prenom());
        utilisateur.setEmail(command.email());
        utilisateur.setDtn(command.dtn());
        utilisateur.setMotDePasse(passwordEncoder.encode(command.motDePasse()));

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return new UserResponse(
                saved.getIdUtilisateur(),
                saved.getNom(),
                saved.getPrenom(),
                saved.getNom() + " " + saved.getPrenom(),
                saved.getEmail(),
                saved.getDtn());
    }
}
