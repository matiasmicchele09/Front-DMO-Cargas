'use strict'
document.addEventListener('DOMContentLoaded', () => {
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        tpo_usuario = getURL.get('tpo_usuario'),
        cod_carga = getURL.get('cod_carga');
    const tableBodyRequest = document.querySelector(".t_body_solicitudes");

    let btn_dashboard = document.querySelector(".a-dashboard"),
        btn_mis_camiones = document.querySelector(".a-mis-camiones"),
        btn_buscar_carga = document.querySelector(".a-buscar-cargas"),
        btn_my_request = document.querySelector(".a-mis-solicitudes"),
        btn_documents = document.querySelector(".a-documentos-dc"),
        btn_mis_cargas = document.querySelector(".a-mis-cargas"),
        btn_mi_perfil = document.querySelector(".a-perfil"),
        btn_logOut = document.querySelector(".btn-salir"),
        cod_soli,
        carga;
    var initialized_session = 'false';

    initialized_session = sessionStorage.getItem("initialized_session");
    if (initialized_session == 'true') {

        fetch(`http://localhost:3000/getNameUser/${cod_usuario}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                if (tpo_usuario == 1) { btn_mi_perfil.innerHTML = `${data[0].razon_social} <b>(Transportista)</b>`; } else { btn_mi_perfil.innerHTML = `${data[0].razon_social} <b>(Dador Carga)</b>`; }
            })
            .catch(err => { console.log(err); })

        if (tpo_usuario == '1') {

            let nav_mis_cargas = document.querySelector(".nav-mis-cargas");
            nav_mis_cargas.classList.add("nav-mis-cargas-none");

            const drop_area_request = document.querySelector(".drop-area-fin-viaje"),
                drag_text = drop_area_request.querySelector("h2"),
                button_request = drop_area_request.querySelector("button"),
                input_request = drop_area_request.querySelector("#input-file");
            let filesUpload,
                archivo;


            button_request.addEventListener('click', (event) => {
                event.preventDefault();
                input_request.click();
            })

            input_request.addEventListener('change', (event) => {
                //Este no se si va, creo que es para archivos multiples. Ver despues
                event.preventDefault();
                filesUpload = input_request.files;
                drop_area_request.classList.add("active");
                showFiles(filesUpload);
                drop_area_request.classList.remove("active");
            })

            function showFiles(filesUpload) {
                if (filesUpload == undefined) {
                    console.log("en undefined");
                    //processFile(filesUpload);
                } else {
                    for (const file of filesUpload) {
                        processFile(file)
                    }
                }
            }

            function processFile(file) {
                archivo = file;
                const docType = file.type;
                console.log(docType);
                const validExtensions = ["image/jpeg", "image/png", "image/jpg"];

                let p = document.getElementById('nom_archivo');
                if (validExtensions.includes(docType)) {
                    const fileReader = new FileReader();
                    fileReader.addEventListener('load', event => {
                        event.preventDefault()
                        const fileURL = fileReader.result;
                        p.innerHTML = `${file.name}`
                        const html = document.getElementById('preview');
                        //html.innerHTML = html.innerHTML + p;
                        //html.appendChild(p);

                    })
                    fileReader.readAsDataURL(file);
                    // uploadFile(file)

                } else {
                    const p = `<p><span class="failure">¡${file.name} tiene un formato NO válido!</span></p>`
                    const html = document.getElementById('preview');
                    html.innerHTML = html.innerHTML + p;
                }


            }

            async function uploadFile(file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await fetch('http://localhost:3000/uploadFiles', {
                            method: "POST",
                            body: formData
                        })
                        .catch(err => { console.log(err); })
                    const responseText = await response.text();
                    console.log(responseText);
                    const p = `<h5><span class="success">¡Archivo subido correctamente!</span></h5>`
                    const html = document.getElementById('preview');
                    html.innerHTML = html.innerHTML + p;

                } catch (error) {
                    console.log(error);
                    const p = `<h5><span class="failure">¡Ha ocurrido un error al subir el archivo!</span></h5>`
                    const html = document.getElementById('preview');
                    html.innerHTML = html.innerHTML + p;
                }
            }


            fetch(`http://localhost:3000/getUserRequest/${cod_usuario}`, {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.length == 0) {
                        document.getElementById('no_cargas').innerHTML = "<b>Usted no ha realizado ninguna Solicitud</b>"
                    }

                    data.forEach(res => {

                        var tableRow = document.createElement('tr'),
                            tableData1 = document.createElement('td'),
                            tableData2 = document.createElement('td'),
                            tableData3 = document.createElement('td'),
                            tableData4 = document.createElement('td'),
                            //  tableData5 = document.createElement('td'),
                            tableData6 = document.createElement('td'),
                            tableData7 = document.createElement('td'),
                            btnEntregada = document.createElement('button'),
                            btnCancelarRequest = document.createElement('button'),
                            btnMas = document.createElement('button'),
                            fecha_solicitud = new Date(res.fec_solicitud);
                        btnMas.classList.add("btn_mas_carga");
                        btnMas.innerHTML = 'Ver más';

                        tableData3.innerHTML = `${fecha_solicitud.toLocaleDateString()}`;

                        fetch(`http://localhost:3000/getTipoEstadoSolicitud/${res.cod_estado_solicitud}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                console.log(data);
                                switch (data[0].cod_estado_solicitud) {
                                    case 1:
                                        tableData4.innerHTML = `<span class="badge text-bg-secondary">${data[0].descripcion}</span>`
                                        btnCancelarRequest.innerHTML = 'Cancelar Solicitud';
                                        btnCancelarRequest.classList.add("btn_cancel_request");
                                        btnCancelarRequest.setAttribute("id", `${res.cod_solicitud}-${res.cod_carga}-${data[0].cod_estado_solicitud}`);
                                        tableData7.appendChild(btnCancelarRequest);
                                        break;
                                    case 2:
                                        tableData4.innerHTML = `<span class="badge text-bg-success">${data[0].descripcion}</span>`
                                        btnCancelarRequest.innerHTML = 'Cancelar Solicitud';
                                        btnCancelarRequest.classList.add("btn_cancel_request");
                                        btnCancelarRequest.setAttribute("id", `${res.cod_solicitud}-${res.cod_carga}-${data[0].cod_estado_solicitud}`);
                                        tableData7.appendChild(btnCancelarRequest);

                                        break;
                                    case 3:
                                        tableData4.innerHTML = `<span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                        tableData7.remove(btnEntregada);
                                        tableData7.remove(btnCancelarRequest);
                                        break;
                                    case 4:
                                        tableData4.innerHTML = `<span class="badge text-bg-dark">${data[0].descripcion}</span>`
                                        tableData7.remove(btnCancelarRequest);
                                        break;
                                    case 5:
                                        tableData4.innerHTML = `<span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                        tableData7.remove(btnCancelarRequest);
                                        break;
                                }
                            })
                            .catch(err => { console.log(err); })

                        //tableData1.innerHTML = `${res.cod_solicitud} - ${data[0].descripcion}`;
                        fetch(`http://localhost:3000/getOneCargaUser/${res.cod_carga}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        tableData1.innerHTML = `${res.cod_solicitud} - ${data[0].descripcion}`;
                                        //tableData2.innerHTML = data[0].descripcion;
                                    })
                                    .catch(err => { console.log(err); })
                                fetch(`http://localhost:3000/getOneTipoEstado/${data[0].cod_estado_carga}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        switch (data[0].cod_estado_carga) {
                                            case 4:
                                                btnEntregada.innerHTML = 'Entregar Carga';
                                                btnEntregada.classList.add("btn_entregar_carga");
                                                btnEntregada.setAttribute("data-bs-toggle", "modal");
                                                btnEntregada.setAttribute("data-bs-target", "#finalizarCarga");
                                                btnEntregada.setAttribute("id", `${res.cod_solicitud}-${res.cod_carga}`);
                                                tableData7.appendChild(btnEntregada);
                                                tableData7.remove(btnCancelarRequest);
                                                break;
                                            case 5:
                                                tableData7.remove(btnCancelarRequest);
                                                break;
                                        }
                                        console.log(data);
                                    }).catch(err => { console.log(err); })



                            })
                            .catch(err => { console.log(err); })

                        tableData6.appendChild(btnMas);
                        tableData6.classList.add('btn_vermas');
                        tableData7.classList.add('btn_cancel');


                        tableRow.appendChild(tableData1);
                        //tableRow.appendChild(tableData2);
                        tableRow.appendChild(tableData3);
                        tableRow.appendChild(tableData4);
                        // tableRow.appendChild(tableData5);
                        tableRow.appendChild(tableData6);
                        tableRow.appendChild(tableData7);
                        tableBodyRequest.appendChild(tableRow);

                        //Botón Ver Más
                        btnMas.addEventListener('click', (event) => {
                            event.preventDefault();
                            window.location.href = `./view_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${res.cod_solicitud}&cod_carga=${res.cod_carga}`;
                        });

                        //Botón Cancelar Solicitud
                        btnCancelarRequest.addEventListener('click', (event) => {
                            event.preventDefault();
                            let id_request = btnCancelarRequest.getAttribute("id").split("-")

                            Swal.fire({
                                    title: 'Cancelar Solicitud',
                                    text: '¿Está seguro que desea cancelar esta solicitud? !Luego no podrá volver a solicitarla!',
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
                                        let fecha_today = new Date(),
                                            estadoCarga = { codigo_carga: id_request[1], cod_estado_carga: '1' },
                                            estadoSolicitud = { cod_solicitud: id_request[0], cod_estado_solicitud: '5', fec_cambio_estado: fecha_today };

                                        let cant_solicitudes = await fetch(`http://localhost:3000/getFreightsRequest/${id_request[1]}`, {
                                                method: 'GET',
                                            }).then(res => res.json())
                                            .then(data => {
                                                console.log(data)
                                                return data;
                                            })

                                        //Si esta en "Solicitada" puede tener mas de una solicitud. Por lo que el estado de la carga no debe modificarse. Caso contrario, sí.
                                        //Si esta "Aceptada" puede tener 1 o mas solicitudes, pero eso es indistinto ya que lo que marca la diferencia es el estado == 2
                                        //Si el estado es == 2 (Aceptada) si hubiera mas de una solicitud las demas estarian rechazadas
                                        //¿Pero que pasa si tiene mas de una, por ej. 3, y las 3 estan en solicitadas.
                                        if (cant_solicitudes.length == 1 || id_request[2] == 2) {

                                            fetch(`http://localhost:3000/updateEstadoSolicitud`, {
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

                                        } else if (cant_solicitudes.length > 1) {
                                            let solActual = await fetch(`http://localhost:3000/updateEstadoSolicitud/`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify(estadoSolicitud),
                                                })
                                                .then(data => {
                                                    return true;
                                                })
                                                .catch(err => { console.log(err); })

                                            if (solActual == true) {
                                                let cant = 1; //Está bien que arranque en uno porque cancelo una solic. arriba, pero no trabajo sobre la coleccion de solicitudes actualizada. Sino debería hacer otro fetch aca, y no es necesario, si ya se que la canceló.
                                                for (let i = 0; i < cant_solicitudes.length; i++) {
                                                    if (cant_solicitudes[i].cod_estado_solicitud == 5) {
                                                        console.log("en el contador");
                                                        cant = cant + 1;
                                                    }
                                                }
                                                if (cant == cant_solicitudes.length) {
                                                    fetch(`http://localhost:3000/updateEstadoCarga/`, {
                                                            method: 'PUT',
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            },
                                                            body: JSON.stringify(estadoCarga),
                                                        })
                                                        .catch(err => { console.log(err); })
                                                }
                                            }


                                        }

                                        Swal.fire({
                                            title: 'La Solicitud ha sido Cancelada',
                                            icon: 'success',
                                            showConfirmButton: false,
                                            timer: 3000
                                        })

                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 3000);
                                    }
                                })
                                .catch(err => { console.log(err); })
                        });



                        btnEntregada.addEventListener('click', (event) => {
                            event.preventDefault();
                            let codigos = btnEntregada.getAttribute("id").split("-")
                            console.log(codigos);
                            cod_soli = codigos[0];
                            carga = codigos[1];
                            //console.log("entregar", cod_soli);
                        })
                    })


                    //Botón Finalizar Viaje
                    document.getElementById("btn_finalizar_viaje").addEventListener('click', async(event) => {

                        if (document.getElementById('nom_archivo').textContent == "" || document.getElementById('nom_archivo').textContent == undefined) {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: '¡Primero debe subir el Formulario de Conformidad!',
                                showConfirmButton: false,
                                timer: 4000
                            })
                        } else {
                            //validar que primero se suba el archivo
                            console.log(document.getElementById('nom_archivo').textContent);
                            console.log("entregar", cod_soli)
                            event.preventDefault();
                            let nombre_archivo = archivo.name;
                            console.log("nombre_archivo", nombre_archivo);
                            console.log("archivo", archivo);
                            await uploadFile(archivo)

                            let nom_arch = { cod_solicitud: parseInt(cod_soli, 10), nombre: nombre_archivo },
                                estadoCarga = { codigo_carga: carga, cod_estado_carga: '5' };

                            fetch(`http://localhost:3000/uploadFileFinViaje`, {
                                    method: 'PUT',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(nom_arch),
                                })
                                .catch(err => { console.log(err); })



                            fetch(`http://localhost:3000/updateEstadoCarga`, {
                                    method: 'PUT',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(estadoCarga),
                                })
                                .catch(err => { console.log(err); })

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: '¡Viaje Finalizado!',
                                showConfirmButton: false,
                                timer: 3000
                            })

                            setTimeout(() => {
                                window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
                            }, 3000);
                        }

                    })
                })
                .catch(err => { console.log(err); })
        } else {

            let nav_mis_camiones = document.querySelector(".nav-mis-camiones"),
                nav_buscar_carga = document.querySelector(".nav-buscar-carga"),
                nav_mis_solicitudes = document.querySelector(".nav-mis-solicitudes");
            nav_mis_camiones.classList.add("nav-mis-camiones-none");
            nav_mis_solicitudes.classList.add("nav-mis-solicitudes-none");
            nav_buscar_carga.classList.add("nav-buscar-carga-none");
            fetch(`http://localhost:3000/getFreightsRequest/${cod_carga}`, {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.length == 0) {
                        let p = document.createElement('h5');
                        p.innerHTML = `No hay Solicitudes para esta carga. Cod. Carga: ${cod_carga}`
                        tableBodyRequest.appendChild(p);
                    }
                    data.forEach(res => {
                        let tableRow = document.createElement('tr'),
                            tableData1 = document.createElement('td'),
                            tableData2 = document.createElement('td'),
                            tableData3 = document.createElement('td'),
                            tableData4 = document.createElement('td'),
                            //tableData5 = document.createElement('td'),
                            tableData6 = document.createElement('td'),
                            tableData7 = document.createElement('td'),
                            tableData8 = document.createElement('td'),
                            btnMas = document.createElement('button'),
                            btnRetirada = document.createElement('button'),
                            btnFinalizar = document.createElement('button'),
                            fecha_solicitud = new Date(res.fec_solicitud);

                        btnMas.classList.add("btn_mas_carga");
                        btnMas.innerHTML = 'Ver más';
                        btnRetirada.innerHTML = 'Actualizar Estado';
                        btnFinalizar.innerHTML = 'Finalizar Proceso';
                        btnFinalizar.setAttribute("id", res.cod_solicitud);

                        btnRetirada.classList.add("btn_retirar_carga");
                        btnFinalizar.classList.add("btn_finalizar_carga");
                        btnRetirada.setAttribute("data-bs-toggle", "modal");
                        btnRetirada.setAttribute("data-bs-target", "#updateEstadoCarga");

                        tableData1.innerHTML = `${res.cod_solicitud}`;
                        fetch(`http://localhost:3000/getOneCargaUser/${res.cod_carga}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        document.getElementById("descri_carga").innerHTML = `<b>Carga: </b>${data[0].descripcion} <b>Cod.:</b> ${cod_carga}`;
                                        // tableData2.innerHTML = data[0].descripcion;
                                    });
                            })
                            .catch(err => { console.log(err); })

                        tableData3.innerHTML = `${fecha_solicitud.toLocaleDateString()}`;

                        fetch(`http://localhost:3000/getTipoEstadoSolicitud/${res.cod_estado_solicitud}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                switch (data[0].cod_estado_solicitud) {
                                    case 1:
                                        tableData4.innerHTML = `<span class="badge text-bg-secondary">${data[0].descripcion}</span>`
                                        break;
                                    case 2:
                                        tableData4.innerHTML = `<span class="badge text-bg-success">${data[0].descripcion}</span>`
                                        tableData7.appendChild(btnRetirada);
                                        break;
                                    case 3:
                                        tableData4.innerHTML = `<span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                        tableData8.remove(btnFinalizar);
                                        break;
                                    case 4:
                                        tableData4.innerHTML = `<span class="badge text-bg-dark">${data[0].descripcion}</span>`
                                        break;
                                    case 5:
                                        tableData4.innerHTML = `<span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                        break;
                                }
                            })
                            .catch(err => { console.log(err); })

                        fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                fetch(`http://localhost:3000/getOneTipoEstado/${data[0].cod_estado_carga}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        let estado_carga = document.getElementById('estado_carga');
                                        switch (data[0].cod_estado_carga) {
                                            case 1:
                                                estado_carga.innerHTML = `<b>Estado Carga: </b><span class="badge text-bg-info">${data[0].descripcion}</span>`
                                                break;
                                            case 2:
                                                estado_carga.innerHTML = `<b>Estado Carga: </b><span class="badge text-bg-warning">${data[0].descripcion}</span>`;
                                                break;
                                            case 3:
                                                estado_carga.innerHTML = `<b>Estado Carga: </b><span class="badge text-bg-success">${data[0].descripcion}</span>`
                                                break;
                                            case 4:
                                                estado_carga.innerHTML = `<b>Estado Carga: </b><span class="badge text-bg-light">${data[0].descripcion}</span>`
                                                tableData7.remove(btnRetirada);
                                                break;
                                            case 5:
                                                estado_carga.innerHTML = `<b>Estado Carga: </b><span class="badge text-bg-primary">${data[0].descripcion}</span>`
                                                tableData7.remove(btnRetirada);
                                                tableData8.appendChild(btnFinalizar);
                                                break;
                                        }

                                        if (data[0].cod_estado_carga) {

                                        }
                                        console.log(data);
                                    }).catch(err => { console.log(err); })
                            })
                            .catch(err => { console.log(err); })

                        tableData6.appendChild(btnMas);



                        tableRow.appendChild(tableData1);
                        //tableRow.appendChild(tableData2);
                        tableRow.appendChild(tableData3);
                        tableRow.appendChild(tableData4);
                        //tableRow.appendChild(tableData5);
                        tableRow.appendChild(tableData6);
                        tableRow.appendChild(tableData7);
                        tableRow.appendChild(tableData8);
                        tableBodyRequest.appendChild(tableRow);

                        //Botón Ver Más
                        btnMas.addEventListener('click', (event) => {
                            event.preventDefault();
                            window.location.href = `./view_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${res.cod_solicitud}&cod_carga=${res.cod_carga}`;
                        })

                        //Actualizar Carga a estado: Retirada
                        document.getElementById("btn_actualizar_retiro").addEventListener('click', (event) => {
                            event.preventDefault();
                            let estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '4' };


                            fetch(`http://localhost:3000/updateEstadoCarga/`, {
                                    method: 'PUT',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(estadoCarga),
                                })
                                .catch(err => { console.log(err); })

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: '¡Estado Actualizado!',
                                showConfirmButton: false,
                                timer: 1500
                            })

                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        })

                        //Botón Finalizar Proceso
                        btnFinalizar.addEventListener('click', (event) => {
                            event.preventDefault();
                            let solicitud = btnFinalizar.getAttribute("id")
                            Swal.fire({
                                    title: 'Finalizar Proceso',
                                    text: 'Al Finalizar el Proceso estará diciendo a DMO que la Carga ha sido entregada y usted lo ha confirmado',
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
                                        var fecha_today = new Date()
                                        console.log("fecha_today", fecha_today.toLocaleDateString());
                                        let estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '6' },
                                            estadoSolicitud = { cod_solicitud: solicitud, cod_estado_solicitud: '4', fec_cambio_estado: fecha_today };


                                        fetch(`http://localhost:3000/updateEstadoCarga/`, {
                                                method: 'PUT',
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(estadoCarga),
                                            })
                                            .catch(err => { console.log(err); })

                                        fetch(`http://localhost:3000/updateEstadoSolicitud`, {
                                                method: 'PUT',
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(estadoSolicitud),
                                            })
                                            .catch(err => { console.log(err); })
                                        Swal.fire({
                                            title: 'EL PROCESO HA FINALIZADO CON ÉXITO',
                                            icon: 'success',
                                            showConfirmButton: false,
                                            timer: 3000
                                        })

                                        setTimeout(() => {
                                            window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
                                        }, 3000);
                                    }
                                })
                                .catch(err => { console.log(err); })
                        })
                    })
                })
                .catch(err => { console.log(err); })
        }

        //Mis Camiones
        btn_mis_camiones.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Botón Dashboard
        btn_dashboard.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Buscar Cargas - Transportista
        btn_buscar_carga.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./search.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Mis Cargas - Dador de Carga
        btn_mis_cargas.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Botón Mi Perfil
        btn_mi_perfil.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

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
        });
    } else {
        alert("Usted NO ha Iniciado Sesión");
        window.location.href = './index.html';
    }
})