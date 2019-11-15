const Favorite = require('../models/favorite')
const User = require('../models/user')
const Search = require('../models/search')

const favoritePage = async (req,res)=>{
    try{
        const user = await User.findById(req.session.user._id)
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
        const result  = await Favorite.findOne({isbn13: req.body.isbn13})
        let book = result
        if(!result){
            const data  = await Search.searchBook(req.body.isbn13)
            const favorite = new Favorite(data) 
            await favorite.save()
            book = favorite  
        }
        const user = await User.findById(req.session.user._id)
        const cart = [...user.items]
        const index = cart.findIndex(el=> el.bookId.toString() == book._id)
        if( index >= 0){
            res.redirect('/favorite')
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
        res.render('fav-book',{
            title: result.title,
            result,
            comments
        })
    }catch(err){
        console.log(err)
    }
}

const removeBookPage = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user._id)
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