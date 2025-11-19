CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,                      -- Si l’utilisateur est connecté (sinon NULL)
  overall_rating TINYINT DEFAULT 0,         -- Note globale (0-5)
  produits_rating TINYINT DEFAULT 0,        -- Qualité des produits
  accueil_rating TINYINT DEFAULT 0,         -- Service d'accueil
  livraison_rating TINYINT DEFAULT 0,       -- Service de livraison
  prix_rating TINYINT DEFAULT 0,            -- Rapport qualité-prix
  fidelite_rating TINYINT DEFAULT 0,        -- Programme de fidélité
  libre_expression TEXT,                   -- Champ libre
  email_consent BOOLEAN DEFAULT FALSE,     -- Consentement contact par email
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date/heure du feedback
  FOREIGN KEY (client_id) REFERENCES clients(id)
ON DELETE CASCADE
);
