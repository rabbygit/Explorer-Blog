const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

exports.commentPostController = async (req, res, next) => {
    let { postId } = req.params
    let { body } = req.body

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not allowed to comment'
        })
    }

    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try {
        let createdComment = await comment.save();
        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { 'comments': createdComment._id } }
        )

        let commentJson = await Comment.findById(createdComment._id)
            .populate('user', 'profilePics')

        return res.status(201).json(commentJson)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}


exports.replyCommentPostController = async (req, res, next) => {
    let { commentId } = req.params
    let { body } = req.body;

    console.log(commentId, body)

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not allowed to comment'
        })
    }

    let reply = {
        body,
        user: req.user._id
    }

    try {
        await Comment.findOneAndUpdate(
            { _id: commentId },
            { $push: { 'replies': reply } }
        )

        res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}