'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        tpo_usuario = getURL.get('tpo_usuario'),
        tableBody = document.querySelector(".t_body");

    let modal_tipo_carga = document.querySelector(".modal_tipo_carga"),
        btn_cerrar_modal = document.querySelector(".btn-cerrar-modal"),
        btn_logOut = document.querySelector(".btn-salir"),
        btn_agregar_carga = document.querySelector(".btn_plus"),
        btn_dashboard = document.querySelector(".a-dashboard"),
        btn_mi_perfil = document.querySelector(".a-perfil");

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

        fetch(`http://localhost:3000/getCargasUser/${cod_usuario}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.length == 0) {
                    document.getElementById('no_cargas').innerHTML = "<b>Usted no ha realizado ningún alta de Cargas</b>"
                }
                data.forEach(res => {
                    let btnMas = document.createElement('button'),
                        btnSolicitudes = document.createElement('button');
                    btnMas.classList.add("btn_mas_carga");
                    btnSolicitudes.classList.add("btn_solicitudes_carga");
                    btnMas.innerHTML = 'Ver';
                    btnSolicitudes.innerHTML = 'Solicitudes';

                    let tableRow = document.createElement('tr'),
                        tableData1 = document.createElement('td'),
                        tableData2 = document.createElement('td'),
                        tableData3 = document.createElement('td'),
                        tableData4 = document.createElement('td'),
                        tableData5 = document.createElement('td'),
                        tableData6 = document.createElement('td'),
                        tableData7 = document.createElement('td');

                    tableData1.innerHTML = `${res.cod_carga}`;

                    fetch(`http://localhost:3000/getOneTipoCarga/${res.cod_tipo_carga}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            tableData2.innerHTML = `${res.cod_carga} - ${data[0].descripcion}`;
                        })
                        .catch(err => { console.log(err); })

                    fetch(`http://localhost:3000/getOneTipoProducto/${res.cod_tipo_producto}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            tableData2.innerHTML = tableData2.innerHTML + ` - ${data[0].descripcion}`;
                        })
                        .catch(err => { console.log(err); })


                    let loc_origen,
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

                    tableData4.innerHTML = `${loc_origen} - ${loc_destino}`;

                    tableData6.classList.add('th_ver_mas')
                    tableData7.classList.add('th_solicitudes')
                    fetch(`http://localhost:3000/getOneTipoEstado/${res.cod_estado_carga}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            //Puede parecer repetitivo este CASE pero cad estado lleva un nombre y un color distinto
                            switch (data[0].cod_estado_carga) {
                                case 1:
                                    tableData5.innerHTML = `<span class="badge text-bg-info">${data[0].descripcion}</span>`
                                    tableData7.appendChild(btnSolicitudes);
                                    break;
                                case 2:
                                    tableData5.innerHTML = `<span class="badge text-bg-warning">${data[0].descripcion}</span>`;
                                    tableData7.appendChild(btnSolicitudes);
                                    break;
                                case 3:
                                    tableData5.innerHTML = `<span class="badge text-bg-success">${data[0].descripcion}</span>`
                                    tableData7.appendChild(btnSolicitudes);
                                    break;
                                case 4:
                                    tableData5.innerHTML = `<span class="badge text-bg-light">${data[0].descripcion}</span>`
                                    tableData7.appendChild(btnSolicitudes);
                                    break;
                                case 5:
                                    tableData5.innerHTML = `<span class="badge text-bg-primary">${data[0].descripcion}</span>`
                                    tableData7.appendChild(btnSolicitudes);
                                    break;
                                case 6:
                                    tableData5.innerHTML = `<span class="badge text-bg-dark">${data[0].descripcion}</span>`
                                    tableData7.appendChild(btnSolicitudes);
                                    break;
                            }
                        })
                        .catch(err => { console.log(err); })

                    tableData6.appendChild(btnMas);

                    //tableRow.appendChild(tableData1);
                    tableRow.appendChild(tableData2);
                    //tableRow.appendChild(tableData3);
                    tableRow.appendChild(tableData4);
                    tableRow.appendChild(tableData5);
                    tableRow.appendChild(tableData6);
                    tableRow.appendChild(tableData7);
                    tableBody.appendChild(tableRow);

                    btnMas.addEventListener('click', (event) => {
                        event.preventDefault();
                        window.location.href = `./view_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&cod_carga=${res.cod_carga}`;
                    })

                    btnSolicitudes.addEventListener('click', (event) => {
                        event.preventDefault();
                        window.location.href = `./my_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&cod_carga=${res.cod_carga}`;
                    })

                })
            })
            .catch(err => { console.log(err); })

        //Botón de Agregar Carga
        btn_agregar_carga.addEventListener('click', (event) => {
            event.preventDefault();

            fetch('http://localhost:3000/getAllTiposCargas', {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {

                    data.forEach(res => {
                        //console.log(res);

                        let div = document.createElement('div');
                        let button = document.createElement('button');
                        div.classList.add("mb-3")
                        button.classList.add("btn_modal_tipo_carga");
                        button.setAttribute("id", res.cod_tipo_carga);
                        button.innerHTML = res.descripcion;
                        div.appendChild(button);
                        modal_tipo_carga.appendChild(div);

                        //Botón de elección de Tipo de Carga
                        button.addEventListener('click', (event) => {
                            event.preventDefault();
                            const positionButton = button.getAttribute("id");
                            window.location.href = `./add_freight.html?cod_usuario=${cod_usuario}&tipo_carga=${positionButton}`;
                        });
                    });
                })
                .catch(err => { console.log(err); })
        })

        //Botón Cerrar Modal
        btn_cerrar_modal.addEventListener('click', (event) => {
            event.preventDefault();
            /*El reload lo hago al cerrar el modal para que se recargue la página porque sino, por ejemplo, si el dador de carga no se decidia la primera vez que iba a cargar un tipo de carga y lo cerraba
            y lo volví a abrir, entonces se empezaban a repetir los 6 tipos de cargas
            PERO NO SE SI ES LO MÁS OPTIMO, TAL VEZ SI TENES MUCHAS CARGAS TARDE EN CARGAR. BUSCAR OTRA FORMA*/
            window.location.reload();
        })

        //Botón Dashboard
        btn_dashboard.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Botón Mi Perfil
        btn_mi_perfil.addEventListener('click', () => {
            window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
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