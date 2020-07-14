require('dotenv').config()
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose')
const config = require('config');
var path = require('path')


const setMiddlewares = require('./middleware/middlewares')
const setRoute = require('./routes/routes')

// playground
const validatorRoute = require('./play/validator')

const app = express()

// Disabling console.log while application in production

var DEBUG_MODE = app.get("env") == "production" ? false : true; // Set this value to false for production

if (typeof (console) === 'undefined') {
    console = {}
}

if (!DEBUG_MODE || typeof (console.log) === 'undefined') {
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function () { };
}

// Set up View engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Using  Middlewares from Middleware directory
setMiddlewares(app)
app.use(express.static(path.join(__dirname, 'public')));

// Using Routes fromm routes directory.
app.use('/validator', validatorRoute)
setRoute(app)

app.use((req, res, next) => {
    let error = new Error('404 page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status == 404) {
        return res.render('pages/error/404', { flashMessage: {} })
    }
    console.log(chalk.red.inverse(error.message))
    res.render('pages/error/500', { flashMessage: {} })
})

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.MONGODB_URI || config.get('mogodb-uri')

mongoose.
    connect(DB_URL,
        { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, autoIndex: false })
    .then(() => {
        console.log(chalk.green(`Database connected`))

        app.listen(PORT, () => {
            console.log(chalk.green.inverse(`Server is listening on ${PORT}`))
        })
    }).catch(e => {
        return console.log(e.message)
    })







// const testConsole = require('debug')('app:test')
// const dbConsole = require('debug')('db:test')

// testConsole('This is test')
// dbConsole('This is db')



// if (app.get('env') == 'development') {
//     console.log(config.dev.name)
// } else {
//     console.log(config.dev.name)
// }

