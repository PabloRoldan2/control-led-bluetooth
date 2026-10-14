require('dotenv').config(); //debe ir primero para cargar las credenciales de la bd
const express = require('express');
const path = require('path');

// Importaciones
const ledRouter = require('./routes/led');
const brazoRouter = require('./routes/brazo');
const estadisticasRouter = require('./routes/estadisticas');
const auditoriaRouter = require('./routes/auditoria'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/estadisticas', estadisticasRouter);
app.use('/api/led', ledRouter);
app.use('/api/brazo', brazoRouter);
app.use('/api/auditoria', auditoriaRouter);    

app.listen(PORT, () => console.log(`Servidor: http://localhost:${PORT}`));