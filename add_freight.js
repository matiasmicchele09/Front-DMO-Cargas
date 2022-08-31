const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
let btn_back = document.querySelector(".parr_volver");
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {
    //Botón Volver
    btn_back.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = `./my_freights.html?cod_usuario=${cod_usuario}`;
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