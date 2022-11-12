'use strict'
document.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        cod_carga = getURL.get('cod_carga'),
        tpo_usuario = getURL.get('tpo_usuario'),
        inputs = document.querySelectorAll('#form_freight input'),
        formEdicionCarga = document.getElementById("form_freight");

    let btn_back = document.querySelector(".parr_volver");
    var initialized_session = 'false';
    initialized_session = sessionStorage.getItem("initialized_session");

    const expresiones = {
        domicilio_origen: /^[a-zA-ZÀ-ÿ\s]+[0-9]{1,40}$/, // Letras, números y espacios, pueden llevar acentos.                
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
        origen: true,
        domicilio_origen: true,
        fec_retiro: true,
        hora_retiro: true,
        destino: true,
        fec_destino: true,
        domicilio_destino: true,
        receptor_carga: true,
        cant_unit: true,
        peso_unit_kg: true,
        peso_total_kg: true,
        largo_mts: true,
        ancho_mts: true,
        alto_mts: true,
        peso_unit_tn: true,
        peso_total_tn: true,
        cant_litros: true,
        valor_carga: true
    }

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "domicilio_origen":
                validarCampo(expresiones.domicilio_origen, e.target, 'domicilio_origen');
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
        const btnEdit = document.getElementById("btn_edit_carga"),
            btnCancel = document.getElementById("btn_cancel_carga"),
            btnSave = document.getElementById("btn_save_carga"),
            btnDelete = document.getElementById("btn_delete_carga"),
            btnRequest = document.getElementById("btn_request_carga"),
            btnCalculaValor = document.getElementById("btn_calcular_valor");

        let date,
            today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();

        if (`${month}`.length > 1 && `${day}`.length > 1) {
            date = `${year}-${month}-${day}`;
        } else if (`${month}`.length == 1 && `${day}`.length == 1) {
            date = `${year}-0${month}-0${day}`;
        } else if (`${month}`.length == 1) {
            date = `${year}-0${month}-${day}`;
        } else if (`${day}`.length == 1) {
            date = `${year}-${month}-0${day}`;
        }
        //Validación de que Fecha de Retiro NO puede ser menor al Día de hoy
        document.getElementById("fec_retiro").addEventListener('blur', (event) => {
            event.preventDefault();
            // console.log(document.getElementById("fec_retiro").value);
            if (date > document.getElementById("fec_retiro").value) {
                alert("¡No puede ingresar una Fecha de Retiro menor al Día de hoy!")
            }
        })

        fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                console.log("Carga: ", data);
                const nuevo_retiro = new Date(data[0].fec_retiro),
                    nuevo_destino = new Date(data[0].fec_destino);
                document.getElementById("parr_cod_carga").innerHTML = `<b>Cod. Carga: </b>${cod_carga} - <b> Fecha Publicación de la Carga: </b>${data[0].fec_publicacion.substring(0, 10)}`
                btnSave.disabled = true;
                btnCalculaValor.disabled = true;

                /* Lo de la fecha no lo hice como hice mas abajo en la solicitud porque a los dias y meses de un 
                digito no les agrega el cero delante (01, 02, ...) entonces el input no me lo toma como válido.
                Creo que hay una biblioteca llamada moment que podes darle el formato correcto a la fecha,
                pero me hizo renegar asi que no la use */

                fetch(`http://localhost:3000/getNameUser/${data[0].cod_usuario}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        //console.log(data);
                        document.getElementById('rs_dador_carga').innerHTML = data[0].razon_social;
                    })
                    .catch(err => { console.log(err); })

                document.getElementById('origen').value = data[0].origen;
                document.getElementById('domicilio_origen').value = data[0].domicilio_origen;
                document.getElementById('fec_retiro').value = data[0].fec_retiro.substring(0, 10);
                document.getElementById('hora_retiro').value = data[0].hora_retiro.substring(0, 5);
                document.getElementById('destino').value = data[0].destino;
                document.getElementById('domicilio_destino').value = data[0].domicilio_destino;
                document.getElementById('receptor_carga').value = data[0].receptor_carga;
                document.getElementById('fec_destino').value = data[0].fec_destino.substring(0, 10);
                document.getElementById('comentario').value = data[0].comentario;
                document.getElementById('parrafo_dist_recorrido').innerHTML = `<b>Distancia Estimada del recorrido: </b> ${data[0].distancia_recorrido} Km`;
                document.getElementById('distancia_recorrido').value = data[0].distancia_recorrido;
                document.getElementById('valor_carga').value = data[0].valor_carga;
                document.getElementById('valor_carga_en_pesos').value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data[0].valor_carga);
                console.log(new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data[0].valor_carga));
                console.log(document.getElementById('valor_carga').value);

                const tipo_producto = data[0].cod_tipo_producto;

                fetch(`http://localhost:3000/getAllTiposProducto/${data[0].cod_tipo_carga}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {

                        let select = document.getElementById('selectTipoProducto'),
                            inputUsuario = document.getElementById("cod_usuario"),
                            inputTipoCarga = document.getElementById("cod_tipo_carga"),
                            inputCodCarga = document.getElementById("cod_carga");

                        inputUsuario.value = `${cod_usuario}`;
                        inputTipoCarga.value = `${data[0].cod_tipo_carga}`;
                        inputCodCarga.value = `${cod_carga}`;

                        data.forEach(res => {
                            let option = document.createElement('option');
                            option.setAttribute('id', `option_tipo_prod_${res.cod_tipo_producto}`);
                            option.setAttribute('value', `${res.cod_tipo_producto}`)
                            if (tipo_producto == res.cod_tipo_producto) {
                                option.selected = true;
                            }

                            option.innerHTML = `${res.descripcion}`;
                            select.appendChild(option);
                            select.disabled = true;
                        })
                    })
                    .catch(err => { console.log(err); })

                if (data[0].req_refrigeracion == true) {
                    document.getElementById("grupo__req_refrigeracion").classList.add("form_req_refrigeracion_disponible");
                    document.getElementById('req_refrigeracion').checked = data[0].req_refrigeracion;
                }

                if (data[0].es_carga_peligrosa == true) {
                    document.getElementById("grupo__es_carga_peligrosa").classList.add("form_es_carga_peligrosa_disponible");
                    document.getElementById('es_carga_peligrosa').checked = data[0].es_carga_peligrosa;
                }

                if (data[0].es_carga_apilable == true) {
                    document.getElementById("grupo__es_carga_apilable").classList.add("form_es_carga_apilable_disponible");
                    document.getElementById('es_carga_apilable').checked = data[0].es_carga_apilable;
                }

                for (let i = 0; i < data.length; i++) {

                    if (data[i].cant_unit != 0) {
                        document.getElementById("grupo__cant_unit").classList.remove("form_cant_unit");
                        document.getElementById("grupo__cant_unit").classList.add("form_cant_unit_disponible");
                        document.getElementById('cant_unit').value = data[0].cant_unit;
                    } else { document.getElementById("cant_unit").value = 0; }
                    if (data[i].peso_unit_kg != 0) {
                        document.getElementById('grupo__peso_unit_kg').classList.remove("form_peso_unit_kg");
                        document.getElementById('grupo__peso_unit_kg').classList.add("form_peso_unit_kg_disponible");
                        document.getElementById('peso_unit_kg').value = data[0].peso_unit_kg;
                    } else { document.getElementById('peso_unit_kg').value = 0 }
                    if (data[i].peso_total_kg != 0) {
                        document.getElementById('grupo__peso_total_kg').classList.remove("form_peso_total_kg");
                        document.getElementById('grupo__peso_total_kg').classList.add("form_peso_total_kg_disponible");
                        document.getElementById('peso_total_kg').value = data[0].peso_total_kg;
                    } else { document.getElementById('peso_total_kg').value = 0 }
                    if (data[i].largo_mts != 0) {
                        document.getElementById('grupo__largo_mts').classList.remove("form_largo_mts");
                        document.getElementById('grupo__largo_mts').classList.add("form_largo_mts_disponible");
                        document.getElementById('largo_mts').value = data[0].largo_mts;
                    } else { document.getElementById('largo_mts').value = 0 }
                    if (data[i].ancho_mts != 0) {
                        document.getElementById('grupo__ancho_mts').classList.remove("form_ancho_mts");
                        document.getElementById('grupo__ancho_mts').classList.add("form_ancho_mts_disponible");
                        document.getElementById('ancho_mts').value = data[0].ancho_mts;
                    } else { document.getElementById('ancho_mts').value = 0 }
                    if (data[i].alto_mts != 0) {
                        document.getElementById('grupo__alto_mts').classList.remove("form_alto_mts");
                        document.getElementById('grupo__alto_mts').classList.add("form_alto_mts_disponible");
                        document.getElementById('alto_mts').value = data[0].alto_mts;
                    } else { document.getElementById('alto_mts').value = 0 }
                    if (data[i].peso_unit_tn != 0) {
                        document.getElementById('grupo__peso_unit_tn').classList.remove("form_peso_unit_tn");
                        document.getElementById('grupo__peso_unit_tn').classList.add("form_peso_unit_tn_disponible");
                        document.getElementById('peso_unit_tn').value = data[0].peso_unit_tn;
                    } else { document.getElementById('peso_unit_tn').value = 0 }
                    if (data[i].peso_total_tn != 0) {
                        document.getElementById('grupo__peso_total_tn').classList.remove("form_peso_total_tn");
                        document.getElementById('grupo__peso_total_tn').classList.add("form_peso_total_tn_disponible");
                        document.getElementById('peso_total_tn').value = data[0].peso_total_tn;
                    } else { document.getElementById('peso_total_tn').value = 0 }
                    if (data[i].cant_litros != 0) {
                        document.getElementById('grupo__cant_litros').classList.remove("form_cant_litros");
                        document.getElementById('grupo__cant_litros').classList.add("form_cant_litros_disponible");
                        document.getElementById('cant_litros').value = data[0].cant_litros;
                    } else { document.getElementById('cant_litros').value = 0 }
                }
                inputs.forEach((input) => {
                    input.disabled = true;
                });

                if (tpo_usuario == '1') {
                    btnEdit.classList.add("btn_edit_carga_oculto");
                    btnCancel.classList.add("btn_cancel_carga_oculto");
                    btnSave.classList.add("btn_save_carga_oculto");
                    btnDelete.classList.add("btn_delete_carga_oculto");
                    btnCalculaValor.classList.add("btn_calcular_valor_oculto");

                    if (data[0].valor_carga <= 30000) {
                        let valor_reducido = data[0].valor_carga * 0.90;
                        document.getElementById('valor_carga_en_pesos').value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                    } else if (data[0].valor_carga <= 60000) {
                        let valor_reducido = data[0].valor_carga * 0.93;
                        document.getElementById('valor_carga_en_pesos').value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                    } else if (data[0].valor_carga <= 100000) {
                        let valor_reducido = data[0].valor_carga * 0.95;
                        document.getElementById('valor_carga_en_pesos').value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                    } else {
                        let valor_reducido = data[0].valor_carga * 0.97;
                        document.getElementById('valor_carga_en_pesos').value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                    }



                    //Validación para ver si el Transportista no tiene viajes que le coincidan con la fecha de salida de esta nueva carga
                    fetch(`http://localhost:3000/getUserRequest/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            /*Recorre solicitudes, ésta cuenta si tiene estado Solicitada o Aceptada, caso contrario se le permite al Transportista solicitar. 
                            Sino, se fija si la fecha de retiro de la carga que quiere solicitar coincide con alguna fecha de llegada de alguna de las solicitudes que tiene en estado 1 o 2.*/
                            data.forEach(async res => {
                                if (res.cod_estado_solicitud == 1 || res.cod_estado_solicitud == 2) {
                                    for (let i = 0, tieneViaje = false; i < data.length && tieneViaje === false; i++) {
                                        //console.log("i", i, "tieneViaje", tieneViaje);
                                        await fetch(`http://localhost:3000/getOneCargaUser/${data[i].cod_carga}`, {
                                                method: 'GET',
                                            }).then(res => res.json())
                                            .then(data => {
                                                console.log(data);
                                                let date_destino = new Date(data[0].fec_destino),
                                                    date_origen = new Date(data[0].fec_retiro);
                                                if ((nuevo_retiro < date_origen && nuevo_destino > date_origen) || (nuevo_retiro < date_destino && nuevo_destino > date_destino)) {
                                                    tieneViaje = true;
                                                    btnRequest.classList.add("btn_request_carga_oculto");
                                                    let h5 = document.createElement('h5');
                                                    h5.setAttribute("style", "color:#dc3545")
                                                    h5.innerHTML = `¡Usted no puede solicitar esta carga debido a que ya tiene un viaje programado para esa fecha!`; // ${date_origen.toLocaleDateString()} hasta ${date_destino.toLocaleDateString()} cargas solicitadas para esta fecha salida
                                                    document.querySelector(".form__grupo-btn-agregar-carga").appendChild(h5);
                                                }
                                            })
                                            .catch(err => { console.log(err); })
                                    }
                                }
                            })
                        })
                        .catch(err => { console.log(err); })

                    //Botón Solicitar
                    btnRequest.addEventListener('click', (event) => {
                        event.preventDefault();

                        var today = new Date(),
                            day = today.getDate(),
                            month = today.getMonth() + 1,
                            year = today.getFullYear();

                        let p = document.querySelector('.parrafo_informacion'),
                            modalUsuario = document.getElementById('cod_usuario_modal'),
                            modalEstadoSolicitud = document.getElementById('cod_estado_solicitud_modal'),
                            modalCarga = document.getElementById('cod_carga_modal'),
                            modalFecSolicitud = document.getElementById('fec_solicitud_modal'),
                            cambioEstado = document.getElementById('fec_estado'),
                            option = document.getElementById(`option_tipo_prod_${tipo_producto}`),
                            formRequest = document.getElementById('formulario_request'),
                            fecha_retiro = new Date(data[0].fec_retiro),
                            fecha_destino = new Date(data[0].fec_destino);

                        p.innerHTML = `<b>Origen: </b> ${data[0].origen} - ${fecha_retiro.toLocaleDateString()}<br>
                                                    <b>Destino: </b> ${data[0].destino} - ${fecha_destino.toLocaleDateString()} <br>
                                                    <b>Carga: </b> ${option.text}`

                        modalUsuario.value = cod_usuario;
                        modalEstadoSolicitud.value = "1";
                        modalCarga.value = data[0].cod_carga;
                        //Tuve que ponerlo así porque lo meses de un dígito van con cero adelante
                        if (`${month}`.length > 1 && `${day}`.length > 1) {
                            modalFecSolicitud.value = `${year}-${month}-${day}`;
                            cambioEstado.value = `${year}-${month}-${day}`;
                        } else if (`${month}`.length == 1 && `${day}`.length == 1) {
                            modalFecSolicitud.value = `${year}-0${month}-0${day}`;
                            cambioEstado.value = `${year}-0${month}-0${day}`;
                        } else if (`${month}`.length == 1) {
                            modalFecSolicitud.value = `${year}-0${month}-${day}`;
                            cambioEstado.value = `${year}-0${month}-${day}`;
                        } else if (`${day}`.length == 1) {
                            modalFecSolicitud.value = `${year}-${month}-0${day}`;
                            cambioEstado.value = `${year}-${month}-0${day}`;
                        }

                        fetch(`http://localhost:3000/getTrucksUser/${cod_usuario}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                //console.log(data);
                                let select = document.getElementById('selectCamion_modal');

                                for (let i in data) {
                                    if (data[i].eliminado != true) {
                                        let option = document.createElement('option');
                                        option.setAttribute('id', `option_camion_${i}`);
                                        option.setAttribute('value', `${data[i].patente_camion}`)
                                        option.innerHTML = `${data[i].patente_camion}`;
                                        select.appendChild(option);
                                    }
                                }

                                select.addEventListener("change", (event) => {
                                    event.preventDefault();
                                    //El select.value representa la patente que es enviada al sevidor... my_truck/:patente
                                    //Pero no usa el value del option, como defini arriba el value
                                    fetch(`http://localhost:3000/my_truck/${select.value}`, {
                                            method: 'GET',
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            // console.log(data[0])
                                            let parrafo_informacion = document.querySelector(".info_camion");
                                            parrafo_informacion.innerHTML = `<b>Marca: </b> ${data[0].marca} <br>
                                                                                        <b>Modelo: </b>${data[0].modelo} <br>
                                                                                        <b>Año: </b> ${data[0].anio}`;

                                            fetch(`http://localhost:3000/getOneTypeTruck/${data[0].cod_tipo_camion}`, {
                                                    method: 'GET',
                                                })
                                                .then(res => res.json())
                                                .then(data => {
                                                    //console.log(data[0])
                                                    let parr = document.querySelector(".info_tipo_camion");
                                                    parr.innerHTML = `<b>Descripción: </b> ${data[0].descripcion}`;
                                                })
                                                .catch(err => { console.log(err); })


                                        })
                                        .catch(err => { console.log(err); })

                                })
                            })
                            .catch(err => { console.log(err); })


                        fetch(`http://localhost:3000/getCarroceriasUser/${cod_usuario}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                //console.log(data);
                                let select = document.getElementById('selectCarroceria_modal');

                                for (let i in data) {
                                    if (data[i].eliminado != true) {
                                        let option = document.createElement('option');
                                        option.setAttribute('id', `option_carroceria_${i}`);
                                        option.setAttribute('value', `${data[i].patente_carroceria}`)
                                        option.innerHTML = `${data[i].patente_carroceria}`;
                                        select.appendChild(option);
                                    }
                                }

                                select.addEventListener("change", () => {
                                    fetch(`http://localhost:3000/mi_carroceria/${select.value}`, {
                                            method: 'GET',
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            //console.log(data[0])
                                            let parrafo_informacion = document.querySelector(".info_carroceria");
                                            parrafo_informacion.innerHTML = `<b>Cant. Ejes: </b> ${data[0].cant_ejes} <br>                                                                     
                                                                                        <b>Año: </b> ${data[0].anio}`;

                                            fetch(`http://localhost:3000/getOneTipoCarroceria/${data[0].cod_tipo_carroceria}`, {
                                                    method: 'GET',
                                                })
                                                .then(res => res.json())
                                                .then(data => {
                                                    //   console.log(data[0])
                                                    let parr = document.querySelector(".info_tipo_carroceria");
                                                    parr.innerHTML = `<b>Descripción: </b> ${data[0].descripcion}`;
                                                })
                                                .catch(err => { console.log(err); })


                                        })
                                        .catch(err => { console.log(err); })

                                })
                            })
                            .catch(err => { console.log(err); })

                        formRequest.addEventListener('submit', (event) => {
                            event.preventDefault();

                            fetch(`http://localhost:3000/dashboard/${cod_usuario}`, {
                                    method: 'GET',
                                })
                                .then(res => res.json())
                                .then(data => {
                                    //console.log(data[0])
                                    let datos_transpor = Object.values(data[0]);

                                    //Si no incluye nulos saca el cartel. 
                                    if (datos_transpor.includes(null)) {
                                        document.getElementById("form__mensaje_error_solicitar_carga").classList.add("form__mensaje_error_activo");
                                        setTimeout(() => {
                                            document.getElementById("form__mensaje_error_solicitar_carga").classList.remove("form__mensaje_error_activo");
                                        }, 3000);
                                    } else {

                                        let selectCamion = document.getElementById('selectCamion_modal'),
                                            selectCarroceria = document.getElementById('selectCarroceria_modal');

                                        if (selectCamion.value != 99 && selectCarroceria.value != 99) {

                                            let registroFormData = new FormData(formRequest),
                                                estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '2' };

                                            fetch(`http://localhost:3000/updateEstadoCarga/`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify(estadoCarga),
                                                })
                                                .catch(err => { console.log(err); })

                                            fetch('http://localhost:3000/confirm_request/', {
                                                    method: 'POST',
                                                    body: registroFormData,
                                                })
                                                .catch(err => { console.log(err); })

                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: '¡Solicitud Enviada!',
                                                showConfirmButton: false,
                                                timer: 2500
                                            })

                                            setTimeout(() => {
                                                javascript: history.back();
                                            }, 2500);
                                        } else {
                                            document.getElementById('form__mensaje_error_request_freight').classList.add('form__mensaje_error_activo')
                                            setTimeout(() => {
                                                document.getElementById('form__mensaje_error_request_freight').classList.remove('form__mensaje_error_activo')
                                            }, 3500);
                                        }
                                    }
                                })



                        })

                    });

                } else if (tpo_usuario == '2') {
                    {
                        btnRequest.classList.add("btn_request_carga_oculto");
                    }

                    document.getElementById('peso_total_kg').addEventListener('change', (event) => {
                        event.preventDefault();
                        alert("Ha modificado el peso, deberá recalcular el valor del flete de la Carga");
                        document.getElementById('valor_carga').value = "";
                    })
                    document.getElementById('peso_total_tn').addEventListener('change', (event) => {
                        event.preventDefault();
                        alert("Ha modificado el peso, deberá recalcular el valor del flete de la Carga");
                        document.getElementById('valor_carga').value = "";
                    })
                    document.getElementById('cant_litros').addEventListener('change', (event) => {
                        event.preventDefault();
                        alert("Ha modificado los litros, deberá recalcular el valor del flete de la Carga");
                        document.getElementById('valor_carga').value = "";
                    })



                    //Botón Editar
                    btnEdit.addEventListener('click', (event) => {
                        event.preventDefault();
                        if (data[0].cod_estado_carga != 1) {
                            Swal.fire({
                                title: '¡Esta Carga ya se encuentra Solicitada y/o Asignada y NO puede editarla!',
                                icon: 'error',
                                allowOutsideClick: false,

                            })

                        } else {

                            const inputs = document.querySelectorAll('#form_freight input');
                            inputs.forEach((input) => {
                                /*  if (input.type == "checkbox" && input.checked == true) {
                                     input.disabled = false;

                                 } */
                                input.disabled = false;
                            });
                            /* document.getElementById('req_refrigeracion').value = false;
                            document.getElementById('es_carga_peligrosa').value = false;
                            document.getElementById('es_carga_apilable').value = false; */
                            document.getElementById('selectTipoProducto').disabled = false;
                            document.getElementById('fec_destino').disabled = true;
                            document.getElementById('valor_carga_en_pesos').disabled = true;
                            btnSave.disabled = false;
                            btnEdit.disabled = true;
                            btnCalculaValor.disabled = false;
                        }
                    });

                    //Botón Cancelar
                    btnCancel.addEventListener('click', (event) => {
                        event.preventDefault();
                        const inputs = document.querySelectorAll('#form_freight input');

                        inputs.forEach((input) => {
                            input.disabled = true;
                        })
                        document.getElementById('selectTipoProducto').disabled = true;
                        btnSave.disabled = true;
                        btnEdit.disabled = false;
                        btnCalculaValor.disabled = true;
                    });

                    document.getElementById('req_refrigeracion').addEventListener("click", () => {
                        if (document.getElementById('req_refrigeracion').checked) {
                            document.getElementById('req_refrigeracion').value = true
                        } else {
                            document.getElementById('req_refrigeracion').value = false
                        }
                    })
                    document.getElementById('es_carga_peligrosa').addEventListener("click", () => {
                        if (document.getElementById('es_carga_peligrosa').checked) {
                            document.getElementById('es_carga_peligrosa').value = true
                        } else {
                            document.getElementById('es_carga_peligrosa').value = false
                        }
                    })
                    document.getElementById('es_carga_apilable').addEventListener("click", () => {
                        if (document.getElementById('es_carga_apilable').checked) {
                            document.getElementById('es_carga_apilable').value = true
                        } else {
                            document.getElementById('es_carga_apilable').value = false
                        }
                    })

                    // Guardar Cambios 
                    formEdicionCarga.addEventListener('submit', (event) => {
                        event.preventDefault();
                        let horaRetiro = document.getElementById("hora_retiro"),
                            fecRetiro = document.getElementById("fec_retiro"),
                            fecDestino = document.getElementById("fec_destino"),
                            receptor_carga = document.getElementById("receptor_carga"),
                            origen = document.getElementById("origen"),
                            destino = document.getElementById("destino"),
                            valor = document.getElementById("valor_carga");

                        if (origen.value == "") { campos.origen = false; } else { campos.origen = true; }
                        if (destino.value == "") { campos.destino = false; } else { campos.destino = true; }
                        if (horaRetiro.value == "") { campos.hora_retiro = false; } else { campos.hora_retiro = true; }
                        if (fecRetiro.value == "" && date > fecRetiro.value) { campos.fec_retiro = false; } else { campos.fec_retiro = true; }
                        if (fecDestino.value == "" && fecRetiro.value > fecDestino.value) { campos.fec_destino = false; } else { campos.fec_destino = true; }
                        if (receptor_carga.value == "") { campos.receptor_carga = false; } else { campos.receptor_carga = true; }
                        if (valor.value == "") { campos.valor_carga = false; } else { campos.valor_carga = true; }


                        valor.disabled = false;
                        fecDestino.disabled = false;

                        if (campos.origen && campos.destino && campos.domicilio_origen && campos.hora_retiro && campos.fec_retiro &&
                            campos.fec_destino && campos.domicilio_destino && campos.receptor_carga && campos.cant_unit &&
                            campos.peso_unit_kg && campos.peso_total_kg && campos.largo_mts && campos.ancho_mts &&
                            campos.alto_mts && campos.peso_unit_tn && campos.peso_total_tn && campos.cant_litros && campos.valor_carga) {

                            let registroFormData = new FormData(formEdicionCarga);

                            fetch('http://localhost:3000/update_carga', {
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
                                javascript: history.back()
                            }, 2500);

                        } else {
                            document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
                            setTimeout(() => {
                                document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
                            }, 4000);
                            setTimeout(() => {
                                valor.disabled = true;
                            }, 500);
                            setTimeout(() => {
                                fecDestino.disabled = true;
                            }, 500);
                        }

                    })

                    //Botón Eliminar
                    btnDelete.addEventListener("click", (event) => {
                        event.preventDefault();

                        if (data[0].cod_estado_carga == 3) {
                            Swal.fire({
                                title: '¡Esta Carga ya se encuentra Asignada y NO puede eliminarla. Por favor, comuniquese con el Servicio de Atención al Cliente de DMO Cargas (0800-444-7878) si desea cancelar el retiro de la misma!',
                                icon: 'error',
                                allowOutsideClick: false,
                            })

                        } else {
                            Swal.fire({
                                    title: '¿Está seguro que desea eliminar esta Carga?',
                                    icon: 'warning',
                                    showDenyButton: false,
                                    showConfirmButton: true,
                                    showCancelButton: true,
                                    confirmButtonText: `Confirmar`,
                                    cancelButtonText: 'Cancelar',
                                    reverseButtons: true,
                                    allowOutsideClick: false,

                                })
                                .then((result) => {

                                    if (result.isConfirmed) {
                                        fetch(`http://localhost:3000/delete_carga/${data[0].cod_carga}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(data[0])
                                            })
                                            .catch(err => { console.log(err); })
                                        Swal.fire({
                                            title: 'La Carga ha sido eliminado',
                                            icon: 'success',
                                            showConfirmButton: false,
                                            timer: 2000
                                        })

                                        setTimeout(() => {
                                            javascript: history.back()
                                        }, 2000);
                                    }
                                })
                                .catch(err => { console.log(err); })
                        }
                    });


                }

            })
            .catch(err => { console.log(err); })

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