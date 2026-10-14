const express = require('express');
const { enviar } = require('../bluetooth');
const { registrarAccion } = require('../db');

const router = express.Router();

// POST /api/brazo  ->  '2' = izquierda, '3' = derecha
router.post('/', async (req, res) => {
    const { estado } = req.body;

    if (estado !== 'ON' && estado !== 'OFF') {
        return res.status(400).json({ mensaje: 'Estado no válido. Utiliza ON u OFF.' });
    }

    // 3 = Brazo a la izquierda, 4 = Brazo a la derecha
    await registrarAccion(estado === 'ON' ? 3 : 4);

    enviar(estado === 'ON' ? '2' : '3', `Brazo ${estado}`, res);
});

module.exports = router;