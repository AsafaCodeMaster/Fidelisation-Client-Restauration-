CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    birth_date DATE,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reward_points INT DEFAULT 0,
    hashed_password VARCHAR(255) NOT NULL,
    CONSTRAINT chk_contact CHECK (
        (phone_number IS NOT NULL) OR (email IS NOT NULL)
    )
);
