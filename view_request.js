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
                    divMyRequestCamion = document.getElementById('datos_camion'),
                    btnDeclineRequest = document.getElementById('btn_decline_request');

                data.forEach(res => {
                    let p_nro_orden = document.createElement('p'),
                        p_estado = document.createElement('p'),
                        p_fecha_solicitud = document.createElement('p'),
                        download_conformidad = document.createElement('a'),
                        download_files = document.createElement('a'),
                        fecha_solicitud = new Date(res.fec_solicitud),
                        fec_cambio_estado = new Date(res.fec_cambio_estado);

                    p_nro_orden.innerHTML = `<b>Nro. Orden:</b> ${data[0].cod_solicitud}`;
                    download_files.innerHTML = 'Descargar Formulario de Retiro de Carga <i class="fa-solid fa-file-pdf"></i>'
                    download_conformidad.innerHTML = 'Descargar Formulario de Conformidad de Entrega de Carga <i class="fa-solid fa-file-pdf"></i>'

                    //Estado Solicitud
                    fetch(`http://localhost:3000/getTipoEstadoSolicitud/${res.cod_estado_solicitud}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            switch (data[0].cod_estado_solicitud) {
                                case 1:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-secondary">${data[0].descripcion}</span> <b>${fec_cambio_estado.toLocaleDateString()}`
                                    break;
                                case 2:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-success">${data[0].descripcion}</span> <b>${fec_cambio_estado.toLocaleDateString()}</b></br>`
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
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-danger">${data[0].descripcion}</span> <b>${fec_cambio_estado.toLocaleDateString()}</b></br>`
                                    break;
                                case 4:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-dark">${data[0].descripcion}</span> <b>${fec_cambio_estado.toLocaleDateString()}</b></br>`
                                    break;
                                case 5:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-danger">${data[0].descripcion}</span> <b>${fec_cambio_estado.toLocaleDateString()}</b></br>`
                                    break;
                            }

                            if (tpo_usuario == '2' && data[0].cod_estado_solicitud != '1') {
                                btn_avanzar.classList.add('btn_avanzar_request_none');
                                btnDeclineRequest.classList.add('btn_decline_request_none');

                            }
                            if (tpo_usuario == '1') {
                                btn_avanzar.classList.add('btn_avanzar_request_none');
                                btnDeclineRequest.classList.add('btn_decline_request_none');
                                document.getElementById('btn_cancelar_request').classList.add("btn_cancelar_request_none")
                                document.getElementById('p_btn_cancelar_request').classList.add("p_btn_cancelar_request_none")

                            }
                            if (tpo_usuario == '1' && data[0].cod_estado_solicitud == '2') {
                                p_estado.append(download_files);
                            }
                            if (tpo_usuario == '2' && data[0].cod_estado_solicitud != '2') {
                                document.getElementById('btn_cancelar_request').classList.add("btn_cancelar_request_none")
                                document.getElementById('p_btn_cancelar_request').classList.add("p_btn_cancelar_request_none")
                            }

                        })
                        .catch(err => { console.log(err); })

                    p_fecha_solicitud.innerHTML = `<b>Fecha Solicitud: </b> ${fecha_solicitud.toLocaleDateString()}`;

                    /* El nombre de getOneCargaUser puede confundir porque lo uso en el view_freigh para ver una carga de un 
                    usuario en específico, pero la carga al tener un id único está asignada a un usuario en específico, entonces
                    si yo mando el id de la carga me va a traer, dentro de los datos de la carga, si o si el usuario al que corresponde.
                    Da la casualidad que puedo usar esta ruta para traer la carga acá, en la solicitud.*/

                    //Formulario de Conformidad
                    let cuerpo = document.getElementById("cuerpo_asunto"),
                        pie = document.getElementById("firma"),
                        today = new Date();
                    fetch(`http://localhost:3000/getOneCargaUser/${data[0].cod_carga}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);

                            if (tpo_usuario == '2' && (data[0].cod_estado_carga == 5 || data[0].cod_estado_carga == 6)) {
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
                                                document.getElementById('btn_cancelar_request').classList.add("btn_cancelar_request_none")
                                                document.getElementById('p_btn_cancelar_request').classList.add("p_btn_cancelar_request_none")
                                            })
                                            .catch(err => { console.log(err); })
                                    })
                                    .catch(err => { console.log(err); })
                            }
                            pie.value = `Documento emitido desde www.dmocargas.com.ar el ${today.toLocaleDateString()}. Firma: DMO - Cargas `;
                            cuerpo.innerHTML = `Yo, receptor de carga ${data[0].receptor_carga}, domiciliado en ${data[0].domicilio_destino} ${data[0].destino}, mediante el presente confirmo que acepto el estado de entrega de la Carga N° ${data[0].cod_carga}, el día ${data[0].fec_destino.substring(0, 10)}`


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

                            h5.innerHTML = `<u>Datos de la Carga - Cod. ${data[0].cod_carga}</u>`;
                            let valor_en_pesos = 0;

                            p_origen_destino.innerHTML = `<b>Origen: </b>${loc_origen} - <b>Fecha: </b> ${fecha_retiro.toLocaleDateString()} - ${data[0].hora_retiro} Hs</br>
                                            <b>Domicilio: </b>${data[0].domicilio_origen}</br>                                            
                                            <hr>
                                            <b>Destino: </b> ${loc_destino} - <b>Fecha: </b> ${fecha_destino.toLocaleDateString()}</br>
                                            <b>Domicilio: </b>${data[0].domicilio_destino} </br>
                                            <b>Receptor de Carga: </b> ${data[0].receptor_carga} </br>                                             
                                            <b>Comentario: </b> ${data[0].comentario} </br>
                                            <b>Distancia Aprox.: </b> ${data[0].distancia_recorrido} Km </br>`


                            if (tpo_usuario == '1') {
                                if (data[0].valor_carga <= 30000) {
                                    let valor_reducido = data[0].valor_carga * 0.90;
                                    valor_en_pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                                    p_origen_destino.innerHTML = p_origen_destino.innerHTML + `<b>Valor Flete: </b> ${valor_en_pesos} <hr>`;
                                } else if (data[0].valor_carga <= 60000) {
                                    let valor_reducido = data[0].valor_carga * 0.93;
                                    valor_en_pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                                    p_origen_destino.innerHTML = p_origen_destino.innerHTML + `<b>Valor Flete: </b> ${valor_en_pesos} <hr>`;
                                } else if (data[0].valor_carga <= 100000) {
                                    let valor_reducido = data[0].valor_carga * 0.95;
                                    valor_en_pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                                    p_origen_destino.innerHTML = p_origen_destino.innerHTML + `<b>Valor Flete: </b> ${valor_en_pesos} <hr>`;
                                } else {
                                    let valor_reducido = data[0].valor_carga * 0.97;
                                    valor_en_pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor_reducido);
                                    p_origen_destino.innerHTML = p_origen_destino.innerHTML + `<b>Valor Flete: </b> ${valor_en_pesos} <hr>`;
                                }

                                document.getElementById('form-conformidad-carga').classList.add("conformidad-carga-none")

                            } else {
                                valor_en_pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data[0].valor_carga);
                                p_origen_destino.innerHTML = p_origen_destino.innerHTML + `<b>Valor Flete: </b> ${valor_en_pesos} <hr>`;

                            }


                            divMyRequestCarga.appendChild(h5);
                            divMyRequestCarga.appendChild(p_origen_destino);

                            fetch(`http://localhost:3000/getNameUser/${data[0].cod_usuario}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    console.log(data);
                                    let p_dador_carga = document.createElement('p');
                                    p_dador_carga.innerHTML = `<b>Dador de Carga: </b> ${data[0].razon_social}`;
                                    cuerpo.value = cuerpo.value + ` Carga correspondiente a ${data[0].razon_social} - C.U.I.T: ${data[0].cuit_cuil}.`;
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

                    //Datos Camión
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

                    //Datos Carrocería
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

                    let docsTransportista = document.createElement('div'),
                        imgdocsTransportista = document.createElement('div'),
                        p_transp = document.createElement('p');
                    p_transp.innerHTML = '<b><u>Documentación:</u></b>'
                    docsTransportista.appendChild(p_transp);

                    //Datos Usuario Transportista.
                    fetch(`http://localhost:3000/my_profile/${data[0].cod_usuario_transp}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log("data", data);
                            let p_chofer = document.createElement('p');
                            p_chofer.innerHTML = `<b>Conductor: </b> ${data[0].razon_social} </br>
                                                  <b>CUIT: </b>${data[0].cuit_cuil} </br>
                                                  <b>Tel.: </b>${data[0].nro_telefono} </br>
                                                  <b>Email: </b>${data[0].email} </br>`;
                            docsTransportista.appendChild(p_chofer);
                            cuerpo.value = cuerpo.value + `. Transportada por el Sr/Sra. ${data[0].razon_social}, identificado/a con D.N.I./C.U.I.T N°. ${data[0].cuit_cuil}. `;


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

                //Generación PDF
                const id = `${Math.random().toString(32).substring(7)}`
                const generatePDF = (characterData) => {
                    window.jsPDF = window.jspdf.jsPDF;
                    const doc = new jsPDF()
                    doc.setFontSize(20);
                    doc.setFont("helvetica", "bold");
                    doc.text(characterData.asunto_retiro, 60, 30);
                    const docWidth = doc.internal.pageSize.getWidth();
                    const docHeight = doc.internal.pageSize.getHeight();
                    doc.line(0, 60, docWidth, 60);
                    doc.setFont("helvetica", "italic");
                    const splitDescription = doc.splitTextToSize(
                        characterData.cuerpo,
                        docWidth - 20
                    );
                    doc.text(splitDescription, 10, 80);
                    doc.setFontSize(20);
                    doc.setFont("helvetica", "bold");
                    doc.text(characterData.observaciones, 10, 150);
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bold");
                    doc.text(characterData.firma_receptor, 10, 200);
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bold");
                    doc.text(characterData.firma_dmo, 10, 250);

                    //doc.text(characterData.type.name, docWidth - 20, 45, { align: "right" });
                    //doc.line(0, docHeight - 60, docWidth, docHeight - 60);
                    doc.save(`Form_conformidad_${id}`);
                };

                const handleOnSubmitForm = (e) => {
                    e.preventDefault();
                    try {
                        const characterProperties = Array.from(e.target.querySelectorAll("[name]"));
                        const characterData = {};
                        //errorMessageContainer.classList.add("hidden");
                        for (let i = 0, j = characterProperties.length; i < j; i++) {
                            const field = characterProperties[i];
                            const attribute = field.getAttribute("name");
                            const value = field.value;
                            if (!field.value) {
                                throw new Error(`El campo ${attribute} está vacio!`);
                            }
                            characterData[attribute] = value;
                            if (attribute === "type") {
                                const option = field.querySelector(`[value=${value}]`);
                                characterData[attribute] = {
                                    name: option.innerHTML,
                                    image: option.dataset.imageUrl,
                                };
                            }
                        }
                        generatePDF(characterData);
                    } catch (err) {
                        console.log(err);
                        // errorMessageContainer.innerHTML = err.message;
                        //errorMessageContainer.classList.remove("hidden");
                    }
                };

                let form_conformidad = document.getElementById('form-conformidad-carga');

                form_conformidad.addEventListener("submit", handleOnSubmitForm);


                //Botón Cancelar Solicitud
                //En este caso, la solicitud ya esta asignada, y si tuviera otras, estarían rechazadas. Entonces pasaría a estar las demas rechazadas y esta cancelada.
                document.getElementById('btn_cancelar_request').addEventListener("click", (event) => {
                    event.preventDefault();
                    Swal.fire({
                            title: '¿Está seguro que desea Cancelar esta Solicitud?',
                            icon: 'warning',
                            showDenyButton: false,
                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmButtonText: `Confirmar`,
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            allowOutsideClick: false,

                        })
                        .then(async(result) => {
                            if (result.isConfirmed) {
                                var fecha_today = new Date(),
                                    today = new Date(),
                                    day = today.getDate(),
                                    month = today.getMonth() + 1,
                                    year = today.getFullYear();
                                if (`${month}`.length > 1 && `${day}`.length > 1) {
                                    fecha_today = `${year}-${month}-${day}`;
                                } else if (`${month}`.length == 1 && `${day}`.length == 1) {
                                    fecha_today = `${year}-0${month}-0${day}`;
                                } else if (`${month}`.length == 1) {
                                    fecha_today = `${year}-0${month}-${day}`;
                                } else if (`${day}`.length == 1) {
                                    fecha_today = `${year}-${month}-0${day}`;
                                }
                                let estadoSolicitud = { cod_solicitud: cod_solicitud, cod_estado_solicitud: '5', fec_cambio_estado: fecha_today },
                                    estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '1' };

                                fetch(`http://localhost:3000/updateEstadoSolicitud/`, {
                                        method: 'PUT',
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(estadoSolicitud),
                                    })
                                    .catch(err => { console.log(err); })




                                fetch(`http://localhost:3000/updateEstadoCarga/`, {
                                        method: 'PUT',
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(estadoCarga),
                                    })
                                    .catch(err => { console.log(err); })



                                Swal.fire({
                                    title: 'La Solicitud ha sido Cancelada',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 2000
                                })

                                setTimeout(() => {
                                    window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&cod_carga=${cod_carga}`;
                                }, 2000);



                            }
                        })

                })

                //Párrafo de "Cancelar Solcitud"
                document.getElementById('p_btn_cancelar_request').addEventListener("click", (event) => {
                    event.preventDefault();
                    Swal.fire({
                        icon: 'info',
                        text: 'Fue pensado para que usted pueda Cancelar la Solicitud cuando el Transportista no vaya a retirar la carga, ya sea con previo aviso, o no y usted ya haya aceptado esa solicitud. De este modo, puede devolver a la carga su estado de "Publicada" para que otros Transportistas la puedan visualizar a la hora de buscar. Si así usted lo desea. POR EL PAGO POR EL FLETE, por favor, comunicarse con DMO-Cargas para la devolución del dinero.',
                        showDenyButton: false,
                        allowOutsideClick: false,

                    })

                })


                //Botón Aceptar Solicitud
                btn_avanzar.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.location.href = `./accept_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${cod_solicitud}&cod_carga=${cod_carga}`;
                })

                //Botón Rechazar
                btnDeclineRequest.addEventListener("click", (event) => {
                    event.preventDefault();
                    Swal.fire({
                            title: '¿Está seguro que desea rechazar esta Solicitud?',
                            icon: 'warning',
                            showDenyButton: false,
                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmButtonText: `Confirmar`,
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            allowOutsideClick: false,

                        })
                        .then(async(result) => {

                            if (result.isConfirmed) {
                                var fecha_today = new Date(),
                                    today = new Date(),
                                    day = today.getDate(),
                                    month = today.getMonth() + 1,
                                    year = today.getFullYear();
                                if (`${month}`.length > 1 && `${day}`.length > 1) {
                                    fecha_today = `${year}-${month}-${day}`;
                                } else if (`${month}`.length == 1 && `${day}`.length == 1) {
                                    fecha_today = `${year}-0${month}-0${day}`;
                                } else if (`${month}`.length == 1) {
                                    fecha_today = `${year}-0${month}-${day}`;
                                } else if (`${day}`.length == 1) {
                                    fecha_today = `${year}-${month}-0${day}`;
                                }
                                let estadoSolicitud = { cod_solicitud: cod_solicitud, cod_estado_solicitud: '3', fec_cambio_estado: fecha_today },
                                    estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '1' };

                                let updateSolicitud = await fetch(`http://localhost:3000/updateEstadoSolicitud/`, {
                                        method: 'PUT',
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(estadoSolicitud),
                                    }).then(data => {
                                        return true;
                                    })
                                    .catch(err => { console.log(err); })

                                //consultar si tiene al menos una solicitud con estado <> 3
                                if (updateSolicitud == true) {
                                    fetch(`http://localhost:3000/getFreightsRequest/${cod_carga}`, {
                                            method: 'GET',
                                        }).then(res => res.json())
                                        .then(data => {
                                            console.log("getFreightsRequest", data);
                                            let cant_solicitudes = 0;
                                            data.forEach(res => {
                                                    if (res.cod_estado_solicitud != 3) {
                                                        cant_solicitudes = cant_solicitudes + 1;
                                                    }
                                                })
                                                //console.log("cant_solicitudes", cant_solicitudes);

                                            if (cant_solicitudes == 0) {
                                                fetch(`http://localhost:3000/updateEstadoCarga/`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify(estadoCarga),
                                                    })
                                                    .catch(err => { console.log(err); })
                                            }
                                        })

                                    Swal.fire({
                                        title: 'La Solicitud ha sido Rechazada',
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 2000
                                    })

                                    setTimeout(() => {
                                        window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&cod_carga=${cod_carga}`;
                                    }, 2000);


                                }
                            }




                        })
                        .catch(err => { console.log(err); })
                });


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