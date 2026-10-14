const express = require('express');
const { poolPromise } = require('../db');

const router = express.Router();

// GET /api/auditoria  ->  INNER JOIN entre Historial y Accion
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request().query(`
            SELECT h.id_historial,
                   h.id_accion,
                   a.Descripcion AS descripcion,
                   h.fecha
            FROM Historial h
            INNER JOIN Accion a ON h.id_accion = a.id_accion
            ORDER BY h.fecha DESC, h.id_historial DESC
        `);
        res.json(resultado.recordset);
    } catch (err) {
        console.error('Error en auditoría:', err.message);
        res.status(500).json({ mensaje: 'No se pudo obtener el historial.' });
    }
});

module.exports = router;