const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    tpo_usuario = getURL.get('tpo_usuario'),
    cod_solicitud = getURL.get('request'),
    cod_carga = getURL.get('cod_carga');
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");
document.addEventListener('DOMContentLoaded', () => {
    if (initialized_session == 'true') {
        let btn_back = document.querySelector(".parr_volver");

        fetch(`http://localhost:3000/getOneSolicitud/${cod_solicitud}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data[0]);

                let btn_acept = document.getElementById('btn_acept_request'),
                    btn_decline = document.getElementById('btn_decline_request'),
                    divMyRequest = document.getElementById('my_request'),
                    divMyRequestCarga = document.getElementById('datos_carga'),
                    divMyRequestCamion = document.getElementById('datos_camion');

                data.forEach(res => {
                    let p_nro_orden = document.createElement('p'),
                        p_estado = document.createElement('p'),
                        p_fecha_solicitud = document.createElement('p'),
                        //download_files = document.createElement('p'),
                        download_files = document.createElement('a'),
                        fecha_solicitud = new Date(res.fec_solicitud);

                    p_nro_orden.innerHTML = `<b>Nro. Orden:</b> ${data[0].cod_solicitud}`;
                    download_files.innerHTML = 'Descargar Formulario de Retiro de Carga <i class="fa-solid fa-file-pdf"></i>'

                    /* fetch(`http://localhost:3000/getNameFile/${cod_solicitud}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data[0].nombre_archivo);
                            download_files.href = `http://localhost:5000/assets/files/${data[0].nombre_archivo}`
                            download_files.target = '_blank';
                            download_files.download = `${data[0].nombre_archivo}`
                        }) */
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
                                            console.log(data[0].nombre_archivo);
                                            download_files.href = `http://localhost:5000/assets/files/${data[0].nombre_archivo}`
                                            download_files.target = '_blank';
                                            download_files.download = `${data[0].nombre_archivo}`
                                        })
                                    break;
                                case 3:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                    break;
                            }
                            if (tpo_usuario == '1' || data[0].cod_estado_solicitud != '1') {
                                btn_acept.classList.add('btn_acept_request_none');
                                btn_decline.classList.add('btn_decline_request_none');
                            }
                            if (tpo_usuario == '1' && data[0].cod_estado_solicitud == '2') {
                                p_estado.append(download_files);
                            }
                        })
                    p_fecha_solicitud.innerHTML = `<b>Fecha Solicitud: </b> ${fecha_solicitud.toLocaleDateString()}`;

                    //Download files
                    /* download_files.addEventListener('click', (event) => {
                        event.preventDefault();
                        fetch(`http://localhost:3000/getNameFile/${cod_solicitud}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                console.log(data[0].nombre_archivo);
                                download_files.href = `http://localhost:5000/assets/files/${data[0].nombre_archivo}`
                                download_files.target = '_blank';
                                download_files.download = `${data[0].nombre_archivo}`
                                fetch(`http://localhost:3000/downloadFile/${data[0].nombre_archivo}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        console.log(data);
                                    })
                                    .catch(err => { console.log(err); })


                            })
                    }) */


                    /* El nombre de getOneCargaUser puede confundir porque lo uso en el view_freigh para ver una carga de un 
                    usuario en específico, pero la carga al tener un id único está asignada a un usuario en específico, entonces
                    si yo mando el id de la carga me va a traer, dentro de los datos de la carga, si o si el usuario al que corresponde.
                    Da la casualidad que puedo usar esta ruta para traer la carga acá, en la solicitud.*/
                    fetch(`http://localhost:3000/getOneCargaUser/${data[0].cod_carga}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {

                            console.log(data[0])

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
                            p_origen_destino.innerHTML = `<b>Origen: </b>${data[0].ciudad_origen} (${data[0].prov_origen}) - <b>Fecha: </b> ${fecha_retiro.toLocaleDateString()} - ${data[0].hora_retiro}</br>
                                            <b>Domicilio: </b>${data[0].domicilio_origen}</br>                                            
                                            <hr>
                                            <b>Destino: </b> ${data[0].ciudad_destino} (${data[0].prov_destino}) - <b>Fecha: </b> ${fecha_destino.toLocaleDateString()} - ${data[0].hora_destino}</br>
                                            <b>Domicilio: </b>${data[0].domicilio_destino} </br>
                                            <b>Receptor de Carga: </b> ${data[0].receptor_carga} </br>                                             
                                            <b>Comentario: </b> ${data[0].comentario}<hr>`;

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
                        })
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
                        })

                    fetch(`http://localhost:3000/getNameUser/${data[0].cod_usuario_transp}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            let p_chofer = document.createElement('p');
                            p_chofer.innerHTML = `<b>Conductor: </b> ${data[0].razon_social} </br>
                                                  <b>CUIT: </b>${data[0].cuit_cuil}`;
                            divMyRequestCamion.appendChild(p_chofer);
                        })
                });


                //Botón Aceptar Solicitud
                btn_acept.addEventListener('click', (event) => {
                    event.preventDefault();
                    const drop_area_request = document.querySelector(".drop-area-request"),
                        drag_text = drop_area_request.querySelector("h2"),
                        button_request = drop_area_request.querySelector("button"),
                        input_request = drop_area_request.querySelector("#input-file");
                    let filesUpload;


                    button_request.addEventListener('click', (event) => {
                        event.preventDefault();
                        input_request.click();
                    })

                    input_request.addEventListener('change', (event) => {
                        //Este no se si va, creo que es para archivos multiples. Ver despues
                        event.preventDefault();
                        /*  console.log(input_request.files);
                        const FD = new FormData();
                        for (let file in input_request.files) {
                            FD.append('files[]', input_request.files)
                        }
                        fetch(`http://localhost:3000/uploadFiles/`, {
                                method: 'POST',
                                body: FD
                            }).then(res => res.json())
                            .then(data => {
                                console.log(data);
                            })
                            .catch(err => { console.log(err); })
 */

                        filesUpload = input_request.files;
                        //files = this.files;
                        // console.log("valor", files);
                        drop_area_request.classList.add("active");
                        //files = event.dataTransfer.files;
                        showFiles(filesUpload);
                        drop_area_request.classList.remove("active");
                    })

                    function showFiles(files) {
                        console.log(files);
                        if (files == undefined) {
                            console.log("en undefined");
                            processFile(files);
                        } else {
                            for (const file of files) {
                                processFile(file)
                            }
                        }
                    }

                    function processFile(file) {
                        const docType = file.type;
                        console.log(docType);
                        const validExtensions = ["application/pdf"];

                        if (validExtensions.includes(docType)) {
                            console.log("es valido");
                            const fileReader = new FileReader(),
                                id = `file-${Math.random().toString(32).substring(7)}`;

                            fileReader.addEventListener('load', event => {
                                const fileURL = fileReader.result;
                                //console.log("fileURL", fileURL);
                                const p = `<p>${file.name}</p>`
                                const html = document.getElementById('preview');
                                html.innerHTML = html.innerHTML + p;

                            })

                            fileReader.readAsDataURL(file);
                            uploadFile(file, id)

                        } else {
                            const p = `<p><span class="failure">¡${file.name} tiene un formato NO válido!</span></p>`
                            const html = document.getElementById('preview');
                            html.innerHTML = html.innerHTML + p;
                            setTimeout(() => {
                                location.reload();
                            }, 2500);
                        }


                    }

                    async function uploadFile(file, id) {
                        const formData = new FormData();
                        console.log("id", id);
                        formData.append("file", file);

                        try {
                            const response = await fetch(`http://localhost:3000/uploadFiles/${cod_solicitud}`, {
                                method: "POST",
                                body: formData
                            })
                            const responseText = await response.text();
                            console.log(responseText);
                            const p = `<h5><span class="success">¡Archivo subido correctamente!</span></h5>`
                            const html = document.getElementById('preview');
                            html.innerHTML = html.innerHTML + p;
                            setTimeout(() => {
                                window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&cod_carga=${cod_carga}`;
                            }, 3000);
                            //document.querySelector(`#${id} .status-text`).innerHTML = `<span class="success">¡Archivo subido correctamente!</span>`
                        } catch (error) {
                            const p = `<h5><span class="failure">¡Ha ocurrido un error al subir el archivo!</span></h5>`
                            const html = document.getElementById('preview');
                            html.innerHTML = html.innerHTML + p;
                            setTimeout(() => {
                                location.reload();
                            }, 3000);
                            //document.querySelector(`#${id} .status-text`).innerHTML = `<span class="failure">¡Ha ocurrido un error al subir el archivo!</span>`
                        }
                    }

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
                    let estadoSolicitud = { codigo_carga: cod_carga, cod_estado_solicitud: '2', fec_cambio_estado: fecha_today },
                        estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '3' };

                    fetch(`http://localhost:3000/updateEstadoSolicitud/`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(estadoSolicitud),
                    });

                    fetch(`http://localhost:3000/updateEstadoCarga/`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(estadoCarga),
                    });

                })


                //Botón Rechazar Solicitud
                btn_decline.addEventListener('click', (event) => {
                    event.preventDefault()

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
                    let estadoSolicitud = { codigo_carga: cod_carga, cod_estado_solicitud: '3', fec_cambio_estado: fecha_today },
                        estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '1' };

                    fetch(`http://localhost:3000/updateEstadoSolicitud/`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(estadoSolicitud),
                    });

                    fetch(`http://localhost:3000/updateEstadoCarga/`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(estadoCarga),
                    });

                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '¡Solicitud Rechazada!',
                        showConfirmButton: false,
                        timer: 2500
                    })

                    setTimeout(() => {
                        javascript: history.back()
                    }, 3000);
                })
            })

        //Botón Volver
        btn_back.addEventListener('click', (event) => {
            event.preventDefault();
            javascript: history.back();
        })

    }
})