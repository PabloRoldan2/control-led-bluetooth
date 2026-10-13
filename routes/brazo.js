const express = require('express');
const { enviar } = require('../bluetooth');

const router = express.Router();

// POST /api/brazo  ->  '2' = posición A, '3' = posición B
router.post('/', (req, res) => {
    const { estado } = req.body;

    if (estado !== 'ON' && estado !== 'OFF') {
        return res.status(400).json({ mensaje2: 'Estado no válido. Utiliza ON u OFF.' });
    }

    enviar(estado === 'ON' ? '2' : '3', `Brazo ${estado}`, res);
});

module.exports = router;