-- Create a new tableE order_items' with a primary key and columns
CREATE TABLE order_items (
    order_item_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    menu_id INT NOT NULL,
    amount INT NOT NULL,
    CONSTRAINT fk_menu FOREIGN KEY (menu_id) REFERENCES menus(menu_id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(order_id)

    
);