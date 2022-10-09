const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    tpo_usuario = getURL.get('tpo_usuario'),
    cod_carga = getURL.get('cod_carga');
const tableBodyRequest = document.querySelector(".t_body_solicitudes");

let btn_dashboard = document.querySelector(".a-dashboard"),
    btn_mis_camiones = document.querySelector(".a-mis-camiones"),
    btn_buscar_carga = document.querySelector(".a-buscar-cargas"),
    btn_my_request = document.querySelector(".a-mis-solicitudes"),
    btn_mis_cargas = document.querySelector(".a-mis-cargas"),
    btn_mi_perfil = document.querySelector(".a-perfil"),
    btn_logOut = document.querySelector(".btn-salir");
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");
document.addEventListener('DOMContentLoaded', () => {
    if (initialized_session == 'true') {

        fetch(`http://localhost:3000/getNameUser/${cod_usuario}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                btn_mi_perfil.innerHTML = `${data[0].razon_social}`;
            })

        if (tpo_usuario == '1') {
            let nav_mis_cargas = document.querySelector(".nav-mis-cargas");
            nav_mis_cargas.classList.add("nav-mis-cargas-none");

            fetch(`http://localhost:3000/getUserRequest/${cod_usuario}`, {
                    method: 'GET',
                }).then(res => res.json())
                .then(data => {
                    console.log(data);

                    data.forEach(res => {
                        let tableRow = document.createElement('tr'),
                            tableData1 = document.createElement('td'),
                            tableData2 = document.createElement('td'),
                            tableData3 = document.createElement('td'),
                            tableData4 = document.createElement('td'),
                            tableData5 = document.createElement('td'),
                            btnMas = document.createElement('button'),
                            fecha_solicitud = new Date(res.fec_solicitud);
                        btnMas.classList.add("btn_mas_carga");
                        btnMas.innerHTML = 'Ver más';

                        tableData1.innerHTML = `${res.cod_solicitud}`;
                        fetch(`http://localhost:3000/getOneCargaUser/${res.cod_carga}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        tableData2.innerHTML = data[0].descripcion;
                                    });
                            });

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
                                        break;
                                    case 3:
                                        tableData4.innerHTML = `<span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                        break;
                                }


                            });

                        tableData5.appendChild(btnMas);

                        tableRow.appendChild(tableData1);
                        tableRow.appendChild(tableData2);
                        tableRow.appendChild(tableData3);
                        tableRow.appendChild(tableData4);
                        tableRow.appendChild(tableData5);
                        tableBodyRequest.appendChild(tableRow);

                        btnMas.addEventListener('click', (event) => {
                            event.preventDefault();
                            window.location.href = `./view_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${res.cod_solicitud}&cod_carga=${res.cod_carga}`;
                        })

                    })
                })
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
                            tableData5 = document.createElement('td'),
                            btnMas = document.createElement('button'),
                            fecha_solicitud = new Date(res.fec_solicitud);
                        btnMas.classList.add("btn_mas_carga");
                        btnMas.innerHTML = 'Ver más';

                        tableData1.innerHTML = `${res.cod_solicitud}`;
                        fetch(`http://localhost:3000/getOneCargaUser/${res.cod_carga}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                fetch(`http://localhost:3000/getOneTipoProducto/${data[0].cod_tipo_producto}`, {
                                        method: 'GET',
                                    }).then(res => res.json())
                                    .then(data => {
                                        tableData2.innerHTML = data[0].descripcion;
                                    });
                            });

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
                                        break;
                                    case 3:
                                        tableData4.innerHTML = `<span class="badge text-bg-danger">${data[0].descripcion}</span>`
                                        break;
                                }
                            });

                        tableData5.appendChild(btnMas);

                        tableRow.appendChild(tableData1);
                        tableRow.appendChild(tableData2);
                        tableRow.appendChild(tableData3);
                        tableRow.appendChild(tableData4);
                        tableRow.appendChild(tableData5);
                        tableBodyRequest.appendChild(tableRow);
                        btnMas.addEventListener('click', (event) => {
                            event.preventDefault();
                            window.location.href = `./view_request.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&request=${res.cod_solicitud}&cod_carga=${res.cod_carga}`;
                        })

                    })
                })
        }



        //Mis Camiones
        btn_mis_camiones.addEventListener('click', () => {
            window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });
        //Botón Dashboard
        btn_dashboard.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });
        //Buscar Cargas - Transportista
        btn_buscar_carga.addEventListener('click', () => {
            window.location.href = `./search.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
        });

        //Mis Cargas - Dador de Carga
        btn_mis_cargas.addEventListener('click', () => {
            window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
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
    }
})