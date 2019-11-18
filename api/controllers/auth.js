require('dotenv').config()
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const loginAuth = async (req,res)=>{
    try{
        const {email, password} = req.body
        const client = await User.findOne({email})
        const samePass = await bcrypt.compare(password, client.password)
        if(samePass){
            const token = jwt.sign(client._id.toString(),process.env.JWT_SECRET)
            req.session.token = token
            req.session.user = client._id
            req.session.isAuthenticated = true;
            req.session.save(err=>{
                if(err){
                    throw err
                }
                res.status(200).json({
                    token: token
                })
            })
        }else{
            res.status(403).json({
                err: true,
                message: 'Проблеми при авторизації'
            })
        }
    }catch(err){
        res.status(401).json({
            err: true,
            message: 'Проблеми при авторизації'
        })
    }
}

const registerAuth = async(req,res)=>{
    try{
        const {email, password, name} = req.body
        const hashPass = await bcrypt.hash(password, 7)
        const user = new User({
            email: email, 
            password: hashPass, 
            name,
            favorite:{items:[]}
        })
        await user.save()
        res.status(200).json({
            message: 'Користувач зареєстрований успішно'
        })
    }catch(err){
        res.status(403).json({
            err: true,
            message: 'Проблеми при реєстрації'
        })
    }
}


module.exports = {
    loginAuth,
    registerAuth,
}