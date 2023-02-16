const express = require('express');
const router = express.Router(); // metodo que devuelve objeto

const pool = require('../database'); // hace referencia a la conexión a la BD
const { isLoggedIn } = require('../lib/authentication'); // protección de rutas

// Encargado de mostrar el formulario
router.get('/add', isLoggedIn, async (req, res) => {
    const rooms = await pool.query('SELECT * FROM rooms WHERE (state = 1) AND active = "Disponible"'); // consulta para traer los cuartos en el formulario
    res.render('customers/add', { rooms });
})

// Encargado de guardar datos de clientes en BD
router.post('/add', isLoggedIn, async (req, res) => {
    const { username, document, phone, nationality, cant_person, cant_day, rooms_id, created_at, price_customer } = req.body;
    const newCustomers = {
        username,
        document,
        phone,
        nationality,
        cant_person,
        cant_day,
        rooms_id,
        created_at,
        price_customer
    };
    await pool.query('INSERT INTO customers set ?', [newCustomers]);
    await pool.query('UPDATE rooms set active = "Ocupado" WHERE id = ?', [rooms_id]);
    req.flash('success', 'Cliente guardado correctamente');
    res.redirect("/customers");
})

// Encargado de mostrar listado de clientes
router.get('/', isLoggedIn, async (req, res) => {
    const customers = await pool.query('SELECT * FROM customers WHERE state = 1');
    let idRoom = await pool.query('SELECT number_room, price, type_room FROM rooms r, customers c WHERE (r.state = 1) AND (c.rooms_id = r.id) ')
    res.render('customers/list', { customers, idRoom });
})

// Encargado de mostrar datos del cliente en el form
router.post('/search', isLoggedIn, async (req, res) => {
    const { search } = req.body;
    if (search.length != 0) {
        const sql = "SELECT * FROM customers WHERE (state = 1) AND (document LIKE '" + search + "' OR username LIKE '%"+ search +"%') "; 
        const customers = await pool.query(sql);
        res.render('customers/list', { customers });
    }else{
        res.redirect('/customers');
    }
})

// Encargado de eliminar el cliente en BD
router.get('/delete/:id/:room', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { room } = req.params;
    await pool.query('UPDATE customers set state = 2 WHERE id = ?', [id]);
    await pool.query('UPDATE rooms set active = "Disponible" WHERE id = ?', [room]);
    await pool.query('UPDATE customers set rooms_id = ? WHERE rooms_id = ?', [null, room]);
    req.flash('success', 'Cliente eliminado correctamente');
    res.redirect("/customers");
})

// Encargado de mostrar datos del cliente en el form
router.get('/update/:id/:room', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { room } = req.params;
    const customers = await pool.query('SELECT * FROM customers WHERE (state = 1) AND id = ?', [id]);
    const rooms = await pool.query('SELECT * FROM rooms r, customers c  WHERE (r.state = 1) AND r.id = ?', [room]); // consulta para traer el cuarto seleccionado
    const roomsActive = await pool.query('SELECT * FROM rooms r  WHERE (r.state = 1) AND r.active = "Disponible"'); // consulta para traer los cuartos en el formulario del update
    res.render('customers/update', { customer: customers[0], rooms: rooms[0], roomsActive });
})

// Encargado de actualizar datos del cliente en BD

router.post('/update/:id/:room', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { room } = req.params;
    const { username, document, phone, nationality, cant_person, cant_day, rooms_id, created_at, price_customer } = req.body;
    const newCustomers = {
        username,
        document,
        phone,
        nationality,
        cant_person,
        cant_day,
        rooms_id,
        created_at, 
        price_customer
    };
    await pool.query('UPDATE customers set ? WHERE id = ?', [newCustomers, id]);
    await pool.query('UPDATE rooms set active = "Ocupado" WHERE id = ?', [rooms_id]);
    await pool.query('UPDATE rooms set active = "Disponible" WHERE id = ?', [room]);
    req.flash('success', 'Cliente modificado correctamente');
    res.redirect("/customers");
})

// Encargado de mostrar datos del cliente en el form
router.get('/topay/:id/:room', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { room } = req.params;
    await pool.query('UPDATE customers set topay = ? WHERE id = ?', [null,id]);
    await pool.query('UPDATE rooms set active = "Disponible" WHERE id = ?', [room]);
    await pool.query('UPDATE customers set rooms_id = ? WHERE rooms_id = ?', [null, room]);
    res.redirect('/customers');
})

module.exports = router;