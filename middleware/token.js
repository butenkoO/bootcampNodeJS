require('dotenv').config()
const jwt = require('jsonwebtoken')
module.exports = (req,res,next)=>{
    const token = req.session.token
    try{
        jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.redirect('/auth/login#login')
    }
    next()
}