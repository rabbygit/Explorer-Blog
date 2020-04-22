const router = require('express').Router()

const { isAuthenticated } = require('../../middleware/authMiddleware')


const {
    commentPostController,
    replyCommentPostController
} = require('../controllers/commentsController')

const {
    likeGetController,
    dislikeGetController
} = require('../controllers/likeDislikeController')

const {
    bookmarksGetController
} = require('../controllers/bookmarksController')


router.post('/comments/:postId', isAuthenticated, commentPostController)

router.post('/comments/replies/:commentId', isAuthenticated, replyCommentPostController)


router.get('/likes/:postId', isAuthenticated, likeGetController)

router.get('/dislikes/:postId', isAuthenticated, dislikeGetController)


router.get('/bookmarks/:postId', bookmarksGetController)


module.exports = router