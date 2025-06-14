const API_URL = "https://jsonplaceholder.typicode.com";

//Abre addModal
function openModal(type){
  if (type==='add'){
    document.getElementById("addModal").style.display = 'block';
    document.getElementById("addTitle").value = "";
    document.getElementById("addBody").value = "";
  }
}

function ResetAll() {
  if (confirm("Seguro que quiere reiniciar los datos?")) {
    localStorage.clear();
    location.reload();
  }
}

// Metodo añade una linea
async function addLine() {

  const localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
  const lastId = localPosts.length > 0 ? Math.max(...localPosts.map((p) => p.id)) : 100;
  const newPOST = {
      id: lastId +1,
      title: document.getElementById("addTitle").value,
      body: document.getElementById("addBody").value,
    };

    try {
      //Llama a la API para guardar las nuevas variables
      const response  = await fetch(`${API_URL}/posts`, {
        method: "POST",
        body: JSON.stringify(newPOST),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })

      //Convierte el cuerpo JSON a un objeto JS
      const saved = await response.json();
      
      //Guarda en localStorage
      localPosts.push(newPOST);
      localStorage.setItem("localPosts", JSON.stringify(localPosts));

      alert("Linea agregado correctamente.");
      document.getElementById("addModal").style.display = 'none';

      renderTable();
    } catch (error) {
      alert("No se pudo agregar la linea.");
      console.error("Error al agregar la linea", error);
    }
}

// Muestra la tabla en conjunto
function renderTable(){
  const tabla = document.getElementById("table");
    tabla.innerHTML = "";

    const localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
    const apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];

    const allpost = [...apiPosts, ...localPosts].sort((a,b)=>a.id - b.id);

    allpost.forEach((post) => {
      const row = tabla.insertRow();
      row.setAttribute("id", `row-${post.id}`);

      row.insertCell(0).innerHTML = post.id;
      row.insertCell(1).innerHTML = post.title;
      row.insertCell(2).innerHTML = post.body;

      const acction = row.insertCell(3);
      acction.innerHTML = `<button onclick="editRow(${post.id})">Editar</button> <button onclick="eliminarPost(${post.id})">Eliminar</button>`;
    });
  }


// Metodo de editar la linea elegida
function editRow(id) {
  const row = document.getElementById(`row-${id}`);
  const title = row.children[1].innerText;
  const body = row.children[2].innerText;

  document.getElementById("editId").value = id;
  document.getElementById("uptTitle").value = title;
  document.getElementById("uptBody").value = body;
  document.getElementById("editModal").style.display = 'block';
}

async function saveEdit() {
  const id = parseInt(document.getElementById("editId").value);
  const title = document.getElementById("uptTitle").value;
  const body = document.getElementById("uptBody").value;

  const localPost = JSON.parse(localStorage.getItem("localPosts")) || [];
  const idxLocal = localPost.findIndex((p) => p.id === id);

  if (idxLocal !== -1) {
    localPost[idxLocal].title = title;
    localPost[idxLocal].body = body;
    localStorage.setItem("localPosts", JSON.stringify(localPost));
    return;
  }

  let apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];
  const idxApi = apiPosts.findIndex((p) => p.id === id);
  if (idxApi != -1) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        body: body
      })
    });

    apiPosts[idxApi].title = title;
    apiPosts[idxApi].body = body;
    localStorage.setItem("apiPosts", JSON.stringify(apiPosts));
  }
  alert("Fila editada correctamente.")
  document.getElementById("editModal").style.display = 'none';
  renderTable();
}

// Elimina la linea elegida
async function eliminarPost(id) {
  if (!confirm("Seguro que quiere eliminar la linea?")) return;

  try {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
    });
    const row = document.getElementById(`rpw-${id}`);
    if (row) row.remove();

    let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
    localPosts = localPosts.filter((p) => p.id !== id);
    localStorage.setItem("localPosts", JSON.stringify(localPosts));

    let apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];
    apiPosts = apiPosts.filter((p) => p.id != id);
    localStorage.setItem("apiPosts", JSON.stringify(apiPosts));

    alert("Linea eliminado.");
    renderTable();
  } catch (error) {
    console.error("Error al eliminar la linea");
  }
}

window.onload = async() => {

    if (!localStorage.getItem("apiPosts")) {
      try {
        const response = await fetch(`${API_URL}/posts`);
        const data = await response.json();
        localStorage.setItem("apiPosts", JSON.stringify(data));
      } catch (error) {
        console.error("Error al traer la API", error);
      }
    }
  renderTable();
};
