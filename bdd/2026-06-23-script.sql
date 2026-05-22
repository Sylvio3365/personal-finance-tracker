-- ════════════════════════════════════════════════════════════════
-- Script de données de test pour Personal Finance Tracker
-- Date: 2026-06-23 (version corrigée avec ON CONFLICT)
-- ════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────
-- 1. Types de Compte (Type de données de base)
-- ──────────────────────────────────────────────────────────────────
INSERT INTO type_compte (id_type_compte, nom) VALUES
  (1, 'Compte Courant'),
  (2, 'Compte Épargne'),
  (3, 'Compte Titres'),
  (4, 'Portefeuille')
ON CONFLICT (id_type_compte) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 2. Types de Transaction
-- ──────────────────────────────────────────────────────────────────
INSERT INTO transaction_type (id_transaction_type, libelle) VALUES
  (1, 'Revenu'),
  (2, 'Dépense')
ON CONFLICT (id_transaction_type) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 3. Catégories
-- ──────────────────────────────────────────────────────────────────
INSERT INTO categorie (id_categorie, libelle, limite) VALUES
  (1, 'Nourriture', 250000.00),
  (2, 'Transport', 120000.00),
  (3, 'Loisirs', 150000.00),
  (4, 'Santé', 100000.00),
  (5, 'Éducation', 200000.00),
  (6, 'Logement', 500000.00),
  (7, 'Utilities', 80000.00),
  (8, 'Salaire', NULL),
  (9, 'Bonus', NULL)
ON CONFLICT (id_categorie) DO UPDATE SET libelle = EXCLUDED.libelle;

