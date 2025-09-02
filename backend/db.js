//import Pool
const {Pool} = require('pg');
//dotnev config -- biar bisa dibaca

require('dotenv').config()

// buat object yang berisi koneksi

const pool = new Pool({
    connectionString : process.env.DATABASE_URL // baca dari env
    // default mas koneksi 10
})

// handle error
pool.on('error',(error) => {
    console.log('error');
    //exit the connection
    process.exit(1)
})

// export kita ingin menggunakan nama baru kita encapsulasi dengan {}

// 2 metode di export
module.exports = {
    query : (text,params) => pool.query(text,params), // query sebenarnya punya 2 params, kita pisahkan untuk menghindalri sql injection
    getClient : () => pool.connect() // agaar bisa menjalankan query secara berurutan
}
