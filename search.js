const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    tpo_usuario = getURL.get('tpo_usuario');
let btn_dashboard = document.querySelector(".a-dashboard"),
    btn_logOut = document.querySelector(".btn-salir"),
    btn_mis_camiones = document.querySelector(".a-mis-camiones"),
    btn_mi_perfil = document.querySelector(".a-perfil");

var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    let btnBuscarCarga = document.getElementById("btn_buscar_carga"),
        inputBusquedaCarga = document.getElementById("buscar_carga");


    btnBuscarCarga.addEventListener("click", (event) => {
        event.preventDefault();
        let nombre_provincia = inputBusquedaCarga.value;





        fetch(`http://localhost:3000/searchCarga/${nombre_provincia}`, {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                console.log(data);

                let contenedor = document.querySelector(".info_cargas_disponibles");

                // HACER UNA ANIMACIÓN DE BUSQUEDA,
                if (data.length == 0) {
                    document.querySelector(".carga_no_encontrada").classList.add("muestra_carga_no_encontrada")
                } else {
                    document.querySelector(".carga_no_encontrada").classList.remove("muestra_carga_no_encontrada")

                    data.forEach(res => {

                        let card = document.createElement('div'),
                            cardHeader = document.createElement('div'),
                            cardBody = document.createElement('div'),
                            cardBody2 = document.createElement('div'),
                            cardText1 = document.createElement('p'),
                            cardText2 = document.createElement('p'),
                            cardText3 = document.createElement('p'),
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
                        //cardText3.classList.add("cardText3-carga");
                        btnVerDetalle.classList.add("btn_ver_detalle");


                        fetch(`http://localhost:3000/getOneTipoCarga/${res.cod_tipo_carga}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {

                                cardHeader.innerHTML = `<h5 style="display: inline-block";> ${data[0].descripcion} - </h5>`
                            });

                        fetch(`http://localhost:3000/getOneTipoProducto/${res.cod_tipo_producto}`, {
                                method: 'GET',
                            }).then(res => res.json())
                            .then(data => {
                                cardHeader.innerHTML = cardHeader.innerHTML + ` <b>${data[0].descripcion}</b>`
                            });


                        /*TENGO QUE VER COMOM MOSTRAR LA FECHA Y HORA DE OTRA MANERA LA PUTA MADRE*/
                        cardText1.innerHTML = `<b>${res.ciudad_origen}</b> ${res.prov_origen} <br> 
                                          <b>${res.fec_retiro.substring(0, 10)}</b> ${res.hora_retiro.substring(0, 5)}`;
                        cardText2.innerHTML = `<b>${res.ciudad_destino}</b> ${res.prov_destino} <br> 
                            <b>${res.fec_destino.substring(0, 10)}</b> ${res.hora_destino.substring(0, 5)}`


                        btnVerDetalle.innerHTML = "Ver Detalle";



                        card.appendChild(cardHeader);
                        cardBody.appendChild(cardText1);
                        cardBody.appendChild(cardText2);
                        if (res.comentario != "") {
                            cardText3.innerHTML = `<b>${res.comentario}</b>`;

                            cardBody2.appendChild(cardText3);
                        }
                        card.appendChild(cardBody);
                        card.appendChild(cardBody2);
                        card.appendChild(btnVerDetalle);
                        contenedor.appendChild(card);



                        btnVerDetalle.addEventListener("click", () => {
                            //alert(res.cod_carga)
                            window.location.href = `./view_freights.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}&carga=${res.cod_carga}`;
                        })


                    })
                }

            })

    })


    //Botón Dashboard
    btn_dashboard.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
    });

    //Mis Camiones - Transportista
    btn_mis_camiones.addEventListener('click', () => {
        window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}`;
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