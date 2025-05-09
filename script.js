const API_URL = "https://jsonplaceholder.typicode.com";

async function CargarAlumnos() {
    const tabla = document.getElementById("tabla");
    if(!tabla) return;
    try{
        const response =await fetch(`${API_URL}/posts`);
        const alumnos =await response.json();
        tabla.innerHTML="";
        
        alumnos.forEach(est => {
            const row = tabla.insertRow();
            const idCell = row.insertCell(0);
            const titleCell = row.insertCell(1);
            const bodyCell = row.insertCell(2);
            const actionsCell = row.insertCell(3);
            
            row.setAttribute('id',est.id);
            idCell.innerHTML = est.id;
            titleCell.innerHTML = est.title;
            bodyCell.innerHTML = est.body;
            actionsCell.innerHTML = `<button onclick="editarEstudiante(${est.id})">Editar</button> <button onclick="eliminarPost(${est.id})">Eliminar</button>`;
            tabla.appendChild(row);
        });
        window.addEventListener("DOMContentLoaded",()=>{
        
        const data = localStorage.getItem("newPOST");
        if (data) {
            const response = JSON.parse(data)
            
            const tabla = document.getElementById('tabla');
            const row = tabla.insertRow();
            const idCell = row.insertCell(0);
            const titleCell = row.insertCell(1);
            const bodyCell = row.insertCell(2);
            const actionsCell = row.insertCell(3);
            
            row.setAttribute('id',response.id);
            idCell.innerHTML = response.id;
            titleCell.innerHTML = response.title;
            bodyCell.innerHTML = response.body;
            actionsCell.innerHTML = `<button onclick="editarEstudiante(${response.id})">Editar</button> <button onclick="eliminarPost(${response.id})">Eliminar</button>`;
            tabla.appendChild(row);
            
            localStorage.removeItem("newPOST");
        }
    })

    } catch(error){
        console.error("Error al cargar estudiante",error)
    }
}

const formulario = document.getElementById("addStudentForm")
if(formulario){
    formulario.addEventListener("submit",async(e)=>{
        e.preventDefault();
        const newrow = {
            title: document.getElementById("title").value,
            body: document.getElementById("body").value,
        };
        try{
            let response = await fetch(`${API_URL}/posts`,{
                method: "POST",
                headers:{"Content-Type":"aplication/json"},
                body:JSON.stringify(newrow)
            });
            response = await response.json();
            localStorage.setItem("newPOST",JSON.stringify(response));
            alert("Linea agregado correctamente.");
            window.location.href = "index.html";
            localStorage.setItem();
            
        }catch (error){
            console.error("Error al agregar alumno",error);
        }
    });
}

async function editarPost(id) {

    
}

async function eliminarPost(id){
    if(!confirm("Seguro que quiere eliminar la linea?"))return;

    try{
        await fetch(`${API_URL}/posts/${id}`,{
            method: "DELETE"
        });
        const table = document.getElementById('tabla');
        const deletedRow = document.getElementById(id);
        table.removeChild(deletedRow);
        alert("Linea eliminado.");
    }catch (error){
        console.error("Error al eliminar la linea");
    }
}

var counter = 0;

window.onload = () =>{
        CargarAlumnos();
}