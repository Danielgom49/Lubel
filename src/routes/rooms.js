const express = require('express');
const router = express.Router(); // metodo que devuelve objeto

const pool = require('../database'); // hace referencia a la conexión a la BD
const { isLoggedIn } = require('../lib/authentication'); // protección de rutas

// Encargado de mostrar el formulario
router.get('/add', isLoggedIn, (req, res) => {
    res.render('rooms/add');
})

// Encargado de guardar datos de los cuartos en BD
router.post('/add', isLoggedIn, async (req, res) => {
    const { number_room, price, type_room, cant_beds } = req.body;
    const newRooms = {
        number_room, 
        price, 
        type_room,
        cant_beds
    };
    await pool.query('INSERT INTO rooms set ?', [newRooms]);
    req.flash('success', 'Cuarto guardado correctamente');
    res.redirect("/rooms");
})

// Encargado de mostrar listado de cuartos
router.get('/', isLoggedIn, async (req, res) => { // ruta para renderizar el form
    const rooms = await pool.query('SELECT * FROM rooms WHERE state = 1');
    res.render('rooms/list', { rooms });
})

// Encargado de mostrar datos del cuarto en el form
router.post('/search', isLoggedIn, async (req, res) => {
    const { search, active, type_room } = req.body;
    if (search.length == 0 && active == 0 && type_room == 0) {
        res.redirect('/rooms');
    }else{
        let sql = "";
        if(search != "" && active != 0 && type_room != 0){
            sql = "SELECT * FROM rooms WHERE state = 1 AND active LIKE '"+ active +"' AND type_room LIKE '"+ type_room +"' AND number_room LIKE '%"+ search +"%'";
        }
        else{
            if(search != "" && active != 0){
                sql = "SELECT * FROM rooms WHERE state = 1 AND active LIKE '"+ active +"' AND number_room LIKE '%"+ search +"%'";
            }
            else{
                if(search != "" && type_room != 0){
                    sql = "SELECT * FROM rooms WHERE state = 1 AND type_room LIKE '"+ type_room +"' AND number_room LIKE '%"+ search +"%'";
                }else{
                    if(active != 0 && type_room != 0){
                        sql = "SELECT * FROM rooms WHERE state = 1 AND active LIKE '"+ active +"' AND type_room LIKE '"+ type_room +"'";
                    }else{
                        if (search != "") {
                            sql = "SELECT * FROM rooms WHERE state = 1 AND number_room LIKE '%"+ search +"%'";
                        }else{
                            if (active != 0) {
                                sql = "SELECT * FROM rooms WHERE state = 1 AND active LIKE '"+ active +"'";
                            }else{
                                sql = "SELECT * FROM rooms WHERE state = 1 AND type_room LIKE '"+ type_room +"'";
                            }
                        }
                    }
                }
            }
        }
        const rooms = await pool.query(sql);
        res.render('rooms/list', { rooms });
    }
})

// Encargado de eliminar el cuarto en BD
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    // await pool.query('UPDATE customers set rooms_id = ? WHERE rooms_id = ?', [null, id]);
    await pool.query('UPDATE rooms set state = 2 WHERE id = ?', [id]);
    req.flash('success', 'Cuarto eliminado correctamente');
    res.redirect("/rooms");
})

// Encargado de mostrar datos del cuarto en el form
router.get('/update/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const rooms = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    res.render('rooms/update', { rooms: rooms[0] });
})

router.post('/update/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { number_room, price, type_room, cant_beds } = req.body;
    const newRooms = {
        number_room, 
        price, 
        type_room,
        cant_beds
    };
    await pool.query('UPDATE rooms set ? WHERE id = ?', [newRooms, id]);
    req.flash('success', 'Cuarto modificado correctamente');
    res.redirect("/rooms");
})

module.exports = router;