const express = require('express');
const path = require('path');

// Importaciones
const ledRouter = require('./routes/led');
const brazoRouter = require('./routes/brazo');
const estadisticasRouter = require('./routes/estadisticas');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/estadisticas', estadisticasRouter);
app.use('/api/led', ledRouter);
app.use('/api/brazo', brazoRouter);

app.listen(PORT, () => console.log(`Servidor: http://localhost:${PORT}`));