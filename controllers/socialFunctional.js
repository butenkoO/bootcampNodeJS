require('dotenv').config()
const Favorite = require('../models/favorite')
const findAndSave = require('../helpers/addAndSave')
const uploadToS3 = require('../helpers/uploadToS3')
const moment = require('moment')


const addComment =async(req,res)=>{
    try{
        let filePath,image,audio,video;
        if(req.file){
            if(!req.file.mimetype.match('image.*|audio.*|video.*')){
                req.flash('dataError', 'Даний файл не підтримуєються')
                return res.redirect(req.headers.referer)
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
            filePath = await uploadToS3(req)
            }
        }
        const book = await findAndSave(req.body.isbn13)
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
        res.redirect(req.headers.referer)
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось добавити коментар'
        })
    }
}

const like = async (req,res)=>{
    try{
        const book = await findAndSave(req.body.isbn13)
        const like = [...book.likes.like]
        const indexLike = like.findIndex(el => el.author == req.body.author)
        if( indexLike >= 0){
            res.redirect(req.headers.referer)
        }else{
            like.push({author: req.session.user})
            book.likes.like = like
            let dislike = [...book.likes.dislike]
            const indexDisLike = dislike.findIndex(el => el.author == req.body.author)
            if( indexDisLike >= 0){
                dislike.splice(indexDisLike,1)
                book.likes.dislike = dislike
            }
            await book.save()
            res.redirect(req.headers.referer)
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
        const book = await findAndSave(req.body.isbn13)
        const dislike = [...book.likes.dislike]
        const indexDisLike = dislike.findIndex(el => el.author == req.body.author)
        if( indexDisLike >= 0){
            res.redirect(req.headers.referer)
        }else{
            dislike.push({author: req.session.user})
            book.likes.dislike = dislike
            let like = [...book.likes.like]
            const indexLike = like.findIndex(el => el.author == req.body.author)
            if( indexLike >= 0){
                like.splice(indexLike,1)
                book.likes.like = like
            }
            await book.save()
            res.redirect(req.headers.referer)
        }    
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось оцінити товар'
        })
    }  
}

const deleteComment = async(req,res)=>{
    try{
        const result = await Favorite.findOne({_id: req.body.bookid})
        const comment = [...result.comments]
        const index = comment.findIndex(el=> el._id.toString() === req.body.id)
        if(index >= 0){
            if(!comment[index].author.toString() == req.session.user){
                res.redirect(req.headers.referer)
            }
            comment.splice(index,1)
            result.comments = comment
            await result.save()
            res.redirect(req.headers.referer)
        }else{
            res.redirect(req.headers.referer)
        }
    }catch(err){
    console.log({
        err: true,
        message: 'Не вдалось видалити коментар'
    })
}
}

module.exports = {
    addComment,
    like,
    dislike,
    deleteComment
}