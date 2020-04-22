const router = require('express').Router()

const {
    explorerGetController,
    singlePostController
} = require('../controllers/explorerController')


router.get('/', explorerGetController)

router.get('/:postId', singlePostController)


module.exports = router