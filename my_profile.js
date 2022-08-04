const getURL = new URLSearchParams(window.location.search),
    user = getURL.get('user');

var initialized_session = 'false';

initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {


    fetch(`http://localhost:3000/my_profile/${user}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            let razon_social = document.createElement('h3');
            let cuit_cuil = document.createElement('p');
            let email = document.createElement('p');
            let div = document.querySelector(".my_profile");
            let btn_volver = document.createElement('input');
            btn_volver.type = "button";
            btn_volver.value = "Volver";

            razon_social.innerHTML = `${data[0].razon_social}`;
            cuit_cuil.innerHTML = `${data[0].cuit_cuil}`;
            email.innerHTML = `${data[0].email}`;

            div.appendChild(razon_social);
            div.appendChild(cuit_cuil);
            div.appendChild(email);
            div.appendChild(btn_volver);

            btn_volver.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `./dashboard.html?user=${user}`;
            })
        })
} else {
    alert("No ha Iniciado Sesión")
    window.location.href = './index.html';
}