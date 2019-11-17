const User = require('../models/user')

const readLaterPage = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user)
        const data = user.readLater
        res.render('readLater',{
            title:'Прочитати пізніше', 
            isreadLater: true,
            data
        })
    }catch(err){
        console.log({
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
        res.redirect('/favorite')
    }else{
        tasks.push({
            bookName: req.body.bookName,
            isbn13: req.body.isbn13,
            done: false
        })
        user.readLater = tasks
        await user.save()
        res.redirect(req.headers.referer)  
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
        res.redirect('/readlater')  
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось видалити елемент'
        })
    }  
}

const readLaterCheck = async (req,res)=>{
    const user = await User.findById(req.session.user)
    const tasks = [...user.readLater]
    const index = tasks.findIndex(el => el._id.toString() == req.body.task)
    if( index >= 0){
        tasks[index].done = !tasks[index].done
        await user.save()
        res.redirect('/readlater') 
    }else{
        res.redirect('/readlater')
    } 
}

module.exports = {
    readLaterPage,
    readLaterAdd,
    readLaterCheck,
    readLaterRemove
}