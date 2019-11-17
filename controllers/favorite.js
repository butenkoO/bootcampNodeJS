const Favorite = require('../models/favorite')
const User = require('../models/user')
const findAndSave = require('../helpers/addAndSave')


const favoritePage = async (req,res)=>{
    try{
        const user = await User.findById(req.session.user)
        .populate('items.bookId')
        .exec()
        const data = user.items
        res.render('favorite',{
            title:'Вподобане', 
            isFavorite: true,
            data
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось відобразити сторінку'
        })
    }
}

const addToFavorite = async (req,res)=>{
    try{
        const book = await findAndSave(req.body.isbn13)
        const user = await User.findById(req.session.user)
        const cart = [...user.items]
        const index = cart.findIndex(el=> el.bookId.toString() == book._id)
        if( index >= 0){
            res.redirect(req.headers.referer)
        }else{
            cart.push({
                bookId: book._id
            })
            user.items = cart
            await user.save()
            res.redirect('/favorite')  
        }
    }catch(err){
        console.log({
            err: true,
            message: 'Не вийшло добавити в улюблене'
        })
    }
}

const favoriteBookPage = async (req,res)=>{
    try{
        const result  = await Favorite.findOne({_id: req.params.id})
        .populate('comments.author', 'name')
        .exec()
        const comments = result.comments
        likeCount = result.likes.like.length
        dislikeCount = result.likes.dislike.length
        res.render('fav-book',{
            title: result.title,
            dislikeCount,
            likeCount,
            client: req.session.user.toString(),
            result,
            comments
        })
    }catch(err){
        console.log(err)
    }
}

const removeBookPage = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user)
        const cart = [...user.items]
        const index = cart.findIndex(el => el.bookId == req.body.id)
        cart.splice(index,1)
        user.items = cart
        await user.save()
        res.redirect('/favorite')  
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось видалити елемент'
        })
    } 
}

module.exports = {
    favoritePage: favoritePage,
    addToFavorite: addToFavorite,
    removeBookPage: removeBookPage,
    favoriteBookPage: favoriteBookPage  
}