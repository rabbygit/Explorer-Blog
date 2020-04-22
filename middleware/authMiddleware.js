const User = require('../models/User')

module.exports.bindUserRequest = () => {
    return async (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return next()
        }

        try {
            let user = await User.findById(req.session.user._id);
            req.user = user;
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/auth/login')
    }

    next()
}

exports.isUnauthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/dashboard')
    }
    next()
}