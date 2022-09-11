const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    tableBody = document.querySelector(".t_body");

let modal_tipo_carga = document.querySelector(".modal_tipo_carga"),
    btn_cerrar_modal = document.querySelector(".btn-cerrar-modal"),
    btn_logOut = document.querySelector(".btn-salir"),
    btn_agregar_carga = document.querySelector(".btn_plus");

var initialized_session = 'false';
initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    let btn_dashboard = document.querySelector(".a-dashboard");
    console.log('aca', cod_usuario);
    fetch(`http://localhost:3000/getCargasUser/${cod_usuario}`, {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            data.forEach(res => {
                let btnMas = document.createElement('button');
                btnMas.classList.add("btn_mas_carga")
                btnMas.innerHTML = 'Ver más';

                let tableRow = document.createElement('tr');
                let tableData1 = document.createElement('td');
                let tableData2 = document.createElement('td');
                let tableData3 = document.createElement('td');
                let tableData4 = document.createElement('td');
                let tableData5 = document.createElement('td');
                let tableData6 = document.createElement('td');

                tableData1.innerHTML = `${res.cod_carga}`;

                fetch(`http://localhost:3000/getOneTipoCarga/${res.cod_tipo_carga}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        tableData2.innerHTML = data[0].descripcion;
                    });

                fetch(`http://localhost:3000/getOneTipoProducto/${res.cod_tipo_producto}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        tableData3.innerHTML = data[0].descripcion;
                    });

                tableData4.innerHTML = `${res.prov_origen} - ${res.prov_destino}`;

                fetch(`http://localhost:3000/getOneTipoEstado/${res.cod_estado_carga}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        //<span class="badge text-bg-danger">Danger</span>
                        tableData5.innerHTML = `<span class="badge text-bg-info">${data[0].descripcion}</span>`
                    });

                tableData6.appendChild(btnMas);

                tableRow.appendChild(tableData1);
                tableRow.appendChild(tableData2);
                tableRow.appendChild(tableData3);
                tableRow.appendChild(tableData4);
                tableRow.appendChild(tableData5);
                tableRow.appendChild(tableData6);
                tableBody.appendChild(tableRow);

                btnMas.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.location.href = `./view_freights.html?cod_usuario=${cod_usuario}&carga=${res.cod_carga}`;
                })

            })
        })


    //Botón de Agregar Camión
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