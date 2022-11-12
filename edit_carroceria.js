'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        patente_carroceria = getURL.get('patente'),
        formEdicionCarroceria = document.getElementById("form_edit_carroceria"),
        inputs = document.querySelectorAll('#form_edit_carroceria input');
    var initialized_session = 'false';
    let btn_back = document.querySelector(".parr_volver");
    initialized_session = sessionStorage.getItem("initialized_session");
    const expresiones = {
        patente_carroceria: /^[a-zA-Z0-9]{6,7}$/, // Letras, numeros, guion y guion_bajo    
        cant_ejes: /^\d{1,1}$/, // Supongo así valido que solo sean 4 números    
        anio: /^\d{4,4}$/, // Supongo así valido que solo sean 4 números  
    }

    const campos = {
        patente_carroceria: true,
        cant_ejes: true,
        anio: true
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

    if (initialized_session == 'true') {

        fetch(`http://localhost:3000/mi_carroceria/${patente_carroceria}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data[0])
                document.getElementById('cod_usuario').value = data[0].cod_usuario;
                document.getElementById('patente_carroceria').value = data[0].patente_carroceria;
                document.getElementById('cant_ejes').value = data[0].cant_ejes;
                document.getElementById('anio').value = data[0].anio;

                const tipo_carroceria = data[0].cod_tipo_carroceria;

                fetch('http://localhost:3000/getCarroceria', {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        for (let i in data) {
                            //console.log(data[i]);
                            let select = document.getElementById('selectCarroceria');
                            let option = document.createElement('option');
                            option.setAttribute('value', `${data[i].cod_tipo_carroceria}`)
                            if (tipo_carroceria == data[i].cod_tipo_carroceria) {
                                option.selected = true;
                            }
                            option.innerHTML = `${data[i].descripcion}`;
                            select.appendChild(option);
                        }

                    })
                    .catch(err => { console.log(err); })

                // Guardar Cambios 
                formEdicionCarroceria.addEventListener('submit', (event) => {
                    event.preventDefault();
                    if (campos.patente_carroceria && campos.cant_ejes && campos.anio) {

                        let registroFormData = new FormData(formEdicionCarroceria);

                        //no se si con el put o post puedo hacer el then catch porque en realidad no devuelven nada. Pero tiene que haber una forma
                        fetch('http://localhost:3000/update_carroceria/', {
                                method: 'PUT',
                                body: registroFormData,
                            })
                            .catch(err => { console.log(err); })

                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '¡Cambios Guardados!',
                            showConfirmButton: false,
                            timer: 2500
                        })

                        setTimeout(() => {
                            window.location.href = `./my_trucks.html?cod_usuario=${data[0].cod_usuario}`;
                        }, 2500);

                    } else {
                        document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
                        setTimeout(() => {
                            document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
                        }, 4000);
                    }
                })
            })
            .catch(err => { console.log(err); })

        //Botón Volver
        btn_back.addEventListener('click', (event) => {
            event.preventDefault();
            javascript: history.back();
        })
    } else {
        alert("Usted NO ha Iniciado Sesión");
        window.location.href = './index.html';
    }
})