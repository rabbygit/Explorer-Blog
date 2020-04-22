const Post = require('../models/Post')
const Flash = require('../utils/Flash')

exports.searchGetController = async (req, res, next) => {
    let term = req.query.term
    let currentPage = parseInt(req.query.page) || 1
    let itemPerPage = 2

    console.log(term)

    try {
        let posts = await Post.find({ $text: { $search: term } })
            .skip((itemPerPage * currentPage) - itemPerPage)
            .limit(itemPerPage)

        let totalPost = await Post.countDocuments({ $text: { $search: term } })
        let totalPage = totalPost / itemPerPage

        res.render('pages/explorer/search', {
            title: `Search result for ${term}`,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            totalPage,
            currentPage,
            itemPerPage,
            posts
        })
    } catch (e) {
        next(e)
    }
}