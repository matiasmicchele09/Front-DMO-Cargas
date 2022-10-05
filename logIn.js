const form_login = document.getElementById("form_logueo");

form_login.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById('email');
    let pass = document.getElementById('password');

    if (email.value == "" && pass.value == "") {
        document.getElementById('form__mensaje_error_advertencia').classList.add('form__mensaje_error_advertencia_activo')
        setTimeout(() => {
            document.getElementById('form__mensaje_error_advertencia').classList.remove('form__mensaje_error_advertencia_activo')
        }, 4000);

    } else {
        let logueoFormData = new FormData(form_login);

        fetch('http://localhost:3000/logIn', {
                method: 'POST',
                body: logueoFormData,
            }).then(res => res.json())
            .then(data => {

                if (data.length == 0) {

                    document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo')
                    setTimeout(() => {
                        document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
                    }, 4000);
                } else {
                    //console.log(data[0].cod_usuario);
                    let cod_usuario = data[0].cod_usuario;

                    document.getElementById('form__mensaje_exito').classList.add('form__mensaje_exito_activo');

                    //SESIÓN
                    sessionStorage.setItem("initialized_session", "true");

                    setTimeout(() => {
                        window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}`;
                    }, 2000);

                }
            })
            //.catch(err => console.log(err))
    }
})