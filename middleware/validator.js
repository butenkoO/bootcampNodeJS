const { check, validationResult } = require('express-validator');
const User = require('../models/user')

exports.registerValidators = [
    check('name')
     .trim()
     .isLength({min: 3})
     .withMessage('Імя повинно містити мінімум 3 символи'),
    check('email')
     .isEmail().withMessage('Некоректний Email')
     .trim()
     .custom(async(value, {req})=>{
        try{
            const client = await User.findOne({ email: value });
            if(client){
                return Promise.reject('Даний email використовується')
            }
        }catch(err){
            console.log(err)
        }
    }),
    check('password', 'Пароль повинен містити мінімум 6 символів, великі, малі літери та цифри')
     .trim()
     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,30}$/, "i"),
    check('confirm')
     .trim()
     .custom(async(value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Паролі не співпадають')
        }
        return true
    })
]
exports.loginValidators = [
    check('email')
     .trim()
     .custom(async(value, {req})=>{
        try{
            const client = await User.findOne({ email: value });
            if(!client){
                return Promise.reject('Даного користувача не існує')
            }
        }catch(err){
            console.log(err)
        }
    })
]

exports.resetValidators = [
    check('email')
     .trim()
     .custom(async(value, {req})=>{
        try{
            const client = await User.findOne({ email: value });
            if(!client){
                return Promise.reject('Даного користувача не існує')
            }
        }catch(err){
            console.log(err)
        }
    })
]

exports.newPassValidators = [
    check('password', 'Пароль повинен містити мінімум 6 символів, великі, малі літери та цифри')
     .trim()
     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,30}$/, "i")
]

exports.bookValidators = [
    check('title')
     .trim()
     .isLength({min: 3})
     .withMessage('Імя книги повинно містити мінімум 3 символи'),
     check('authors')
     .trim()
     .isLength({min: 3})
     .withMessage('Імя автора повинно містити мінімум 3 символи'),
     check('year')
     .trim()
     .isLength({min: 4})
     .withMessage('Некоректна дата')
]
