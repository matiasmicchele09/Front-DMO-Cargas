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
                btn_logOut = document.querySelector(".btn-salir"),
                h3 = document.createElement('h3'),
                p = document.createElement('p');

            h3.innerHTML = `Bienvenido <b>${data[0].razon_social}</b>`;
            if (data[0].tipo_usuario == '1') {
                let nav_mis_cargas = document.querySelector(".nav-mis-cargas");
                nav_mis_cargas.classList.add("nav-mis-cargas-none");
                p.innerHTML = 'Usted está registrado como Transportista'
            } else {
                let nav_mis_camiones = document.querySelector(".nav-mis-camiones"),
                    nav_buscar_carga = document.querySelector(".nav-buscar-carga"),
                    nav_mis_solicitudes = document.querySelector(".nav-mis-solicitudes");
                nav_mis_camiones.classList.add("nav-mis-camiones-none");
                nav_mis_solicitudes.classList.add("nav-mis-solicitudes-none");
                nav_buscar_carga.classList.add("nav-buscar-carga-none");
                p.innerHTML = 'Usted está registrado como Dador de Carga'
            }
            div.appendChild(h3);
            div.appendChild(p);

            //Mis Camiones - Transportista
            btn_mis_camiones.addEventListener('click', () => {
                window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}&tpo_usuario=${data[0].tipo_usuario}`;
            });

            //Mi Perfil
            btn_perfil.addEventListener('click', () => {
                window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}`;
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
                window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}`;
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