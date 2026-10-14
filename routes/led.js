// Ruta que enciende o apaga el LED. Funciona igual que la del brazo,
// pero con otros caracteres y sin contador.

const express = require('express');
const { enviar } = require('../bluetooth');

const router = express.Router();

// POST /api/led
router.post('/', async (req, res) => {
    const { estado } = req.body;

    // Solo aceptamos ON u OFF.
    if (estado !== 'ON' && estado !== 'OFF') {
        return res.status(400).json({ mensaje: 'Estado no válido. Utiliza ON u OFF.' });
    }

    try {
        // ON = '1' (encender), OFF = '0' (apagar).
        await enviar(estado === 'ON' ? '1' : '0');
        res.json({ mensaje: `LED ${estado}: comando enviado correctamente.` });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ mensaje: err.message });
    }
});

module.exports = router;