// title , body , author , tags , thumbnail , readTime , likes , dislikes , comments

const { Schema, model } = require('mongoose')

let postSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    body: {
        type: String,
        required: true,
        maxlength: 5000
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    thumbnail: String,
    readTime: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true })

postSchema.index({ title: 'text', body: 'text', tags: 'text' })

const Post = model("Post", postSchema)

Post.createIndexes()

module.exports = Post;