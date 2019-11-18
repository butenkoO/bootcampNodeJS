const User = require('../../models/user')

const readLaterPage = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user)
        const data = user.readLater
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

const readLaterAdd =async(req,res)=>{
    const user = await User.findById(req.session.user)
    const tasks = [...user.readLater]
    const index = tasks.findIndex(el=> el.isbn13.toString() == req.body.isbn13)
    if( index >= 0){
        res.status(403).json({
            message: 'Книжка вже в списку'
        })
    }else{
        tasks.push({
            bookName: req.body.bookName,
            isbn13: req.body.isbn13,
        })
        user.readLater = tasks
        await user.save()
        res.status(200).json({
            message: 'Книжка успішно додана до списку'
        }) 
    }

}

const readLaterRemove = async (req,res)=>{
    try{
        const user = await User.findById(req.session.user)
        const tasks = [...user.readLater]
        const index = tasks.findIndex(el => el._id.toString() == req.body.id)
        tasks.splice(index,1)
        user.readLater = tasks
        await user.save()
        res.status(200).json({
            message: 'Книжка успішно видалена з списку'
        }) 
    }catch(err){
        res.json({
            err: true,
            message: 'Не вдалось видалити елемент'
        })
    }  
}


module.exports = {
    readLaterPage,
    readLaterAdd,
    readLaterRemove
}