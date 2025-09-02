const express = require('express');
const db = require('../db');
const router = express.Router();
const asyncHandler = require('../utils/AsyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const { nanoid } = require('nanoid');

router.get('/me',authMiddleware,asyncHandler(async(req,res) => {
    // ambil id karena req.user = {id:idUser} menggunakan destructing
    const {id,email} = req.user ;
    //search nama dan email
    const searchUser = await db.query('SELECT name_user,email FROM customers WHERE id = $1',[id]);
    if(searchUser.rowCount == 0 ){
    
        return res.status(404).json({message:"not found"});
    };
    //get data
    const dat = searchUser.rows[0];

    return res.status(200).json({
        name:dat.name_user,
        email:dat.email
    })

}))

//daftar menupm start

router.get('/menu',authMiddleware,asyncHandler(async(req,res) => {
    //ambil dari database
    //baca query bentuknya string
    // parse kenumber
    const {page} = req.query;
    //dari eksternal defensifve programming
    if(isNaN(page) || page < 1 || !page){
        return res.status(401).json({message:'invalid'})
    }
    //select kita tentukan per halaman ada 8 jadi 
    const limit = 8
    // dari limit kita tentukan offset (start ambil data dengan rumus)
    const startIndex = (Number(page)-1) * limit;
    //ambil table berdasarkan startIndex
    const menuTable = await db.query('SELECT * FROM menus ORDER BY menu_id LIMIT $1 OFFSET $2',[limit,startIndex]);
    //defensive progtamming setiap melaukan operasi
    if(menuTable.rowCount == 0){
        return res.status(404).json({message:'not found'})
    };
    //get data
    const dataMenu = menuTable.rows;
    res.status(200).json(dataMenu);
}))

// detailed product
router.get('/product/:menu_id',authMiddleware,asyncHandler(async(req,res) => {
    //ambil param
    const {menu_id} = req.params;
    //devensive programming, jika null/undefinied
    if(!menu_id){
        return res.status(401).json({message:'invalid params'})
    }
    //jika tidak
    const searchData = await db.query('SELECT * FROM menus WHERE menu_id = $1', [Number(menu_id)]);
    //defensive programming
    if(searchData.rowCount == 0){
        return res.status(404).json({message:'Not Found'})
    };
    //ambil data
    const foundData = searchData.rows[0];
    res.status(200).json(foundData)
}))

// order
router.post('/order',authMiddleware,asyncHandler(async(req,res) => {
    const {items} = req.body;
    //explicit
    if(!items || !Array.isArray(items)) return res.status(400).json({message:"data invalid"})
    const {id} = req.user;
    // mulai insert data ke database
    const client = await db.getClient(); // biar bisa nulis db query brurutan
    // transaction dalam sql didalam begin dan commit
    const orderId = nanoid(5);
    await client.query('BEGIN');
    //tulis di order dulu terus 
    // agrefasi misal total kalau bisa diitung di backend
    //menggunakan reduce 
    const totalPesanan = items.reduce((val,item) => {
        const quantitityItem = Number(item.amount ?? item.qty);
        return val + (quantitityItem * Number(item.price))
    },0)
    //masukan ke total pesanan di table orders
    await client.query('INSERT INTO orders(order_id,customer_id,total) VALUES ($1,$2,$3)',[orderId,id,totalPesanan]);
    //insert ke kolom table order item
    for (const item of items){
        const quantity = Number(item.qty ?? item.amount)
        //masukan ke order item
        const orderItemId = nanoid(5);

        await client.query('INSERT INTO order_items(order_item_id,order_id,menu_id,amount) VALUES ($1,$2,$3,$4)',[orderItemId,orderId,item.menu_id,quantity]);

        // update stock dikurangi qty
        await client.query('UPDATE menus SET stock = stock - $1 WHERE menu_id = $2',[quantity,item.menu_id] )

    }
    await client.query('COMMIT');
    res.status(201).json({message:'data berhasil diinput'})

}))
module.exports = router;