const form_login = document.getElementById("form_logueo");
//const formularioRegistro = document.getElementById("form_Registro");

form_logueo.addEventListener('submit', (e) => {
    e.preventDefault();

    //window.location.href = "./user-page.html"

    let logueoFormData = new FormData(form_login);
    //console.log(logueoFormData);


    fetch('http://localhost:3000/signIn', {
            method: 'POST',
            body: logueoFormData
        })
        /*      .then(res => res.json())
              .then(data => {
                  console.log(data);
              })*/
})