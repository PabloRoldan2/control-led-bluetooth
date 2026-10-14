// Esta ruta le entrega a la página los datos para las gráficas.

const express = require('express');
const { resumen, porMinuto } = require('../estadisticas');

const router = express.Router();

// GET /api/estadisticas
// El prefijo '/api/estadisticas' lo pone server.js, por eso aquí es solo '/'.
router.get('/', (req, res) => {
    // Respondemos con un JSON con los dos conjuntos de datos:
    // { resumen: { izquierda, derecha }, porDia: [ ... ] }
    res.json({ resumen: resumen(), porMinuto: porMinuto() });
});

module.exports = router;