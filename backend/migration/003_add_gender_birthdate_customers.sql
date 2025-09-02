-- kolom gender yang hanya diperbolehkan male dan female nilainya dengan menggunakan perintah CHECK
ALTER TABLE Customers ADD COLUMN gender TEXT CHECK (gender IN ('male','female'));
ALTER TABLE Customers ADD COLUMN birth_date DATE;