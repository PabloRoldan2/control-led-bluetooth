// Carga el historial desde el servidor y lo muestra en la tabla.
async function cargarHistorial() {
    const tbody = document.querySelector('#tabla-historial tbody');

    try {
        const respuesta = await fetch('/api/auditoria');
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'Error al cargar el historial.');
        }

        if (datos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Aún no hay registros.</td></tr>';
            return;
        }

        tbody.innerHTML = datos.map(fila => `
            <tr>
                <td>${fila.id_historial}</td>
                <td>${fila.id_accion}</td>
                <td>${fila.descripcion}</td>
                <td>${new Date(fila.fecha).toLocaleString('es-GT')}</td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
    }
}

cargarHistorial();