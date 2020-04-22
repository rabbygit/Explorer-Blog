const { body } = require('express-validator')
const validator = require('validator')

const urlValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error("Provide a valid url")
        }
    }

    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name can not be empty.')
        .isLength({ max: 50 }).withMessage("Name must be less than 50 characters.")
        .trim(),
    body('title')
        .not().isEmpty().withMessage('Title can not be empty.')
        .isLength({ max: 100 }).withMessage("Title must be less than 100 characters.")
        .trim(),
    body('bio')
        .not().isEmpty().withMessage('Bio can not be empty.')
        .isLength({ max: 500 }).withMessage("Bio must be greater than 5 characters")
        .trim(),
    body('website')
        .custom(urlValidator),
    body('facebook')
        .custom(urlValidator),
    body('twitter')
        .custom(urlValidator),
    body('github')
        .custom(urlValidator),

]