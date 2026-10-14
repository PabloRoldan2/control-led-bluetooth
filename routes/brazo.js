// Ruta que mueve el brazo y cuenta el movimiento.

const express = require('express');
const { enviar } = require('../bluetooth');                 // envía el byte al HC-05
const { registrarMovimiento } = require('../estadisticas'); // suma al contador

const router = express.Router();

// POST /api/brazo
// "async" nos permite usar "await" para esperar a que el envío termine.
router.post('/', async (req, res) => {
    // La página manda { estado: 'ON' } o { estado: 'OFF' }
const { enviar } = require('../bluetooth');
const { registrarAccion } = require('../db');

const router = express.Router();

// POST /api/brazo  ->  '2' = izquierda, '3' = derecha
router.post('/', async (req, res) => {
    const { estado } = req.body;

    // Validamos: solo aceptamos ON u OFF para no mandar cualquier cosa al puerto.
    if (estado !== 'ON' && estado !== 'OFF') {
        return res.status(400).json({ mensaje: 'Estado no válido. Utiliza ON u OFF.' });
    }

    // ON = botón "Izquierda" = carácter '2'; OFF = botón "Derecha" = carácter '3'.
    const comando = estado === 'ON' ? '2' : '3';
    const direccion = estado === 'ON' ? 'izquierda' : 'derecha';

    try {
        // Esperamos a que el comando se envíe por Bluetooth.
        // Si falla, salta directo al catch y NO se cuenta el movimiento.
        await enviar(comando);

        // Solo si el envío salió bien, sumamos el movimiento.
        registrarMovimiento(direccion);
        // Aquí la otra persona podrá agregar su registro en la base de datos.

        console.log(`Brazo ${direccion} -> ${comando}`);
        res.json({ mensaje: `Brazo a la ${direccion}: comando enviado correctamente.` });
    } catch (err) {
        // Cualquier error (puerto cerrado, fallo de escritura) llega aquí.
        console.error('Error:', err.message);
        res.status(500).json({ mensaje: err.message });
    }
    // 3 = Brazo a la izquierda, 4 = Brazo a la derecha
    await registrarAccion(estado === 'ON' ? 3 : 4);

    enviar(estado === 'ON' ? '2' : '3', `Brazo ${estado}`, res);
});

module.exports = router;