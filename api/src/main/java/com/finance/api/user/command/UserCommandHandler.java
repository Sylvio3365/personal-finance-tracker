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

    public UserResponse updateProfile(UpdateProfileCommand command) {
        Utilisateur utilisateur = utilisateurRepository.findById(command.utilisateurId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        // Check if email is already used by another user
        if (command.email() != null && !command.email().isBlank()) {
            utilisateurRepository.findByEmail(command.email()).ifPresent(existing -> {
                if (!existing.getIdUtilisateur().equals(command.utilisateurId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email deja utilise");
                }
            });
        }

        if (command.nom() != null && !command.nom().isBlank()) {
            utilisateur.setNom(command.nom());
        }
        if (command.email() != null && !command.email().isBlank()) {
            utilisateur.setEmail(command.email());
        }
        if (command.dateNaissance() != null) {
            utilisateur.setDtn(command.dateNaissance());
        }

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return new UserResponse(
                saved.getIdUtilisateur(),
                saved.getNom(),
                saved.getPrenom(),
                saved.getNom() + " " + saved.getPrenom(),
                saved.getEmail(),
                saved.getDtn());
    }

    public void updatePassword(UpdatePasswordCommand command) {
        Utilisateur utilisateur = utilisateurRepository.findById(command.utilisateurId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        if (!passwordEncoder.matches(command.currentPassword(), utilisateur.getMotDePasse())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe actuel incorrect");
        }

        if (command.newPassword() == null || command.newPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nouveau mot de passe obligatoire");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(command.newPassword()));
        utilisateurRepository.save(utilisateur);
    }
}
