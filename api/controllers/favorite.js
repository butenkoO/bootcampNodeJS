const User = require('../../models/user')
const findAndSave = require('../../helpers/addAndSave')


const favoritePage = async (req,res)=>{
    try{
        const user = await User.findById(req.session.user)
        .populate('items.bookId')
        .exec()
        const data = user.items
        res.status(200).json({
            data
        })
    }catch(err){
        res.json({
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
            res.status(403).json({
                message: 'Товар вже додано'
            })
        }else{
            cart.push({
                bookId: book._id
            })
            user.items = cart
            await user.save()
            res.status(200).json({
                message: 'Книгу додано до улюбленого'
            }) 
        }
    }catch(err){
        res.json({
            err: true,
            message: 'Не вийшло добавити в улюблене'
        })
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
        res.status(200).json({
            message: 'Книгу видалено з улюбленого'
        })  
    }catch(err){
        res.json({
            err: true,
            message: 'Не вдалось видалити елемент'
        })
    } 
}

module.exports = {
    favoritePage,
    addToFavorite,
    removeBookPage
}