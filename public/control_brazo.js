// Función que permite mover el brazo
// enviando el comando correspondiente al servidor.
async function controlarBrazo(estado) {

    // Obtenemos el elemento HTML donde se mostrarán
    // los mensajes sobre el resultado de la operación.
    const mensaje2 = document.getElementById('mensaje2');

    try {

        // Enviamos una solicitud POST al servidor Node.js
        // mediante la ruta /api/brazo.
        const respuesta = await fetch('/api/brazo', {
            method: 'POST',

            // Indicamos que los datos se enviarán en formato JSON.
            headers: {
                'Content-Type': 'application/json'
            },

            // Convertimos el estado recibido en un objeto JSON para enviarlo al servidor.
            body: JSON.stringify({ estado: estado })
        });

        // Interpretamos la respuesta del servidor como JSON.
        const resultado = await respuesta.json();

        // Comprobamos si el servidor respondió con un error HTTP.
        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || 'No se pudo controlar el Brazo.'
            );
        }

        // Mostramos el mensaje devuelto por el servidor.
        mensaje2.textContent = resultado.mensaje;

    } catch (error) {

        // Si ocurre un error durante la solicitud,
        // mostramos el mensaje correspondiente en la página.
        mensaje2.textContent = 'Error: ' + error.message;
    }
}
