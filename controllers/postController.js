const readingTime = require('reading-time');

const Flash = require('../utils/Flash')
const errorFormatter = require('../utils/validationErrorFormatter');
const { validationResult } = require('express-validator')

const Post = require('../models/Post')
const Profile = require('../models/Profile')


exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/create-post', {
        title: 'Create Your Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

    console.log(errors.mapped())

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/post/create-post', {
            title: 'Create Your Post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags
            }
        })
    }

    if (tags) {
        tags = tags.split(/[ ,]+/).filter(Boolean)
    }

    let readTime = readingTime(body).text;

    let newPost = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        readTime,
        thumbnail: '',
        likes: [],
        dislikes: [],
        comments: []
    })

    if (req.file) {
        newPost.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        let createdPost = await newPost.save();
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPost._id } }
        )

        req.flash('success', 'Post created successfully.')
        return res.redirect(`/post/edit-post/${createdPost._id}`)
    } catch (error) {
        next(error)
    }
}


exports.editPostGetController = async (req, res, next) => {

    let postId = req.params.id;

    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if (!post) {
            let error = new Error('404 post not Found')
            error.status = 404;
            throw error
        }

        res.render('pages/dashboard/post/edit-post', {
            title: 'Edit Your Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            post
        })

    } catch (e) {
        next(e)
    }

}

exports.editPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    let errors = validationResult(req).formatWith(errorFormatter)
    let postId = req.params.id

    try {

        if (!errors.isEmpty()) {
            return res.render('pages/dashboard/post/edit-post', {
                title: 'Edit Your Post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
            })
        }

        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if (!post) {
            let error = new Error('404 post not Found')
            error.status = 404;
            throw error
        }

        if (tags) {
            tags = tags.split(/[ ,]+/).filter(Boolean)
        }

        let thumbnail = post.thumbnail
        if (req.file) {
            thumbnail = `/uploads/${req.file.filename}`
        }

        await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: { title, body, tags, thumbnail } },
            { new: true }
        )

        req.flash("success", 'Updated Successfully')
        res.redirect('/post/edit-post/' + post._id)
    } catch (e) {
        next(e)
    }

}



exports.deletePostGetController = async (req, res, next) => {
    let postId = req.params.id
    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if (!post) {
            let error = new Error("404 post not found")
            error.status = 404;
            throw error
        }

        await Post.findOneAndDelete({ _id: postId })
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { 'posts': postId } }
        )

        req.flash('success', "Post deleted successfully")
        res.redirect('/posts')
    } catch (e) {
        next(e)
    }
}

exports.postGetController = async (req, res, next) => {
    try {
        let posts = await Post.find({ author: req.user._id })
        res.render('pages/dashboard/post/posts', {
            title: 'My All Posts',
            flashMessage: Flash.getMessage(req),
            posts
        })
    } catch (e) {
        next(e)
    }
}