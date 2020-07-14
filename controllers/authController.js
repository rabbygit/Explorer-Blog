const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')

const User = require('../models/User')
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash')

module.exports.signupGetController = (req, res) => {
    res.render('pages/auth/signup', {
        title: "Create An Account",
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.signupPostController = async (req, res, next) => {

    let { username, email, password, confirmpassword } = req.body;

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', "Please check your form carefully.")
        return res.render('pages/auth/signup',
            {
                title: "Invalid Inputs",
                error: errors.mapped(),
                value: {
                    username, email, password
                },
                flashMessage: Flash.getMessage(req)
            })
    }


    try {
        let hasedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            username,
            email,
            password: hasedPassword
        })

        await user.save();
        req.flash('success', 'User created successfully.')

        res.redirect('/auth/login')

    } catch (e) {
        next(e)
    }
}

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', {
        title: "Login to your Account",
        error: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.loginPostController = async (req, res, next) => {
    let { email, password } = req.body;

    let errors = validationResult(req).formatWith(errorFormatter)


    if (!errors.isEmpty()) {
        req.flash('fail', "Check Your form carefully")
        return res.render('pages/auth/login',
            {
                title: "Check Your form carefully",
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req)
            })
    }

    try {
        let user = await User.findOne({ email })
        if (!user) {
            req.flash('fail', "Invalid Credentials")

            return res.render('pages/auth/login',
                {
                    title: "Invalid Credentials",
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        let match = await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('fail', "Invalid Credentials")

            return res.render('pages/auth/login',
                {
                    title: "Invalid Credentials",
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        req.session.isLoggedIn = true
        req.session.user = user

        req.session.save(err => {
            if (err) {
                return next(err)
            }

            req.flash('success', "Successfully Logged in.")

            res.redirect('/dashboard')
        })

    } catch (error) {
        next(error)
    }
}

exports.logoutController = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err)
        }

        return res.redirect('/auth/login')
    })
}

exports.changePasswordGetController = (req, res, next) => {
    res.render('pages/auth/changePassword', {
        title: 'Change Password',
        flashMessage: Flash.getMessage(req)
    })
}

exports.changePasswordPostController = async (req, res, next) => {
    let { oldPassword, newPassword, confirmpassword } = req.body

    if (newPassword != confirmpassword) {
        req.flash("fail", 'Password does not match')
        return res.redirect('/auth/changePassword')
    }

    try {
        let match = await bcrypt.compare(oldPassword, req.user.password)

        if (!match) {
            req.flash("fail", 'Invalid old password')
            return res.redirect('/auth/changePassword')
        }

        let hashPassword = await bcrypt.hash(newPassword, 11)
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { password: hashPassword } }
        )

        req.flash("success", 'Password updated Successfully')
        return res.redirect('/auth/changePassword')
    } catch (e) {
        next(e)
    }
}
