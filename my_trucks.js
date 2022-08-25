const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
const tableBody = document.querySelector(".t_body");
let btn_agregar_camion = document.querySelector(".btn_plus")
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    fetch(`http://localhost:3000/getTrucksUser/${cod_usuario}`, {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            console.log(data);

            let btn_dashboard = document.querySelector(".a-dashboard");
            let btn_logOut = document.querySelector(".btn-salir");

            data.forEach(res => {

                let btnEdit = document.createElement('button');
                btnEdit.classList.add("btn_edit_camion")
                btnEdit.innerHTML = 'Editar';
                let btnDelete = document.createElement('button');
                btnDelete.classList.add("btn_delete_camion")
                btnDelete.innerHTML = 'Eliminar';

                let tableRow = document.createElement('tr');
                let tableData1 = document.createElement('td');
                let tableData2 = document.createElement('td');
                let tableData3 = document.createElement('td');
                let tableData4 = document.createElement('td');
                let tableData5 = document.createElement('td');
                let tableData6 = document.createElement('td');
                let tableData7 = document.createElement('td');
                let tableData8 = document.createElement('td');

                tableData1.innerHTML = `${res.patente}`;
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

                fetch(`http://localhost:3000/getOneTipoCarroceria/${res.cod_tipo_carroceria}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        let tipo_carroceria = data[0].descripcion;
                        tableData6.innerHTML = tipo_carroceria;
                    });

                tableData7.appendChild(btnEdit);
                tableData8.appendChild(btnDelete);
                tableRow.appendChild(tableData1);
                tableRow.appendChild(tableData2);
                tableRow.appendChild(tableData3);
                tableRow.appendChild(tableData4);
                tableRow.appendChild(tableData5);
                tableRow.appendChild(tableData6);
                tableRow.appendChild(tableData7);
                tableRow.appendChild(tableData8);
                tableBody.appendChild(tableRow);

                //Botón Eliminar
                btnDelete.addEventListener("click", () => {

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
                        fetch(`http://localhost:3000/delete/${res.patente}`, {
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
                btnEdit.addEventListener("click", () => {
                    window.location.href = `./edit_truck.html?patente=${res.patente}`;
                })


            });

            



            //Botón de Agregar Camión
            btn_agregar_camion.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `./add_truck.html?cod_usuario=${cod_usuario}`;
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

        })




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