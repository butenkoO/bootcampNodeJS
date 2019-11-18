const Search = require('../../models/search')
const Favorite = require('../../models/favorite')


const mainSearch = async (req,res)=>{
    try{
        const find = req.query.search
        const page = req.query.page || '1'
        const search  = await Search.searchResult(find, page)
        if(page<1 || page>Math.ceil(search.total/10) || !search.books.length){
           return res.status(404).json({
                message: 'Даної сторінки не існує'
           })
        }
        res.status(200).json({
            search
        })
    }catch(err){
        res.json({
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
        if(book){
            result = book
        }else{
            const data  = await Search.searchBook(req.params.id) 
            result = data
        }
        if(result){
                  res.status(200).json({
            result
        })  
        }else{
            res.status(404).json({
                message: 'Даної сторінки не існує'
           })
        }
    }catch(err){
        res.json({
            err: true,
            message: 'Не вдалось відобразити сторінку'
        })
    }
}

module.exports = {
    mainSearch,
    searchBook
}