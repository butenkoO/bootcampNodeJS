require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../email/registration')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: process.env.MAIL_KEY}
}))

const loginPage = (req,res)=>{
    res.render('auth',{
        title:'Авторизація',
        isLogin: true,
        loginError: req.flash('loginError'),
        regError: req.flash('regError')
    })
}

const loginAuth = async (req,res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('loginError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login') 
        }
        const {email, password} = req.body
        const client = await User.findOne({email})
        const samePass = await bcrypt.compare(password, client.password)
        if(samePass){
                const token = jwt.sign(client._id.toString(),process.env.JWT_SECRET)
                req.session.user = client
                req.session.isAuthenticated = true;
                req.session.save(err=>{
                    if(err){
                        throw err
                    }
                    res.json({"token": token})
                })
            }else{
                req.flash('loginError', 'Пароль невірний')
                res.redirect('/auth/login#login')
            }
    }catch(err){
        console.log({
            err: true,
            message: 'Проблеми при авторизації'
        })
    }
}

const registerAuth = async(req,res)=>{
    try{
        const {email, password, name} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('regError', errors.array()[0].msg)
            return res.redirect('/auth/login#register') 
        }
            const hash = await bcrypt.hash(password, 7)
            const user = new User({
                email, 
                password: hash, 
                name, 
                favorite:{items:[]}
            })
            await user.save()
            await transporter.sendMail(regEmail(email, name))
            res.redirect('/auth/login#login')
        
    }catch(err){
        console.log({
            err: true,
            message: 'Проблеми при реєстрації'
        })
    }
}
const logOut = (req,res)=>{
    req.session.destroy(()=>{
      res.redirect('/auth/login#login')  
    })    
}

module.exports = {
    loginPage: loginPage,
    loginAuth: loginAuth,
    registerAuth: registerAuth,
    logOut: logOut
}