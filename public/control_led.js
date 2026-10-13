// Función que permite encender o apagar la LED
// enviando el comando correspondiente al servidor.
async function controlarLed(estado) {

    // Obtenemos el elemento HTML donde se mostrarán
    // los mensajes sobre el resultado de la operación.
    const mensaje = document.getElementById('mensaje');

    try {

        // Enviamos una solicitud POST al servidor Node.js
        // mediante la ruta /api/led.
        const respuesta = await fetch('/api/led', {
            method: 'POST',

            // Indicamos que los datos se enviarán en formato JSON.
            headers: {
                'Content-Type': 'application/json'
            },

            // Convertimos el estado recibido (ON u OFF)
            // en un objeto JSON para enviarlo al servidor.
            body: JSON.stringify({ estado: estado })
        });

        // Interpretamos la respuesta del servidor como JSON.
        const resultado = await respuesta.json();

        // Comprobamos si el servidor respondió con un error HTTP.
        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || 'No se pudo controlar la LED.'
            );
        }

        // Mostramos el mensaje devuelto por el servidor.
        mensaje.textContent = resultado.mensaje;

    } catch (error) {

        // Si ocurre un error durante la solicitud,
        // mostramos el mensaje correspondiente en la página.
        mensaje.textContent = 'Error: ' + error.message;
    }
}
