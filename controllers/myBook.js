const User = require('../models/user')
const AWS = require('aws-sdk')
const uuid = require('uuid')
const ID = process.env.ID
const SECRET = process.env.SECRET
const BUCKET_NAME = process.env.BUCKET_NAME

const myBookPage =async (req,res)=>{
    try{
        const user = await User.findById(req.session.user._id)
        const data = user.myBook
        res.render('myBooks',{
            title:'Мої книжки', 
            isMyBook: true,
            data
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось відобразити сторінку'
        })
    }
}

const addMyBookPage =(req,res)=>{
    res.render('addMyBook',{
        title:'Додати книжку',
        isAddMyBook:true})
}

const addMyBook = async (req,res)=>{
    try{
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        })
        const filename = uuid.v4()
        const params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const s3Response = await s3.upload(params).promise();
        const user = await User.findById(req.session.user._id)
        const book = [...user.myBook]
        book.push({
            title:req.body.title,
            image:s3Response.Location,
            authors:req.body.authors,
            year:req.body.year,
            desc:req.body.desc
        })
        user.myBook = book
        await user.save()
        res.redirect('/myBook')  
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось добавити книжку'
        })
    }
}

const editMyBookPage = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user._id)
        const book = [...user.myBook]
        const index = book.findIndex(el => el._id == req.params.id)
        res.render('editMyBook',{
            data: book[index]
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось відобразити сторінку'
        })
    }
}

const editMyBook =async (req,res)=>{
try{
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    })
    const filename = uuid.v4()
    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const s3Response = await s3.upload(params).promise();
    const user = await User.findById(req.session.user._id)
    const book = [...user.myBook]
    const index = book.findIndex(el => el._id == req.body.id)
    book.splice(index,1)
    book.push({
        title:req.body.title,
        image:s3Response.Location,
        authors:req.body.authors,
        year:req.body.year,
        desc:req.body.desc
    })
    user.myBook = book
    await user.save()
    res.redirect('/myBook')
}catch(err){
    console.log({
        err: true,
        message: 'Не вдалось редагувати книжку'
    })
} 
}

const removeMyBook =async (req,res)=>{
    try{
        const user = await User.findById(req.session.user._id)
        const book = [...user.myBook]
        const index = book.findIndex(el => el._id == req.body.id)
        book.splice(index,1)
        user.myBook = book
        await user.save()
        res.redirect('/myBook')  
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось видалити книжку'
        })
    } 
}

module.exports = {
    myBookPage,
    addMyBookPage,
    addMyBook,
    editMyBook,
    removeMyBook,
    editMyBookPage
}