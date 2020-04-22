const { body } = require('express-validator')

module.exports = [
    body('email')
        .not().isEmpty().withMessage("Please provide a valid email."),
    body('password')
        .not().isEmpty().withMessage("Password can not be empty"),
]