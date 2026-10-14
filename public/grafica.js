// Este archivo dibuja las dos gráficas del dashboard y las mantiene
// actualizadas pidiéndole los datos al servidor cada pocos segundos.

// Guardamos las gráficas en variables fuera de la función.
// Así, la función puede saber si ya existen (y solo actualizarlas)
// o si todavía hay que crearlas. Empiezan en null = "aún no creadas".
let graficaAcciones = null;
let graficaTiempo = null;

async function actualizarGraficas() {
    try {
        // Pedimos las estadísticas al servidor y convertimos la respuesta
        // de JSON a un objeto. Con { resumen, porMinuto } sacamos las dos
        // partes: los totales y los movimientos de cada minuto.
        const respuesta = await fetch('/api/estadisticas');
        const { resumen, porMinuto } = await respuesta.json();

        // Preparamos los datos una sola vez, para usarlos tanto al crear
        // las gráficas como al actualizarlas.

        // Alturas de las dos barras: [total izquierda, total derecha]
        const datosAcciones = [resumen.izquierda, resumen.derecha];

        // porMinuto es una lista con una fila por minuto. Con .map() sacamos
        // de cada fila solo el dato que necesitamos, y queda una lista nueva:
        // - las horas, que van en el eje horizontal ('10:15', '10:16', ...)
        // - los movimientos a la izquierda y a la derecha de cada minuto
        const etiquetasTiempo = porMinuto.map(m => m.hora);
        const datosIzquierda = porMinuto.map(m => m.izquierda);
        const datosDerecha = porMinuto.map(m => m.derecha);

        // Si graficaAcciones sigue en null, es la primera vez
        // y toca crear las gráficas.
        if (!graficaAcciones) {

            // ---------- Gráfica 1: total de movimientos por dirección ----------
            graficaAcciones = new Chart(document.getElementById('graficaAcciones'), {
                type: 'bar', // gráfica de barras
                data: {
                    // Nombres que aparecen debajo de cada barra
                    labels: ['Izquierda', 'Derecha'],
                    datasets: [{
                        label: 'Movimientos',
                        data: datosAcciones // altura de cada barra
                    }]
                },
                options: {
                    scales: {
                        // El eje vertical empieza en 0 y solo muestra enteros
                        // (no tiene sentido "1.5 movimientos")
                        y: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                }
            });

            // ---------- Gráfica 2: movimientos por minuto ----------
            graficaTiempo = new Chart(document.getElementById('graficaTiempo'), {
                type: 'line', // gráfica de líneas
                data: {
                    labels: etiquetasTiempo, // eje horizontal: las horas
                    datasets: [
                        // Una línea por dirección. Cada una tiene su nombre
                        // (label) y sus valores, en el mismo orden que las horas.
                        { label: 'Izquierda', data: datosIzquierda },
                        { label: 'Derecha', data: datosDerecha }
                    ]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                }
            });

        } else {
            // Si las gráficas ya existen, no se vuelven a crear
            // (se encimarían unas sobre otras): solo se les cambian los datos.

            // Gráfica 1: reemplazamos las alturas de las barras
            graficaAcciones.data.datasets[0].data = datosAcciones;
            graficaAcciones.update(); // update() la vuelve a dibujar

            // Gráfica 2: reemplazamos las horas y los valores de las dos líneas.
            // datasets[0] es la línea de Izquierda y datasets[1] la de Derecha,
            // en el mismo orden en que las creamos arriba.
            graficaTiempo.data.labels = etiquetasTiempo;
            graficaTiempo.data.datasets[0].data = datosIzquierda;
            graficaTiempo.data.datasets[1].data = datosDerecha;
            graficaTiempo.update();
        }
    } catch (error) {
        // Si el servidor no responde o algo falla, no se rompe la página:
        // el error queda en la consola del navegador (F12).
        console.error('No se pudieron actualizar las gráficas:', error);
    }
}

// Dibujamos las gráficas apenas carga la página...
actualizarGraficas();

// ...y repetimos la función cada 3000 milisegundos (3 segundos).
// Así las gráficas se mueven solas mientras se usa el brazo.
setInterval(actualizarGraficas, 3000);