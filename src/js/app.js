let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});


function iniciarApp() {

    //resalta el div que se clickea cortes, uñas, tratamiento capilar etc
    mostrarServicios();

    mostrarSeccion();

    //muestra la seccion que se clickea servicios,informacion cliente o resumen
    cambiarSeccion();

    //routes

    routSig();

    routAnt();

    //boton routes muestra el boton correspondiente segun la pagina anterior-siguiente

    botonRout();

    //muestra resumen o msj de error
    mostrarResumen();
};

function mostrarSeccion() {

    //Eliminamos el mostrar-seccion de la clase anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }


    const claseAgregada = document.querySelector(`#paso-${pagina}`);
    claseAgregada.classList.add('mostrar-seccion');

    //eliminamos el tab-select
    const tabAnterior = document.querySelector('.tab-select');
    if (tabAnterior) {
        tabAnterior.classList.remove('tab-select');
    };


    //resalta tab actual

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('tab-select');
}

function cambiarSeccion() {
    const lugarElegido = document.querySelectorAll('.tabs button')

    lugarElegido.forEach(lugar => {
        lugar.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonRout();
        })
    });

}


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
            contenedorServicio.dataset.idServicio = id;

            //Seleccionar servicio

            contenedorServicio.onclick = seleccionarServicio;

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



function seleccionarServicio(e) {
    //forzar al elemento al cual le damos click sea el div
    let element;

    if (e.target.tagName === 'P') {
        element = e.target.parentElement;
    } else {
        element = e.target;

    }

    if (element.classList.contains('seleccion')) {
        element.classList.remove('seleccion');
    } else {

        element.classList.add('seleccion');
    }

};


function routSig() {
    const siguiente = document.querySelector('#sig');
    siguiente.addEventListener('click', () => {
        pagina++;
        botonRout()
    })

};


function routAnt() {
    const anterior = document.querySelector('#ant');
    anterior.addEventListener('click', () => {
        pagina--;
        botonRout()
    })
};

function botonRout() {
    const siguiente = document.querySelector('#sig');
    const anterior = document.querySelector('#ant');

    if (pagina === 1) {
        anterior.classList.add('ocultar');
        siguiente.classList.remove('ocultar')
    } else if (pagina === 2) {
        anterior.classList.remove('ocultar');
        siguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        siguiente.classList.add('ocultar');
        anterior.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen() {
    //destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //selecionamos el div
    const resumenAlerta = document.querySelector('.resumen-contenido');

    //validacion del objeto

    if (Object.values(cita).includes('')) {
        const incompleto = document.createElement('p');
        incompleto.textContent = 'Faltan datos de servicios, nombre, fecha, hora. Por favor ingrese todos los datos'
        incompleto.classList.add('resumen-alerta');

        //inyectamos p al div

        resumenAlerta.appendChild(incompleto);
       
       
    }


}