
const jwt = require('jsonwebtoken')

require('dotenv').config() //biar bisa baca enve
const auth = (req,res,next) => {
    //akses ke cookies
    const tokenUser = req.cookies.login;
    if(!tokenUser){
        return res.status(401).json({message:'token tidak valuid'})
    }
    
    try{
        //validasi token yang berada di cookie
        const payload = jwt.verify(tokenUser,process.env.JWT_AUTH_SECRET);
        console.log(payload)
        //setelah validasi tambahkan key dengan nama user di object req
        req.user = {id:payload.id,email:payload.email};
        //next ke route handler
        next()


    }catch(error){
        return res.status(401).json({message:'token tidak valuid'})

        
    }

}

module.exports = auth;