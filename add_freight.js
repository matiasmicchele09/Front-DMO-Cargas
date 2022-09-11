const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    tipo_carga = getURL.get('tipo_carga'),
    formAgregarCarga = document.getElementById("form_freight"),
    inputs = document.querySelectorAll('#form_freight input');
let btn_back = document.querySelector(".parr_volver");
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

const expresiones = {
    prov_origen: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    ciudad_origen: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    domicilio_origen: /^[a-zA-ZÀ-ÿ\s]+[0-9]{1,40}$/, // Letras, números y espacios, pueden llevar acentos.
    prov_destino: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    ciudad_destino: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    domicilio_destino: /^[a-zA-ZÀ-ÿ\s]+[0-9]{1,40}$/, // Letras, números y espacios, pueden llevar acentos.
    cant_unit: /^[0-9]/, // Solo números
    peso_unit_kg: /^[0-9]/, // Solo números
    peso_total_kg: /^[0-9]/, // Solo números
    largo_mts: /^[0-9]/, // Solo números
    ancho_mts: /^[0-9]/, // Solo números
    alto_mts: /^[0-9]/, // Solo números
    peso_unit_tn: /^[0-9]/, // Solo números
    peso_total_tn: /^[0-9]/, // Solo números 
    cant_litros: /^[0-9]/ // Solo números
}
const campos = {
    prov_origen: false,
    ciudad_origen: false,
    domicilio_origen: false,
    fec_retiro: false,
    hora_retiro: false,
    fec_destino: false,
    hora_destino: false,
    prov_destino: false,
    ciudad_destino: false,
    domicilio_destino: false,
    receptor_carga: false,
    cant_unit: false,
    peso_unit_kg: false,
    peso_total_kg: false,
    largo_mts: false,
    ancho_mts: false,
    alto_mts: false,
    peso_unit_tn: false,
    peso_total_tn: false,
    cant_litros: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "prov_origen":
            validarCampo(expresiones.prov_origen, e.target, 'prov_origen'); //también podría haber pasado solo el e.target en vez de e.target.name
            break;
        case "ciudad_origen":
            validarCampo(expresiones.ciudad_origen, e.target, 'ciudad_origen');
            break;
        case "domicilio_origen":
            validarCampo(expresiones.domicilio_origen, e.target, 'domicilio_origen');
            break;
        case "prov_destino":
            validarCampo(expresiones.prov_destino, e.target, 'prov_destino'); //también podría haber pasado solo el e.target en vez de e.target.name
            break;
        case "ciudad_destino":
            validarCampo(expresiones.ciudad_destino, e.target, 'ciudad_destino');
            break;
        case "domicilio_destino":
            validarCampo(expresiones.domicilio_destino, e.target, 'domicilio_destino');
            break;
        case "cant_unit":
            validarCampo(expresiones.cant_unit, e.target, 'cant_unit');
            break;
        case "peso_unit_kg":
            validarCampo(expresiones.peso_unit_kg, e.target, 'peso_unit_kg');
            break;
        case "peso_total_kg":
            validarCampo(expresiones.peso_total_kg, e.target, 'peso_total_kg');
            break;
        case "largo_mts":
            validarCampo(expresiones.largo_mts, e.target, 'largo_mts');
            break;
        case "ancho_mts":
            validarCampo(expresiones.ancho_mts, e.target, 'ancho_mts');
            break;
        case "alto_mts":
            validarCampo(expresiones.alto_mts, e.target, 'alto_mts');
            break;
        case "peso_unit_tn":
            validarCampo(expresiones.peso_unit_tn, e.target, 'peso_unit_tn');
            break;
        case "peso_total_tn":
            validarCampo(expresiones.peso_total_tn, e.target, 'peso_total_tn');
            break;
        case "cant_litros":
            validarCampo(expresiones.cant_litros, e.target, 'cant_litros');
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

    let inputCantUnitaria = document.getElementById("cant_unit"),
        inputPesoUnitario = document.getElementById("peso_unit_kg"),
        inputPesoUTotal = document.getElementById("peso_total_kg");

    fetch(`http://localhost:3000/getAllTiposProducto/${tipo_carga}`, {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {

            let select = document.getElementById('selectTipoProducto'),
                selectEstado = document.getElementById('selectEstadoCarga'),
                inputUsuario = document.getElementById("cod_usuario"),
                inputTipoCarga = document.getElementById("cod_tipo_carga");

            inputUsuario.value = `${cod_usuario}`;
            inputTipoCarga.value = `${tipo_carga}`;

            data.forEach(res => {

                let option = document.createElement('option');
                option.setAttribute('id', `option_tipo_prod_${res.cod_tipo_producto}`);
                option.setAttribute('value', `${res.cod_tipo_producto}`)
                option.innerHTML = `${res.descripcion}`;
                select.appendChild(option);
            })

            fetch('http://localhost:3000/getOneEstadoCarga/1', {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    let option = document.createElement('option');
                    option.setAttribute('id', `cod_estado_carga_${data[0].descripcion}`);
                    option.setAttribute('value', `${data[0].cod_estado_carga}`)

                    option.innerHTML = `${data[0].descripcion}`;
                    selectEstado.appendChild(option);
                })

            select.addEventListener("change", (event) => {
                event.preventDefault();

                let option = document.getElementById(`option_tipo_prod_${select.value}`),
                    tipo_prod_seleccionado = option.getAttribute("value"),
                    divRefrigeriacion = document.getElementById("grupo__req_refrigeracion"),
                    divPeligrosa = document.getElementById("grupo__es_carga_peligrosa"),
                    divApilable = document.getElementById("grupo__es_carga_apilable"),
                    divCantUnitaria = document.getElementById("grupo__cant_unit"),
                    divPesoUnitKG = document.getElementById("grupo__peso_unit_kg"),
                    divPesoTotalKG = document.getElementById("grupo__peso_total_kg"),
                    divLargo = document.getElementById("grupo__largo_mts"),
                    divAncho = document.getElementById("grupo__ancho_mts"),
                    divAlto = document.getElementById("grupo__alto_mts"),
                    divPesoUnitTN = document.getElementById("grupo__peso_unit_tn"),
                    divPesoTotalTN = document.getElementById("grupo__peso_total_tn"),
                    divLitros = document.getElementById("grupo__cant_litros");


                for (i in data) {

                    if (data[i].cod_tipo_producto == tipo_prod_seleccionado) {

                        if (data[i].req_refrigeracion == true) {
                            divRefrigeriacion.classList.remove("form_req_refrigeracion");
                            divRefrigeriacion.classList.add("form_req_refrigeracion_disponible");
                            //req_refrigeracion.value = false;
                            //req_refrigeracion.checked = false;
                        } else {
                            //req_refrigeracion.checked = false;
                            //req_refrigeracion.value = false;
                        }
                        if (data[i].es_carga_peligrosa == true) {
                            divPeligrosa.classList.remove("form_es_carga_peligrosa");
                            divPeligrosa.classList.add("form_es_carga_peligrosa_disponible");
                            //es_carga_peligrosa.value = false;
                            //es_carga_peligrosa.checked = false;
                        } else {
                            //es_carga_peligrosa.checked = false;
                            //es_carga_peligrosa.value = false;
                        }
                        if (data[i].es_carga_apilable == true) {
                            divApilable.classList.remove("form_es_carga_apilable");
                            divApilable.classList.add("form_es_carga_apilable_disponible");
                            //es_carga_apilable.value = false;
                            es_carga_apilable.checked = false;
                        } else {
                            es_carga_apilable.checked = false;
                            //es_carga_apilable.value = false;
                        }
                        if (data[i].cant_unit == true) {
                            divCantUnitaria.classList.remove("form_cant_unit");
                            divCantUnitaria.classList.add("form_cant_unit_disponible");
                        } else {
                            cant_unit = document.getElementById("cant_unit");
                            cant_unit.value = 0;
                            campos.cant_unit = true;
                        }
                        if (data[i].peso_unit_kg == true) {
                            divPesoUnitKG.classList.remove("form_peso_unit_kg");
                            divPesoUnitKG.classList.add("form_peso_unit_kg_disponible");
                        } else {
                            peso_unit_kg = document.getElementById("peso_unit_kg");
                            peso_unit_kg.value = 0;
                            campos.peso_unit_kg = true;
                        }
                        if (data[i].peso_total_kg == true) {
                            divPesoTotalKG.classList.remove("form_peso_total_kg");
                            divPesoTotalKG.classList.add("form_peso_total_kg_disponible");
                        } else {
                            peso_total_kg = document.getElementById("peso_total_kg");
                            peso_total_kg.value = 0;
                            campos.peso_total_kg = true;
                        }
                        if (data[i].largo_mts == true) {
                            divLargo.classList.remove("form_largo_mts");
                            divLargo.classList.add("form_largo_mts_disponible");
                        } else {
                            largo_mts = document.getElementById("largo_mts");
                            largo_mts.value = 0;
                            campos.largo_mts = true;
                        }
                        if (data[i].ancho_mts == true) {
                            divAncho.classList.remove("form_ancho_mts");
                            divAncho.classList.add("form_ancho_mts_disponible");
                        } else {
                            ancho_mts = document.getElementById("ancho_mts");
                            ancho_mts.value = 0;
                            campos.ancho_mts = true;
                        }
                        if (data[i].alto_mts == true) {
                            divAlto.classList.remove("form_alto_mts");
                            divAlto.classList.add("form_alto_mts_disponible");
                        } else {
                            alto_mts = document.getElementById("alto_mts");
                            alto_mts.value = 0;
                            campos.alto_mts = true;
                        }
                        if (data[i].peso_unit_tn == true) {
                            divPesoUnitTN.classList.remove("form_peso_unit_tn");
                            divPesoUnitTN.classList.add("form_peso_unit_tn_disponible");
                        } else {
                            peso_unit_tn = document.getElementById("peso_unit_tn");
                            peso_unit_tn.value = 0;
                            campos.peso_unit_tn = true;
                        }
                        if (data[i].peso_total_tn == true) {
                            divPesoTotalTN.classList.remove("form_peso_total_tn");
                            divPesoTotalTN.classList.add("form_peso_total_tn_disponible");
                        } else {
                            peso_total_tn = document.getElementById("peso_total_tn");
                            peso_total_tn.value = 0;
                            campos.peso_total_tn = true;
                        }
                        if (data[i].cant_litros == true) {
                            divLitros.classList.remove("form_cant_litros");
                            divLitros.classList.add("form_cant_litros_disponible");
                        } else {
                            cant_litros = document.getElementById("cant_litros");
                            cant_litros.value = 0;
                            campos.cant_litros = true;
                        }
                    } else if (tipo_prod_seleccionado == 0) {
                        divRefrigeriacion.classList.remove("form_req_refrigeracion_disponible");
                        divPeligrosa.classList.remove("form_es_carga_peligrosa_disponible");
                        divApilable.classList.remove("form_es_carga_apilable_disponible");
                        divCantUnitaria.classList.remove("form_cant_unit_disponible");
                        divPesoUnitKG.classList.remove("form_peso_unit_kg_disponible");
                        divPesoTotalKG.classList.remove("form_peso_total_kg_disponible");
                        divLargo.classList.remove("form_largo_mts_disponible");
                        divAncho.classList.remove("form_ancho_mts_disponible");
                        divAlto.classList.remove("form_alto_mts_disponible");
                        divPesoUnitTN.classList.remove("form_peso_unit_tn_disponible");
                        divPesoTotalTN.classList.remove("form_peso_total_tn_disponible");
                        divLitros.classList.remove("form_cant_litros_disponible");
                        divRefrigeriacion.classList.add("form_req_refrigeracion");
                        divPeligrosa.classList.add("form_es_carga_peligrosa");
                        divApilable.classList.add("form_es_carga_apilable");
                        divCantUnitaria.classList.add("form_cant_unit");
                        divPesoUnitKG.classList.add("form_peso_unit_kg");
                        divPesoTotalKG.classList.add("form_peso_total_kg");
                        divLargo.classList.add("form_largo_mts");
                        divAncho.classList.add("form_ancho_mts");
                        divAlto.classList.add("form_alto_mts");
                        divPesoUnitTN.classList.add("form_peso_unit_tn");
                        divPesoTotalTN.classList.add("form_peso_total_tn");
                        divLitros.classList.add("form_cant_litros");
                    }
                }
            })

            document.getElementById('req_refrigeracion').addEventListener("click", () => {
                if (document.getElementById('req_refrigeracion').checked) {
                    document.getElementById('req_refrigeracion').value = true
                }
            })
            document.getElementById('es_carga_peligrosa').addEventListener("click", () => {
                if (document.getElementById('es_carga_peligrosa').checked) {
                    document.getElementById('es_carga_peligrosa').value = true
                }
            })
            document.getElementById('es_carga_apilable').addEventListener("click", () => {
                if (document.getElementById('es_carga_apilable').checked) {
                    document.getElementById('es_carga_apilable').value = true
                }
            })

            inputPesoUnitario.addEventListener('keyup', () => {
                inputPesoUTotal.value = inputCantUnitaria.value * inputPesoUnitario.value;
                campos.peso_total_kg = true;
            });

            inputCantUnitaria.addEventListener('keyup', () => {
                inputPesoUTotal.value = inputCantUnitaria.value * inputPesoUnitario.value;
                campos.peso_total_kg = true;
            });
        })

    //Envío de Formulario
    formAgregarCarga.addEventListener('submit', (event) => {
        event.preventDefault();
        let horaRetiro = document.getElementById("hora_retiro"),
            horaDestino = document.getElementById("hora_destino"),
            fecRetiro = document.getElementById("fec_retiro"),
            fecDestino = document.getElementById("fec_destino"),
            receptor_carga = document.getElementById("receptor_carga");



        if (horaRetiro.value == "") {
            campos.hora_retiro = false;
        } else { campos.hora_retiro = true; }
        if (horaDestino.value == "") {
            campos.hora_destino = false;
        } else { campos.hora_destino = true; }
        if (fecRetiro.value == "") {
            campos.fec_retiro = false;
        } else { campos.fec_retiro = true; }
        if (fecDestino.value == "") {
            campos.fec_destino = false;
        } else { campos.fec_destino = true; }
        if (receptor_carga.value == "") {
            campos.receptor_carga = false;
        } else { campos.receptor_carga = true; }
        /* falta que salga el cartel en todos esos campos que definí acá arriba */

        if (campos.prov_origen && campos.ciudad_origen && campos.domicilio_origen &&
            campos.hora_retiro && campos.fec_retiro && campos.hora_destino &&
            campos.fec_destino && campos.prov_destino && campos.ciudad_destino &&
            campos.domicilio_destino && campos.receptor_carga && campos.cant_unit &&
            campos.peso_unit_kg && campos.peso_total_kg && campos.largo_mts && campos.ancho_mts &&
            campos.alto_mts && campos.peso_unit_tn && campos.peso_total_tn && campos.cant_litros) {
            let registroFormData = new FormData(formAgregarCarga);

            fetch('http://localhost:3000/add_freight/', {
                method: 'POST',
                body: registroFormData,
            });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Carga Agregada!',
                showConfirmButton: false,
                timer: 2500
            })

            setTimeout(() => {
                javascript: history.back()
            }, 2500);
        } else {
            /* aca tendria que hacer que salten los carteles junto con el cartel mayor que se define aca abajo */
            document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo');
            setTimeout(() => {
                document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
            }, 4000);
        }
    })

    //Botón Volver
    btn_back.addEventListener('click', (event) => {
        event.preventDefault();
        //window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}`;
        javascript: history.back()
    })
} else {
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