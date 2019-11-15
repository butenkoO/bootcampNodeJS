const Search = require('../models/search')
const Favorite = require('../models/favorite')

const mainPage = (req,res)=>{
    res.render('main',{title:'Головна', isMain: true})
}

const mainSearch = async (req,res)=>{
    try{
        const find = req.query.search
        const page = req.query.page || '1'
        const search  = await Search.searchResult(find, page)
        res.render('result',{
            title:'Результат пошуку',
            search: search.books,
            page: Math.ceil(search.total/10)
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось відобразити сторінку'
        })
    }
}

const searchBook = async (req,res)=>{
    try{
        const book  = await Favorite.findOne({isbn13: req.params.id})
        .populate('comments.author', 'name')
        .exec()
        let comments,client,result;
        if(book){
            comments = book.comments
            result = book
        }else{
            const data  = await Search.searchBook(req.params.id) 
            result = data
        }
        if(req.session.user){
            client = req.session.user._id
        } 
        res.render('book',{
            title: result.title,
            result,
            client,
            dataError: req.flash('dataError'),
            comments
        })
    }catch(err){
        console.log({
            err: true,
            message: 'Не вдалось відобразити сторінку'
        })
    }
}

module.exports = {
    mainPage: mainPage,
    mainSearch: mainSearch,
    searchBook: searchBook
}