const Post = require('../../models/Post')

exports.likeGetController = async (req, res, next) => {
    let { postId } = req.params
    let userId = req.user._id
    let liked = null

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not allowed to comment'
        })
    }

    try {
        let post = await Post.findById(postId)

        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislikes': userId } }
            )
        }

        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } }
            )
            liked = false
        } else {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { 'likes': userId } }
            )
            liked = true
        }

        let updtaedPost = await Post.findById(postId)

        return res.status(200).json({
            liked,
            totalLikes: updtaedPost.likes.length,
            totaldislikes: updtaedPost.dislikes.length
        })
    } catch (e) {
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

exports.dislikeGetController = async (req, res, next) => {
    let { postId } = req.params
    let userId = req.user._id
    let disliked = null

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not allowed to comment'
        })
    }

    try {
        let post = await Post.findById(postId)

        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } }
            )
        }

        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislikes': userId } }
            )
            disliked = false
        } else {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { 'dislikes': userId } }
            )
            disliked = true
        }

        let updtaedPost = await Post.findById(postId)

        return res.status(200).json({
            disliked,
            totalLike: updtaedPost.likes.length,
            totaldislikes: updtaedPost.dislikes.length
        })

    } catch (e) {
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}