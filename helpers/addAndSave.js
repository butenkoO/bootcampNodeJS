const Favorite = require('../models/favorite')
const Search = require('../models/search')

module.exports = async function(atribute){
    const result  = await Favorite.findOne({isbn13: atribute})
    let book = result
    if(!result){
        const data  = await Search.searchBook(atribute)
        const favorite = new Favorite(data) 
        await favorite.save()
        book = favorite
    }
    return book 
} 