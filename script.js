const API_URL = "https://jsonplaceholder.typicode.com";

function ResetAll() {
    if (confirm("Seguro que quiere reiniciar los datos?")) {
        localStorage.clear();
        location.reload();
    }
}

// Metodo añade una linea
if (document.getElementById("AddLine")) {
    document.getElementById("AddLine").addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();

        const lastId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
        const newId = lastId + 1;
        const newPOST = {
            id: newId,
            title: document.getElementById("title").value,
            body: document.getElementById("body").value,
        };
        try {
            await fetch(`${API_URL}/posts`, {
                method: "POST",
                body: JSON.stringify(newPOST),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => response.json())
                .then((json) => console.log(json));

            const localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
            localPosts.unshift(newPOST);
            localStorage.setItem("localPost", JSON.stringify(localPosts));

            alert("Linea agregado correctamente.");
            window.location.href = "index.html";

        } catch (error) {
            console.error("Error al agregar alumno", error);
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
                const response = await fetch(`${API_URL}/posts`)
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

        allpost.forEach(post => {

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
}


// Metodo de editar la linea elegida
async function editRow(id) {
    const row = document.getElementById(id);
    if (!row) return;

    try {
        fetch(`${API_URL}/posts/1`, {
            method: "PUT",
            body: JSON.stringify({
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; chartset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));

        const newTitle = prompt("New Title", row.cells[1].innerHTML);
        const newBody = prompt("New Body", row.cells[2].innerHTML);

        if (newTitle !== null) row.cells[1].innerHTML = newTitle;
        if (newBody !== null) row.cells[2].innerHTML = newBody;

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
            method: "DELETE"
        });
        const row = document.getElementById(id);
        if (row) row.remove();

        let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
        localPosts = localPosts.filter(p => p.id !== id);
        localStorage.setItem("localPosts", JSON.stringify(localPosts));

        let apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];
        apiPosts = apiPosts.filter(p => p.id != id);
        localStorage.setItem("apiPosts", JSON.stringify(apiPosts));

        alert("Linea eliminado.");
    } catch (error) {
        console.error("Error al eliminar la linea");
    }
}

// Metodo para cambiar el contenido de la linea
async function updatedPosts(id, newTitle, newBody) {

    const localPost = JSON.parse(localStorage.getItem("localPosts")) || [];
    const idxLocal = localPost.findIndex(p => p.id === id);

    if (idxLocal !== -1) {
        localPost[idxLocal].title = newTitle;
        localPost[idxLocal].body = newBody;
        localStorage.setItem("localPosts", JSON.stringify(localPost));
        return;
    }

    let apiPosts = JSON.parse(localStorage.getItem("apiPosts")) || [];
    const idxApi = apiPosts.findIndex(p => p.id === id);
    if (idxApi != -1) {
        await fetch(`${API_URL}/posts/${id}`, {
            method: "PUT"
        });

        apiPosts[idxApi].title = newTitle;
        apiPosts[idxApi].body = newBody;
        localStorage.setItem("apiPosts", JSON.stringify(apiPosts));
    }
}