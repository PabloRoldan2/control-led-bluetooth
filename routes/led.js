const express = require('express');
const { enviar } = require('../bluetooth');
const { registrarAccion } = require('../db');

const router = express.Router();

// POST /api/led  ->  '1' = encender, '0' = apagar
router.post('/', async (req, res) => {
    const { estado } = req.body;

    if (estado !== 'ON' && estado !== 'OFF') {
        return res.status(400).json({ mensaje: 'Estado no válido. Utiliza ON u OFF.' });
    }

    // 1 = LED encendida, 2 = LED apagada
    await registrarAccion(estado === 'ON' ? 1 : 2);

    enviar(estado === 'ON' ? '1' : '0', `LED ${estado}`, res);
});

module.exports = router;