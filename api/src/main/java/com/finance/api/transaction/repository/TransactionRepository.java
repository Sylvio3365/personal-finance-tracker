package com.finance.api.transaction.repository;

import com.finance.api.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    long countByUtilisateurCompte_IdUtilisateurCompte(Long compteId);

    List<Transaction> findByUtilisateurCompte_IdUtilisateurCompte(Long compteId);

    Page<Transaction> findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateur(
            Long compteId, Long utilisateurId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionType(
            Long utilisateurId, Long transactionTypeId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_Utilisateur_IdUtilisateurAndCategorie_IdCategorie(
            Long utilisateurId, Long categorieId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionType(
            Long compteId, Long utilisateurId, Long transactionTypeId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateurAndCategorie_IdCategorie(
            Long compteId, Long utilisateurId, Long categorieId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionTypeAndCategorie_IdCategorie(
            Long utilisateurId, Long transactionTypeId, Long categorieId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_IdUtilisateurCompteAndUtilisateurCompte_Utilisateur_IdUtilisateurAndTransactionType_IdTransactionTypeAndCategorie_IdCategorie(
            Long compteId, Long utilisateurId, Long transactionTypeId, Long categorieId, Pageable pageable);

    Page<Transaction> findByUtilisateurCompte_Utilisateur_IdUtilisateur(Long utilisateurId, Pageable pageable);

    @Query("select t from Transaction t " +
            "where t.utilisateurCompte.utilisateur.idUtilisateur = :utilisateurId " +
            "order by t.dateTransaction desc")
    List<Transaction> findByUtilisateurId(@Param("utilisateurId") Long utilisateurId);

    @Query("select t from Transaction t " +
            "where t.utilisateurCompte.utilisateur.idUtilisateur = :utilisateurId " +
            "and (:compteId is null or t.utilisateurCompte.idUtilisateurCompte = :compteId) " +
            "and (:categorieId is null or t.categorie.idCategorie = :categorieId) " +
            "and (:transactionTypeId is null or t.transactionType.idTransactionType = :transactionTypeId) " +
            "order by t.dateTransaction desc")
    List<Transaction> findFiltered(
            @Param("utilisateurId") Long utilisateurId,
            @Param("compteId") Long compteId,
            @Param("categorieId") Long categorieId,
            @Param("transactionTypeId") Long transactionTypeId
    );

    @Query("select coalesce(sum(t.montant), 0) from Transaction t " +
            "where t.utilisateurCompte.idUtilisateurCompte = :compteId " +
            "and t.dateTransaction between :start and :end " +
            "and lower(t.transactionType.libelle) = lower(:typeLibelle)")
    BigDecimal sumByCompteAndTypeBetween(
            @Param("compteId") Long compteId,
            @Param("typeLibelle") String typeLibelle,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("select t.categorie.idCategorie, t.categorie.libelle, sum(t.montant) from Transaction t " +
            "where t.utilisateurCompte.idUtilisateurCompte = :compteId " +
            "and t.dateTransaction between :start and :end " +
            "and lower(t.transactionType.libelle) = 'depense' " +
            "group by t.categorie.idCategorie, t.categorie.libelle")
    List<Object[]> sumDepenseByCategorie(
            @Param("compteId") Long compteId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("select coalesce(sum(t.montant), 0) from Transaction t " +
            "where t.utilisateurCompte.idUtilisateurCompte = :compteId " +
            "and t.categorie.idCategorie = :categorieId " +
            "and t.dateTransaction between :start and :end " +
            "and lower(t.transactionType.libelle) = 'depense'")
    BigDecimal sumDepenseByCategorieBetween(
            @Param("compteId") Long compteId,
            @Param("categorieId") Long categorieId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
