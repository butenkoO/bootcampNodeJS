const Search = require('../models/search')
const Favorite = require('../models/favorite')
const { validationResult } = require('express-validator');

const mainPage = (req,res)=>{
    res.render('main',{
        title:'Головна',
        isMain: true,
        searchError: req.flash('searchError')
    })
}

const mainSearch = async (req,res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('searchError', errors.array()[0].msg)
            return res.redirect('/') 
        }
        const find = req.query.search
        const page = req.query.page || '1'
        const search  = await Search.searchResult(find, page)
        if(search.books.length){
                   if(page<1){
           return res.redirect(`/search?search=${req.query.search}&page=1`)
        }
        if(page>Math.ceil(search.total/10)){
            return res.redirect(`/search?search=${req.query.search}&page=${Math.ceil(search.total/10)}`)
         } 
        }
        res.render('result',{
            title:'Результат пошуку',
            search: search.books,
            pageCount: Math.ceil(search.total/10),
            page,
            back: page-1,
            next: +page+1,
            ref: req.query.search
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
        let comments,client,result,
        likeCount = 0,
        dislikeCount= 0,
        done = false;
        if(book){
            likeCount = book.likes.like.length
            dislikeCount = book.likes.dislike.length
            comments = book.comments
            result = book
        }else{
            const data  = await Search.searchBook(req.params.id) 
            result = data
        }
        if(req.session.user){
            client = req.session.user.toString()
        }
        res.render('book',{
            title: result.title,
            likeCount,
            dislikeCount,
            result,
            done,
            client,
            comments,
            dataError: req.flash('dataError')
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