const getURL = new URLSearchParams(window.location.search),
    user = getURL.get('user');

var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {

    document.addEventListener('DOMContentLoaded', (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/dashboard/${user}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data[0]);

                let div = document.querySelector(".dashboard");
                let btn_perfil = document.querySelector(".a-perfil");
                let h3 = document.createElement('h3');

                h3.innerHTML = `Bienvenido <b>${user}</b>`;
                div.appendChild(h3);

                btn_perfil.addEventListener('click', () => {
                    window.location.href = `./my_profile.html?user=${data[0].email}`;
                })

                let btn_logOut = document.querySelector(".btn-salir");

                btn_logOut.addEventListener('click', (event) => {
                    event.preventDefault();
                    sessionStorage.removeItem("initialized_session");
                    window.location.href = './index.html';
                })
            })
    })
} else {
    alert("No ha Iniciado Sesión")
    window.location.href = './index.html';
}