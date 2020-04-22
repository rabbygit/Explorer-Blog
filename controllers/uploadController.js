const fs = require('fs')

const User = require('../models/User')
const Profile = require('../models/Profile')

exports.uploadProfilePics = async (req, res, next) => {
    if (req.file) {
        try {
            let profile = await Profile.findOne({ user: req.user._id });
            let profilePics = `/uploads/${req.file.filename}`;


            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics } })
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics } })

            res.status(200).json({
                profilePics
            })

        } catch (error) {
            res.status(500).json({
                profilePics: req.user.profilePics
            })
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics
        })
    }
}

exports.removeProfilePics = (req, res, next) => {
    try {
        let defaultProfilePics = `/uploads/default.png`;
        let currentProfilePics = req.user.profilePics;

        console.log(currentProfilePics)

        fs.unlink(`public${currentProfilePics}`, async (err) => {
            let profile = await Profile.findOne({ user: req.user._id });
            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics: defaultProfilePics } })
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics: defaultProfilePics } }
            )

            if (currentProfilePics !== 'uploads/default.png') {
                fs.unlink(`public${currentProfilePics}`, err => {
                    if (err) console.log(err)
                })
            }

            res.status(200).json({
                profilePics: defaultProfilePics
            })

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Can't remove profile pic"
        })
    }
}

exports.postImageUploadController = (req, res, next) => {
    if (req.file) {
        return res.status(200).json({
            imageUrl: `/uploads/${req.file.filename}`
        })
    }

    return res.status(500).json({
        message: 'Server error'
    })
}