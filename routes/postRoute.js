const router = require('express').Router()

const postValidator = require('../validator/dashboard/postValidator')
const { isAuthenticated } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    postGetController
} = require('../controllers/postController')

router.get('/create-post', isAuthenticated, createPostGetController)
router.post('/create-post', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController)

router.get('/edit-post/:id', isAuthenticated, editPostGetController)
router.post('/edit-post/:id', isAuthenticated, upload.single('post-thumbnail'), postValidator, editPostPostController)

router.get('/delete-post/:id', isAuthenticated, deletePostGetController)

router.get('/posts', isAuthenticated, postGetController)

module.exports = router