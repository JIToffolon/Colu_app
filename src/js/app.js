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
    //Alamacena el nombre de la cita
    nombreCita();
    //almacena la fecha de la cita
    fechaCita();

    //desabilita dias pasados
    deshabilitarFechaAnterior();

    //almacena la hora de la cita

    horaCita();

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

        const id = parseInt(element.dataset.idServicio);

        eliminarServicio(id);
    } else {

        element.classList.add('seleccion');

        const servicioObj = {
            id: parseInt(element.dataset.idServicio),
            nombre: element.firstElementChild.textContent,
            precio: element.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }

};

function eliminarServicio(id) {

    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita);

}



function agregarServicio(servicioObj) {

    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);


}


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
        mostrarResumen(); //Carga el resumen de la cita
    }
    mostrarSeccion();
}

function mostrarResumen() {
    //destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //selecionamos el div
    const resumenAlerta = document.querySelector('.resumen-contenido');

    //limpia el html previo
    while (resumenAlerta.firstChild) {
        resumenAlerta.removeChild(resumenAlerta.firstChild);
    }


    //validacion del objeto

    if (Object.values(cita).includes('')) {
        const incompleto = document.createElement('p');
        incompleto.textContent = 'Faltan datos de servicios, nombre, fecha, hora. Por favor ingrese todos los datos'
        incompleto.classList.add('resumen-alerta');

        //inyectamos p al div

        resumenAlerta.appendChild(incompleto);

        return;

    }

    const headingCita = document.createElement('h3');
    headingCita.textContent = 'Resumen de Cita';
    //mostrar resumen



    const nombreCita = document.createElement('p');
    nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;


    const fechaCita = document.createElement('p');
    fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;



    const horaCita = document.createElement('p');
    horaCita.innerHTML = `<span>Hora: </span>${hora}`;
    
    


    const serviciosCita = document.createElement('div');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('h3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);


    let cantidad=0;

    //Iterar sobre el arreglo de servicios

    servicios.forEach(servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('div');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('p');
        textoServicio.textContent = nombre;

        const textoPrecio = document.createElement('p');
        textoPrecio.textContent = precio;
        textoPrecio.classList.add('precio');


        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(textoPrecio);
        serviciosCita.appendChild(contenedorServicio);

        const totalServicio=precio.split('$');
        // console.log(parseInt(totalServicio[1].trim()));

        cantidad += parseInt(totalServicio[1].trim());


    })
    resumenAlerta.appendChild(headingCita);
    resumenAlerta.appendChild(nombreCita);
    resumenAlerta.appendChild(fechaCita);
    resumenAlerta.appendChild(horaCita);
    resumenAlerta.appendChild(serviciosCita);


    const cantidadPagar=document.createElement('p');
    cantidadPagar.innerHTML=`<span>Total a pagar :</span> $    ${cantidad}`
    cantidadPagar.classList.add('pagar')

    resumenAlerta.appendChild(cantidadPagar);

}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', (e) => {

        const nombreTexto = e.target.value.trim(); // e.target.value indica que es lo que se está escribiendo. El trim() elimina el espacio en blanco.

        //Validacion de que nombreTexto debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('nombre no válido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }

    })
}


function mostrarAlerta(mensaje, tipo) {
    console.log('el mensaje es', mensaje);

    //si hay una alerta previa no mostrar otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }


    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error')
    }
    console.log(alerta);

    //insertar en el html

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar alerta dsp de 3 seg

    setTimeout(() => {
        alerta.remove()
    }, 3000);
}

function fechaCita() {

    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', (e) => {


        const dia = new Date(e.target.value).getUTCDay();
        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = ''; // Esta linea hace que al seleccionar una fecha invalida, no se muestre 
            mostrarAlerta('Los fines de semana no trabajamos, disfrutamos de la vida', 'error');
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita);
        }


    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();

    // Ajustamos la fecha actual para deshabilitar días anteriores
    fechaAhora.setDate(fechaAhora.getDate() + 1);

    const year = fechaAhora.getFullYear();
    const month = fechaAhora.getMonth() + 1;
    const day = fechaAhora.getDate();

    // Formato deseado AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora')
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora invalida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);


        } else {
            cita.hora = horaCita;
        }

        console.log(cita);
    })
}