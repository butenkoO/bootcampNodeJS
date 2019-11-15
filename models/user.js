const {Schema, model } = require('mongoose')

const user = new Schema({
email:{
    type: String,
    required: true
},
password : {
    type: String,
    required: true
},
name : {
    type: String,
    required: true
},
items :[
        {
            bookId :{
                type: Schema.Types.ObjectId,
                ref: 'Favorite',
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
        desc: {
            type: String,
        }
    }
]

})

module.exports = model('User', user)
