ALTER TABLE menus add CONSTRAINT stock_non_negative CHECK (stock >= 0);
