const express = require('express');
const router = express.Router(); // metodo que devuelve objeto

const pool = require('../database'); // hace referencia a la conexión a la BD
const { isLoggedIn } = require('../lib/authentication'); // protección de rutas


//Encargado de mostrar la vista de configuracion
router.get('/', isLoggedIn, async (req, res) => {
    res.render('configuration/configuration');
})

module.exports = router;