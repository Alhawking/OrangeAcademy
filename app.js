document.addEventListener('DOMContentLoaded',()=>{
    addSmoothScroll();
    validateForm();
});

function addSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor =>{
        anchor.addEventListener('click', function(e){
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    )
}

function validateForm(){
    const form = document.querySelector('form');
    const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value;
        const age = Number(form.querySelector('input[name="age"]').value);
        const email = form.querySelector('input[name="email"]').value;
        const tel = form.querySelector('input[name="tel"]').value;
        const parteDeOrange = form.querySelector('textarea[name="parteDeOrange"]').value;
        if(!name){
            const div = document.querySelector('#nombre_solicitud_error');
            div.style.display = 'block';
            div.parentNode.scrollIntoView({
                behavior: 'smooth'
            });
        }else if(!age || Number.isNaN(age)){
            const div = document.querySelector('#edad_solicitud_error');
            div.style.display = 'block';
            div.parentNode.scrollIntoView({
                behavior: 'smooth'
            });
        }else if(!regexEmail.test(email)){
            const div = document.querySelector('#email_solicitud_error');
            div.style.display = 'block';
            div.parentNode.scrollIntoView({
                behavior: 'smooth'
            });
        }else if(!regexPhone.test(tel)){
            const div = document.querySelector('#tel_solicitud_error');
            div.style.display = 'block';
            div.parentNode.scrollIntoView({
                behavior: 'smooth'
            });
            
        }else if(!parteDeOrange){
            const div = document.querySelector('#parteDeOrange_solicitud_error');
            div.style.display = 'block';
            div.parentNode.scrollIntoView({
                behavior: 'smooth'
            });
        }else{
            const files = document.querySelector('#inputGroupFile04').files;
            if(files){
                getBase64(files[0])
            }else{
                form.submit();
            }
        }
        setTimeout(()=>{
            document.querySelectorAll('.alert-danger').forEach(div =>div.style.display = 'none')
        },3000);
    });
}

function getBase64(file){
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {

        //prepare data to pass to processing page 
        const fileEncoded = reader.result;
        console.log(fileEncoded);
        const base64enc = fileEncoded.split(";base64,")[1];
        const fullFileName = document.querySelector("#inputGroupFile04").files[0].name;
        const fileName = fullFileName.split(".")[0];
        const assetName = fullFileName.split(".")[1];

        return new Promise((resolve, reject) => {
            fetch("https://cloud.orangedcx.com.mx/001-orange-academy-process", {  //provide URL of the processing page
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    base64enc: base64enc,
                    fileName: fileName,
                    assetName: assetName
                })
            })
            .then(function(res) {
                    resolve(res);
            })
            .catch(function(err) {
                reject(err);
            });
        })
    };
}