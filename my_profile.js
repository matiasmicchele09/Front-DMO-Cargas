const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    formularioPerfil = document.getElementById("form_profile"),
    inputs = document.querySelectorAll('#form_profile input'); //me devuelve un arreglo de todos los inputs dentro del formulario
var initialized_session = 'false';

const expresiones = {
    //usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    razon_social: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    cuit_cuil: /^\d{11,11}$/, // Supongo así valido que solo sean 11 números
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^.{4,50}$/ // 4 a 50 digitos.
        /*fec_nacim: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/*/
}

const campos = {
    razon_social: true,
    cuit_cuil: true,
    email: true,
    password: true,
    /*fec_nacim: true*/
}

const validarFormulario = (e) => {
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
            /*case "fec_nacim":
                validarCampo(expresiones.fec_nacim, e.target, 'fec_nacim');
                break;*/
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


initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {


    fetch(`http://localhost:3000/my_profile/${cod_usuario}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data[0]);
            let datosUsuario = data[0];
            let btn_logOut = document.querySelector(".btn-salir");
            let inputUsuario = document.getElementById('cod_usuario'),
                razon_social = document.getElementById('razon_social'),
                cuit_cuil = document.getElementById('cuit_cuil'),
                email = document.getElementById('email'),
                password = document.getElementById('password');
            fec_nacim = document.getElementById('fec_nacim');

            inputs.forEach((input) => {
                input.disabled = true;
            })

            inputUsuario.value = datosUsuario.cod_usuario;
            razon_social.value = datosUsuario.razon_social;
            cuit_cuil.value = datosUsuario.cuit_cuil;
            email.value = datosUsuario.email;
            password.value = datosUsuario.password;
            fec_nacim.value = datosUsuario.fec_nacim.substring(0, 10);

            let btn_back = document.querySelector(".parr_volver"),
                btn_edit = document.getElementById("btn_edit_profile"),
                btn_cancel = document.getElementById("btn_cancel_profile");

            //Botón Editar
            btn_edit.addEventListener('click', (event) => {
                event.preventDefault();
                inputs.forEach((input) => {
                    input.disabled = false;
                })
            });

            //Botón Cancelar
            btn_cancel.addEventListener('click', (event) => {
                event.preventDefault();

                inputs.forEach((input) => {
                    input.disabled = true;
                })
            })

            //Botón Guardar
            formularioPerfil.addEventListener('submit', (event) => {
                event.preventDefault();

                if (campos.razon_social && campos.cuit_cuil && campos.email && campos.password) {

                    let registroFormData = new FormData(formularioPerfil);
                    fetch('http://localhost:3000/update_profile', {
                            method: 'POST',
                            body: registroFormData,
                        })
                        /*.then(*/
                    Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '¡Guardando Cambios!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        /*).catch(
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: '¡Se ha producido un error!',
                            showConfirmButton: false,
                            timer: 1500
                        }))
*/
                    setTimeout(() => {
                        javascript: history.back();
                    }, 1500);
                } else {
                    document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
                }

            })

            //Botón Salir
            btn_logOut.addEventListener('click', (event) => {
                event.preventDefault();
                Swal.fire({
                    position: 'center',
                    title: 'CERRANDO SESIÓN...',
                    text: '¡Hasta Pronto!',
                    showConfirmButton: false,
                    timer: 1500
                })

                sessionStorage.removeItem("initialized_session");
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1500);

            })

            //Botón Volver
            btn_back.addEventListener('click', (event) => {
                event.preventDefault();
                const inputs = document.querySelectorAll('#form_profile input');
                let isAvailable = false;

                inputs.forEach((input) => {
                    if (input.disabled == false) {
                        isAvailable = true;
                    } else {
                        isAvailable = false;
                    }
                });

                if (isAvailable == true) {
                    Swal.fire({
                        title: '¡Hay cambios sin guardar!',
                        text: 'Si sale de la página no se guardarán',
                        icon: 'warning',
                        showDenyButton: true,
                        showConfirmButton: false,
                        showCancelButton: true,
                        denyButtonText: `Salir`,
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                        allowOutsideClick: false,

                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isDenied) {
                            javascript: history.back();
                        }
                    })
                } else {
                    javascript: history.back();
                }
            })

        })
} else {
    //Me parece que estas alertas no la tira porque al estar atada al CDN entonces si no carga el html no 
    //va a cargar el CDN. Tengo que ver como hacer.
    //Sino ya fue lo dejo sin nada y listo. En ninguna app que recuerde te salta un cartel con eso.
    //Simplemente muestra que no esta cargado nada porque no esta en su sesion
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: '¡No ha iniciado sesión!',
        showConfirmButton: false,
        timer: 1500
    })
    setTimeout(() => {
        window.location.href = './index.html';
    }, 1500);
}