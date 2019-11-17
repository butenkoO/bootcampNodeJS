const User = require('../models/user')
const uploadToS3 = require('../helpers/uploadToS3')


const myBookPage =async (req,res)=>{
    try{
        const user = await User.findById(req.session.user)
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
        const filePath = await uploadToS3(req)
        const user = await User.findById(req.session.user)
        const book = [...user.myBook]
        book.push({
            title:req.body.title,
            image:filePath,
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
        const user = await User.findById(req.session.user)
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
    const filePath = await uploadToS3(req)
    const user = await User.findById(req.session.user)
    const book = [...user.myBook]
    const index = book.findIndex(el => el._id == req.body.id)
    book.splice(index,1)
    book.push({
        title:req.body.title,
        image:filePath,
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
        const user = await User.findById(req.session.user)
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