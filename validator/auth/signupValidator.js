const { body } = require('express-validator')

const User = require("../../models/User");

module.exports = [
    body('username')
        .isLength({ min: 3, max: 15 }).withMessage("User name must be between 3 to 15 characters.")
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject("User name is already used.")
            }
        })
        .trim(),
    body('email')
        .isEmail().withMessage("Please provide a valid email.")
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject("Email is already used.")
            }
        })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 5 }).withMessage("Password must be greater than 5 characters"),
    body('confirmpassword')
        .isLength({ min: 5 }).withMessage("Password must be greater than 5 characters")
        .custom((confirmpassword, { req }) => {
            if (confirmpassword !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true
        })
]