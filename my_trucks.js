const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
let btn_agregar_camion = document.querySelector(".btn_plus")
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    btn_agregar_camion.addEventListener('click', (event) => {
        event.preventDefault();

        window.location.href = `./add_truck.html?cod_usuario=${cod_usuario}`;

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