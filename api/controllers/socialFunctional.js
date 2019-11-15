require('dotenv').config()
const Favorite = require('../models/favorite')
const Search = require('../models/search')
const AWS = require('aws-sdk')
const uuid = require('uuid')
const moment = require('moment')
const ID = process.env.ID
const SECRET = process.env.SECRET
const BUCKET_NAME = process.env.BUCKET_NAME

const addComment =async(req,res)=>{
    try{
        let filePath,image,audio,video;
        if(req.file){
        if(!req.file.mimetype.match('image.*|audio.*|video.*')){
            req.flash('dataError', 'Даний файл не підтримуєються')
            res.redirect('/books/'+ req.body.isbn13)
        }else{
            if(req.file.mimetype.match('image.*')){
                image = true
            }
            if(req.file.mimetype.match('audio.*')){
                audio = true
            }
            if(req.file.mimetype.match('video.*')){
                video = true
            }
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
            filePath = s3Response.Location
        }
        const result  = await Favorite.findOne({isbn13: req.body.isbn13})
        let book = result
        if(!result){
            const data  = await Search.searchBook(req.body.isbn13)
            const favorite = new Favorite(data) 
            await favorite.save()
            book = favorite  
        }
        const commentCart = [...book.comments]
        commentCart.push({
            commentMain: req.body.textarea,
            data: filePath,
            image,audio,video,
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            author: req.body.author,
        })
        book.comments = commentCart
        await book.save()
        res.redirect('/books/'+ req.body.isbn13)
        }
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось добавити коментар'
        })
    }
}

const like = async (req,res)=>{
    try{
        const result  = await Favorite.findOne({isbn13: req.body.isbn13})
        let book = result
        if(!result){
            const data  = await Search.searchBook(req.body.isbn13)
            const favorite = new Favorite(data) 
            await favorite.save()
            book = favorite  
        }
        const like = [...book.likes.like]
        const indexLike = like.findIndex(el => el.author == req.body.author)
        if( indexLike >= 0){
            res.redirect('/books/'+ req.body.isbn13)
        }else{
            like.push({author: req.session.user._id})
            book.likes.like = like
            let dislike = [...book.likes.dislike]
            const indexDisLike = dislike.findIndex(el => el.author == req.body.author)
            if( indexDisLike >= 0){
                dislike.splice(indexDisLike,1)
                book.likes.dislike = dislike
            }
            await book.save()
            res.redirect('/books/'+ req.body.isbn13)
        } 
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось оцінити товар'
        })
    }   
}

const dislike = async (req,res)=>{
    try{
        const result  = await Favorite.findOne({isbn13: req.body.isbn13})
        let book = result
        if(!result){
            const data  = await Search.searchBook(req.body.isbn13)
            const favorite = new Favorite(data) 
            await favorite.save()
            book = favorite  
        }
        const dislike = [...book.likes.dislike]
        const indexDisLike = dislike.findIndex(el => el.author == req.body.author)
        if( indexDisLike >= 0){
            res.redirect('/books/'+ req.body.isbn13)
        }else{
            dislike.push({author: req.session.user._id})
            book.likes.dislike = dislike
            let like = [...book.likes.like]
            const indexLike = like.findIndex(el => el.author == req.body.author)
            if( indexLike >= 0){
                like.splice(indexLike,1)
                book.likes.like = like
            }
            await book.save()
            res.redirect('/books/'+ req.body.isbn13)
        }    
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось оцінити товар'
        })
    }  
}

module.exports = {
    addComment,
    like,
    dislike
}