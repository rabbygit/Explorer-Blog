const Flash = require('../utils/Flash')
const User = require('../models/User')

exports.authorProfileGetController = async (req, res, next) => {
    let userId = req.params.userId

    try {
        let author = await User.findOne({ _id: userId })
            .populate({
                path: 'profile',
                populate: {
                    path: 'posts'
                }
            })

        if (!author) {
            req.flash('fail', "Auhtor not found")
            return res.render('pages/explorer/author', {
                title: "Auhtor page",
                flashMessage: Flash.getMessage(req),
                author: {}
            })
        }

        return res.render('pages/explorer/author', {
            title: "Auhtor page",
            flashMessage: Flash.getMessage(req),
            author
        })
    } catch (e) {
        next(e)
    }
}