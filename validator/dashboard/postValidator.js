const { body } = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Post Title can not be empty.')
        .isLength({ max: 100 }).withMessage("Title must be less than 100 characters.")
        .trim(),
    body('body')
        .not().isEmpty().withMessage('Post body can not be empty.')
        .custom(value => {
            const node = cheerio.load(value)
            let text = node.text()

            if (text.length > 5000) {
                throw new Error('Post body must be less than 5000 characters.')
            }

            return true
        })
]