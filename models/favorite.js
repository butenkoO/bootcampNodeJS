const {Schema, model} = require('mongoose')

const favorite = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    authors: {
        type: String,
    },
    language: {
        type: String,
    },
    pages: {
        type: String,
    },
    year: {
        type: String,
    },
    desc: {
        type: String,
        required: true
    },
    isbn13: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    comments:[
        {
            commentMain:{
                type: String,
            },
            time: {
                type: String,
                required: true
            },
            data: {
                type: String,
            },
            image: {
                type: String,
            },
            audio: {
                type: String,
            },
            video: {
                type: String,
            },
            author: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }

    ],
    likes: {
        like: [
            {
            author: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
                } 
            }
        ],
        dislike:[
            {
            author: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
                } 
            }
        ]
    }
})

module.exports = model('Favorite', favorite)