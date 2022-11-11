'use strict'
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const getURL = new URLSearchParams(window.location.search),
        cod_usuario = getURL.get('cod_usuario'),
        tpo_usuario = getURL.get('tpo_usuario'),
        formularioPerfil = document.getElementById("form_profile"),
        formularioCuenta = document.getElementById("form_cuenta_perfil"),
        formularioProfesional = document.getElementById("perfil_prof_transportista"),
        inputs = document.querySelectorAll('#form_profile input'), //me devuelve un arreglo de todos los inputs dentro del formulario
        inputsCuenta = document.querySelectorAll('#form_cuenta_perfil input');
    var initialized_session = 'false';

    const expresiones = {
        razon_social: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        cuit_cuil: /^\d{11,11}$/, // Supongo así valido que solo sean 11 números
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        password: /^.{4,50}$/, // 4 a 50 digitos.
        nro_telefono: /[0-9]/ // Solo números        
    }

    const campos = {
        razon_social: true,
        cuit_cuil: true,
        email: true,
        password: true,
        nro_telefono: true
    }

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "razon_social":
                validarCampo(expresiones.razon_social, e.target, 'razon_social'); //también podría haber pasado solo el e.target en vez de e.target.name
                break;
            case "cuit_cuil":
                validarCampo(expresiones.cuit_cuil, e.target, 'cuit_cuil');
                break;
            case "email":
                validarCampo(expresiones.email, e.target, 'email');
                break;
            case "password":
                validarCampo(expresiones.password, e.target, 'password');
                break;
            case "nro_telefono":
                validarCampo(expresiones.nro_telefono, e.target, 'nro_telefono');
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
    inputsCuenta.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario); //para cuando pierde el foco, valida luego de terminar de escribir, creo es asi
    })

    initialized_session = sessionStorage.getItem("initialized_session");

    if (initialized_session == 'true') {

        if (tpo_usuario == '2') {
            document.getElementById('btn_editar_profesion').setAttribute("style", "display:none")
        }


        fetch(`http://localhost:3000/my_profile/${cod_usuario}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data[0]);
                let datosUsuario = data[0],
                    btn_logOut = document.querySelector(".btn-salir"),
                    inputUsuario = document.getElementById('cod_usuario'),
                    inputUsuariocuenta = document.getElementById('cod_usuario_cuenta'),
                    btn_perfil = document.querySelector(".a-perfil"),
                    razon_social = document.getElementById('razon_social'),
                    cuit_cuil = document.getElementById('cuit_cuil'),
                    email = document.getElementById('email'),
                    password = document.getElementById('password'),
                    fec_nacim = document.getElementById('fec_nacim'),
                    nro_telefono = document.getElementById('nro_telefono'),
                    imagenFrente = document.getElementById('img_lic_frente'),
                    imagenDorso = document.getElementById('img_lic_dorso'),
                    imagenCurso = document.getElementById('img_curso'),
                    inputImgLicFrente = document.getElementById('nom_img_lic_frente'),
                    inputImgLicDorso = document.getElementById('nom_img_lic_dorso'),
                    inputImgLicCurso = document.getElementById('nom_img_curso'),
                    btn_back = document.querySelector(".parr_volver"),
                    btn_edit = document.getElementById("btn_edit_profile"),
                    btn_cancel = document.getElementById("btn_cancel_profile"),
                    btn_save_profile = document.getElementById("btn_save_profile"),
                    btn_cancel_cuenta = document.getElementById("btn_cancel_cuenta"),
                    btn_edit_cuenta = document.getElementById("btn_edit_cuenta"),
                    btn_save_cuenta = document.getElementById("btn_save_cuenta"),
                    btn_edit_profesional = document.getElementById("btn_edit_profesional"),
                    btn_cancel_profesional = document.getElementById("btn_cancel_profesional"),
                    btn_save_profesional = document.getElementById("btn_save_profesional"),
                    nombre_img_lic_frente = data[0].nom_img_lic_frente;

                btn_save_profile.disabled = true;
                btn_save_cuenta.disabled = true;
                btn_save_profesional.disabled = true;

                inputs.forEach((input) => {
                    input.disabled = true;
                })
                inputsCuenta.forEach((input) => {
                    input.disabled = true;
                })

                btn_perfil.innerHTML = `${data[0].razon_social}`;
                inputUsuario.value = datosUsuario.cod_usuario;
                inputUsuariocuenta.value = datosUsuario.cod_usuario;
                razon_social.value = datosUsuario.razon_social;
                cuit_cuil.value = datosUsuario.cuit_cuil;
                email.value = datosUsuario.email;
                password.value = datosUsuario.password;
                nro_telefono.value = datosUsuario.nro_telefono;
                if (datosUsuario.fec_nacim != "" & datosUsuario.fec_nacim != null) {
                    fec_nacim.value = datosUsuario.fec_nacim.substring(0, 10);
                }

                inputImgLicFrente.value = data[0].nom_img_lic_frente;
                inputImgLicDorso.value = data[0].nom_img_lic_dorso;

                const drop_area_img_frente = document.querySelector(".drop-area-img-frente"),
                    button_request_frente = drop_area_img_frente.querySelector("button"),
                    input_request_frente = document.getElementById("input-img-frente"),
                    drop_area_img_dorso = document.querySelector(".drop-area-img-dorso"),
                    button_request_dorso = drop_area_img_dorso.querySelector("button"),
                    input_request_dorso = document.getElementById("input-img-dorso"),
                    drop_area_img_curso = document.querySelector(".drop-area-img-curso"),
                    button_request_curso = drop_area_img_curso.querySelector("button"),
                    input_request_curso = document.getElementById("input-curso");

                let filesUpload;

                if (data[0].nom_img_lic_frente != null && data[0].nom_img_lic_frente != "") {
                    drop_area_img_frente.classList.add("drop-area-imagenes-perfil");

                    fetch(`http://localhost:3000/downloadImg/${data[0].nom_img_lic_frente}`, {
                            method: 'GET',
                        }).then(res => res.blob())
                        .then(img => imagenFrente.src = URL.createObjectURL(img))
                        .catch(err => { console.log(err); })
                } else {
                    imagenFrente.classList.add("img-docs-perfil");
                    button_request_frente.disabled = true;
                }

                if (data[0].nom_img_lic_dorso != null && data[0].nom_img_lic_dorso != "") {
                    drop_area_img_dorso.classList.add("drop-area-imagenes-perfil");
                    fetch(`http://localhost:3000/downloadImg/${data[0].nom_img_lic_dorso}`, {
                            method: 'GET',
                        }).then(res => res.blob())
                        .then(img => imagenDorso.src = URL.createObjectURL(img))
                        .catch(err => { console.log(err); })
                } else {
                    imagenDorso.classList.add("img-docs-perfil");
                    button_request_dorso.disabled = true;
                }

                if (data[0].nom_img_curso != null && data[0].nom_img_curso != "") {
                    drop_area_img_curso.classList.add("drop-area-imagenes-perfil");
                    fetch(`http://localhost:3000/downloadImg/${data[0].nom_img_curso}`, {
                            method: 'GET',
                        }).then(res => res.blob())
                        .then(img => imagenCurso.src = URL.createObjectURL(img))
                        .catch(err => { console.log(err); })
                } else {
                    imagenCurso.classList.add("img-docs-perfil");
                    button_request_curso.disabled = true;
                }

                /* drag and drop */
                //Licencia Frente
                let archivo_frente,
                    archivo_dorso,
                    archivo_curso;
                button_request_frente.addEventListener('click', (event) => {
                    event.preventDefault();
                    input_request_frente.click();
                });
                input_request_frente.addEventListener('change', (event) => {
                    event.preventDefault();
                    filesUpload = input_request_frente.files;
                    drop_area_img_frente.classList.add("active");

                    showFilesFrente(filesUpload);
                    drop_area_img_frente.classList.remove("active");
                });

                function showFilesFrente(files) {
                    //console.log(files);
                    if (files == undefined) {
                        console.log("en undefined");
                        processFileFrente(files);
                    } else {
                        for (const file of files) {
                            processFileFrente(file)
                        }
                    }
                };

                function processFileFrente(file) {
                    //archivo_frente = file;
                    const docType = file.type;
                    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];

                    let p = document.getElementById('nom_archivo_frente');
                    if (validExtensions.includes(docType)) {
                        const fileReader = new FileReader();
                        fileReader.addEventListener('load', (event) => {
                            event.preventDefault();
                            inputImgLicFrente.value = file.name;
                            p.innerHTML = `${file.name}`
                                //const html = document.getElementById('preview_frente');
                                //html.innerHTML = html.innerHTML + p;
                        })
                        fileReader.readAsDataURL(file);
                        uploadFileFrente(file)
                            //uploadFile(file)

                    } else {
                        const p = `<p><span class="failure">¡${file.name} tiene un formato NO válido!</span></p>`
                        const html = document.getElementById('preview_frente');
                        html.innerHTML = html.innerHTML + p;
                    }
                }

                //Licencia Dorso
                button_request_dorso.addEventListener('click', (event) => {
                    event.preventDefault();
                    input_request_dorso.click();
                });

                input_request_dorso.addEventListener('change', (event) => {
                    event.preventDefault();
                    filesUpload = input_request_dorso.files;
                    drop_area_img_dorso.classList.add("active");

                    showFilesDorso(filesUpload);
                    drop_area_img_dorso.classList.remove("active");
                });

                function showFilesDorso(files) {
                    //console.log(files);
                    if (files == undefined) {
                        console.log("en undefined");
                        processFileDorso(files);
                    } else {
                        for (const file of files) {
                            processFileDorso(file)
                        }
                    }
                };

                function processFileDorso(file) {
                    // archivo_dorso = file;
                    const docType = file.type;
                    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];

                    let p = document.getElementById('nom_archivo_dorso');
                    if (validExtensions.includes(docType)) {
                        const fileReader = new FileReader();
                        fileReader.addEventListener('load', (event) => {
                            event.preventDefault();
                            inputImgLicDorso.value = file.name;
                            p.innerHTML = `${file.name}`
                                //const html = document.getElementById('preview_dorso');
                                //html.innerHTML = html.innerHTML + p;
                        })
                        fileReader.readAsDataURL(file);
                        uploadFileDorso(file)
                            //uploadFile(file)

                    } else {
                        const p = `<p><span class="failure">¡${file.name} tiene un formato NO válido!</span></p>`
                        const html = document.getElementById('preview_dorso');
                        html.innerHTML = html.innerHTML + p;
                    }
                };

                //Curso
                button_request_curso.addEventListener('click', (event) => {
                    event.preventDefault();
                    input_request_curso.click();
                });

                input_request_curso.addEventListener('change', (event) => {
                    event.preventDefault();
                    filesUpload = input_request_curso.files;
                    drop_area_img_curso.classList.add("active");

                    showFilesCurso(filesUpload);
                    drop_area_img_curso.classList.remove("active");
                });

                function showFilesCurso(files) {
                    //console.log(files);
                    if (files == undefined) {
                        console.log("en undefined");
                        processFileCurso(files);
                    } else {
                        for (const file of files) {
                            processFileCurso(file)
                        }
                    }
                };

                function processFileCurso(file) {
                    //archivo_curso = file;
                    const docType = file.type;
                    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];

                    let p = document.getElementById('nom_archivo_curso');
                    if (validExtensions.includes(docType)) {
                        const fileReader = new FileReader();
                        fileReader.addEventListener('load', (event) => {
                            event.preventDefault();
                            inputImgLicCurso.value = file.name;
                            p.innerHTML = `${file.name}`
                                //const html = document.getElementById('preview_curso');
                                //html.innerHTML = html.innerHTML + p;
                        })
                        fileReader.readAsDataURL(file);
                        uploadFileCurso(file)
                            // uploadFile(file)

                    } else {
                        const p = `<p><span class="failure">¡${file.name} tiene un formato NO válido!</span></p>`
                        const html = document.getElementById('preview_curso');
                        html.innerHTML = html.innerHTML + p;
                    }
                };


                async function uploadFileFrente(file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    let nombre_archivo = file.name;
                    let nom_arch = { cod_usuario: cod_usuario, nom_img_lic_frente: nombre_archivo };
                    fetch(`http://localhost:3000/uploadLicFrente`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(nom_arch),
                        })
                        .catch(err => { console.log(err); })
                    try {
                        const response = await fetch('http://localhost:3000/uploadImages', {
                            method: "POST",
                            body: formData
                        })
                        const responseText = await response.text();
                        console.log("responseText", responseText);
                        const p = `<h5><span class="success">¡Archivo subido correctamente!</span></h5>`
                        const html = document.getElementById('preview_frente');
                        html.innerHTML = html.innerHTML + p;



                    } catch (error) {
                        console.log(error);
                        const html = document.getElementById('preview_frente');
                        html.innerHTML = html.innerHTML + p;
                    }
                }

                async function uploadFileDorso(file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    let nombre_archivo = file.name;
                    let nom_arch = { cod_usuario: cod_usuario, nom_img_lic_dorso: nombre_archivo };
                    fetch(`http://localhost:3000/uploadLicDorso`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(nom_arch),
                        })
                        .catch(err => { console.log(err); })
                    try {
                        const response = await fetch('http://localhost:3000/uploadImages', {
                            method: "POST",
                            body: formData
                        })
                        const responseText = await response.text();
                        console.log("responseText", responseText);
                        const p = `<h5><span class="success">¡Archivo subido correctamente!</span></h5>`
                        const html = document.getElementById('preview_dorso');
                        html.innerHTML = html.innerHTML + p;

                    } catch (error) {
                        console.log(error);
                        const html = document.getElementById('preview_dorso');
                        html.innerHTML = html.innerHTML + p;
                    }
                }

                async function uploadFileCurso(file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    let nombre_archivo = file.name;
                    let nom_arch = { cod_usuario: cod_usuario, nom_img_curso: nombre_archivo };
                    fetch(`http://localhost:3000/uploadImgCurso`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(nom_arch),
                        })
                        .catch(err => { console.log(err); })
                    try {
                        const response = await fetch('http://localhost:3000/uploadImages', {
                                method: "POST",
                                body: formData
                            })
                            .catch(err => { console.log(err); })
                        const responseText = await response.text();
                        console.log("responseText", responseText);
                        const p = `<h5><span class="success">¡Archivo subido correctamente!</span></h5>`
                        const html = document.getElementById('preview_curso');
                        html.innerHTML = html.innerHTML + p;

                        return true;

                    } catch (error) {
                        console.log(error);
                        const html = document.getElementById('preview_curso');
                        html.innerHTML = html.innerHTML + p;
                    }

                }

                /* fin drag and drop */




                //Editar Cuenta
                let pass_2 = document.getElementById('grupo__password_2');
                let inputPass_2 = document.getElementById('password_2');
                btn_edit_cuenta.addEventListener('click', (event) => {
                    event.preventDefault();
                    inputsCuenta.forEach((input) => {
                        input.disabled = false;
                    })
                    password.value = ""
                    pass_2.classList.remove("div_pass_2_none");

                    btn_save_cuenta.disabled = false;
                });

                //Cancelar cuenta
                btn_cancel_cuenta.addEventListener('click', (event) => {
                    event.preventDefault();

                    inputsCuenta.forEach((input) => {
                        input.disabled = true;
                    })

                    password.value = datosUsuario.password;
                    pass_2.classList.add("div_pass_2_none");

                    btn_save_cuenta.disabled = true;
                })

                //Guardar Cuenta
                formularioCuenta.addEventListener('submit', (event) => {
                    event.preventDefault();
                    if (campos.email && campos.password) {

                        if (password.value != inputPass_2.value) {
                            document.getElementById('form__mensaje_error_contrasenia').classList.add('form__mensaje_error_activo')
                            setTimeout(() => {
                                document.getElementById('form__mensaje_error_contrasenia').classList.remove('form__mensaje_error_activo')
                            }, 3500);

                        } else {
                            let registroFormData = new FormData(formularioCuenta);
                            fetch('http://localhost:3000/update_cuenta', {
                                    method: 'POST',
                                    body: registroFormData,
                                })
                                .catch(err => { console.log(err); })

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: '¡Guardando Cambios!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(() => {
                                window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
                            }, 1500);
                        }
                    } else {
                        document.getElementById('form__mensaje_error_cuenta').classList.add('form__mensaje_error_activo')
                        setTimeout(() => {
                            document.getElementById('form__mensaje_error_cuenta').classList.remove('form__mensaje_error_activo')
                        }, 3500);
                    }
                })

                //Botón Editar Perfil
                btn_edit.addEventListener('click', (event) => {
                    event.preventDefault();
                    inputs.forEach((input) => {
                        input.disabled = false;
                    });
                    btn_save_profile.disabled = false;
                });

                //Botón Editar Profesional
                btn_edit_profesional.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log("nombre_img_lic_frente", nombre_img_lic_frente);
                    drop_area_img_frente.classList.remove("drop-area-imagenes-perfil");
                    drop_area_img_dorso.classList.remove("drop-area-imagenes-perfil");
                    drop_area_img_curso.classList.remove("drop-area-imagenes-perfil");
                    imagenFrente.classList.add("img-docs-perfil");
                    imagenDorso.classList.add("img-docs-perfil");
                    imagenCurso.classList.add("img-docs-perfil");
                    let p = document.getElementById('nom_archivo_curso');
                    //p.
                    button_request_frente.disabled = false;
                    button_request_dorso.disabled = false;
                    button_request_curso.disabled = false;
                    btn_save_profesional.disabled = false;
                });

                //Botón Cancelar Perfil
                btn_cancel.addEventListener('click', (event) => {
                    event.preventDefault();
                    inputs.forEach((input) => {
                        input.disabled = true;
                    });
                })

                //Botón Cancelar Profesional
                btn_cancel_profesional.addEventListener('click', (event) => {
                    event.preventDefault();
                    drop_area_img_frente.classList.add("drop-area-imagenes-perfil");
                    drop_area_img_dorso.classList.add("drop-area-imagenes-perfil");
                    drop_area_img_curso.classList.add("drop-area-imagenes-perfil");
                    imagenFrente.classList.remove("img-docs-perfil");
                    imagenDorso.classList.remove("img-docs-perfil");
                    imagenCurso.classList.remove("img-docs-perfil");
                    btn_save_profesional.disabled = true;
                })


                //Botón Guardar Perfil
                formularioPerfil.addEventListener('submit', (event) => {
                    event.preventDefault();
                    let fecha = document.getElementById('fec_nacim')

                    if (fecha.value == null || fecha.value == "") {
                        fecha.value = "1900-01-01";
                    }

                    if (campos.razon_social && campos.cuit_cuil && campos.nro_telefono) {

                        /* await uploadFileFrente(archivo_frente);
                        await uploadFileDorso(archivo_dorso);
                        await uploadFileCurso(archivo_curso); */
                        /* let p_frente = document.getElementById('nom_archivo_frente'),
                            p_dorso = document.getElementById('nom_archivo_dorso'),
                            p_curso = document.getElementById('nom_archivo_curso');

                        if ((p_frente.textContent == "" || p_frente.textContent == undefined) ||
                            (p_dorso.textContent == "" || p_dorso.textContent == undefined) ||
                            (p_curso.textContent == "" || p_curso.textContent == undefined)) {
                            document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo');
                            setTimeout(() => {
                                document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
                            }, 3500);
                        } else {
                            LO COMENTÉ LUEGO DE LA PRIMERA VEZ UNO NO VA A ANDAR MODIFICANDO LAS 3 IMAGENES AL MISMO TIEMPO, ENTONCES 
                            CON ESA CONDICIÓN IBA A OBLIGARLO A SUBIR LAS 3 IMAGENES CADA VEZ QUE QUIERA ACTUALIZAR UNA.


                            TENDRÍA QUE VER QUE PASA SI MODIFICO UNA SI A LAS OTRAS DOS GUARDA LOS NOMBRES VACIOS, PORQUE LOS INPUTS
                            VAN A ESTAR VACIOS CUANDO LE DE AL BOTÓN EDITAR
                            */



                        let registroFormData = new FormData(formularioPerfil);
                        fetch('http://localhost:3000/update_profile', {
                                method: 'POST',
                                body: registroFormData,
                            })
                            .catch(err => { console.log(err); })

                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '¡Guardando Cambios!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            window.location.href = `./dashboard.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
                        }, 1500);
                        //}
                    } else {
                        document.getElementById('form__mensaje_error').classList.add('form__mensaje_error_activo');
                        setTimeout(() => {
                            document.getElementById('form__mensaje_error').classList.remove('form__mensaje_error_activo')
                        }, 3500);
                    }

                })

                //Botón Guardar Profesional
                formularioProfesional.addEventListener('submit', async(event) => {
                    event.preventDefault();
                    /* await uploadFileFrente(archivo_frente);
                    await uploadFileDorso(archivo_dorso); */
                    //let subioCurso = await uploadFileCurso(archivo_curso);

                    //console.log("subioCurso", subioCurso);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Guardando Cambios!',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    setTimeout(() => {
                        window.location.href = `./my_profile.html?cod_usuario=${cod_usuario}&tpo_usuario=${tpo_usuario}`;
                    }, 3000);

                })

                //Botón Salir
                btn_logOut.addEventListener('click', (event) => {
                    event.preventDefault();
                    Swal.fire({
                        position: 'center',
                        title: 'CERRANDO SESIÓN...',
                        text: '¡Hasta Pronto!',
                        showConfirmButton: false,
                        timer: 1500
                    })

                    sessionStorage.removeItem("initialized_session");
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 1500);

                })

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
                        Swal.fire({
                            title: '¡Hay cambios sin guardar!',
                            text: 'Si sale de la página no se guardarán',
                            icon: 'warning',
                            showDenyButton: true,
                            showConfirmButton: false,
                            showCancelButton: true,
                            denyButtonText: `Salir`,
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            allowOutsideClick: false,

                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isDenied) {
                                javascript: history.back();
                            }
                        })
                    } else {
                        javascript: history.back();
                    }
                })

            })
            .catch(err => { console.log(err); })
    } else {
        alert("Usted NO ha Iniciado Sesión");
        window.location.href = './index.html';
    }

})