// Maneja la conexión con el HC-05. Se abre una sola vez
// y todos los archivos que lo importen comparten la misma conexión.

const { SerialPort } = require('serialport');

// Abrimos el puerto COM7 (el puerto saliente del HC-05 en Windows).
// El baudRate de aquí no afecta al Bluetooth; solo es un valor requerido.
const bluetooth = new SerialPort({ path: 'COM7', baudRate: 9600 });

// Avisos en consola para saber el estado de la conexión.
bluetooth.on('open', () => console.log('Bluetooth conectado en COM7'));
bluetooth.on('error', (err) => console.error('Error Bluetooth:', err.message));

// Envía un carácter al Arduino y devuelve una "promesa":
// - resolve() significa que se envió bien.
// - reject(error) significa que hubo un problema.
// Gracias a esto, las rutas pueden usar "await enviar(...)".
function enviar(comando) {
    return new Promise((resolve, reject) => {
        // Si el puerto no está abierto, no intentamos escribir.
        if (!bluetooth.isOpen) {
            return reject(new Error('El puerto Bluetooth no está conectado.'));
        }

        // Escribimos el carácter. El callback avisa si hubo error.
        bluetooth.write(comando, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = { enviar };