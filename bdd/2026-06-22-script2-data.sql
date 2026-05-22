INSERT INTO utilisateur (nom, prenom, email, dtn)
VALUES ('Dupont', 'Marie', 'marie.dupont@example.com', '1995-04-12');

INSERT INTO type_compte (nom) VALUES
('Courant'),
('Epargne'),
('Cash');

INSERT INTO transaction_type (libelle) VALUES
('Revenu'),
('Depense');

INSERT INTO categorie (libelle, limite) VALUES
('Nourriture', 45000.00),
('Transport', 35000.00),
('Salaire', NULL),
('Loisirs', 20000.00);


INSERT INTO type_compte (nom) VALUES
('Mobile Money');