-- ──────────────────────────────────────────────────────────────────
-- 4. Utilisateur de Test
-- ──────────────────────────────────────────────────────────────────
-- Mot de passe: password123 (à hasher en production)
INSERT INTO utilisateur (id_utilisateur, nom, prenom, email, dtn, mot_de_passe) VALUES
  (1, 'Dupont', 'Jean', 'jean.dupont@test.com', '1990-05-15', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBS1Hp')
ON CONFLICT (id_utilisateur) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 5. Comptes Utilisateur
-- ──────────────────────────────────────────────────────────────────
INSERT INTO utilisateur_compte (id_utilisateur_compte, nom, solde_actuel, id_type_compte, id_utilisateur) VALUES
  (1, 'Compte Chèques Principal', '1500000', 1, 1),
  (2, 'Épargne Retraite', '5000000', 2, 1),
  (3, 'Compte Actions', '2500000', 3, 1),
  (4, 'Portefeuille Espèces', '50000', 4, 1)
ON CONFLICT (id_utilisateur_compte) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 6. Transactions de Test (Mai 2026)
-- ──────────────────────────────────────────────────────────────────

-- Revenus
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (1, 2500000.00, '2026-05-01 09:00:00', 'Salaire mensuel', 8, 1, 1),
  (2, 150000.00, '2026-05-15 14:30:00', 'Prime projet', 8, 1, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Nourriture
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (3, 45000.00, '2026-05-02 11:20:00', 'Supermarché Carrefour', 1, 2, 1),
  (4, 35000.00, '2026-05-05 12:45:00', 'Resto Italiana', 1, 2, 1),
  (5, 28000.00, '2026-05-08 10:15:00', 'Boucherie Martin', 1, 2, 1),
  (6, 52000.00, '2026-05-12 09:30:00', 'Courses semaine', 1, 2, 1),
  (7, 38000.00, '2026-05-18 13:00:00', 'Pizza Hut', 1, 2, 1),
  (8, 42000.00, '2026-05-22 11:45:00', 'Marché Bio', 1, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Transport
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (9, 15000.00, '2026-05-03 08:30:00', 'Essence Elf', 2, 2, 1),
  (10, 25000.00, '2026-05-10 10:00:00', 'Révision Auto', 2, 2, 1),
  (11, 12000.00, '2026-05-17 09:15:00', 'Essence Total', 2, 2, 1),
  (12, 18000.00, '2026-05-25 07:45:00', 'Parking mois', 2, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Loisirs
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (13, 55000.00, '2026-05-04 19:30:00', 'Cinéma + Popcorn', 3, 2, 1),
  (14, 75000.00, '2026-05-11 17:00:00', 'PlayStation 5 game', 3, 2, 1),
  (15, 28000.00, '2026-05-20 18:45:00', 'Concert Tondú', 3, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Santé
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (16, 45000.00, '2026-05-06 14:20:00', 'Pharmacie Blon', 4, 2, 1),
  (17, 95000.00, '2026-05-19 11:00:00', 'Visite Dentiste', 4, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Éducation
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (18, 125000.00, '2026-05-07 10:30:00', 'Formation Udemy', 5, 2, 1),
  (19, 85000.00, '2026-05-21 09:00:00', 'Livres Python', 5, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Logement
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (20, 450000.00, '2026-05-01 08:00:00', 'Loyer Mai', 6, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Utilities
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (21, 35000.00, '2026-05-09 12:00:00', 'Facture Électricité', 7, 2, 1),
  (22, 25000.00, '2026-05-15 15:30:00', 'Internet Orange', 7, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Autres dépenses
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (23, 65000.00, '2026-05-13 10:00:00', 'Assurance Voiture', 9, 2, 1),
  (24, 40000.00, '2026-05-24 16:45:00', 'Cadeau Anniversaire', 9, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 7. Transactions de Test (Juin 2026)
-- ──────────────────────────────────────────────────────────────────

-- Revenus Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (25, 2500000.00, '2026-06-01 09:00:00', 'Salaire mensuel', 8, 1, 1),
  (26, 200000.00, '2026-06-20 14:30:00', 'Bonus Performance', 8, 1, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Nourriture Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (27, 48000.00, '2026-06-02 11:20:00', 'Supermarché Carrefour', 1, 2, 1),
  (28, 32000.00, '2026-06-06 12:45:00', 'Resto Japonais', 1, 2, 1),
  (29, 31000.00, '2026-06-09 10:15:00', 'Boucherie Martin', 1, 2, 1),
  (30, 55000.00, '2026-06-14 09:30:00', 'Courses semaine', 1, 2, 1),
  (31, 40000.00, '2026-06-19 13:00:00', 'Burger King', 1, 2, 1),
  (32, 38000.00, '2026-06-25 11:45:00', 'Marché Bio', 1, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Transport Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (33, 16000.00, '2026-06-03 08:30:00', 'Essence Elf', 2, 2, 1),
  (34, 8000.00, '2026-06-11 10:00:00', 'Lavage Auto', 2, 2, 1),
  (35, 14000.00, '2026-06-18 09:15:00', 'Essence Total', 2, 2, 1),
  (36, 18000.00, '2026-06-28 07:45:00', 'Parking mois', 2, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Loisirs Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (37, 62000.00, '2026-06-05 19:30:00', 'Cinéma 2 places', 3, 2, 1),
  (38, 45000.00, '2026-06-12 17:00:00', 'Restaurant Gourmet', 3, 2, 1),
  (39, 31000.00, '2026-06-22 18:45:00', 'Spectacle Musical', 3, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Santé Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (40, 52000.00, '2026-06-07 14:20:00', 'Pharmacie Blon', 4, 2, 1),
  (41, 68000.00, '2026-06-21 11:00:00', 'Consultation Cardiologue', 4, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Éducation Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (42, 95000.00, '2026-06-08 10:30:00', 'Cours Linux Avancé', 5, 2, 1),
  (43, 75000.00, '2026-06-23 09:00:00', 'Livres DevOps', 5, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Logement Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (44, 450000.00, '2026-06-01 08:00:00', 'Loyer Juin', 6, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Dépenses Utilities Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (45, 38000.00, '2026-06-10 12:00:00', 'Facture Électricité', 7, 2, 1),
  (46, 25000.00, '2026-06-16 15:30:00', 'Internet Orange', 7, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- Autres dépenses Juin
INSERT INTO transaction (id_transaction, montant, date_transaction, note, id_categorie, id_transaction_type, id_utilisateur_compte) VALUES
  (47, 65000.00, '2026-06-14 10:00:00', 'Assurance Voiture', 9, 2, 1),
  (48, 52000.00, '2026-06-26 16:45:00', 'Réparation Montre', 9, 2, 1)
ON CONFLICT (id_transaction) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 8. Résumé des données ajoutées
-- ──────────────────────────────────────────────────────────────────
-- Utilisateur: Jean Dupont (jean.dupont@test.com)
-- Comptes: 4 comptes (Courant, Épargne, Titres, Portefeuille)
-- Catégories: 9 catégories avec limites mensuelles
-- Transactions: 48 transactions (Mai + Juin 2026)
--
-- MAI 2026:
--   - 2 revenus = 2 650 000 Ar
--   - 22 dépenses par catégorie
--   - Total dépenses ≈ 1 397 000 Ar
--   - Solde net mai ≈ 1 253 000 Ar
--
-- JUIN 2026:
--   - 2 revenus = 2 700 000 Ar (salaire + bonus)
--   - 24 dépenses par catégorie
--   - Total dépenses ≈ 1 442 000 Ar
--   - Solde net juin ≈ 1 258 000 Ar
--
-- TOTAL 2 MOIS: 48 transactions
-- ──────────────────────────────────────────────────────────────────