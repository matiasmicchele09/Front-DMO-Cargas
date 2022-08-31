const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario');
const formularioPerfil = document.getElementById("form_profile");
var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {


    fetch(`http://localhost:3000/my_profile/${cod_usuario}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data[0]);
            let datosUsuario = data[0];
            let btn_logOut = document.querySelector(".btn-salir");

            for (let obj in datosUsuario) {

                if (`${obj}` != "cod_usuario" && `${obj}` != "tipo_usuario") {
                    let divGrupo = document.createElement('div'),
                        divInput = document.createElement('div');

                    divGrupo.classList.add("form_grupo");
                    divInput.classList.add("form_grupo_input");

                    let label = document.createElement('label'),
                        input = document.createElement('input');

                    input.setAttribute("type", 'text');
                    input.classList.add("form-control");
                    input.setAttribute("id", `${obj}`);
                    input.setAttribute("name", `${obj}`);
                    label.innerHTML = `${obj}`.toUpperCase().replace('_', ' ');
                    if (`${obj}` == "fec_nacim") {
                        input.type = "date"
                    }

                    input.value = `${datosUsuario[obj]}`;

                    if (`${obj}` == "fec_nacim") {
                        let fecha = `${datosUsuario[obj]}`.substring(0, 10);
                        input.value = fecha;
                    }

                    divGrupo.appendChild(label);
                    divInput.appendChild(input);
                    input.disabled = true;
                    divGrupo.appendChild(divInput);
                    formularioPerfil.appendChild(divGrupo);
                }
            }

            let btn_back = document.querySelector(".parr_volver"),
                btn_edit = document.createElement('button'),
                btn_cancel = document.createElement('button'),
                btn_save = document.createElement('button');

            btn_edit.type = "button";
            btn_edit.innerHTML = "Editar"
            btn_edit.classList.add("btn_edit_profile");

            btn_cancel.type = "button";
            btn_cancel.innerHTML = "Cancelar"
            btn_cancel.classList.add("btn_cancel_profile");

            btn_save.type = "submit";
            btn_save.innerHTML = "Guardar Cambios";
            btn_save.classList.add("btn_save_profile");

            formularioPerfil.appendChild(btn_edit);
            formularioPerfil.appendChild(btn_cancel);
            formularioPerfil.appendChild(btn_save);

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

            })

            //Botón Volver
            btn_back.addEventListener('click', (event) => {
                event.preventDefault();
                const inputs = document.querySelectorAll('#form_profile input');
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
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isDenied) {
                            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
                        }
                    })
                } else {
                    window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
                }
            })

            //Botón Editar
            btn_edit.addEventListener('click', (event) => {
                event.preventDefault();
                const inputs = document.querySelectorAll('#form_profile input');

                inputs.forEach((input) => {
                    input.disabled = false;
                })
            });

            //Botón Cancelar
            btn_cancel.addEventListener('click', (event) => {
                event.preventDefault();
                const inputs = document.querySelectorAll('#form_profile input');

                inputs.forEach((input) => {
                    input.disabled = true;
                })
            })

            //Botón Guardar
            btn_save.addEventListener('click', (event) => {
                event.preventDefault();
                const inputs = document.querySelectorAll('#form_profile input');
                let isAvailable = false;

                inputs.forEach((input) => {
                    if (input.disabled == true) {
                        isAvailable = true;
                    } else {
                        isAvailable = false;
                    }
                });

                if (isAvailable == false) {

                    let registroFormData = new FormData(formularioPerfil);
                    fetch('http://localhost:3000/update_profile', {
                            method: 'POST',
                            body: registroFormData,
                        })
                        /*.then(
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '¡Guardando Cambios!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    ).catch(
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: '¡Se ha producido un error!',
                            showConfirmButton: false,
                            timer: 1500
                        }))
*/
                    setTimeout(() => {
                        window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
                    }, 1500);
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'question',
                        title: '¡No ha modificado nada!',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            })
        })
} else {
    //Me parece que estas alertas no la tira porque al estar atada al CDN entonces si no carga el html no 
    //va a cargar el CDN. Tengo que ver como hacer.
    //Sino ya fue lo dejo sin nada y listo. En ninguna app que recuerde te salta un cartel con eso.
    //Simplemente muestra que no esta cargado nada porque no esta en su sesion
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