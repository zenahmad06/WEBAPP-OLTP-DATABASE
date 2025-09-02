-- Create a new table 'TableName' with a primary key and columns
CREATE TABLE menus (
    menu_id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category in ('american','asian','italian','mexican')),
    -- KALAOU koma gunakan numeric
    price NUMERIC(10,2) NOT NULL
);


-- mulai dari 101
ALTER SEQUENCE menus_menu_id_seq RESTART WITH 101;