'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario');
    let btn_back = document.querySelector(".parr_volver");
    const inputs = document.querySelectorAll('#form_truck input');
    const formularioCamion = document.getElementById('form_truck');
    const expresiones = {
        patente_camion: /^[a-zA-Z0-9]{6,7}$/, // Letras, numeros, guion y guion_bajo
        marca: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        modelo: /^[a-zA-Z0-9À-ÿ\s]{1,40}$/, // Letras, números y espacios, pueden llevar acentos.
        anio: /^\d{4,4}$/, // Supongo así valido que solo sean 4 números    
    }

    const campos = {
        patente_camion: false,
        marca: false,
        modelo: false,
        anio: false
    }

    const validarFormulario = (e) => {
        //e.target.name la e es solo un parametro, se podría llamar de cualer manera.
        //esta linea es para validar correctamente el campo que sea el que queremos validar
        //nos da el name del input
        switch (e.target.name) {
            case "patente_camion":
                validarCampo(expresiones.patente_camion, e.target, 'patente_camion'); //también podría haber pasado solo el e.target en vez de e.target.name
                break;
            case "marca":
                validarCampo(expresiones.marca, e.target, 'marca');
                break;
            case "modelo":
                validarCampo(expresiones.modelo, e.target, 'modelo');
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


        fetch('http://localhost:3000/getAllTypeTruck', {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {

                for (let i in data) {
                    //console.log(data[i]);
                    let select = document.getElementById('selectCamion');
                    let option = document.createElement('option');
                    option.setAttribute('value', `${data[i].cod_tipo_camion}`)
                    option.innerHTML = `${data[i].descripcion}`;
                    select.appendChild(option);
                }

            })
            .catch(err => { console.log(err); })

        formularioCamion.addEventListener('submit', (event) => {
            event.preventDefault();
            let tipo_cam = document.getElementById('selectCamion');

            if (campos.patente_camion && campos.marca && campos.modelo && campos.anio && tipo_cam.value != 0) {

                let registroFormData = new FormData(formularioCamion);

                fetch('http://localhost:3000/add_truck/', {
                        method: 'POST',
                        body: registroFormData,
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Success:', response);
                        } else {
                            console.log("error");
                        }

                    })
                    .catch(err => { console.log(err); })
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Camión Agregado!',
                    showConfirmButton: false,
                    timer: 2500
                })

                setTimeout(() => {
                    window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=1`;
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


    } else {
        alert("Usted NO ha Iniciado Sesión");
        window.location.href = './index.html';
    }
})