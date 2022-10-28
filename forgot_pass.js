'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
const formPassword = document.getElementById("form_password"),
inputs = document.querySelectorAll('#form_password input');
const expresiones = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^.{4,50}$/ // 4 a 50 digitos.    
}

const campos = {
    email: false,
    password: false    
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "email":
            validarCampo(expresiones.email, e.target, 'email');
            break;
        case "password":
            validarCampo(expresiones.password, e.target, 'password');
            break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario_grupo_incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario_grupo_correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-circle-xmark');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-circle-check');
        document.querySelector(`#grupo__${campo} .form__input_error`).classList.remove('form__input_error_activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario_grupo_incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario_grupo_correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-circle-check');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-circle-xmark');
        document.querySelector(`#grupo__${campo} .form__input_error`).classList.add('form__input_error_activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario); //para cuando pierde el foco, valida luego de terminar de escribir, creo es asi
})

formPassword.addEventListener('submit', (event) => {
    event.preventDefault();

    let pass = document.getElementById("password"),
     pass_2 = document.getElementById("password_2"),
     mail = document.getElementById('email');

     if (campos.email && campos.password) {
     if (pass.value != pass_2.value){
        document.getElementById("form__mensaje_error_pass").classList.add("form__mensaje_error_pass_activo");
        setTimeout(() => {
            document.getElementById("form__mensaje_error_pass").classList.remove("form__mensaje_error_pass_activo");
        }, 3000);
     }else{

        fetch(`http://localhost:3000/buscoEmail/${mail.value}`, {
                method: 'GET',                
            }).then(res => res.json())
            .then(data => {

                if (data.length == 0){
                    document.getElementById('form__mensaje_error_no_email').classList.add('form__mensaje_error_no_email_activo')
                        setTimeout(() => {
                            document.getElementById('form__mensaje_error_no_email').classList.remove('fform__mensaje_error_no_email_activo')
                        }, 3500);
                }else{
                    let registroFormData = new FormData(formPassword);
                            fetch('http://localhost:3000/update_password', {
                                    method: 'PUT',
                                    body: registroFormData,
                                })
                                .catch(err => { console.log(err); })

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: '¡Contraseña Actualizada!',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            setTimeout(() => {
                                window.location.href = 'logIn.html';
                            }, 2000);
                }
            })

        
     }
    }
     else{
        document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
                        setTimeout(() => {
                            document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
                        }, 3500);
     }



})


})