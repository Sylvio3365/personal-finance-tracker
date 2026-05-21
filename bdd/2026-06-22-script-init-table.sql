CREATE TABLE utilisateur(
   id_utilisateur SERIAL,
   nom VARCHAR(50) ,
   prenom VARCHAR(50) ,
   email VARCHAR(50)  NOT NULL,
   dtn DATE,
   mot_de_passe VARCHAR(255) NOT NULL,
   PRIMARY KEY(id_utilisateur),
   UNIQUE(email)
);

CREATE TABLE type_compte(
   id_type_compte SERIAL,
   nom VARCHAR(50) ,
   PRIMARY KEY(id_type_compte)
);

CREATE TABLE utilisateur_compte(
   id_utilisateur_compte INTEGER,
   nom VARCHAR(50) ,
   solde_actuel VARCHAR(50) ,
   id_type_compte INTEGER NOT NULL,
   id_utilisateur INTEGER NOT NULL,
   PRIMARY KEY(id_utilisateur_compte),
   UNIQUE(id_type_compte),
   UNIQUE(id_utilisateur),
   FOREIGN KEY(id_type_compte) REFERENCES type_compte(id_type_compte),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE transaction_type(
   id_transaction_type SERIAL,
   libelle VARCHAR(50) ,
   PRIMARY KEY(id_transaction_type)
);

CREATE TABLE categorie(
   id_categorie SERIAL,
   libelle VARCHAR(50) ,
   limite NUMERIC(25,2)  ,
   PRIMARY KEY(id_categorie)
);

CREATE TABLE transaction(
   id_transaction SERIAL,
   montant NUMERIC(25,4)  ,
   date_transaction TIMESTAMP,
   note TEXT,
   id_categorie INTEGER NOT NULL,
   id_transaction_type INTEGER NOT NULL,
   id_utilisateur_compte INTEGER NOT NULL,
   PRIMARY KEY(id_transaction),
   FOREIGN KEY(id_categorie) REFERENCES categorie(id_categorie),
   FOREIGN KEY(id_transaction_type) REFERENCES transaction_type(id_transaction_type),
   FOREIGN KEY(id_utilisateur_compte) REFERENCES utilisateur_compte(id_utilisateur_compte)
);

ALTER TABLE utilisateur
ADD COLUMN mot_de_passe VARCHAR(255);

UPDATE utilisateur
SET mot_de_passe = 'TEMP_HASH_A_REMPLACER'
WHERE mot_de_passe IS NULL;

ALTER TABLE utilisateur
ALTER COLUMN mot_de_passe SET NOT NULL;