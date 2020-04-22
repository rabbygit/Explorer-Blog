const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');


router.get('/', (req, res, next) => {
    res.render('playground/signup', { title: 'new playground', flashMessage: {} })
})


router.post('/', upload.single('file'), (req, res, next) => {
    if (req.file) {
    }

    res.redirect('/validator')
})

module.exports = router;