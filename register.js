'use strict'

const formularioRegistro = document.getElementById("form_Registro");
const inputs = document.querySelectorAll('#form_Registro input'); //me devuelve un arreglo de todos los inputs dentro del formulario

const expresiones = {
    //usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    razon_social: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    cuit_cuil: /^\d{11,11}$/, // Supongo así valido que solo sean 11 números
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^.{4,50}$/ // 4 a 50 digitos.
}

const campos = {
    razon_social: false,
    cuit_cuil: false,
    email: false,
    password: false
}

const validarFormulario = (e) => {
    //e.target.name la e es solo un parametro, se podría llamar de cualer manera.
    //esta linea es para validar correctamente el campo que sea el que queremos validar
    //nos da el name del input
    switch (e.target.name) {
        case "razon_social":
            validarCampo(expresiones.razon_social, e.target, 'razon_social'); //también podría haber pasado solo el e.target en vez de e.target.name
            break;
        case "cuit_cuil":
            validarCampo(expresiones.cuit_cuil, e.target, 'cuit_cuil');
            break;
        case "email":
            validarCampo(expresiones.email, e.target, 'email');
            break;
        case "password":
            validarCampo(expresiones.password, e.target, 'password');
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
})

formularioRegistro.addEventListener('submit', (event) => {
    event.preventDefault();

    const terminos = document.getElementById('terminos');
    const CUIT = document.getElementById('cuit_cuil');
    var es_fisica_y_transportista = true;
    const transportista = document.getElementById('tipo_usuario_transportista');
    const dador_carga = document.getElementById('tipo_usuario_dador_carga');

    if (terminos.checked == false) {
        document.querySelector('#grupo__terminos .form__input_error').classList.add('form__input_error_activo');
    } else {
        document.querySelector('#grupo__terminos .form__input_error').classList.remove('form__input_error_activo');
    }

    if (transportista.checked == false && dador_carga.checked == false) {
        document.querySelector('#grupo__tipo_usuario .form__input_error').classList.add('form__input_error_activo');
    } else {
        document.querySelector('#grupo__tipo_usuario .form__input_error').classList.remove('form__input_error_activo');
    }

    //Filtro para que si una persona elige "transportista" entonces sea física
    if (transportista.checked == true && CUIT.value.substring(0, 1) == '3') {
        document.querySelector('#grupo__tipo_usuario .form__input_error_transportista').classList.add('form__input_error_transportista_activo');
        es_fisica_y_transportista = false;
    } else {
        document.querySelector('#grupo__tipo_usuario .form__input_error_transportista').classList.remove('form__input_error_transportista_activo');
        es_fisica_y_transportista = true;
    }

    if (campos.razon_social && campos.cuit_cuil && campos.email && campos.password && terminos.checked && (transportista.checked || dador_carga.checked) && es_fisica_y_transportista) {

        let registroFormData = new FormData(formularioRegistro);

        document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
        document.getElementById('form__mensaje_exito').classList.add('form__mensaje_exito_activo')

        fetch('http://localhost:3000/register', {
            method: 'POST',
            body: registroFormData,
        });

        setTimeout(() => {
            document.getElementById('form__mensaje_exito').classList.remove('form__mensaje_exito_activo')
        }, 3000);

        setTimeout(() => {
            window.location.href = './logIn.html';
        }, 3000);

    } else {
        document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
    }
})