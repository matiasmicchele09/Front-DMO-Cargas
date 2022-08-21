const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
let btn_back = document.querySelector(".parr_volver");
const formularioCamion = document.getElementById('form_truck')
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {


    fetch('http://localhost:3000/getTruck', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            console.log(data);

            for (i in data) {
                //console.log(data[i]);
                let select = document.getElementById('selectCamion');
                let option = document.createElement('option');
                option.setAttribute('value', `${data[i].cod_tipo_camion}`)
                option.innerHTML = `${data[i].descripcion}`;
                select.appendChild(option);
            }

        })
    fetch('http://localhost:3000/getCarroceria', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            console.log(data);

            for (i in data) {
                //console.log(data[i]);
                let select = document.getElementById('selectCarroceria');
                let option = document.createElement('option');
                option.setAttribute('value', `${data[i].cod_tipo_carroceria}`)
                option.innerHTML = `${data[i].descripcion}`;
                select.appendChild(option);
            }

        })






    btn_back.addEventListener('click', (event) => {
        event.preventDefault();


        /* Me parece que muestra igual el HTML porque justamente no lo genero con JS 
        Pero seguro lo dejo así porque al no poder acceder al JS no funcionan los botones de volver. 
        */
        /* const inputs = document.querySelectorAll('#form_profile input');
        let isAvailable = false;

        inputs.forEach((input) => {
            if (input.disabled == false) {
                isAvailable = true;
            } else {
                isAvailable = false;
            }
        });

        if (isAvailable == true) {
            Swal.fire({
                title: '¡Hay cambios sin guardar!',
                text: 'Si sale de la página no se guardarán',
                icon: 'warning',
                showDenyButton: true,
                showConfirmButton: false,
                showCancelButton: true,
                denyButtonText: `Salir`,
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                allowOutsideClick: false,

            }).then((result) => {
                /* Read more about isConfirmed, isDenied below 
                if (result.isDenied) {
                    window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
                }
            })
        } else {
            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
        } */
        window.location.href = `./my_trucks.html?cod_usuario=${cod_usuario}`;
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