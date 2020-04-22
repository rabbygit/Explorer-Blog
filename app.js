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

mongoose.
    connect(config.get('mogodb-uri'),
        { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, autoIndex: false })
    .then(() => {
        console.log(chalk.green(`Database connected`))

        app.listen(PORT, () => {
            console.log(chalk.green.inverse(`Server is listening on ${PORT}`))
        })
    }).catch(e => {
        return console.log(e)
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

