package com.finance.api.account.repository;

import com.finance.api.model.UtilisateurCompte;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UtilisateurCompteRepository extends JpaRepository<UtilisateurCompte, Long> {
    List<UtilisateurCompte> findByUtilisateur_IdUtilisateur(Long utilisateurId);

    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateur(Long utilisateurId, Pageable pageable);

    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndTypeCompte_IdTypeCompte(
            Long utilisateurId, Long typeCompteId, Pageable pageable);

    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndNomContainingIgnoreCase(
            Long utilisateurId, String nom, Pageable pageable);

    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndTypeCompte_IdTypeCompteAndNomContainingIgnoreCase(
            Long utilisateurId, Long typeCompteId, String nom, Pageable pageable);
}
