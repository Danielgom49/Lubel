const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database); // Hace las tareas en secuencia

pool.getConnection((err, connection) => { // Se genera la concexión a la BD
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Error de conexión a la BD
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') { // Se comprueba las conexiones a la BD
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') { // Cuando se rechaza la conexión a la BD
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) connection.release();  // Inicia la conexción
    console.log('DB is Connected');
    return;
})
// Promisify Pool Query
pool.query = promisify(pool.query); // Se pasa a promesas lo que antes eran callback

module.exports = pool;