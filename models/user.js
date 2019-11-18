const {Schema, model } = require('mongoose')

const user = new Schema({
temporaryAddress: String,
email: String,
password : {
    type: String,
    required: true
},
name : {
    type: String,
    required: true
},
registerToken: String,
registerTokenExp: Date,
resetToken: String,
resetTokenExp: Date,
items :[
        {
            bookId :{
                type: Schema.Types.ObjectId,
                ref: 'Favorite',
                required: true
            }
        }
    ],
readLater: [
    {
        bookName:{
            type: String,
            required: true
        },
        isbn13: {
            type: String,
            required: true
        }
    }
],
myBook: [
    {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        authors: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        desc: String
    }
]

})

module.exports = model('User', user)
