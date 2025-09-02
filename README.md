# Membuat WebApp + sistem database OLTP
sumber dataset : Maven Analytics : https://app.mavenanalytics.io/datasets

# frontend
- windiCSS
- useQuery -> fetching data + cache agar tidak fetch data setiap saat
- react router dom
- redux jstoolkit (menghandle state global untuk cart dalam webapp)
- pagination

# Backend
- Disimpan dalam cookies
- login menggunakan jwt token
- menggunakan framework express
- nanoid buat id unik
- bcrypt buat hash password
- driver pg dari postgresql buat menulis sql di express

# Database
- PostgreSql

# Contoh Tampilan

1. Login Page

![login](./image/authLogin.PNG)

2. Tampilan awal 

![landing](./image/landing.PNG)

3. Detailed item page
![detail](./image/detail.PNG)

4. Cart Page
![cart](./image/cart.png)

5. Pagination bekerja
![alt text](./image/pagination.gif)

6. kerja modal
![modal](./image/modal.png)