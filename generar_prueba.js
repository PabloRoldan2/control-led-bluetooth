// Genera movimientos.json con 25 movimientos de prueba
// repartidos al azar dentro de los últimos 15 minutos.

const fs = require('fs');

const eventos = [];
const ahora = Date.now();

for (let i = 0; i < 25; i++) {
    // Un momento al azar entre ahora y hace 15 minutos
    const haceCuanto = Math.floor(Math.random() * 15 * 60000);

    eventos.push({
        direccion: Math.random() < 0.5 ? 'izquierda' : 'derecha',
        fecha: new Date(ahora - haceCuanto).toISOString()
    });
}

// Ordenamos de más antiguo a más reciente, como se guardarían de verdad
eventos.sort((a, b) => a.fecha.localeCompare(b.fecha));

fs.writeFileSync('movimientos.json', JSON.stringify(eventos));
console.log(`Se generaron ${eventos.length} movimientos de prueba.`);