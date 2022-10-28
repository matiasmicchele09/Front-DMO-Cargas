'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario');

    var initialized_session = 'false';

    initialized_session = sessionStorage.getItem("initialized_session");


    if (initialized_session == 'true') {
        fetch(`http://localhost:3000/dashboard/${cod_usuario}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data[0]);

                let div = document.querySelector(".dashboard"),
                    btn_perfil = document.querySelector(".a-perfil"),
                    btn_mis_camiones = document.querySelector(".a-mis-camiones"),
                    btn_buscar_carga = document.querySelector(".a-buscar-cargas"),
                    btn_my_request = document.querySelector(".a-mis-solicitudes"),
                    btn_mis_cargas = document.querySelector(".a-mis-cargas"),
                    btn__manual_usuario = document.querySelector(".a-manual-usuario"),
                    div_card_info_usuario = document.getElementById('card_body_info_usuario'),
                    btn_logOut = document.querySelector(".btn-salir"),
                    h3 = document.createElement('h3'),
                    p = document.createElement('p');

                btn_perfil.innerHTML = `${data[0].razon_social}`;
                btn__manual_usuario.href = 'http://localhost:5000/assets/files/manual_de_usuario.pdf';
                btn__manual_usuario.target = '_blank';
                btn__manual_usuario.download = 'manual_de_usuario.pdf';
                h3.innerHTML = `Bienvenido <b>${data[0].razon_social}</b>`;

                if (data[0].tipo_usuario == '1') {

                    let datos_transpor = Object.values(data[0]);

                    //Si no incluye nulos saca el cartel. 
                    if (!datos_transpor.includes(null)) {
                        document.getElementById("alerta_datos").classList.add("alerta_datos_none")
                    }


                    let nav_mis_cargas = document.querySelector(".nav-mis-cargas");
                    nav_mis_cargas.classList.add("nav-mis-cargas-none");
                    p.innerHTML = 'Usted está registrado como <b>Transportista</b>';
                    fetch(`http://localhost:3000/getTrucksUser/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let p_camion = document.createElement('p');
                            p_camion.innerHTML = `<h5>Transporte</h5> <hr>
                        <b>Cantidad de Camiones: </b> ${data.length}`;
                            div_card_info_usuario.appendChild(p_camion)
                        })
                        .catch(err => { console.log(err); })

                    fetch(`http://localhost:3000/getCarroceriasUser/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let p_carroceria = document.createElement('p');
                            p_carroceria.innerHTML = `<b>Cantidad de Carrocerías: </b> ${data.length}`;
                            div_card_info_usuario.appendChild(p_carroceria)
                        })
                        .catch(err => { console.log(err); })

                    fetch(`http://localhost:3000/getUserRequest/${cod_usuario}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            console.log(data);
                            let p_solicitudes = document.createElement('p'),
                                cant_aceptadas = 0,
                                cant_rechazadas = 0,
                                cant_solicitadas = 0;
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
                            })

                            p_solicitudes.innerHTML = `<h5>Solicitudes</h5> <hr>
                                                   <b>Cantidad de Solicitudes: </b> ${data.length} </br>
                                                   <b>Cantidad Solicitadas: </b>${cant_solicitadas}</br>
                                                   <b>Cantidad Aceptadas: </b>${cant_aceptadas}</br>
                                                   <b>Cantidad Rechazadas: </b>${cant_rechazadas}`;
                            div_card_info_usuario.appendChild(p_solicitudes)
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
                                cant_cargas_entregadas = 0;

                            data.forEach(res => {
                                switch (res.cod_estado_carga) {
                                    case 1:
                                        cant_cargas_publicadas = cant_cargas_publicadas + 1;
                                        break;
                                    case 2:
                                        cant_cargas_solicitadas = cant_cargas_solicitadas + 1;
                                        break;
                                    case 3:
                                        cant_cargas_aceptadas = cant_cargas_aceptadas + 1;
                                        break;
                                    case 4:
                                        cant_cargas_retiradas = cant_cargas_retiradas + 1;
                                        break;
                                    case 5:
                                        cant_cargas_entregadas = cant_cargas_entregadas + 1;
                                        break;
                                }
                            })
                            p_cargas.innerHTML = `<h5>Cargas</h5> <hr>
                                              <b>Cantidad Total de Cargas: </b> ${data.length} </br>
                                              <b>Cantidad de Cargas Publicadas: </b> ${cant_cargas_publicadas} </br>
                                              <b>Cantidad de Cargas Solicitadas: </b> ${cant_cargas_solicitadas} </br>
                                              <b>Cantidad de Cargas Aceptadas: </b> ${cant_cargas_aceptadas} </br>
                                              <b>Cantidad de Cargas Retiradas: </b> ${cant_cargas_retiradas} </br>
                                              <b>Cantidad de Cargas Entregadas: </b> ${cant_cargas_entregadas} </br>`;
                            div_card_info_usuario.appendChild(p_cargas);
                        })
                        .catch(err => { console.log(err); })


                }
                div.appendChild(h3);
                div.appendChild(p);

                //Mis Camiones - Transportista
                btn_mis_camiones.addEventListener('click', () => {
                    window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
                });

                //Mi Perfil
                btn_perfil.addEventListener('click', () => {
                    window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
                });

                //Buscar Cargas - Transportista
                btn_buscar_carga.addEventListener('click', () => {
                    window.location.href = `./search.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
                });

                //Mis Solicitudes
                btn_my_request.addEventListener('click', () => {
                    window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
                });

                //Mis Cargas - Dador de Carga
                btn_mis_cargas.addEventListener('click', () => {
                    window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
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