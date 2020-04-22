const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter');

const Flash = require('../utils/Flash')

const Profile = require('../models/Profile');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.dashboardGetController = async (req, res, next) => {

    try {
        let profile = await Profile.findOne({ user: req.user._id })
            .populate({
                path: 'posts',
                select: 'title thumbnail'
            })
            .populate({
                path: 'bookmarks',
                select: 'title thumbnail'
            })

        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: "My Dashboard",
                flashMessage: Flash.getMessage(req),
                posts: profile.posts.reverse().slice(0, 3),
                bookmarks: profile.bookmarks.reverse().slice(0, 3)
            })
        }

        res.redirect('/dashboard/create-profile')

    } catch (error) {
        next(error.message)
    }
}

exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })

        if (profile) {
            return res.redirect('/dashboard/edit-profile')
        }

        res.render('pages/dashboard/create-profile',
            {
                title: 'Create Profile',
                flashMessage: Flash.getMessage(req),
                error: {}
            })

    } catch (error) {
        next(error.message)
    }
}

exports.createProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile',
            {
                title: 'Create Profile',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped()
            })
    }

    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    try {
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePic: req.user.profilePic,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || '',
            },
            posts: [],
            bookmarks: []
        })

        let createdProfile = await profile.save();

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createdProfile._id } }
        )

        req.flash('success', 'Profile created successfully');
        res.redirect('/dashboard')

    } catch (error) {
        next(error)
    }

    res.render('pages/dashboard/create-profile',
        {
            title: 'Create Profile',
            flashMessage: Flash.getMessage(req),
            error: {}
        })
}

exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (!profile) {
            return res.redirect('/dashboard/create-profile')
        }

        res.render('pages/dashboard/edit-profile', {
            title: "Edit Your Profile",
            flashMessage: Flash.getMessage(req),
            error: {},
            profile
        })
    } catch (error) {
        next(error)
    }
}

exports.editProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter)
    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/edit-profile',
            {
                title: 'Create Profile',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                profile: {
                    name,
                    title,
                    bio,
                    links: {
                        website,
                        facebook,
                        twitter,
                        github
                    }
                }
            })
    }

    try {
        let profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || '',
            }
        }

        let updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: profile
            },
            { new: true }
        )
        req.flash('success', 'Profile updated successfully')
        res.render('pages/dashboard/edit-profile', {
            title: "Edit Your Profile",
            flashMessage: Flash.getMessage(req),
            error: {},
            profile: updatedProfile
        })

    } catch (error) {
        next(error)
    }
}


exports.bookmarksGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
            .populate({
                path: 'bookmarks',
                model: 'Post',
                select: 'title thumbnail'
            })

        res.render('pages/dashboard/bookmarks', {
            title: "Edit Your Profile",
            flashMessage: Flash.getMessage(req),
            error: {},
            posts: profile.bookmarks
        })
    } catch (e) {
        next(e)
    }
}


exports.commentsGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        let comments = await Comment.find({ post: { $in: profile.posts } })
            .populate({
                path: 'post',
                select: 'title'
            })
            .populate({
                path: 'user',
                select: "username profilePics"
            })
            .populate({
                path: 'replies.user',
                select: 'username profilePics'
            })

        res.render('pages/dashboard/comments', {
            title: "My recent comments",
            flashMessage: Flash.getMessage(req),
            comments,
            error: {}
        })
    } catch (e) {
        next(e)
    }
}