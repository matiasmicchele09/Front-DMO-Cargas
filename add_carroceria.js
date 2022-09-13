const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
let btn_back = document.querySelector(".parr_volver");
const inputs = document.querySelectorAll('#form_carroceria input');
const formularioCarroceria = document.getElementById('form_carroceria');
const expresiones = {
    patente_carroceria: /^[a-zA-Z0-9]{6,7}$/, // Letras, numeros, guion y guion_bajo    
    cant_ejes: /^\d{1,1}$/, // Supongo así valido que solo sean 4 números    
    anio: /^\d{4,4}$/, // Supongo así valido que solo sean 4 números
}
const campos = {
    patente_carroceria: false,
    cant_ejes: false,
    anio: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "patente_carroceria":
            validarCampo(expresiones.patente_carroceria, e.target, 'patente_carroceria'); //también podría haber pasado solo el e.target en vez de e.target.name
            break;
        case "cant_ejes":
            validarCampo(expresiones.cant_ejes, e.target, 'cant_ejes');
            break;
        case "anio":
            validarCampo(expresiones.anio, e.target, 'anio');
            break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario_grupo_incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario_grupo_correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-circle-xmark');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-circle-check');
        document.querySelector(`#grupo__${campo} .form__input_error`).classList.remove('form__input_error_activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario_grupo_incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario_grupo_correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-circle-check');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-circle-xmark');
        document.querySelector(`#grupo__${campo} .form__input_error`).classList.add('form__input_error_activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario); //para cuando pierde el foco, valida luego de terminar de escribir, creo es asi
});

var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {
    let inputUsuario = document.getElementById('cod_usuario');
    inputUsuario.value = `${cod_usuario}`;

    fetch('http://localhost:3000/getCarroceria', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {

            for (i in data) {
                //console.log(data[i]);
                let select = document.getElementById('selectCarroceria');
                let option = document.createElement('option');
                option.setAttribute('value', `${data[i].cod_tipo_carroceria}`)
                option.innerHTML = `${data[i].descripcion}`;
                select.appendChild(option);
            }

        })

    formularioCarroceria.addEventListener('submit', (event) => {
        event.preventDefault();
        if (campos.patente_carroceria && campos.cant_ejes && campos.anio) {

            let registroFormData = new FormData(formularioCarroceria);

            fetch('http://localhost:3000/add_carroceria/', {
                method: 'POST',
                body: registroFormData,
            });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Carrocería Agregada!',
                showConfirmButton: false,
                timer: 2500
            })

            setTimeout(() => {
                window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}`;
            }, 2500);

        } else {
            document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo');
            setTimeout(() => {
                document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
            }, 4000);

        }

    })

    //Botón Volver
    btn_back.addEventListener('click', (event) => {
        event.preventDefault();
        javascript: history.back()
    })
}