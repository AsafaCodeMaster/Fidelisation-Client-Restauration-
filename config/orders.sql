CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_client INT NOT NULL,
    id_reward INT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'success') DEFAULT 'success',
    point INT DEFAULT 0,
    remaining_points INT DEFAULT 0,
    description VARCHAR(255) NULL,
    type ENUM('purchase', 'reward') DEFAULT 'purchase',
    FOREIGN KEY (id_client) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (id_reward) REFERENCES rewards(id) ON DELETE SET NULL
);
