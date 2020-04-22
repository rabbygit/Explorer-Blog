const Profile = require('../../models/Profile')

exports.bookmarksGetController = async (req, res, next) => {
    let { postId } = req.params
    let userId = req.user._id
    let bookmark = null

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not allowed to Bookmark'
        })
    }

    try {
        let profile = await Profile.findOne({ user: userId })

        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                { user: userId },
                { $pull: { 'bookmarks': postId } }
            )
            bookmark = false
        } else {
            await Profile.findOneAndUpdate(
                { user: userId },
                { $push: { 'bookmarks': postId } }
            )
            bookmark = true
        }

        return res.status(200).json({
            bookmark
        })

    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}