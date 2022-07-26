document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    fetch('http://localhost:3000/user-page', {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            let div = document.querySelector(".bienvenida");
            let logOut = document.createElement('input');
            let h3 = document.createElement('h3');
            logOut.type = "button"
            logOut.value = "Log Out"
            logOut.id = "logOut"
            h3.innerHTML = `Bienvenido <b>${data}</b>`;
            div.appendChild(h3);
            div.appendChild(logOut);




            let btn_logOut = document.getElementById('logOut');

            btn_logOut.addEventListener('click', (event) => {
                event.preventDefault();
                fetch('http://localhost:3000/logOut', {
                    method: 'GET'
                })
                window.location.href = './logIn.html';
            })






        })

})