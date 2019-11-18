require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../email/registration')
const resetEmail = require('../email/reset')

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
            return res.redirect('/auth/login#login') 
        }
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
                    res.redirect('/')
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

const registerAuth = (req,res)=>{
    try{
        const {email, password, name} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('regError', errors.array()[0].msg)
            return res.redirect('/auth/login#register') 
        }
        crypto.randomBytes(25,async (err, buffer)=>{
            if(err){
                res.flash('resetError','Щось пішло не так...')
                res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            const hashPass = await bcrypt.hash(password, 7)
            const user = new User({
                temporaryAddress: email, 
                password: hashPass, 
                name,
                registerToken: token,
                registerTokenExp: Date.now() + 1800000, 
                favorite:{items:[]}
            })
            await user.save()
            await transporter.sendMail(regEmail(email, name, token))
            res.redirect('/auth/login#login')
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Проблеми при реєстрації'
        })
    }
}

const registerToken =async (req,res)=>{
    if(!req.params.token){
        return res.redirect('/auth/login')
    }
    try{
        const user = await User.findOne({
            registerToken : req.params.token,
            registerTokenExp: {$gt: Date.now()}
        })
        if(!user){
            return res.redirect('/auth/login')
        }else{
            user.email = user.temporaryAddress
            user.temporaryAddress = undefined
            user.registerToken = undefined
            user.registerTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        }
    }catch(err){
        console.log({
            err: true,
            message: 'Щось пішло не так при відновленні паролю...'
        })
    }
}

const logOut = (req,res)=>{
    req.session.destroy(()=>{
      res.redirect('/auth/login#login')  
    })    
}

const resetPage = (req,res)=>{
    res.render('reset',{
        title: 'Відновлення паролю',
        resetError: req.flash('resetError')
    })
}

const reset = (req,res)=>{
    try{        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('resetError', errors.array()[0].msg)
            return res.redirect('/auth/reset') 
        }
        crypto.randomBytes(25,async (err, buffer)=>{
            if(err){
                res.flash('resetError','Щось пішло не так...')
                res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            const user = await User.findOne({email: req.body.email})
            if(user){
                user.resetToken = token
                user.resetTokenExp = Date.now() + 1800000
                await user.save()
                await transporter.sendMail(resetEmail(user.email, token))
                req.flash('loginError',' Перевірте електронну пошту')
                res.redirect('/auth/login')
            }else{
                req.flash('resetError',' Такий Email не знайдений')
                res.redirect('/auth/reset')
            }
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Щось пішло не так...'
        })
    }
}

const newPassword =async (req,res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg)
            return res.redirect(req.headers.referer)
        }
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if(user){
            user.password = await bcrypt.hash(req.body.password, 7)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            req.flash('loginError','Пароль оновлено')
            res.redirect('/auth/login')
        }else{
            req.flash('loginError', 'Час на відновлення паролю вичерпаний')
            res.redirect('/auth/login')
        }

    }catch(err){
        console.log({
            err: true,
            message: 'Оновлення паролю не вдалось'
        })
    }
}

const newPasswordPage =async (req,res)=>{
    if(!req.params.token){
        return res.redirect('/auth/login')
    }
    try{
        const user = await User.findOne({
            resetToken : req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if(!user){
            return res.redirect('/auth/login')
        }else{
            res.render('newPassword', {
                title: 'Новий пароль',
                error: req.flash('error'),
                userId: user._id,
                token: req.params.token
            })
        }
    }catch(err){
        console.log({
            err: true,
            message: 'Щось пішло не так при відновленні паролю...'
        })
    }
}


module.exports = {
    loginPage,
    loginAuth,
    registerAuth,
    logOut,
    reset,
    resetPage,
    newPassword,
    newPasswordPage,
    registerToken
}