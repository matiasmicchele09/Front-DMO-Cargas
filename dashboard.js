const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');

var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    document.addEventListener('DOMContentLoaded', (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/dashboard/${cod_usuario}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data[0]);

                let div = document.querySelector(".dashboard");
                let btn_perfil = document.querySelector(".a-perfil");
                let btn_mis_camiones = document.querySelector(".a-mis-camiones");
                let btn_logOut = document.querySelector(".btn-salir");
                let h3 = document.createElement('h3');
                let h4 = document.createElement('h4');

                h3.innerHTML = `Bienvenido <b>${data[0].razon_social}</b>`;
                if (data[0].tipo_usuario == '1') {
                    h4.innerHTML = 'Usted está registrado como Transportista'
                } else {
                    h4.innerHTML = 'Usted está registrado como Dador de Carga'
                }
                div.appendChild(h3);
                div.appendChild(h4);

                btn_mis_camiones.addEventListener('click', () => {
                    window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}`;
                });

                btn_perfil.addEventListener('click', () => {
                    window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}`;
                });

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