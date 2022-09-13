const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
const tableBodyCamion = document.querySelector(".t_body_camion"),
    tableBodyCarroceria = document.querySelector(".t_body_carroceria");
let btn_agregar_camion = document.querySelector(".btn_agregar_camion"),
    btn_agregar_carroceria = document.querySelector(".btn_agregar_carroceria"),
    btn_dashboard = document.querySelector(".a-dashboard"),
    btn_logOut = document.querySelector(".btn-salir");
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    fetch(`http://localhost:3000/getTrucksUser/${cod_usuario}`, {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.length == 0) {

                let sinCamiones = document.createElement('h1');
                sinCamiones.innerHTML = "¡No tienes camiones cargados aún!"
                document.querySelector('.contenedor_camiones').appendChild(sinCamiones)

            } else {

                data.forEach(res => {

                    let btnEditCamion = document.createElement('button');
                    btnEditCamion.classList.add("btn_edit_camion")
                    btnEditCamion.innerHTML = 'Editar';
                    let btnDeleteCamion = document.createElement('button');
                    btnDeleteCamion.classList.add("btn_delete_camion")
                    btnDeleteCamion.innerHTML = 'Eliminar';

                    let tableRow = document.createElement('tr');
                    let tableData1 = document.createElement('td');
                    let tableData2 = document.createElement('td');
                    let tableData3 = document.createElement('td');
                    let tableData4 = document.createElement('td');
                    let tableData5 = document.createElement('td');
                    let tableData6 = document.createElement('td');
                    let tableData7 = document.createElement('td');

                    tableData1.innerHTML = `${res.patente_camion}`;
                    tableData2.innerHTML = `${res.marca}`;
                    tableData3.innerHTML = `${res.modelo}`;
                    tableData4.innerHTML = `${res.anio}`;

                    fetch(`http://localhost:3000/getOneTypeTruck/${res.cod_tipo_camion}`, {
                            method: 'GET',
                        }).then(res => res.json())
                        .then(data => {
                            let tipo_camion = data[0].descripcion;
                            tableData5.innerHTML = tipo_camion;
                        });

                    tableData6.appendChild(btnEditCamion);
                    tableData7.appendChild(btnDeleteCamion);

                    tableRow.appendChild(tableData1);
                    tableRow.appendChild(tableData2);
                    tableRow.appendChild(tableData3);
                    tableRow.appendChild(tableData4);
                    tableRow.appendChild(tableData5);
                    tableRow.appendChild(tableData6);
                    tableRow.appendChild(tableData7);
                    tableBodyCamion.appendChild(tableRow);

                    //Botón Eliminar
                    btnDeleteCamion.addEventListener("click", (event) => {
                        event.preventDefault();
                        Swal.fire({
                            title: '¿Está seguro que desea eliminar este Camión?',
                            icon: 'warning',
                            showDenyButton: false,
                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmButtonText: `Confirmar`,
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            allowOutsideClick: false,

                        }).then((result) => {
                            fetch(`http://localhost:3000/delete_camion/${res.patente_camion}`, {
                                    method: 'DELETE',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(res)
                                })
                                /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                Swal.fire({
                                    title: 'El Camión ha sido eliminado',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            }

                            setTimeout(() => {
                                location.reload();
                            }, 2000);


                        })
                    });

                    //Botón Editar
                    btnEditCamion.addEventListener("click", () => {
                        window.location.href = `./edit_truck.html?patente=${res.patente_camion}`;
                    })


                });
            }

        })


    fetch(`http://localhost:3000/getCarroceriasUser/${cod_usuario}`, {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {

            console.log(data);

            data.forEach(res => {

                let btnEditCarroceria = document.createElement('button');
                btnEditCarroceria.classList.add("btn_edit_camion")
                btnEditCarroceria.innerHTML = 'Editar';
                let btnDeleteCarroceria = document.createElement('button');
                btnDeleteCarroceria.classList.add("btn_delete_camion")
                btnDeleteCarroceria.innerHTML = 'Eliminar';

                let tableRow = document.createElement('tr');
                let tableData1 = document.createElement('td');
                let tableData2 = document.createElement('td');
                let tableData3 = document.createElement('td');
                let tableData4 = document.createElement('td');
                let tableData5 = document.createElement('td');
                let tableData6 = document.createElement('td');


                tableData1.innerHTML = `${res.patente_carroceria}`;
                tableData2.innerHTML = `${res.cant_ejes}`;
                tableData3.innerHTML = `${res.anio}`;

                fetch(`http://localhost:3000/getOneTipoCarroceria/${res.cod_tipo_carroceria}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        let tipo_carroceria = data[0].descripcion;
                        tableData4.innerHTML = tipo_carroceria;
                    });

                tableData5.appendChild(btnEditCarroceria);
                tableData6.appendChild(btnDeleteCarroceria);

                tableRow.appendChild(tableData1);
                tableRow.appendChild(tableData2);
                tableRow.appendChild(tableData3);
                tableRow.appendChild(tableData4);
                tableRow.appendChild(tableData5);
                tableRow.appendChild(tableData6);
                tableBodyCarroceria.appendChild(tableRow);

                //Botón Eliminar
                btnDeleteCarroceria.addEventListener("click", (event) => {
                    event.preventDefault();
                    Swal.fire({
                        title: '¿Está seguro que desea eliminar esta Carrocería?',
                        icon: 'warning',
                        showDenyButton: false,
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: `Confirmar`,
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                        allowOutsideClick: false,

                    }).then((result) => {
                        fetch(`http://localhost:3000/delete_carroceria/${res.patente_carroceria}`, {
                                method: 'DELETE',
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(res)
                            })
                            /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: 'La Carrocería ha sido eliminada',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                        }

                        setTimeout(() => {
                            location.reload();
                        }, 2000);


                    })
                });

                //Botón Editar
                btnEditCarroceria.addEventListener("click", () => {
                    window.location.href = `./edit_carroceria.html?patente=${res.patente_carroceria}`;
                })
            })
        })

    //Botón de Agregar Camión
    btn_agregar_camion.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./add_truck.html?cod_usuario=${cod_usuario}`;
    })

    //Botón de Agregar Carroceria
    btn_agregar_carroceria.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./add_carroceria.html?cod_usuario=${cod_usuario}`;
    })

    //Botón Dashboard
    btn_dashboard.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
    })

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
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: '¡No ha iniciado sesión!',
        showConfirmButton: false,
        timer: 1500
    })
    setTimeout(() => {
        window.location.href = './index.html';
    }, 1500);
}