const express = require('express');
const router = express.Router(); // metodo que devuelvo objeto

router.get('/', function (req, res) {
    res.redirect('/signin');
})

module.exports = router;