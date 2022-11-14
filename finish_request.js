document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    const getURL = new URLSearchParams(window.location.search),
        cod_solicitud = getURL.get('request'),
        cod_carga = getURL.get('cod_carga'),
        cod_op = getURL.get('payment');

    //var initialized_session = 'false';
    sessionStorage.setItem("initialized_session", "true");
    initialized_session = sessionStorage.getItem("initialized_session");
    console.log("initialized_session", initialized_session);
    if (initialized_session == 'true') {

        fetch(`http://localhost:3000/getPay/${cod_solicitud}/${cod_op}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                let mjs_confirmacion = document.getElementById('mensaje_confirmacion');
                console.log(data[0]);
                console.log("cod_op", cod_op);
                switch (data[0].estado) {
                    case "approved":
                        mjs_confirmacion.innerHTML = "¡Solicitud Aceptada Exitosamente! </br> El Pago ha sido APROBADO y la Carga ha sido Asignada."
                        mjs_confirmacion.setAttribute("style", "color:#29b905;")
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
                        break;
                    case "in_process":
                        //YA PROBÉ TODOS LOS ESTADOS, LOS UNICOS QUE DEVUELVEN UN ESTADO SON APROBADO Y PENDIENTE DE PAGO. LOS DEMAS MUESTRAN EL ERROR EL EL MODAL DE MERCADO PAGO
                        //Y TE DAN LA OPCION DE INGRESAR OTRA TARJETA O DIRECTAMENTE CERRAS EL MODAL Y NO ASIGNAS ESA CARGA PORQUE NO HAY PAGO APROBADO

                        //RESOLVER QUE HACEMOS CON ESTE PAGO, SI LO ACEPTAMOS TAMBIEN Y ASIGNAMOS LA CARGA POR MAS QU ESTE PENDIENTE DE PAGO.
                        mjs_confirmacion.innerHTML = "¡No se pudo aceptar la solicitud. Su pago esta en estado 'Pendiente de pago'!"
                        mjs_confirmacion.setAttribute("style", "color:#f0690f;")
                        break;
                    default:
                        mjs_confirmacion.innerHTML = "¡No se pudo aceptar la solicitud. Su pago esta en estado 'RECHAZADO'!"
                        mjs_confirmacion.setAttribute("style", "color:#BB2929;")
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })



        //Botón Dashboard
        document.querySelector('.parr_volver').addEventListener('click', (event) => {
            event.preventDefault();
            fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {
                    //console.log(data);
                    fetch(`http://localhost:3000/dashboard/${data[0].cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            //console.log(data);
                            window.location.href = `./dashboard.html?cod_usuario=${data[0].cod_usuario}&tpo_usuario=2`;
                        })
                })
        })
    }
})