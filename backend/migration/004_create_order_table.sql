-- Create a new table 'orders' with a primary key and columns
CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY ,
    customer_id VARCHAR(50) ,
    -- catat date user order dengan default
    order_date DATE DEFAULT now(),
    total INT,
    --containt membuat customer_id sebagai FK
    CONSTRAINT FK_customer FOREIGN KEY (customer_id) REFERENCES Customers(id)
)