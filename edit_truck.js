const getURL = new URLSearchParams(window.location.search),
    patente = getURL.get('patente');
const formEdicionCamion = document.getElementById("form_edit_truck");
const inputs = document.querySelectorAll('#form_edit_truck input');
var initialized_session = 'false';
initialized_session = sessionStorage.getItem("initialized_session");
const expresiones = {
    patente: /^[a-zA-Z0-9]{6,7}$/, // Letras, numeros, guion y guion_bajo
    marca: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    modelo: /^[a-zA-Z0-9À-ÿ\s]{1,40}$/, // Letras, números y espacios, pueden llevar acentos.
    anio: /^\d{4,4}$/, // Supongo así valido que solo sean 4 números    
}

const campos = {
    patente: true,
    marca: true,
    modelo: true,
    anio: true
}

const validarFormulario = (e) => {
    //e.target.name la e es solo un parametro, se podría llamar de cualer manera.
    //esta linea es para validar correctamente el campo que sea el que queremos validar
    //nos da el name del input
    switch (e.target.name) {
        case "patente":
            validarCampo(expresiones.patente, e.target, 'patente'); //también podría haber pasado solo el e.target en vez de e.target.name
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

if (initialized_session == 'true') {

    fetch(`http://localhost:3000/my_truck/${patente}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data[0])
            let btn_back = document.querySelector(".parr_volver");
            let inputUsuario = document.getElementById('usuario'),
                inputPatente = document.getElementById('patente'),
                inputMarca = document.getElementById('marca'),
                inputModelo = document.getElementById('modelo'),
                inputAnio = document.getElementById('anio');

            /* Tal vez para ahorrar un par de lineas de código aca podria hacer:
            document.getElementById('usuario').value = data[0].cod_usuario; */
            inputUsuario.value = data[0].cod_usuario;
            inputPatente.value = data[0].patente;
            inputMarca.value = data[0].marca;
            inputModelo.value = data[0].modelo;
            inputAnio.value = data[0].anio;

            const tipo_camion = data[0].cod_tipo_camion;
            const tipo_carroceria = data[0].cod_tipo_carroceria;

            fetch('http://localhost:3000/getAllTypeTruck', {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {
                    for (i in data) {
                        let select = document.getElementById('selectCamion');
                        let option = document.createElement('option');
                        option.setAttribute('value', `${data[i].cod_tipo_camion}`)
                        if (tipo_camion == data[i].cod_tipo_camion) {
                            option.selected = true;
                        }
                        option.innerHTML = `${data[i].descripcion}`;
                        select.appendChild(option);
                    }
                });

            fetch('http://localhost:3000/getCarroceria', {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {

                    for (i in data) {
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


            // Guardar Cambios 
            formEdicionCamion.addEventListener('submit', (event) => {
                event.preventDefault();

                //Es es por las dudas que el usuario toque "sin querer" su número de usuario
                if (inputUsuario.value !== data[0].cod_usuario) {
                    inputUsuario.value = data[0].cod_usuario;
                }

                if (campos.patente && campos.marca && campos.modelo && campos.anio) {

                    let registroFormData = new FormData(formEdicionCamion);

                    //no se si con el put o post puedo hacer el then catch porque en realidad no devuelven nada. Pero tiene que haber una forma
                    fetch('http://localhost:3000/update_truck/', {
                        method: 'PUT',
                        body: registroFormData,
                    })

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

            //Botón Volver
            btn_back.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `./my_trucks.html?cod_usuario=${data[0].cod_usuario}`;
            })
        })

}