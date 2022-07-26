const form_login = document.getElementById("form_logueo");
//const formularioRegistro = document.getElementById("form_Registro");

form_logueo.addEventListener('submit', (e) => {
    e.preventDefault();

    let email = document.getElementById('email');
    let pass = document.getElementById('password');

    console.log(email.value);
    if (email.value == "" && pass.value == "") {
        document.getElementById('form__mensaje_error_advertencia').classList.add('form__mensaje_error_advertencia_activo')
    } else {
        let logueoFormData = new FormData(form_login);

        fetch('http://localhost:3000/logIn', {
                method: 'POST',
                body: logueoFormData
            }).then(res => res.json())
            .then(data => {
                //console.log(data[0])                
                if (data.length == 0) {
                    console.log("El usuario y/o contraseña ha sido mal ingresado");
                    document.getElementById('form__mensaje_error_advertencia').classList.remove('form__mensaje_error_advertencia_activo')
                    document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
                } else {
                    //Esto se pone por si la primera vez le error le desaparezca el cartel.
                    document.getElementById('form__mensaje_error_advertencia').classList.remove('form__mensaje_error_advertencia_activo')
                    document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')

                    //console.log(`bienvenido ${data[0].email}`);
                    setTimeout(() => {
                        window.location.href = './user-page.html';
                    }, 2000);

                }
            })
    }
})