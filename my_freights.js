const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
const tableBody = document.querySelector(".t_body");
let btn_agregar_carga = document.querySelector(".btn_plus");
var initialized_session = 'false';
let modal_tipo_carga = document.querySelector(".modal_tipo_carga");
let btn_cerrar_modal = document.querySelector(".btn-cerrar-modal");

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {


    //Botón de Agregar Camión
    btn_agregar_carga.addEventListener('click', (event) => {
        event.preventDefault();

        fetch('http://localhost:3000/getAllTiposCargas', {
                method: 'GET',
            }).then(res => res.json())
            .then(data => {
                //console.log(data);

                data.forEach(res => {
                    console.log(res);
                    let div = document.createElement('div');
                    div.classList.add("mb-3")
                    let button = document.createElement('button');
                    button.classList.add("btn_modal_tipo_carga");
                    button.setAttribute("id", res.cod_tipo_carga);
                    button.innerHTML = res.descripcion;
                    div.appendChild(button);
                    modal_tipo_carga.appendChild(div);
                })
            })
            /*window.location.href = `./add_freight.html?cod_usuario=${cod_usuario}`;*/

    })

    btn_cerrar_modal.addEventListener('click', (event) => {
        event.preventDefault();
        /*El reload lo hago al cerrar el modal para que se recargue la página porque sino, por ejemplo,
        si el dador de carga no se decidia la primera vez que iba a cargar un tipo de carga y lo cerraba
        y lo volví a abrir, entonces se empezaban a repetir los 6 tipos de cargas
        PERO NO SE SI ES LO MÁS OPTIMO, TAL VEZ SI TENES MUCHAS CARGAS TARDE EN CARGAR. BUSCAR OTRA FORMA
        */
        window.location.reload();
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