const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');
const uploadRoute = require('./uploadRoute')
const postRoute = require('./postRoute')
const apiRoute = require('../api/routes/apiRoute')
const explorerRoute = require('./explorerRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')

const routes = [
    {
        path: '/api',
        handler: apiRoute
    },
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoute
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/post',
        handler: postRoute
    },
    {
        path: '/explorer',
        handler: explorerRoute
    },
    {
        path: '/author',
        handler: authorRoute
    },
    {
        path: '/search',
        handler: searchRoute
    },
    {
        path: '/',
        handler: (req, res) => {
            res.redirect('/explorer')
        }
    }
]


module.exports = app => {
    routes.forEach(route => {
        if (route.path == '/') {
            app.get(route.path, route.handler) // Root route
        } else {
            app.use(route.path, route.handler)
        }
    })
}