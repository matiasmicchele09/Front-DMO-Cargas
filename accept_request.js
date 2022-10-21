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
    /*  const mercadopago = new MercadoPago('TEST-b20165cd-0c06-4fe3-b308-7a3610cfb77e', {
         locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
     }); */
    //const jsPDF = require('jspdf');
    if (initialized_session == 'true') {
        let btn_back = document.querySelector(".parr_volver"),
            btn_mercado_pago = document.getElementById('checkout-btn');



        /* const drop_area_request = document.querySelector(".drop-area-request"),
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
            filesUpload = input_request.files;
            drop_area_request.classList.add("active");
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
                    event.preventDefault()
                    const fileURL = fileReader.result;
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
            } catch (error) {
                const p = `<h5><span class="failure">¡Ha ocurrido un error al subir el archivo!</span></h5>`
                const html = document.getElementById('preview');
                html.innerHTML = html.innerHTML + p;
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
        } */

        fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {


                btn_mercado_pago.addEventListener("click", async(event) => {
                    event.preventDefault();

                    let fleteCarga = {
                        descripcion: `Flete - Origen: ${data[0].origen} - Destino: ${data[0].destino}`,
                        valor_carga: data[0].valor_carga,
                        cantidad: 1
                    }

                    console.log(data);
                    console.log(fleteCarga);
                    console.log(JSON.stringify(fleteCarga));

                    /* fetch('http://localhost:3000/payWithMP', {
                        method: 'POST',
                        body: JSON.stringify(fleteCarga),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
 */


                    /*fetch("/create_preference", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(fleteCarga),
                        })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(preference) {
                            createCheckoutButton(preference.id);
                        })
                        .catch(function() {
                            alert("Unexpected error");
                            //$('#btn_checkout').attr("disabled", false);
                        });

                    function createCheckoutButton(preferenceId) {
                        // Initialize the checkout
                        mercadopago.checkout({
                            preference: {
                                id: preferenceId
                            },
                            render: {
                                container: '#btn_checkout', // Class name where the payment button will be displayed
                                label: 'Pay', // Change the payment button text (optional)
                            }
                        });
                    }*/


                    try {
                        console.log("PAGANDO............");
                        const preference = await (await fetch('http://localhost:3000/payWithMP', {
                            method: 'POST',
                            body: JSON.stringify(fleteCarga),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })).json()

                        console.log("preference", preference);

                        var script = document.createElement('script');
                        script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
                        script.type = "text/javascript";
                        script.dataset.preferenceId = preference.preferenceId;
                        document.getElementById('btn_checkout').innerHTML = "";
                        document.querySelector('#btn_checkout').appendChild(script);





                    } catch {
                        err => { console.log(err); }
                    }
                    /* 
                                const preferenceId = await fetch(`http://localhost:3000/payWithMP/`, {
                                        method: 'POST',
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        //body: JSON.stringify(estadoSolicitud),
                                    }).then(res => res.json())
                                    .then(data => {

                                    }) */

                    //})

                })

            })



        /* let estadoSolicitud = { codigo_carga: cod_carga, cod_estado_solicitud: '2', fec_cambio_estado: fecha_today },
            estadoCarga = { codigo_carga: cod_carga, cod_estado_carga: '3' };

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
            .catch(err => { console.log(err); }) */


        //Botón Volver
        btn_back.addEventListener('click', (event) => {
            event.preventDefault();
            javascript: history.back()
        })


    }
})