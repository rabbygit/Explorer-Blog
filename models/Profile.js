// user,title,bio,profilePics , links :{fb,twitter..},posts,bookmarks

const { Schema, model } = require('mongoose')

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        trim: true,
        maxlength: 50,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500,
        required: true
    },
    profilePic: String,
    links: {
        website: String,
        facebook: String,
        twitter: String,
        github: String,
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, { timestamps: true })

const Profile = model("Profile", profileSchema)

module.exports = Profile