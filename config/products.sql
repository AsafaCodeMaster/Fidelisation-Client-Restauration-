CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);


INSERT INTO products (name, price)
VALUES

    ('Pizza Margherita GM', 28000.00),
    ('Pizza Speciale La Gastronomie GM', 30000.00),
    ('Pizza Speciale Fummé GM', 30000.00),
    ('Pizza 4 Fromaggio GM', 30000.00),
    ('Pizza Turque GM', 30000.00),
    ('Pizza Frutta Di Mare GM', 30000.00),
    ('Pizza Forestière GM', 30000.00),
    ('Viande Gourmande GM', 30000.00),
    ('Pizza 3 Saucisses GM', 30000.00),
    ('Pizza Paysanne GM', 30000.00),

    ('Pizza Margherita MM', 18000.00),
    ('Pizza Speciale La Gastronomie MM', 20000.00),
    ('Pizza Speciale Fummé MM', 20000.00),
    ('Pizza 4 Fromaggio MM', 20000.00),
    ('Pizza Turque MM', 20000.00),
    ('Pizza Frutta Di Mare MM', 20000.00),
    ('Pizza Forestière MM', 20000.00),
    ('Viande Gourmande MM', 20000.00),
    ('Pizza 3 Saucisses MM', 20000.00),
    ('Pizza Paysanne MM', 20000.00);
