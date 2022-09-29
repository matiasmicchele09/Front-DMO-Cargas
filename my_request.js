const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
const tableBodyRequest = document.querySelector(".t_body_solicitudes");

let btn_dashboard = document.querySelector(".a-dashboard"),
    btn_mis_camiones = document.querySelector(".a-mis-camiones"),
    btn_buscar_carga = document.querySelector(".a-buscar-cargas"),
    btn_mi_perfil = document.querySelector(".a-perfil"),
    btn_logOut = document.querySelector(".btn-salir");
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");
document.addEventListener('DOMContentLoaded', () => {
    if (initialized_session == 'true') {

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
                        fecha_solicitud = new Date(res.fec_solicitud);

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
                            tableData4.innerHTML = `<span class="badge text-bg-secondary">${data[0].descripcion}</span>`
                        });

                    tableRow.appendChild(tableData1);
                    tableRow.appendChild(tableData2);
                    tableRow.appendChild(tableData3);
                    tableRow.appendChild(tableData4);
                    tableBodyRequest.appendChild(tableRow);

                })
            })

        //Mis Camiones
        btn_mis_camiones.addEventListener('click', () => {
            window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}`;
        });
    }
})