'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        tpo_usuario = getURL.get('tpo_usuario');
    let btn_dashboard = document.querySelector(".a-dashboard"),
        btn_my_request = document.querySelector(".a-mis-solicitudes"),
        btn_logOut = document.querySelector(".btn-salir"),
        btn_mis_camiones = document.querySelector(".a-mis-camiones"),
        btn_mi_perfil = document.querySelector(".a-perfil");

    var initialized_session = 'false';

    initialized_session = sessionStorage.getItem("initialized_session");

    if (initialized_session == 'true') {
        fetch(`http://localhost:3000/getNameUser/${cod_usuario}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                btn_mi_perfil.innerHTML = `${data[0].razon_social}`;
            })
            .catch(err => { console.log(err); })

        let selectProvincia = document.getElementById('selectProvincia');


        fetch('http://localhost:3000/getAllCargas', {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                console.log(data);
                let prov_repetidas = [],
                    prov_no_repetidas = [],
                    prov_no_repetidas_ordenadas = [];

                data.forEach(res => {

                    let provincia = res.origen.split(",")
                    if (provincia.length == 3) {
                        prov_repetidas.push(provincia[1].trim())
                    }
                    if (provincia.length == 2) {
                        prov_repetidas.push(provincia[0].trim())
                    }
                    console.log(prov_repetidas);


                    for (let i = 0; i < prov_repetidas.length; i++) {
                        if (prov_no_repetidas.includes(prov_repetidas[i])) {} else {
                            prov_no_repetidas.push(prov_repetidas[i]);
                        }
                    }
                    //No encontré otra manera de poder asignar al option las prov ordenadas. Tuve que hacerlo así, con 3 arreglos
                    prov_no_repetidas_ordenadas = prov_no_repetidas.sort();
                })

                for (let i = 0; i < prov_no_repetidas_ordenadas.length; i++) {
                    let option = document.createElement('option');
                    //console.log(prov_no_repetidas_ordenadas[i]);
                    option.innerHTML = `${prov_no_repetidas_ordenadas[i]}`;
                    selectProvincia.appendChild(option);
                }
            })
            .catch(err => { console.log(err); })

        //Esta variable "primera_vez" es para que me limpie la grilla de cards cada vez que va cambiando de provincia.
        let primera_vez = true;
        selectProvincia.addEventListener("change", (event) => {
            event.preventDefault();

            if (selectProvincia.value == 0) {
                let p = document.querySelector(".p_cant_reg"),
                    divs = document.querySelectorAll("#info_cargas_disponibles div");

                divs.forEach((div) => {
                    div.classList.add("card-carga-none");
                });
                p.classList.add("p_cant_reg_none");


            } else {
                if (primera_vez == false) {

                    let p = document.querySelector(".p_cant_reg"),
                        divs = document.querySelectorAll("#info_cargas_disponibles div");
                    divs.forEach((div) => {
                        div.classList.add("card-carga-none");
                    });
                    p.classList.add("p_cant_reg_none");

                }

                console.log(typeof selectProvincia.value);
                fetch(`http://localhost:3000/searchCarga/${selectProvincia.value}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        //console.log(data);

                        let contenedor = document.querySelector(".info_cargas_disponibles"),
                            p = document.querySelector(".p_cant_reg");
                        p.classList.remove("p_cant_reg_none");
                        p.innerHTML = `<b>Cantidad de Cargas encontradas: ${data.length}</b>`;


                        data.forEach(res => {

                            let card = document.createElement('div'),
                                cardHeader = document.createElement('div'),
                                cardBody = document.createElement('div'),
                                cardBody2 = document.createElement('div'),
                                cardText1 = document.createElement('p'),
                                cardText2 = document.createElement('p'),
                                cardText3 = document.createElement('p'),
                                cardText4 = document.createElement('p'),
                                btnVerDetalle = document.createElement('button');

                            card.classList.add("card");
                            card.classList.add("card-carga");
                            cardHeader.classList.add("card-header");
                            cardBody.classList.add("card-body");
                            cardBody2.classList.add("card-body");
                            cardBody.classList.add("cardBbody-carga");
                            cardBody2.classList.add("body2-carga");
                            /*cardTitle.classList.add("card-title");*/
                            cardText1.classList.add("card-text");
                            cardText1.classList.add("cardText1-carga");
                            cardText2.classList.add("card-text");
                            cardText2.classList.add("cardText2-carga");
                            cardText3.classList.add("card-text");
                            cardText4.classList.add("card-text");
                            //cardText3.classList.add("cardText3-carga");
                            btnVerDetalle.classList.add("btn_ver_detalle");

                            fetch(`http://localhost:3000/getOneTipoCarga/${res.cod_tipo_carga}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {

                                    cardHeader.innerHTML = `<h5 style="display: inline-block";> ${data[0].descripcion} - </h5>`
                                })
                                .catch(err => { console.log(err); })

                            fetch(`http://localhost:3000/getOneTipoProducto/${res.cod_tipo_producto}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    cardHeader.innerHTML = cardHeader.innerHTML + ` <b>${data[0].descripcion}</b>`
                                })
                                .catch(err => { console.log(err); })

                            let fecha_retiro = new Date(res.fec_retiro),
                                fecha_destino = new Date(res.fec_destino),
                                loc_origen,
                                loc_destino,
                                pcia_origen,
                                pcia_destino;

                            switch (res.origen.split(",").length) {
                                case 2:
                                    loc_origen = `${res.origen.split(",")[0]} (Capital)`;
                                    break;
                                case 3:
                                    pcia_origen = res.origen.split(",")[1];
                                    loc_origen = `${res.origen.split(",")[0]} (${pcia_origen.trim()})`;
                                    break;
                                case 4:
                                    pcia_origen = res.origen.split(",")[2];
                                    loc_origen = `${res.origen.split(",")[1]} (${pcia_origen.trim()})`
                                    break;
                            }

                            switch (res.destino.split(",").length) {
                                case 2:
                                    loc_destino = `${res.destino.split(",")[0]} (Capital)`;
                                    break;
                                case 3:
                                    pcia_destino = res.destino.split(",")[1];
                                    loc_destino = `${res.destino.split(",")[0]} (${pcia_destino.trim()})`;
                                    break;
                                case 4:
                                    pcia_destino = res.destino.split(",")[2];
                                    loc_destino = `${res.destino.split(",")[1]} (${pcia_destino.trim()})`
                                    break;
                            }
                            //No hago lo mismo con la hora porque me la muestra siempre con los segundos. Es más fácil como está.                        
                            cardText1.innerHTML = `<b>${loc_origen}</b><br> 
                                          <b>${fecha_retiro.toLocaleDateString()}</b> ${res.hora_retiro.substring(0, 5)} Hs`;
                            cardText2.innerHTML = `<b>${loc_destino}</b><br> 
                            <b>${fecha_destino.toLocaleDateString()}</b> ${res.hora_destino.substring(0, 5)} Hs`

                            btnVerDetalle.innerHTML = "Ver Detalle";

                            card.appendChild(cardHeader);
                            cardBody.appendChild(cardText1);
                            cardBody.appendChild(cardText2);
                            if (res.comentario != "") {
                                cardText3.innerHTML = `<i>${res.comentario}</i> </br>`;
                                cardBody2.appendChild(cardText3);
                            } else {
                                cardText3.innerHTML = '';
                                cardBody2.appendChild(cardText3);
                            }
                            fetch(`http://localhost:3000/getNameUser/${res.cod_usuario}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    cardText3.innerHTML = cardText3.innerHTML + `<b>Dador de la carga: </b> ${data[0].razon_social} <br>`;
                                })
                                .catch(err => { console.log(err); })

                            cardText4.innerHTML = `<b>Valor: </b> $${res.valor_carga}`;
                            cardBody2.appendChild(cardText4);

                            card.appendChild(cardBody);
                            card.appendChild(cardBody2);
                            card.appendChild(btnVerDetalle);
                            contenedor.appendChild(card);

                            fetch(`http://localhost:3000/getUserRequest/${cod_usuario}`, {
                                    method: 'GET',
                                }).then(res => res.json())
                                .then(data => {
                                    let btnVerSolicitud = document.createElement('button');
                                    btnVerSolicitud.innerHTML = "Ver Solicitud";
                                    btnVerSolicitud.classList.add("btn_ver_solicitud");

                                    for (let i = 0; i < data.length; i++) {
                                        // console.log(data[i]);
                                        if (res.cod_carga == data[i].cod_carga) {
                                            card.removeChild(btnVerDetalle);
                                            btnVerSolicitud.setAttribute("id", data[i].cod_solicitud)
                                            card.appendChild(btnVerSolicitud);
                                        }
                                    }

                                    btnVerSolicitud.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        let cod_solicitud = btnVerSolicitud.getAttribute("id")
                                        window.location.href = `./view_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${cod_solicitud}&cod_carga=${res.cod_carga}`;
                                    })
                                })
                                .catch(err => { console.log(err); })

                            btnVerDetalle.addEventListener("click", () => {
                                window.location.href = `./view_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&cod_carga=${res.cod_carga}`;
                            });
                        })
                    })
                    .catch(err => { console.log(err); })

                primera_vez = false;
            }
        })



        //Botón Dashboard
        btn_dashboard.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Mis Camiones - Transportista
        btn_mis_camiones.addEventListener('click', () => {
            window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Mis Solicitudes
        btn_my_request.addEventListener('click', () => {
            window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Botón Mi Perfil
        btn_mi_perfil.addEventListener('click', () => {
            window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}`;
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