-- Create a new table 'TableName' with a primary key and columns
CREATE TABLE Customers (
    id VARCHAR(50) PRIMARY KEY,
    name_user VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_user VARCHAR(100)
);