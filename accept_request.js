document.addEventListener('DOMContentLoaded', (event) => {

    event.preventDefault();

    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        cod_request = getURL.get('request'),
        cod_solicitud = getURL.get('request'),
        cod_carga = getURL.get('cod_carga');

    var initialized_session = 'false';
    initialized_session = sessionStorage.getItem("initialized_session");

    if (initialized_session == 'true') {
        let btn_back = document.querySelector(".parr_volver"),
            //   btn_accept = document.getElementById('btn_acept_request'),
            btn_mercado_pago = document.getElementById('checkout-btn');

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
            event.preventDefault();
            console.log(input_request.value);
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
                    console.log("file.name", file.name);
                    console.log(file)
                        //console.log(file.getAttribute('name'))                   
                        //file.name = id;
                        //file.setAttribute("nom", `${id}`)
                        //console.log("nom", file.nom)
                    console.log("file.name", file.name);

                    p.innerHTML = `${file.name}`
                        //p.innerHTML = `${id}`
                        //nombre_archivo = `${file.name}`;

                    //console.log("nombre_archivo", nombre_archivo);
                    const html = document.getElementById('preview');
                    //html.innerHTML = html.innerHTML + p;
                    html.appendChild(p);

                })
                fileReader.readAsDataURL(file);
                uploadFile(file)

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
                /*  const p = `<h5><span class="success">¡Archivo subido correctamente!</span></h5>`
                 const html = document.getElementById('preview');
                 html.innerHTML = html.innerHTML + p; */
            } catch (error) {
                console.log(error);
                const p = `<h5><span class="failure">¡Ha ocurrido un error al subir el archivo!</span></h5>`
                const html = document.getElementById('preview');
                html.innerHTML = html.innerHTML + p;
            }
        }

        fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(async data => {

                let cuerpo = document.getElementById("cuerpo_asunto"),
                    pie = document.getElementById("firma");
                let descri_producto = await fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        return data
                    })

                let dador_carga = await fetch(`http://localhost:3000/dashboard/${cod_usuario}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        return data
                    })

                let solicitud = await fetch(`http://localhost:3000/getOneSolicitud/${cod_request}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        return fetch(`http://localhost:3000/dashboard/${data[0].cod_usuario_transp}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                return data
                            })
                    })

                cuerpo.innerHTML = `Yo dador de carga ${dador_carga[0].razon_social}, identificado con D.N.I./C.U.I.T N° ${dador_carga[0].cuit_cuil}, mediante el presente otorgo el poder al Sr/Sra. ${solicitud[0].razon_social}, identificado/a con D.N.I/C.U.I.T. N° ${solicitud[0].cuit_cuil}, para el retiro de la carga con código N°${cod_carga} - ${descri_producto[0].descripcion}, solicitada, a través de la aplicación web de DMO CARGAS, el ${data[0].fec_retiro.substring(0, 10)} hacia ${data[0].destino}, a recibir por ${data[0].receptor_carga}.
                Un cordial saludo.`
                var today = new Date();
                pie.value = `Documento emitido desde www.dmocargas.com.ar el ${today.toLocaleDateString()}. Firma: DMO - Cargas `

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
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bold");
                    doc.text(characterData.firma_dmo, 10, 200);
                    //doc.text(characterData.type.name, docWidth - 20, 45, { align: "right" });
                    //doc.line(0, docHeight - 60, docWidth, docHeight - 60);
                    doc.save(`Form_retiro_carga_${id}`);
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

                let form_retiro = document.getElementById('form-retiro-carga');

                form_retiro.addEventListener("submit", handleOnSubmitForm);

                btn_mercado_pago.addEventListener("click", async(event) => {
                    event.preventDefault();

                    if (document.getElementById('nom_archivo').textContent == "" || document.getElementById('nom_archivo').textContent == undefined) {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: '¡Primero debe subir el Formulario de retiro de Carga!',
                            showConfirmButton: false,
                            timer: 4000
                        })
                    } else {
                        let nombre_archivo = archivo.name;
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

                        document.getElementById('avanzar_pago').innerHTML = "Arhivo subido correctamente. Por favor, continue con el pago. Haga Click en 'Pagar'"
                        let fleteCarga = {
                            descripcion: `${cod_solicitud} - ${cod_carga} - Origen: ${data[0].origen} - Destino: ${data[0].destino}`,
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
                    }

                })


            })



        //Botón Aceptar Solicitud
        /*     btn_accept.addEventListener('click', async(event) => {
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

*/
        //Botón Volver
        btn_back.addEventListener('click', (event) => {
            event.preventDefault();
            javascript: history.back()
        })


    }
})