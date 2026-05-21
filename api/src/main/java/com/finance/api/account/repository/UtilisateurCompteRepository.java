package com.finance.api.account.repository;

import com.finance.api.model.UtilisateurCompte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UtilisateurCompteRepository extends JpaRepository<UtilisateurCompte, Long> {
    List<UtilisateurCompte> findByUtilisateur_IdUtilisateur(Long utilisateurId);
}
