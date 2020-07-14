const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const config = require('config');


const { bindUserRequest } = require('./authMiddleware')
const setLocals = require('./setLocals');


const store = new MongoDBStore({
    uri: process.env.SECRET || config.get('mogodb-uri'),
    collection: 'sessions'
});


const middlewares = [
    morgan('dev'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: config.get('secret'),
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 60 * 60 * 1000 * 2 // 2 hours
        }
    }),
    flash(),
    bindUserRequest(),
    setLocals(),
]

module.exports = app => {
    middlewares.forEach(middleware => {
        app.use(middleware)
    })
}