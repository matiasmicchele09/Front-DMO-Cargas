const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    cod_solicitud = getURL.get('request');
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
                let divMyRequest = document.getElementById('my_request'),
                divMyRequestCarga = document.getElementById('datos_carga'),
                divMyRequestCamion = document.getElementById('datos_camion');
                data.forEach(res => {
                    let p_estado = document.createElement('p'),
                        p_fecha_solicitud = document.createElement('p'),
                        fecha_solicitud = new Date(res.fec_solicitud);


                    fetch(`http://localhost:3000/getTipoEstadoSolicitud/${res.cod_estado_solicitud}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            switch (data[0].cod_estado_solicitud) {
                                case 1:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-secondary">${data[0].descripcion}</span>`
                                    break;
                                case 2:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-success">${data[0].descripcion}</span>`
                                    break;
                                case 3:
                                    p_estado.innerHTML = `<b>Estado Solicitud: </b><span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                    break;
                            }
                        })
                    p_fecha_solicitud.innerHTML = `<b>Fecha Solicitud: </b> ${fecha_solicitud.toLocaleDateString()}`;

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
                        p_tipo_carga= document.createElement('p'),
                        p_tipo_producto= document.createElement('p'),
                        p_alto_mts= document.createElement('p'),
                        p_ancho_mts= document.createElement('p'),
                        p_cant_litros= document.createElement('p'),
                        p_cant_unit= document.createElement('p'),
                        p_largo_mts = document.createElement('p'),
                        p_peso_total_kg = document.createElement('p'),
                        p_peso_total_tn= document.createElement('p'),
                        p_peso_unit_kg= document.createElement('p'),
                        p_peso_unit_tn= document.createElement('p'),
                        p_req_refrigeracion= document.createElement('p'),
                        p_es_peligrosa= document.createElement('p'),
                        p_es_apilable= document.createElement('p');

                        h5.innerHTML = '<u>Datos de la Carga</u>';
                        p_origen_destino.innerHTML=`<b>Origen: </b>${data[0].ciudad_origen} (${data[0].prov_origen}) - <b>Fecha: </b> ${fecha_retiro.toLocaleDateString()} - ${data[0].hora_retiro}</br>
                                            <b>Domicilio: </b>${data[0].domicilio_origen}</br>                                            
                                            <hr>
                                            <b>Destino: </b> ${data[0].ciudad_destino} (${data[0].prov_destino}) - <b>Fecha: </b> ${fecha_destino.toLocaleDateString()} - ${data[0].hora_destino}</br>
                                            <b>Domicilio: </b>${data[0].domicilio_destino} </br>
                                            <b>Receptor de Carga: </b> ${data[0].receptor_carga}
                                            <hr>
                                            <b>Comentario: </b> ${data[0].comentario}`;

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
                            divMyRequestCarga.appendChild(p_tipo_carga);
                        })

                        fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            p_tipo_producto.innerHTML = `<b>Producto: </b> ${data[0].descripcion}`;
                            divMyRequestCarga.appendChild(p_tipo_producto);
                        })

                        if (data[0].req_refrigeracion != null){p_req_refrigeracion.innerHTML=`<b>Requiere Refrigeración: </b> SI`;
                        divMyRequestCarga.appendChild(p_req_refrigeracion)}
                        if (data[0].es_carga_peligrosa!= null){p_es_peligrosa.innerHTML=`<b>Carga Peligrosa: </b> SI`
                        divMyRequestCarga.appendChild(p_es_peligrosa)}
                        if (data[0].es_carga_apilable!= null){p_es_apilable.innerHTML=`<b>Carga Apilable: </b> SI`
                        divMyRequestCarga.appendChild(p_es_apilable)}
                        if (data[0].cant_unit!= 0){p_cant_unit.innerHTML=`<b>Cant. Unitaria: </b> ${data[0].cant_unit}`
                        divMyRequestCarga.appendChild(p_cant_unit)}
                        if (data[0].peso_unit_kg!= 0){p_peso_unit_kg.innerHTML=`<b>Peso Unitario (Kg): </b> ${data[0].peso_unit_kg}`
                        divMyRequestCarga.appendChild(p_peso_unit_kg)}
                        if (data[0].peso_total_kg!= 0){p_peso_total_kg.innerHTML=`<b>Peso Total (Kg): </b> ${data[0].peso_total_kg}`
                        divMyRequestCarga.appendChild(p_peso_total_kg)}
                        if (data[0].alto_mts!= 0){p_alto_mts.innerHTML=`<b>Altura (mts): </b> ${data[0].alto_mts}`
                        divMyRequestCarga.appendChild(p_alto_mts)}
                        if (data[0].ancho_mts!= 0){p_ancho_mts.innerHTML=`<b>Ancho (mts): </b> ${data[0].ancho_mts}`
                        divMyRequestCarga.appendChild(p_ancho_mts)}
                        if (data[0].largo_mts!= 0){p_largo_mts.innerHTML=`<b>Alto (mts): </b> ${data[0].largo_mts}`
                        divMyRequestCarga.appendChild(p_largo_mts)}                       
                        
                        if (data[0].peso_unit_tn!= 0){p_peso_unit_tn.innerHTML=`<b>Peso Unitario (Tn): </b> ${data[0].peso_unit_tn}`
                        divMyRequestCarga.appendChild(p_peso_unit_tn)}
                        if (data[0].peso_total_tn != 0){p_peso_total_tn.innerHTML=`<b>Peso Total (Tn): </b> ${data[0].peso_total_tn}`
                        divMyRequestCarga.appendChild(p_peso_total_tn)}
                        if (data[0].cant_litros){p_cant_litros.innerHTML=`<b>Cant. Litros: </b> ${data[0].cant_litros}`
                        divMyRequestCarga.appendChild(p_cant_litros)}


                    })

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
                            p_info_camion.innerHTML=`<b>Patente Camión: </b>${data[0].patente_camion} </br>
                                                     <b>Marca: </b>${data[0].marca} - <b>Modelo: </b>${data[0].modelo} - <b>Año: </b>${data[0].anio}`;
                            divMyRequestCamion.appendChild(p_info_camion);  
                            fetch(`http://localhost:3000/getOneTypeTruck/${data[0].cod_tipo_camion}`, {
                            method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                let p_info_camion = document.createElement('p');
                                p_info_camion.innerHTML=`<b>Tipo Camión: </b>${data[0].descripcion}`;
                                divMyRequestCamion.appendChild(p_info_camion);                                                          
                            })
                        })
                        fetch(`http://localhost:3000/mi_carroceria/${data[0].patente_carroceria}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            let p_info_carroceria = document.createElement('p');
                            p_info_carroceria.innerHTML=`<b>Patente Carrocería: </b>${data[0].patente_carroceria} </br>
                                                        <b>Año: </b>${data[0].anio} - <b>Cant. Ejes: </b>${data[0].cant_ejes} </br>`;
                            divMyRequestCamion.appendChild(p_info_carroceria);  
                            fetch(`http://localhost:3000/getOneTipoCarroceria/${data[0].cod_tipo_carroceria}`, {
                            method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                let p_info_carroceria = document.createElement('p');
                                p_info_carroceria.innerHTML=`<b>Tipo Carrocería: </b>${data[0].descripcion}`;
                                divMyRequestCamion.appendChild(p_info_carroceria);
                            })
                        })
                    
                    

                    

                });
























            })

        //Botón Volver
        btn_back.addEventListener('click', (event) => {
            event.preventDefault();
            javascript: history.back();
        })
    }
})