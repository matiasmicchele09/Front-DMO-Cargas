'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        tpo_usuario = getURL.get('tpo_usuario');

    var initialized_session = 'false';

    initialized_session = sessionStorage.getItem("initialized_session");


    if (initialized_session == 'true') {
        fetch(`http://localhost:3000/dashboard/${cod_usuario}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(async data => {
                console.log(data[0]);

                let div = document.querySelector(".dashboard"),
                    btn_perfil = document.querySelector(".a-perfil"),
                    btn_mis_camiones = document.querySelector(".a-mis-camiones"),
                    btn_buscar_carga = document.querySelector(".a-buscar-cargas"),
                    btn_my_request = document.querySelector(".a-mis-solicitudes"),
                    btn_mis_cargas = document.querySelector(".a-mis-cargas"),
                    //  btn__manual_usuario = document.querySelector(".a-manual-usuario"),
                    div_card_info_usuario = document.getElementById('card_body_info_usuario'),
                    btn_logOut = document.querySelector(".btn-salir"),
                    h3 = document.createElement('h3'),
                    p = document.createElement('p');

                if (tpo_usuario == 1) {
                    btn_perfil.innerHTML = `${data[0].razon_social} <b>(Transportista)</b>`;
                    document.getElementById("body_dashboard").setAttribute("style", "background-image: linear-gradient(#aba9cd, #E6E6E6, #E6E6E6)")
                } else {
                    btn_perfil.innerHTML = `${data[0].razon_social} <b>(Dador Carga)</b>`;
                    document.getElementById("body_dashboard").setAttribute("style", "background-image: linear-gradient(#E6E6E6, #E6E6E6, #aba9cd)")
                }

                h3.innerHTML = `Bienvenido <b>${data[0].razon_social}</b>`;

                if (data[0].tipo_usuario == '1') {

                    let datos_transpor = Object.values(data[0]);

                    //Si no incluye nulos ni vacios entonces saca el cartel. 
                    if (!datos_transpor.includes(null) && !datos_transpor.includes("")) {
                        document.getElementById("alerta_datos").classList.add("alerta_datos_none")
                    }

                    let nav_mis_cargas = document.querySelector(".nav-mis-cargas");
                    nav_mis_cargas.classList.add("nav-mis-cargas-none");

                    p.innerHTML = 'Usted está registrado como <b>Transportista</b>';
                    let p_camion = document.createElement('p');
                    //p_camion.innerHTML = `<h5 style="color:#4136df">Transporte</h5>`
                    let camion = await fetch(`http://localhost:3000/getTrucksUser/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            return data
                        })
                        .catch(err => { console.log(err); })

                    console.log(camion.length);

                    p_camion.innerHTML = `<p>No tiene registrado camiones ni carrocerías</p>`

                    camion.forEach(res => {
                        if (res.eliminado != true) {
                            p_camion.innerHTML = `<h5 style="color:#4136df">Transporte</h5>`;
                            fetch(`http://localhost:3000/getOneTypeTruck/${res.cod_tipo_camion}`, {
                                    method: 'GET',
                                })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data[0])
                                    p_camion.innerHTML = p_camion.innerHTML + `<b style="text-decoration:underline">Camión ${res.marca} ${res.modelo}</b></br>
                                                                                    Patente:<i> ${res.patente_camion}</i></br>
                                                                                    Año: <i>${res.anio} </i></br>
                                                                                    Descripción: <i> ${data[0].descripcion}</i> </br>`
                                })
                                .catch(err => { console.log(err); })
                        }
                    })

                    div_card_info_usuario.appendChild(p_camion);

                    let p_carroceria = document.createElement('p');
                    let carroceria = await fetch(`http://localhost:3000/getCarroceriasUser/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            return data;
                        })
                        .catch(err => { console.log(err); })

                    carroceria.forEach(res => {
                        if (res.eliminado != true) {
                            fetch(`http://localhost:3000/getOneTipoCarroceria/${res.cod_tipo_carroceria}`, {
                                    method: 'GET',
                                })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data[0])
                                    p_carroceria.innerHTML = p_carroceria.innerHTML + `<b style="text-decoration:underline">Carrocería ${data[0].descripcion}</b></br>
                                                                                    Patente:<i> ${res.patente_carroceria}</i></br>
                                                                                    Año: <i>${res.anio} </i></br>`

                                })
                                .catch(err => { console.log(err); })
                        }
                    })
                    div_card_info_usuario.appendChild(p_carroceria);

                    fetch(`http://localhost:3000/getUserRequest/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let p_solicitudes = document.createElement('p'),
                                cant_aceptadas = 0,
                                cant_rechazadas = 0,
                                cant_solicitadas = 0,
                                cant_finalizadas = 0,
                                cant_canceladas = 0;
                            data.forEach(res => {
                                if (res.cod_estado_solicitud == '1') {
                                    cant_solicitadas = cant_solicitadas + 1;
                                }
                                if (res.cod_estado_solicitud == '2') {
                                    cant_aceptadas = cant_aceptadas + 1;
                                }
                                if (res.cod_estado_solicitud == '3') {
                                    cant_rechazadas = cant_rechazadas + 1;
                                }
                                if (res.cod_estado_solicitud == '4') {
                                    cant_finalizadas = cant_finalizadas + 1;
                                }
                                if (res.cod_estado_solicitud == '5') {
                                    cant_canceladas = cant_canceladas + 1;
                                }
                            })

                            p_solicitudes.innerHTML = `<h5 style="color:#4136df">Solicitudes</h5> 
                                                 <b>Cantidad de Solicitudes: </b> ${data.length}</br>
                                                   Cantidad <b>Solicitadas: </b>${cant_solicitadas}</br>
                                                   Cantidad <b>Aceptadas: </b>${cant_aceptadas}</br>
                                                   Cantidad <b>Rechazadas: </b>${cant_rechazadas}</br>
                                                   Cantidad <b>Finalizadas: </b>${cant_finalizadas}</br>
                                                   Cantidad <b>Canceladas: </b>${cant_canceladas}`;
                            document.getElementById('card_body_req_usuario').appendChild(p_solicitudes)
                        })
                        .catch(err => { console.log(err); })

                } else {
                    let nav_mis_camiones = document.querySelector(".nav-mis-camiones"),
                        nav_buscar_carga = document.querySelector(".nav-buscar-carga"),
                        nav_mis_solicitudes = document.querySelector(".nav-mis-solicitudes");
                    nav_mis_camiones.classList.add("nav-mis-camiones-none");
                    nav_mis_solicitudes.classList.add("nav-mis-solicitudes-none");
                    nav_buscar_carga.classList.add("nav-buscar-carga-none");
                    p.innerHTML = 'Usted está registrado como <b>Dador de Carga</b>';
                    document.getElementById('card_body_req_usuario').classList.add("d-none")
                    document.getElementById("alerta_datos").classList.add("alerta_datos_none")

                    fetch(`http://localhost:3000/getCargasUser/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let p_cargas = document.createElement('p'),
                                cant_cargas_publicadas = 0,
                                cant_cargas_solicitadas = 0,
                                cant_cargas_aceptadas = 0,
                                cant_cargas_retiradas = 0,
                                cant_cargas_entregadas = 0,
                                cant_cargas_finalizadas = 0;

                            let cardPubli = document.createElement('div'),
                                cardSoli = document.createElement('div'),
                                cardAcep = document.createElement('div'),
                                cardReti = document.createElement('div'),
                                cardEntre = document.createElement('div'),
                                cardFinal = document.createElement('div'),
                                info_usu = document.getElementById('info_usuario');

                            cardPubli.classList.add('card');
                            cardPubli.classList.add('card_body_info_usuario');
                            cardSoli.classList.add('card');
                            cardSoli.classList.add('card_body_info_usuario');
                            cardAcep.classList.add('card');
                            cardAcep.classList.add('card_body_info_usuario');
                            cardReti.classList.add('card');
                            cardReti.classList.add('card_body_info_usuario');
                            cardEntre.classList.add('card');
                            cardEntre.classList.add('card_body_info_usuario');
                            cardFinal.classList.add('card');
                            cardFinal.classList.add('card_body_info_usuario');

                            let parrafo_publi = document.createElement('p');
                            let parrafo_soli = document.createElement('p');
                            let parrafo_acep = document.createElement('p');
                            let parrafo_reti = document.createElement('p');
                            let parrafo_entre = document.createElement('p');
                            let parrafo_final = document.createElement('p');

                            parrafo_publi.innerHTML = `<h5 style="color:#4136df">Cargas Publicadas</h5>`
                            parrafo_soli.innerHTML = `<h5 style="color:#4136df">Cargas Solicitadas</h5>`
                            parrafo_acep.innerHTML = `<h5 style="color:#4136df">Cargas Aceptadas</h5>`
                            parrafo_reti.innerHTML = `<h5 style="color:#4136df">Cargas Retiradas</h5>`
                            parrafo_entre.innerHTML = `<h5 style="color:#4136df">Cargas Entregadas</h5>`
                            parrafo_final.innerHTML = `<h5 style="color:#4136df">Cargas Finalizadas</h5>`
                            data.forEach(res => {
                                switch (res.cod_estado_carga) {
                                    case 1:
                                        let fec_salida = new Date(res.fec_retiro);
                                        let fec_llegada = new Date(res.fec_destino);
                                        let fec_pub = new Date(res.fec_publicacion);

                                        parrafo_publi.innerHTML = parrafo_publi.innerHTML + `<b>Cod.: </b>${res.cod_carga} - <b>Publicación: </b>${fec_pub.toLocaleDateString()}</br>
                                                                                            <b>Salida: </b> ${fec_salida.toLocaleDateString()} </br>
                                                                                            <b>Desde: </b>${res.origen} </br>
                                                                                            <b>Hasta: </b>${res.destino}</br>
                                                                                            <b>Llegada: </b> ${fec_llegada.toLocaleDateString()}
                                                                                            <hr>`;
                                        cant_cargas_publicadas = cant_cargas_publicadas + 1;
                                        break;
                                    case 2:
                                        let fec_sal_soli = new Date(res.fec_retiro);
                                        let fec_lleg_soli = new Date(res.fec_destino);
                                        let fec_pub_sol = new Date(res.fec_publicacion);

                                        parrafo_soli.innerHTML = parrafo_soli.innerHTML + `<b>Cod.: </b>${res.cod_carga} - <b>Publicación: </b>${fec_pub_sol.toLocaleDateString()}</br>
                                                                                            <b>Salida: </b> ${fec_sal_soli.toLocaleDateString()} </br>
                                                                                            <b>Desde: </b>${res.origen} </br>
                                                                                            <b>Hasta: </b>${res.destino}</br>
                                                                                            <b>Llegada: </b> ${fec_lleg_soli.toLocaleDateString()}
                                                                                            <hr>`;
                                        cant_cargas_solicitadas = cant_cargas_solicitadas + 1;
                                        break;
                                    case 3:
                                        let fec_sal_acep = new Date(res.fec_retiro);
                                        let fec_lleg_acep = new Date(res.fec_destino);
                                        let fec_pub_acep = new Date(res.fec_publicacion);

                                        parrafo_acep.innerHTML = parrafo_acep.innerHTML + `<b>Cod.: </b>${res.cod_carga} - <b>Publicación: </b>${fec_pub_acep.toLocaleDateString()}</br>
                                                                                            <b>Salida: </b> ${fec_sal_acep.toLocaleDateString()} </br>
                                                                                            <b>Desde: </b>${res.origen} </br>
                                                                                            <b>Hasta: </b>${res.destino}</br>
                                                                                            <b>Llegada: </b> ${fec_lleg_acep.toLocaleDateString()}
                                                                                            <hr>`;
                                        cant_cargas_aceptadas = cant_cargas_aceptadas + 1;
                                        break;
                                    case 4:
                                        let fec_sal_reti = new Date(res.fec_retiro);
                                        let fec_lleg_reti = new Date(res.fec_destino);
                                        let fec_pub_reti = new Date(res.fec_publicacion);

                                        parrafo_reti.innerHTML = parrafo_reti.innerHTML + `<b>Cod.: </b>${res.cod_carga} - <b>Publicación: </b>${fec_pub_reti.toLocaleDateString()}</br>
                                                                                            <b>Salida: </b> ${fec_sal_reti.toLocaleDateString()} </br>
                                                                                            <b>Desde: </b>${res.origen} </br>
                                                                                            <b>Hasta: </b>${res.destino}</br>
                                                                                            <b>Llegada: </b> ${fec_lleg_reti.toLocaleDateString()}
                                                                                            <hr>`;
                                        cant_cargas_retiradas = cant_cargas_retiradas + 1;
                                        break;
                                    case 5:
                                        let fec_sal_entre = new Date(res.fec_retiro);
                                        let fec_lleg_entre = new Date(res.fec_destino);
                                        let fec_pub_entre = new Date(res.fec_publicacion);

                                        parrafo_entre.innerHTML = parrafo_entre.innerHTML + `<b>Cod.: </b>${res.cod_carga} - <b>Publicación: </b>${fec_pub_entre.toLocaleDateString()}</br>
                                                                                            <b>Salida: </b> ${fec_sal_entre.toLocaleDateString()} </br>
                                                                                            <b>Desde: </b>${res.origen} </br>
                                                                                            <b>Hasta: </b>${res.destino}</br>
                                                                                            <b>Llegada: </b> ${fec_lleg_entre.toLocaleDateString()}
                                                                                            <hr>`;
                                        cant_cargas_entregadas = cant_cargas_entregadas + 1;
                                        break;
                                    case 6:
                                        let fec_sal_fina = new Date(res.fec_retiro);
                                        let fec_lleg_fina = new Date(res.fec_destino);
                                        let fec_pub_fin = new Date(res.fec_publicacion);

                                        parrafo_final.innerHTML = parrafo_final.innerHTML + `<b>Cod.: </b>${res.cod_carga} - <b>Publicación: </b>${fec_pub_fin.toLocaleDateString()}</br>
                                                                                            <b>Salida: </b> ${fec_sal_fina.toLocaleDateString()} </br>
                                                                                            <b>Desde: </b>${res.origen} </br>
                                                                                            <b>Hasta: </b>${res.destino}</br>
                                                                                            <b>Llegada: </b> ${fec_lleg_fina.toLocaleDateString()}
                                                                                            <hr>`;
                                        cant_cargas_finalizadas = cant_cargas_finalizadas + 1;
                                        break;
                                }
                            })





                            cardPubli.appendChild(parrafo_publi);
                            cardSoli.appendChild(parrafo_soli);
                            cardAcep.appendChild(parrafo_acep);
                            cardReti.appendChild(parrafo_reti);
                            cardEntre.appendChild(parrafo_entre);
                            cardFinal.appendChild(parrafo_final);

                            info_usu.appendChild(cardPubli);
                            info_usu.appendChild(cardSoli);
                            info_usu.appendChild(cardAcep);
                            info_usu.appendChild(cardReti);
                            info_usu.appendChild(cardEntre);
                            info_usu.appendChild(cardFinal);

                            p_cargas.innerHTML = `<h5 style="color:#4136df">Totalizador de Cargas</h5> 
                                              <b>Total de Cargas: </b> ${data.length} </br>
                                              Cantidad <b>Publicadas: </b> ${cant_cargas_publicadas} </br>
                                              Cantidad <b>Solicitadas: </b> ${cant_cargas_solicitadas} </br>
                                              Cantidad <b>Aceptadas: </b> ${cant_cargas_aceptadas} </br>
                                              Cantidad <b>Retiradas: </b> ${cant_cargas_retiradas} </br>
                                              Cantidad <b>Entregadas: </b> ${cant_cargas_entregadas} </br>
                                              Cantidad <b>Finalizadas: </b>${cant_cargas_finalizadas}`;
                            div_card_info_usuario.appendChild(p_cargas);

                            if (cant_cargas_publicadas == 0) {
                                cardPubli.classList.add('d-none')
                            }
                            if (cant_cargas_solicitadas == 0) {
                                cardSoli.classList.add('d-none')
                            }
                            if (cant_cargas_aceptadas == 0) {
                                cardAcep.classList.add('d-none')
                            }
                            if (cant_cargas_retiradas == 0) {
                                cardReti.classList.add('d-none')
                            }
                            if (cant_cargas_entregadas == 0) {
                                cardEntre.classList.add('d-none')
                            }
                            if (cant_cargas_finalizadas == 0) {
                                cardFinal.classList.add('d-none')
                            }

                        })
                        .catch(err => { console.log(err); })


                }
                div.appendChild(h3);
                div.appendChild(p);

                //Mis Camiones - Transportista
                btn_mis_camiones.addEventListener('click', () => {
                    window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=1`;
                });

                //Mi Perfil
                btn_perfil.addEventListener('click', () => {
                    window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
                });

                //Buscar Cargas - Transportista
                btn_buscar_carga.addEventListener('click', () => {
                    window.location.href = `./search.html?cod_usuario=${cod_usuario}&tpo_usuario=1`;
                });

                //Mis Solicitudes
                btn_my_request.addEventListener('click', () => {
                    window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=1`;
                });

                //Mis Cargas - Dador de Carga
                btn_mis_cargas.addEventListener('click', () => {
                    window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=2`;
                });

                //Cerrar Sesión
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
            })
            .catch(err => { console.log(err); })

    } else {
        alert("Usted NO ha Iniciado Sesión");
        window.location.href = './index.html';
    }
})