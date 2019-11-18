require('dotenv').config()
const Favorite = require('../../models/favorite')
const findAndSave = require('../../helpers/addAndSave')
const uploadToS3 = require('../../helpers/uploadToS3')
const moment = require('moment')


const addComment =async(req,res)=>{
    try{
        if(req.file){
            if(!req.file.mimetype.match('image.*|audio.*|video.*')){
                return res.status(400).json({
                    message: 'Даний файл не підтримуєються'
                })
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
        res.status(200).json({
            message: 'Коментар успішно додано'
        })
    }catch(err){
        res.json({
            err: true,
            message: 'Не вдалось добавити коментар'
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
                res.status(401).json({
                    message: 'Ви не писали даний коментар'
                })
            }
            comment.splice(index,1)
            result.comments = comment
            await result.save()
            res.status(200).json({
                message: 'Коментар успішно видалено'
            })
        }else{
            res.status(406).json({
                message: 'Коментар не знайдено'
            })
        }
    }catch(err){
    cres.json({
        err: true,
        message: 'Не вдалось видалити коментар'
    })
}
}

module.exports = {
    addComment,
    deleteComment
}