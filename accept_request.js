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
        let btn_back = document.querySelector(".parr_volver"),
            btn_accept = document.getElementById('btn_acept_request'),
            btn_mercado_pago = document.getElementById('checkout-btn');


        fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {

                btn_mercado_pago.addEventListener("click", async(event) => {
                    event.preventDefault();

                    let fleteCarga = {
                        descripcion: `${cod_solicitud} - Origen: ${data[0].origen} - Destino: ${data[0].destino}`,
                        valor_carga: data[0].valor_carga,
                        cantidad: 1
                    }

                    console.log(JSON.stringify(fleteCarga));

                    try {
                        console.log("Comenzando Pago...");
                        const preference = await (await fetch('http://localhost:3000/payWithMP', {
                            method: 'POST',
                            body: JSON.stringify(fleteCarga),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })).json()

                        var script = document.createElement('script');
                        script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
                        script.type = "text/javascript";
                        script.dataset.preferenceId = preference.preferenceId;
                        document.getElementById('btn_checkout').innerHTML = "";
                        document.querySelector('#btn_checkout').appendChild(script);

                    } catch {
                        err => { console.log(err); }
                    }

                })

            })


        const drop_area_request = document.querySelector(".drop-area-request"),
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
            const validExtensions = ["application/pdf"];

            let p = document.getElementById('nom_archivo');
            if (validExtensions.includes(docType)) {
                const fileReader = new FileReader();
                fileReader.addEventListener('load', event => {
                    event.preventDefault()
                    const fileURL = fileReader.result;
                    p.innerHTML = `${file.name}`
                        //nombre_archivo = `${file.name}`;

                    //console.log("nombre_archivo", nombre_archivo);
                    const html = document.getElementById('preview');
                    //html.innerHTML = html.innerHTML + p;
                    //html.appendChild(p);

                })
                fileReader.readAsDataURL(file);
                //uploadFile(file)

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

        //Botón Aceptar Solicitud
        btn_accept.addEventListener('click', async(event) => {
            event.preventDefault();
            // let nombre_archivo = archivo.name;
            //console.log("nombre_archivo", nombre_archivo);
            //console.log("archivo", archivo);
            //await uploadFile(archivo)
            ///await showFiles(filesUpload);
            console.log(document.getElementById('nom_archivo').textContent);

            if (document.getElementById('nom_archivo').textContent == "" || document.getElementById('nom_archivo').textContent == undefined) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Primero debe subir el Formulario de retiro de Carga!',
                    showConfirmButton: false,
                    timer: 4000
                })
            } else {
                fetch(`http://localhost:3000/getPay/${cod_solicitud}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(async data => {
                        console.log(data[0]);
                        switch (data[0].estado) {
                            case "approved":
                                /* PROBAR QUE ONDA CON EL ASYNC AWAIT. AUN NO LO PROBE */
                                let nombre_archivo = archivo.name;
                                console.log("nombre_archivo", nombre_archivo);
                                console.log("archivo", archivo);
                                await uploadFile(archivo)

                                let nom_arch = { cod_solicitud: parseInt(cod_solicitud, 10), nombre: nombre_archivo };
                                console.log(nom_arch)

                                fetch(`http://localhost:3000/uploadFileRequest`, {
                                        method: 'PUT',
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(nom_arch),
                                    })
                                    .catch(err => { console.log(err); })

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

                                fetch(`http://localhost:3000/getFreightsRequest/${cod_carga}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        data.forEach(res => {

                                            if (res.cod_solicitud === parseInt(cod_solicitud, 10)) {
                                                let estadoSolicitud = { cod_solicitud: parseInt(cod_solicitud, 10), cod_estado_solicitud: '2', fec_cambio_estado: fecha_today },
                                                    estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '3' };
                                                fetch(`http://localhost:3000/updateEstadoSolicitud`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify(estadoSolicitud),
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
                                            } else {
                                                let rechazosSolicitud = { cod_solicitud: res.cod_solicitud, cod_estado_solicitud: '3', fec_cambio_estado: fecha_today };

                                                fetch(`http://localhost:3000/updateEstadoSolicitud`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify(rechazosSolicitud),
                                                    })
                                                    .catch(err => { console.log(err); })
                                            }
                                        })

                                    })
                                    .catch(err => { console.log(err); })

                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: '¡Aceptando Solicitud!',
                                    showConfirmButton: false,
                                    timer: 1500
                                })

                                setTimeout(() => {
                                    window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
                                }, 1500);




                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago fue Rechazado por error general")
                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago Pendiente de pagol")
                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago fue Rechazado con validación para autorizar")
                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago fue Rechazado por importe insuficiente")
                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago fue Rechazado por código de seguridad inválido")
                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago fue Rechazado debido a un problema de fecha de vencimiento")
                                break;
                            case "2":
                                alert("No puede aceptar la solicitud. Su pago fue Rechazado debido a un error de formulario")
                                break;
                        }

                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'No puede aceptar una solicitud sin realizar el pago',
                            showConfirmButton: false,
                            timer: 4000
                        })

                    })
            }
        })


        //Botón Volver
        btn_back.addEventListener('click', (event) => {
            event.preventDefault();
            javascript: history.back()
        })


    }
})