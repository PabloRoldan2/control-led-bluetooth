// Este módulo es el contador que guarda cada movimiento del brazo y sabe calcular los totales para las gráficas
const fs = require('fs');
const path = require('path');

// Ruta del archivo donde se guardan los movimientos.
// __dirname es la carpeta donde está este archivo.
const archivo = path.join(__dirname, 'movimientos.json');

// Lista de todos los movimientos.
// Cada uno tiene esta forma: { direccion: 'izquierda' o 'derecha', fecha: '2026-10-13T15:30:00.000Z' }
let eventos = [];

// Al iniciar el server se intenta cargar los movimientos guardados.
// La primera vez el archivo no existe y readFileSync lanza un error,
// por ese motivo va dentro de try/catch: si falla, empezamos con la lista vacía.
try {
    eventos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
} catch {
    eventos = [];
}

// Se llama cada vez que el brazo recibe un comando correctamente.
// "direccion" será 'izquierda' o 'derecha'.
function registrarMovimiento(direccion) {
    // Agregamos el movimiento a la lista, con la fecha y hora actuales.
    eventos.push({ direccion, fecha: new Date().toISOString() });

    // Guardamos la lista completa en el archivo para no perderla
    // si el server se reinicia. writeFile es asíncrono: no frena el servidor.
    fs.writeFile(archivo, JSON.stringify(eventos), (err) => {
        if (err) console.error('No se pudo guardar movimientos.json:', err.message);
    });
}

// Devuelve el total de movimientos por dirección.
// Ejemplo de resultado: { izquierda: 12, derecha: 9 }
function resumen() {
    const total = { izquierda: 0, derecha: 0 };

    // Recorremos todos los eventos y sumamos 1 a la dirección que corresponda.
    eventos.forEach((e) => total[e.direccion]++);

    return total;
}

// Devuelve los movimientos de cada uno de los últimos "minutos" minutos
// (aunque un minuto no tenga movimientos, aparece con ceros).
// Ejemplo: [ { minuto: 29566000, hora: '10:15', izquierda: 2, derecha: 1 }, ... ]
function porMinuto(minutos = 15) {
    // Un "minuto" se identifica como la cantidad de minutos desde 1970,
    // así dos eventos del mismo minuto tienen el mismo número.
    const minutoActual = Math.floor(Date.now() / 60000);
    const resultado = [];

    // Creamos una fila por cada minuto, del más antiguo al actual, todas en cero.
    for (let i = minutos - 1; i >= 0; i--) {
        const minuto = minutoActual - i;
        const hora = new Date(minuto * 60000).toLocaleTimeString('es', {
            hour: '2-digit',
            minute: '2-digit'
        });
        resultado.push({ minuto, hora, izquierda: 0, derecha: 0 });
    }

    // Recorremos los eventos y sumamos cada uno a su minuto (si está en el rango).
    eventos.forEach((e) => {
        const minuto = Math.floor(new Date(e.fecha).getTime() / 60000);
        const fila = resultado.find((r) => r.minuto === minuto);
        if (fila) fila[e.direccion]++;
    });

    return resultado;
}

module.exports = { registrarMovimiento, resumen, porMinuto };