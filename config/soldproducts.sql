CREATE TABLE sold_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT NOT NULL,
    id_product INT NOT NULL,
    
    -- NOUVEAU: Clé Étrangère vers la table clients
    id_client INT NOT NULL, 
    
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type CHAR(10) NOT NULL,
    
    -- Contraintes existantes (maintenues)
    FOREIGN KEY (id_order) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES products(id) ON DELETE CASCADE,
    
    -- CONTRAINTE NOUVELLE: Lien vers le client
    FOREIGN KEY (id_client) REFERENCES clients(id)
ON DELETE CASCADE
);
