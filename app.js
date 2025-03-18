// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
// **Crear un array para almacenar los nombres**

let amigos = [];

// **Implementa una función para agregar amigos**
function agregarAmigo() {
    const input = document.getElementById("amigo");
    const nombre = input.value.trim();
    if (nombre === "") {
        alert("No se permiten nombres vacíos");
        return;
    }
    amigos.push(nombre);
    input.value = "";
    actualizarListaAmigos();
}

// **Implementa una función para actualizar la lista de amigos**
function actualizarListaAmigos() {
    const lista = document.getElementById("listaAmigos");
    lista.innerHTML = "";
    for (let i = 0; i < amigos.length; i++) {
        const li = document.createElement("li");
        li.textContent = amigos[i];
        lista.appendChild(li);
    }
}

// **Implementa una función para sortear los amigos**
function sortearAmigo() {
    if (amigos.length === 0) {
        alert("Las lista de amigos está vacía");
        return;
    }
}
