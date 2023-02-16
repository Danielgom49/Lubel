const express = require('express'); // import express from 'express'
const morgan = require('morgan'); // import morgan from 'morgan'
const exphbs = require('express-handlebars'); // import exphbs from 'express-handlebars'
const path = require('path'); // import path from 'path';
const flash = require('connect-flash'); // import flash from 'connect-flash';
const session = require('express-session'); // import session from 'express-session';
const MySQLStore = require('express-mysql-session'); // import MySQLStore from 'express-mysql-session';
const passport = require('passport'); // import passport from 'passport';

const { database } = require('./keys');

// Initalizations
const app = express(); // devuelve un objeto
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000); // se define el puerto
app.set('views', path.join(__dirname, 'views')); // se establece la direccion de views
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'mysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash()); // funcionalidad de enviar mensajes
app.use(morgan('dev')); // mensaje en consola
app.use(express.urlencoded({ extended: false })); // aceptar datos de los formularios
app.use(express.json()); // enviar y recibir json
app.use(passport.initialize()); // se incia passport
app.use(passport.session());

// Global Variables
app.use((req, res, next) => { // toma la informacion del usuario, lo que el servidor quiere responder y funcion para continuar con el codigo
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/auth.js'));
app.use('/customers', require('./routes/customers.js'));
app.use('/rooms', require('./routes/rooms.js'));
// app.use('/configuration', require('./routes/configuration.js'));

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Starting the Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
}); // utiliza el puerto