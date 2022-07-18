'use strict'

const btn_enviarFormulario = document.getElementById('btn-enviaFormulario');
const formularioRegistro = document.getElementById("formRegistro")

btn_enviarFormulario.addEventListener('click', (event) => {
    event.preventDefault();


    let registroFormData = new FormData(formularioRegistro);
    //debugger
    /*
        registroFormData.get("nom_usuario")

        let nombre = document.getElementById("nom_usuario").value;
        let apellido = document.getElementById("ape_usuario").value;
        let fecha_nac = document.getElementById("fec_nac_usuario").value;
        let nro_doc = document.getElementById("nro_doc_usuario").value;
        //let check = document.getElementById("check_hombre_usuario").value;
        let email = document.getElementById("email_usuario").value;
        let pass = document.getElementById("pass_usuario").value;

        alert(nombre + " " + apellido + " " + fecha_nac + " " + nro_doc + " " + email + " " + pass)*/


    fetch('http://localhost:3000/signUp', {
        method: 'POST',
        /*headers: {
            "Content-Type": "application/json"
        },*/
        body: registroFormData,
    });
})