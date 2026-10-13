const express = require('express');
const { enviar } = require('../bluetooth');

const router = express.Router();

// POST /api/led  ->  '1' = encender, '0' = apagar
router.post('/', (req, res) => {
    const { estado } = req.body;

    if (estado !== 'ON' && estado !== 'OFF') {
        return res.status(400).json({ mensaje: 'Estado no válido. Utiliza ON u OFF.' });
    }

    enviar(estado === 'ON' ? '1' : '0', `LED ${estado}`, res);
});

module.exports = router;