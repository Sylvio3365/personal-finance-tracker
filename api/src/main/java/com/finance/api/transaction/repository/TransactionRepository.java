package com.finance.api.transaction.repository;

import com.finance.api.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    long countByUtilisateurCompte_IdUtilisateurCompte(Long compteId);

    List<Transaction> findByUtilisateurCompte_IdUtilisateurCompte(Long compteId);

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
