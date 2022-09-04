const getURL = new URLSearchParams(window.location.search),
    cod_usuario = getURL.get('cod_usuario'),
    cod_carga = getURL.get('carga'),
    inputs = document.querySelectorAll('#formulario_freight input');

    
let btn_back = document.querySelector(".parr_volver");
var initialized_session = 'false';
initialized_session = sessionStorage.getItem("initialized_session");

if (initialized_session == 'true') {
    
    inputs.forEach((input) => {
        input.disabled = true;
    });
    fetch(`http://localhost:3000/getOneCargaUser/${cod_carga}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .then(data => {
                        console.log(data)
                    })

}
//Botón Volver
btn_back.addEventListener('click', (event) => {
    event.preventDefault();
    javascript: history.back()
})