const Flash = require('../utils/Flash')

module.exports = () => {
    return (req, res, next) => {
        res.locals.flashMessage = Flash.getMessage(req)
        console.log(res.locals.flashMessage)
        next()
    }
}