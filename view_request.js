'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        tpo_usuario = getURL.get('tpo_usuario'),
        cod_solicitud = getURL.get('request'),
        cod_carga = getURL.get('cod_carga');

    var initialized_session = 'false';
    initialized_session = sessionStorage.getItem("initialized_session");

    //const jsPDF = require('jspdf');
    if (initialized_session == 'true') {
        let btn_back = document.querySelector(".parr_volver");

        fetch(`http://localhost:3000/getOneSolicitud/${cod_solicitud}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {

                console.log(data[0]);
                let btn_avanzar = document.getElementById('btn_avanzar_request'),
                    divMyRequest = document.getElementById('my_request'),
                    divMyRequestCarga = document.getElementById('datos_carga'),
                    divMyRequestCamion = document.getElementById('datos_camion');

                data.forEach(res => {
                    let p_nro_orden = document.createElement('p'),
                        p_estado = document.createElement('p'),
                        p_fecha_solicitud = document.createElement('p'),
                        download_conformidad = document.createElement('a'),
                        download_files = document.createElement('a'),
                        fecha_solicitud = new Date(res.fec_solicitud);

                    p_nro_orden.innerHTML = `<b>Nro. Orden:</b> ${data[0].cod_solicitud}`;
                    download_files.innerHTML = 'Descargar Formulario de Retiro de Carga <i class="fa-solid fa-file-pdf"></i>'
                    download_conformidad.innerHTML = 'Descargar Formulario de Conformidad de Entrega de Carga <i class="fa-solid fa-file-pdf"></i>'

                    fetch(`http://localhost:3000/getTipoEstadoSolicitud/${res.cod_estado_solicitud}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            switch (data[0].cod_estado_solicitud) {
                                case 1:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-secondary">${data[0].descripcion}</span>`
                                    break;
                                case 2:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-success">${data[0].descripcion}</span> </br>`
                                        // p_estado.append(download_files);
                                    fetch(`http://localhost:3000/getNameFile/${cod_solicitud}`, {
                                            method: 'GET',
                                        }).then(res => res.json())
                                        .then(data => {
                                            console.log(data[0].form_retiro)
                                            fetch(`http://localhost:3000/downloadFile/${data[0].form_retiro}`, {
                                                    method: 'GET',
                                                }).then(res => res.blob())
                                                .then(data => {
                                                    download_files.href = URL.createObjectURL(data)
                                                    download_files.target = '_blank';
                                                    //download_files.download = `${data[0].form_retiro}`
                                                })
                                                .catch(err => { console.log(err); })
                                        })
                                        .catch(err => { console.log(err); })
                                    break;
                                case 3:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                    break;
                            }
                            if (tpo_usuario == '1' || data[0].cod_estado_solicitud != '1') {
                                btn_avanzar.classList.add('btn_avanzar_request_none');
                            }
                            if (tpo_usuario == '1' && data[0].cod_estado_solicitud == '2') {
                                p_estado.append(download_files);
                            }
                        })
                        .catch(err => { console.log(err); })

                    p_fecha_solicitud.innerHTML = `<b>Fecha Solicitud: </b> ${fecha_solicitud.toLocaleDateString()}`;

                    /* El nombre de getOneCargaUser puede confundir porque lo uso en el view_freigh para ver una carga de un 
                    usuario en específico, pero la carga al tener un id único está asignada a un usuario en específico, entonces
                    si yo mando el id de la carga me va a traer, dentro de los datos de la carga, si o si el usuario al que corresponde.
                    Da la casualidad que puedo usar esta ruta para traer la carga acá, en la solicitud.*/
                    fetch(`http://localhost:3000/getOneCargaUser/${data[0].cod_carga}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {

                            if (tpo_usuario == '2' && data[0].cod_estado_carga == 5) {
                                p_estado.append(download_conformidad);
                                fetch(`http://localhost:3000/getNameFile/${cod_solicitud}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        console.log("getNAmeFile", data[0].form_conformidad)
                                        fetch(`http://localhost:3000/downloadFile/${data[0].form_conformidad}`, {
                                                method: 'GET',
                                            }).then(res => res.blob())
                                            .then(data => {
                                                download_conformidad.href = URL.createObjectURL(data)
                                                download_conformidad.target = '_blank';
                                                //download_files.download = `${data[0].form_retiro}`
                                            })
                                            .catch(err => { console.log(err); })
                                    })
                                    .catch(err => { console.log(err); })
                            }


                            console.log(data[0])
                            let loc_origen,
                                loc_destino,
                                pcia_origen,
                                pcia_destino;

                            switch (data[0].origen.split(",").length) {
                                case 2:
                                    loc_origen = `${data[0].origen.split(",")[0]} (Capital)`;
                                    break;
                                case 3:
                                    pcia_origen = data[0].origen.split(",")[1];
                                    loc_origen = `${data[0].origen.split(",")[0]} (${pcia_origen.trim()})`;
                                    break;
                                case 4:
                                    pcia_origen = data[0].origen.split(",")[2];
                                    loc_origen = `${data[0].origen.split(",")[1]} (${pcia_origen.trim()})`
                                    break;
                            }

                            switch (data[0].destino.split(",").length) {
                                case 2:
                                    loc_destino = `${data[0].destino.split(",")[0]} (Capital)`;
                                    break;
                                case 3:
                                    pcia_destino = data[0].destino.split(",")[1];
                                    loc_destino = `${data[0].destino.split(",")[0]} (${pcia_destino.trim()})`;
                                    break;
                                case 4:
                                    pcia_destino = data[0].destino.split(",")[2];
                                    loc_destino = `${data[0].destino.split(",")[1]} (${pcia_destino.trim()})`
                                    break;
                            }

                            let h5 = document.createElement('h5'),
                                p_origen_destino = document.createElement('p'),
                                fecha_retiro = new Date(data[0].fec_retiro),
                                fecha_destino = new Date(data[0].fec_destino),
                                p_tipo_carga = document.createElement('p'),
                                p_tipo_producto = document.createElement('p'),
                                p_alto_mts = document.createElement('p'),
                                p_ancho_mts = document.createElement('p'),
                                p_cant_litros = document.createElement('p'),
                                p_cant_unit = document.createElement('p'),
                                p_largo_mts = document.createElement('p'),
                                p_peso_total_kg = document.createElement('p'),
                                p_peso_total_tn = document.createElement('p'),
                                p_peso_unit_kg = document.createElement('p'),
                                p_peso_unit_tn = document.createElement('p'),
                                p_req_refrigeracion = document.createElement('p'),
                                p_es_peligrosa = document.createElement('p'),
                                p_es_apilable = document.createElement('p');

                            h5.innerHTML = '<u>Datos de la Carga</u>';
                            let valor_en_pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data[0].valor_carga);
                            p_origen_destino.innerHTML = `<b>Origen: </b>${loc_origen} - <b>Fecha: </b> ${fecha_retiro.toLocaleDateString()} - ${data[0].hora_retiro} Hs</br>
                                            <b>Domicilio: </b>${data[0].domicilio_origen}</br>                                            
                                            <hr>
                                            <b>Destino: </b> ${loc_destino} - <b>Fecha: </b> ${fecha_destino.toLocaleDateString()} - ${data[0].hora_destino} Hs</br>
                                            <b>Domicilio: </b>${data[0].domicilio_destino} </br>
                                            <b>Receptor de Carga: </b> ${data[0].receptor_carga} </br>                                             
                                            <b>Comentario: </b> ${data[0].comentario} </br>
                                            <b>Distancia Aprox.: </b> ${data[0].distancia_recorrido} Km </br>
                                            <b>Valor Flete: </b> ${valor_en_pesos} <hr>`;

                            divMyRequestCarga.appendChild(h5);
                            divMyRequestCarga.appendChild(p_origen_destino);
                            fetch(`http://localhost:3000/getNameUser/${data[0].cod_usuario}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    let p_dador_carga = document.createElement('p');
                                    p_dador_carga.innerHTML = `<b>Dador de Carga: </b> ${data[0].razon_social}`;
                                    divMyRequest.appendChild(p_dador_carga);
                                })

                            fetch(`http://localhost:3000/getOneTipoCarga/${data[0].cod_tipo_carga}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    p_tipo_carga.innerHTML = `<b>Carga: </b> ${data[0].descripcion}`;
                                    p_tipo_carga.classList.add('info_request');
                                    divMyRequestCarga.appendChild(p_tipo_carga);
                                })

                            fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    p_tipo_producto.innerHTML = `<b>Producto: </b> ${data[0].descripcion}`;
                                    p_tipo_producto.classList.add('info_request');
                                    divMyRequestCarga.appendChild(p_tipo_producto);
                                })

                            if (data[0].req_refrigeracion != null) {
                                p_req_refrigeracion.innerHTML = `<b>Requiere Refrigeración: </b> SI`;
                                p_req_refrigeracion.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_req_refrigeracion)
                            }
                            if (data[0].es_carga_peligrosa != null) {
                                p_es_peligrosa.innerHTML = `<b>Carga Peligrosa: </b> SI`
                                p_es_peligrosa.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_es_peligrosa)
                            }
                            if (data[0].es_carga_apilable != null) {
                                p_es_apilable.innerHTML = `<b>Carga Apilable: </b> SI`
                                p_es_apilable.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_es_apilable)
                            }
                            if (data[0].cant_unit != 0) {
                                p_cant_unit.innerHTML = `<b>Cant. Unitaria: </b> ${data[0].cant_unit}`
                                p_cant_unit.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_cant_unit)
                            }
                            if (data[0].peso_unit_kg != 0) {
                                p_peso_unit_kg.innerHTML = `<b>Peso Unitario (Kg): </b> ${data[0].peso_unit_kg}`
                                p_peso_unit_kg.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_peso_unit_kg)
                            }
                            if (data[0].peso_total_kg != 0) {
                                p_peso_total_kg.innerHTML = `<b>Peso Total (Kg): </b> ${data[0].peso_total_kg}`
                                p_peso_total_kg.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_peso_total_kg)
                            }
                            if (data[0].alto_mts != 0) {
                                p_alto_mts.innerHTML = `<b>Altura (mts): </b> ${data[0].alto_mts}`
                                p_alto_mts.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_alto_mts)
                            }
                            if (data[0].ancho_mts != 0) {
                                p_ancho_mts.innerHTML = `<b>Ancho (mts): </b> ${data[0].ancho_mts}`
                                p_ancho_mts.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_ancho_mts)
                            }
                            if (data[0].largo_mts != 0) {
                                p_largo_mts.innerHTML = `<b>Alto (mts): </b> ${data[0].largo_mts}`
                                p_largo_mts.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_largo_mts)
                            }
                            if (data[0].peso_unit_tn != 0) {
                                p_peso_unit_tn.innerHTML = `<b>Peso Unitario (Tn): </b> ${data[0].peso_unit_tn}`
                                p_peso_unit_tn.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_peso_unit_tn)
                            }
                            if (data[0].peso_total_tn != 0) {
                                p_peso_total_tn.innerHTML = `<b>Peso Total (Tn): </b> ${data[0].peso_total_tn}`
                                p_peso_total_tn.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_peso_total_tn)
                            }
                            if (data[0].cant_litros) {
                                p_cant_litros.innerHTML = `<b>Cant. Litros: </b> ${data[0].cant_litros}`
                                p_cant_litros.classList.add('info_request');
                                divMyRequestCarga.appendChild(p_cant_litros)
                            }
                        })
                        .catch(err => { console.log(err); })

                    divMyRequest.appendChild(p_nro_orden);
                    divMyRequest.appendChild(p_estado);
                    divMyRequest.appendChild(p_fecha_solicitud);

                    let h5Camion = document.createElement('h5');
                    h5Camion.innerHTML = '<u>Datos del Camión y Carrocería</u>';
                    divMyRequestCamion.appendChild(h5Camion);
                    fetch(`http://localhost:3000/my_truck/${data[0].patente_camion}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            let p_info_camion = document.createElement('p');
                            p_info_camion.innerHTML = `<b>Patente Camión: </b>${data[0].patente_camion} </br>
                                                     <b>Marca: </b>${data[0].marca} - <b>Modelo: </b>${data[0].modelo} - <b>Año: </b>${data[0].anio}`;
                            divMyRequestCamion.appendChild(p_info_camion);
                            fetch(`http://localhost:3000/getOneTypeTruck/${data[0].cod_tipo_camion}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    let p_info_camion = document.createElement('p');
                                    p_info_camion.innerHTML = `<b>Tipo Camión: </b>${data[0].descripcion}`;
                                    divMyRequestCamion.appendChild(p_info_camion);
                                })
                                .catch(err => { console.log(err); })
                        })
                        .catch(err => { console.log(err); })

                    fetch(`http://localhost:3000/mi_carroceria/${data[0].patente_carroceria}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            let p_info_carroceria = document.createElement('p');
                            p_info_carroceria.innerHTML = `<b>Patente Carrocería: </b>${data[0].patente_carroceria} </br>
                                                        <b>Año: </b>${data[0].anio} - <b>Cant. Ejes: </b>${data[0].cant_ejes} </br>`;
                            divMyRequestCamion.appendChild(p_info_carroceria);
                            fetch(`http://localhost:3000/getOneTipoCarroceria/${data[0].cod_tipo_carroceria}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    let p_info_carroceria = document.createElement('p');
                                    p_info_carroceria.innerHTML = `<b>Tipo Carrocería: </b>${data[0].descripcion}`;
                                    divMyRequestCamion.appendChild(p_info_carroceria);
                                })
                                .catch(err => { console.log(err); })
                        })
                        .catch(err => { console.log(err); })

                    let docsTransportista = document.createElement('div');
                    let imgdocsTransportista = document.createElement('div');
                    let p_transp = document.createElement('p');
                    p_transp.innerHTML = '<b><u>Documentación:</u></b>'
                    docsTransportista.appendChild(p_transp);
                    fetch(`http://localhost:3000/my_profile/${data[0].cod_usuario_transp}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let p_chofer = document.createElement('p');
                            p_chofer.innerHTML = `<b>Conductor: </b> ${data[0].razon_social} </br>
                                                  <b>CUIT: </b>${data[0].cuit_cuil} </br>
                                                  <b>Tel.: </b>${data[0].nro_telefono} </br>
                                                  <b>Email: </b>${data[0].email} </br>`;
                            docsTransportista.appendChild(p_chofer);


                            fetch(`http://localhost:3000/downloadImg/${data[0].nom_img_lic_frente}`, {
                                    method: 'GET',
                                }).then(res => res.blob())
                                .then(img => {
                                    let docFrente = document.createElement('img');
                                    docFrente.classList.add('docs_transp');
                                    docFrente.alt = "Imagen Lic Frente";
                                    docFrente.src = URL.createObjectURL(img);
                                    imgdocsTransportista.appendChild(docFrente);
                                })
                                .catch(err => { console.log(err); })

                            fetch(`http://localhost:3000/downloadImg/${data[0].nom_img_lic_dorso}`, {
                                    method: 'GET',
                                }).then(res => res.blob())
                                .then(img => {
                                    let docDorso = document.createElement('img');
                                    docDorso.classList.add('docs_transp');
                                    docDorso.alt = "Imagen Lic Dorso";
                                    docDorso.src = URL.createObjectURL(img);
                                    imgdocsTransportista.appendChild(docDorso);
                                })
                                .catch(err => { console.log(err); })

                            fetch(`http://localhost:3000/downloadImg/${data[0].nom_img_curso}`, {
                                    method: 'GET',
                                }).then(res => res.blob())
                                .then(img => {
                                    let docCurso = document.createElement('img');
                                    docCurso.classList.add('docs_transp');
                                    docCurso.alt = "Imagen Curso";
                                    docCurso.src = URL.createObjectURL(img);
                                    imgdocsTransportista.appendChild(docCurso);
                                })
                                .catch(err => { console.log(err); })

                            docsTransportista.appendChild(imgdocsTransportista);
                            divMyRequestCamion.appendChild(docsTransportista);
                        })
                        .catch(err => { console.log(err); })
                });


                //Botón Aceptar Solicitud
                btn_avanzar.addEventListener('click', (event) => {
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = `./accept_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${cod_solicitud}&cod_carga=${cod_carga}`;
                    }, 3000);

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