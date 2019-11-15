const axios = require('axios')

class Search{

    static searchResult(el, page){
        return axios.get(`https://api.itbook.store/1.0/search/${el}/${page}`).then(res=>res.data)
    } 
    static searchBook(book){
        return axios.get(`https://api.itbook.store/1.0/books/${book}`).then(res=>res.data)
    } 
}

module.exports = Search