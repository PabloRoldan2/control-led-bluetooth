require('dotenv').config(); //por si solo se prueba esta sección del code
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => console.error('Error de conexión a SQL Server:', err.message));

// Guarda una acción en el historial (la fecha la pone la BD con GETDATE())
async function registrarAccion(idAccion) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_accion', sql.Int, idAccion)
            .query('INSERT INTO Historial (id_accion) VALUES (@id_accion)');
    } catch (err) {
        // Si falla la BD, no se detiene el control del brazo/LED
        console.error('Error al guardar historial:', err.message);
    }
}

module.exports = { sql, poolPromise, registrarAccion };