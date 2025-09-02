
// import the express
const express = require('express');
const router = express.Router();

const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt')
// import utils asynchandler
const asynchandler = require('../utils/AsyncHandler')
const jwt = require('jsonwebtoken')
// import db
const db  = require('../db')
// import sendVerif
const sendVerif = require('../utils/SendVerif');
const transport = require('../utils/SendVerif');

require('dotenv').config()

//menghandle register user
router.post('/register',asynchandler(async(req,res) => {

    //check the body
    const {name,email,password,gender,dates} = req.body;

    // buat object untuk error
    const objErrors = {}
    
    const search = await db.query('SELECT * FROM customers WHERE email = $1',[email]) ;
    const hasEmail= search.rowCount || 0;
    //dinamic menggungkan looping 
    Object.keys(req.body).forEach((item) => {
        // if req.body[item] == nun
        if(!req.body[item]){
            objErrors[item] = `${item} tidak boleh kosong`
        }else{
            if(item == 'password'){
                if(req.body[item].length < 6){
                    objErrors[item] = 'password minimal 6 karakter'
                }
            }else if (item == 'email'){
                //search email udah terdaftar belum
                if (hasEmail != 0 ){
                    objErrors[item] = "email sudah terdaftar"
                }
            }
        }
    })
    // kemudia kirim dengan check apaka objec error kosong/tidak
    //gunakan status code 442
    if(Object.keys(objErrors).length > 0){
        return res.status(442).json({
            fieldErrors : objErrors
        })
    }
   

    //jika tidak daftar
    // generate unik id dengan nanoid
    const id = nanoid(10) //10 karakter unik

    // salt round default 10
    const hashPassword = await bcrypt.hash(password,10)

    //kemudian masukan ke table Customer menggunakan db.query tanpa params


    await db.query('INSERT INTO customers(id,name_user,email,password_user,gender,birth_date) VALUES ($1,$2,$3,$4,$5,$6)',[id,name,email,hashPassword,gender,dates])

    // generate token
    const token = jwt.sign(
        {email},//hanya email di payload
        process.env.JWT_SECRET, // key secret buat verify
        {expiresIn:'15m'}
    )
    //bals ke client dulu baru kirim email
    res.status(201).json({message:'berhasil'})
    //mengirim dengan lunk verifikasi
    await sendVerif.sendMail({
        from:'ahmad123@gmail.com',
        to:'user@example.com',
        subject:'verification email',
        html:`<p>Anda berhasil mendaftar akun anda, langkah terakhir click link ini <a href='http://localhost:3000/api/auth/verify?token=${token}'>Link ini</a></p>`
    })

    

}))

router.get('/verify',asynchandler(async(req,res) => {
    //membaca query, query itu berbentuk {} object jadi ketika menggunakan queri ditandai dengan ? di url kita nambah key di query {}
    const {token} = req.query;
    if(!token){
        return res.status(400).json({message:'token tidak terlampir'})
    };
    //jika ada veryfy dengan jwt.verify dan kunci
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET); // rerurn nya ada adahlah object
        //payload menyiman email
        const emailUser = payload.email;
        //search di db dan update isVerified jadi true
        const update = await db.query('UPDATE Customers SET isVerified = true WHERE email = $1',[emailUser]);
        //jika email nggak ketemu
        if(update.rowCount == 0){
            return res.status(404).json({message:'email tidak ditemukan'})
        }

        //cari id
        const idUser = await db.query('SELECT id FROM customers WHERE email = $1',[emailUser])
        // buat login sesi, simpan id
        const tokenLogin = jwt.sign({id:idUser.rows[0].id},process.env.JWT_AUTH_SECRET,{expiresIn:'1d'}) //menggunakan secret key beda unut login sesi

        // simpan token di cookie
        res.cookie('login',tokenLogin,{
            httpOnly:true,
            path:'/', //cookie AKAN dikirm ke route backend yang punya domain sama
            sameSite:'lax', //proses developement pakai lax dan secure false
            secure:false,
            maxAge: 1000 * 60 * 60 * 24 // durasi cookie
        })
        

        //setelah verifikasi kembali ke halaman login
        res.redirect('http://localhost:5173/product')


    }catch(error){
        return res.status(401).json({message:error.message,name:error.name,})

    }

}))

//handle login

router.post('/login',asynchandler(async(req,res) => {
    // baca data dari body
    const {email,password} = req.body;

    //buat objec errpr
    const loginErrors = {}
    const findEmail = await db.query('SELECT * FROM Customers WHERE email = $1',[email]);

    
    for (const item of Object.keys(req.body)){
        if(!req.body[item]){
            loginErrors[item] = `${item} tidak boleh kosong`
        }else{
            if(item == 'email'){
                const findEmail = await db.query('SELECT * FROM customers WHERE email = $1',[email]);

                if(findEmail.rowCount == 0){
                    loginErrors[item] = 'email belum terdaftar'
                }else{
                    const dat = findEmail.rows[0]

                    const compare = await bcrypt.compare(password,dat.password_user)

                    if(!compare){
                        loginErrors.password = "password salah"
                    }
                }
            }

        }
    }
    console.log(loginErrors)
   
    if(Object.keys(loginErrors).length > 0){
        return res.status(422).json({
            fieldErrors : loginErrors
        })
    }
    // ambil data di key rows return object dengan index [0]
    const datEmail = findEmail.rows[0];
    //menggunakan hruf kecil krn otomatis ke convert harusnya di create table pake isVerivied
    if(!datEmail.isverified){
        return res.status(409).json({
            message:'verifikasi ulang',
            code:'verif'
        })
    }
  
    //buat token simpan email dan id
    const tokenUser =  jwt.sign({email:datEmail.email,id:datEmail.id},process.env.JWT_AUTH_SECRET,{expiresIn:'1d'})
    //jika benar simpan user di cookies
    res.cookie('login',tokenUser,{
        httpOnly:true, //agar tidak terbaca di Javascript
        path:'/', //mengizinkan cookie ini terbaca di path mana aja
        maxAge:1000 * 60 * 60 * 24, // kadaluaras 1 jam lagi dari waktu sekarang 
        sameSite:'lax',
        secure:false

    })

    //
    return res.status(200).json({
        
        message:'login berhasil',
        data:{
            email:datEmail.email,
            user:datEmail
        }
    })
    
}))

// handle resend verfication
router.post('/resend',asynchandler(async(req,res) => {
    const {email} = req.body;
    //generate token
    const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'1h'}); //jwt_SECRET buat verify
    //send email again
   
    res.status(200).json({message:'berhasil resend verifikasi'})
    sendVerif.sendMail({
        from:'contoh@gmail.com',
        to:'userverif@gmai.com',
        subject:'verification email',
        html:`<p> Verifikasi akun anda dengan klik <a href ="http://localhost:3000/api/auth/verify?token=${token}">link ini</a></p>`
    })
    
}))

//logout 
router.post('/logout',asynchandler(async(req,res) => {
    //clear cookies
    //setup harus sama dengan login kecuali MaxAGE
    res.clearCookie('login',{
        httpOnly:true, //agar tidak terbaca di Javascript
        path:'/', //mengizinkan cookie ini terbaca di path mana aja
        sameSite:'lax',
        secure:false

    })
    //sukse
    return res.status(204).end()
}))
module.exports = router