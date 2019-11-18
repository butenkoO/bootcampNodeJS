require('dotenv').config()
const jwt = require('jsonwebtoken')
module.exports = (req,res,next)=>{
    const auth = req.get('Athorization')
    if(!auth){
        res.status(403).json({message: "Can't find token"})
    }
    const token = auth.replace('Bearer', '')
    try{
        jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        console.log(err)
    }
    next()
}