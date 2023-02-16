const express = require('express');
const router = express.Router(); // metodo que devuelve objeto

const passport = require('passport'); // se trae el modulo definido
const { isLoggedIn, isNotLoggedIn } = require('../lib/authentication'); // protección de rutas

router.get('/signup', isNotLoggedIn, (req, res) => { // ruta para renderizar el form
    res.render('auth/auth');
})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/customers', // lugar donde redirecciona si falla
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/customers', // lugar donde redirecciona si falla
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(function(err) {  // do this
        if (err) { return next(err); }// do this
        res.redirect('signin/');
      });
});

module.exports = router;