CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'other') DEFAULT 'other',
    birth_date DATE,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    hashed_password VARCHAR(255) NOT NULL,
    reward_points INT DEFAULT 0,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_password_change DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_contact CHECK (
        (phone_number IS NOT NULL) OR (email IS NOT NULL)
    )
);
