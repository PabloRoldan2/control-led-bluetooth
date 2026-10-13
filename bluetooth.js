const { SerialPort } = require('serialport');

const bluetooth = new SerialPort({ path: 'COM7', baudRate: 9600 });

bluetooth.on('open', () => console.log('Bluetooth conectado en COM7'));
bluetooth.on('error', (err) => console.error('Error Bluetooth:', err.message));

// Envía un carácter al HC-05 y responde al cliente
function enviar(comando, nombre, res) {
    if (!bluetooth.isOpen) {
        return res.status(503).json({ mensaje: 'El puerto Bluetooth no está conectado.' });
    }

    bluetooth.write(comando, (err) => {
        if (err) {
            console.error('Error al enviar:', err.message);
            return res.status(500).json({ mensaje: 'Error al enviar el comando.' });
        }

        console.log(`${nombre} -> ${comando}`);
        res.json({ mensaje: `${nombre} enviado correctamente.` });
    });
}

module.exports = { enviar };