const getURL = new URLSearchParams(window.location.search),
    user = getURL.get('user');
const formularioPerfil = document.getElementById("form_profile");
var initialized_session = 'false';


initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {


    fetch(`http://localhost:3000/my_profile/${user}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data[0]);
            let datosUsuario = data[0];
            for (let obj in datosUsuario) {

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

                /* if (datosUsuario[obj] == "null") {
                    input.value = "Sin Datos"; //debira poner esto pero no estaría pasando
                } else {
                    input.value = `${datosUsuario[obj]}`;
                } */

                if (`${obj}` == "fec_nacim") {
                    input.type = "date"
                }

                input.value = `${datosUsuario[obj]}`;

                if (`${obj}` == "tipo_usuario") {
                    if (datosUsuario[obj] == "1") {
                        input.value = "Transportista";
                    } else {
                        input.value = "Dador de Carga";
                    }
                }

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
                    alert('Tiene cambios sin guardar')
                } else {
                    window.location.href = `./dashboard.html?user=${user}`;
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
                    alert('guardando cambios');

                    let registroFormData = new FormData(formularioPerfil);
                    fetch('http://localhost:3000/update_profile', {
                        method: 'POST',
                        body: registroFormData,
                    });
                    window.location.href = `./dashboard.html?user=${user}`;
                } else {
                    alert('No ha modificado nada')
                }
            })
        })
} else {
    alert("No ha Iniciado Sesión")
    window.location.href = './index.html';
}