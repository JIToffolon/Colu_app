document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});


function iniciarApp() {
    mostrarServicios();
};

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json();

        const { servicios } = db

        //Generar Html
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio
            //Dom Scripting
            //generar nombre del servicio
            const nombreServicio = document.createElement('p');
            nombreServicio.textContent = nombre
            nombreServicio.classList.add('nombre-servicio');

            //generar precio del servicio
            const precioServicio = document.createElement('p');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //generar div contenedor de servicio

            const contenedorServicio = document.createElement('div');
            contenedorServicio.classList.add('contenedor-servicio');

            //inyectar precio y nombre al div

            contenedorServicio.appendChild(nombreServicio);
            contenedorServicio.appendChild(precioServicio);
           
            //inyectar al html

            document.querySelector('#servicios').appendChild(contenedorServicio);

        });



    } catch (error) {
        console.log('error');
    }
};