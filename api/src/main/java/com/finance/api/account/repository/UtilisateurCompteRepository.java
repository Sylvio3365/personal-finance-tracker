package com.finance.api.account.repository;

import com.finance.api.model.UtilisateurCompte;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
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

    // ── Filtre par solde (requêtes JPQL avec conversion) ──
    @Query("select u from UtilisateurCompte u " +
            "where u.utilisateur.idUtilisateur = :utilisateurId " +
            "and cast(u.soldeActuel as java.math.BigDecimal) between :minSolde and :maxSolde")
    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndSoldeBetween(
            @Param("utilisateurId") Long utilisateurId,
            @Param("minSolde") BigDecimal minSolde,
            @Param("maxSolde") BigDecimal maxSolde,
            Pageable pageable);

    @Query("select u from UtilisateurCompte u " +
            "where u.utilisateur.idUtilisateur = :utilisateurId " +
            "and u.typeCompte.idTypeCompte = :typeCompteId " +
            "and cast(u.soldeActuel as java.math.BigDecimal) between :minSolde and :maxSolde")
    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndTypeCompte_IdTypeCompteAndSoldeBetween(
            @Param("utilisateurId") Long utilisateurId,
            @Param("typeCompteId") Long typeCompteId,
            @Param("minSolde") BigDecimal minSolde,
            @Param("maxSolde") BigDecimal maxSolde,
            Pageable pageable);

    @Query("select u from UtilisateurCompte u " +
            "where u.utilisateur.idUtilisateur = :utilisateurId " +
            "and lower(u.nom) like lower(concat('%', :nom, '%')) " +
            "and cast(u.soldeActuel as java.math.BigDecimal) between :minSolde and :maxSolde")
    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndNomContainingIgnoreCaseAndSoldeBetween(
            @Param("utilisateurId") Long utilisateurId,
            @Param("nom") String nom,
            @Param("minSolde") BigDecimal minSolde,
            @Param("maxSolde") BigDecimal maxSolde,
            Pageable pageable);

    @Query("select u from UtilisateurCompte u " +
            "where u.utilisateur.idUtilisateur = :utilisateurId " +
            "and u.typeCompte.idTypeCompte = :typeCompteId " +
            "and lower(u.nom) like lower(concat('%', :nom, '%')) " +
            "and cast(u.soldeActuel as java.math.BigDecimal) between :minSolde and :maxSolde")
    Page<UtilisateurCompte> findByUtilisateur_IdUtilisateurAndTypeCompte_IdTypeCompteAndNomContainingIgnoreCaseAndSoldeBetween(
            @Param("utilisateurId") Long utilisateurId,
            @Param("typeCompteId") Long typeCompteId,
            @Param("nom") String nom,
            @Param("minSolde") BigDecimal minSolde,
            @Param("maxSolde") BigDecimal maxSolde,
            Pageable pageable);
}
