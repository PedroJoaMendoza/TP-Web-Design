const API_URL = "https://jsonplaceholder.typicode.com";

function ResetAll() {
  if (confirm("Seguro que quiere reiniciar los datos?")) {
    localStorage.clear();
    location.reload();
  }
}

// Metodo añade una linea
async function addLine() {
  document.getElementById("addModal").style.display = "block";
  document.getElementById("addLine").addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();

    const lastId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) : 0;
    const newId = lastId + 1;
    const newPOST = {
      id: newId,
      title: document.getElementById("addTitle").value,
      body: document.getElementById("addBody").value,
    };
    try {
      await fetch(`${API_URL}/posts`, {
        method: "POST",
        body: JSON.stringify(newPOST),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));

      const localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
      localPosts.unshift(newPOST);
      localStorage.setItem("localPost", JSON.stringify(localPosts));

      alert("Linea agregado correctamente.");
    } catch (error) {
      alert("No se pudo agregar la linea.");
      console.error("Error al agregar la linea", error);
    }
  });
}

// Obtiene todos los elementos de la tabla
window.onload = () => {
  const tabla = document.getElementById("table");
  if (!tabla) return;

  async function InizialiceData() {
    if (!localStorage.getItem("apiPosts")) {
      try {
        const response = await fetch(`${API_URL}/posts`);
        const data = await response.json();
        localStorage.setItem("apiPosts", JSON.stringify(data));
      } catch (error) {
        console.error("Error al traer la API", error);
        return;
      }
    }
    ShowTable();
  }

  // Muestra la tabla en conjunto
  function ShowTable() {
    tabla.innerHTML = "";

    const localPost = JSON.parse(localStorage.getItem("localPost")) || [];

    const apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];

    const allpost = [...apiPosts, ...localPost];

    allpost.forEach((post) => {
      const row = tabla.insertRow();
      row.setAttribute("id", post.id);

      row.insertCell(0).innerHTML = post.id;
      row.insertCell(1).innerHTML = post.title;
      row.insertCell(2).innerHTML = post.body;

      const acction = row.insertCell(3);
      acction.innerHTML = `<button onclick="editRow(${post.id})">Editar</button> <button onclick="eliminarPost(${post.id})">Eliminar</button>`;
    });
  }
  InizialiceData();
};

// Metodo de editar la linea elegida
async function editRow(id) {
    document.getElementById('editModal').style.display = 'block'
  const row = document.getElementById(id);
  try {
    newTitle = document.getElementById('uptTitle').value;
    newBody = document.getElementById('uptBody').value;
    updatedPosts(id, newTitle, newBody);
  } catch (error) {
    console.error("Hubo un error al editar la linea");
  }
}

// Elimina la linea elegida
async function eliminarPost(id) {
  if (!confirm("Seguro que quiere eliminar la linea?")) return;

  try {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
    });
    const row = document.getElementById(id);
    if (row) row.remove();

    let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
    localPosts = localPosts.filter((p) => p.id !== id);
    localStorage.setItem("localPosts", JSON.stringify(localPosts));

    let apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];
    apiPosts = apiPosts.filter((p) => p.id != id);
    localStorage.setItem("apiPosts", JSON.stringify(apiPosts));

    alert("Linea eliminado.");
  } catch (error) {
    console.error("Error al eliminar la linea");
  }
}

// Metodo para cambiar el contenido de la linea
async function updatedPosts(id, newTitle, newBody) {
  const localPost = JSON.parse(localStorage.getItem("localPosts")) || [];
  const idxLocal = localPost.findIndex((p) => p.id === id);

  if (idxLocal !== -1) {
    localPost[idxLocal].title = newTitle;
    localPost[idxLocal].body = newBody;
    localStorage.setItem("localPosts", JSON.stringify(localPost));
    return;
  }

  let apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];
  const idxApi = apiPosts.findIndex((p) => p.id === id);
  if (idxApi != -1) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: newTitle,
        body: newBody
      })
    });

    apiPosts[idxApi].title = newTitle;
    apiPosts[idxApi].body = newBody;
    localStorage.setItem("apiPosts", JSON.stringify(apiPosts));
  }
}

function showModal(id){
  let originalData;
  for (let i= 0; i < document.getElementById("table").row.length; i++){
    const row = document.getElementById("table").row[i];
    const idCell = row.insertCell[0];
    if (idCell.innerHTML == id){
      originalData ={
        id: idCell.innerHTML,
        title: row.insertCell[1].innerHTML,
        body: row.insertCell[2].innerHTML
      }
      break;
    }
  }
  document.getElementById('modalId').value = originalData.id;
  if(document.getElementById(addLine())){
    document.getElementById('addTitle').value = originalData.title;
    document.getElementById('addBody').value = originalData.body;
  }else if(document.getElementById(editRow(originalData.id))){
    document.getElementById('uptTitle').value = originalData.title;
    document.getElementById('uptBody').value = originalData.body;
  }
document.getElementById('modal-container').style.display = 'block';
}
