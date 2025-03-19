// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
let personasDisponibles = [];
let amigosSecretosDisponibles = [];
let personasSorteadas = [];
let amigosSecretosSorteados = [];
let originalPersonas = [];
let originalAmigos = [];
let modoTexto = false; 
const MAX_CAJITAS = 15;
const MAX_NOMBRES_TEXTO = 15;
let usedPairs = new Set();

function getPairKey(a, b) {
  if (a < b) {
    return a + "--" + b;
  } else {
    return b + "--" + a;
  }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
  document
    .getElementById("btnSorteoAuto")
    .addEventListener("click", onSorteoAuto);

  document
    .getElementById("btnModoIngreso")
    .addEventListener("click", onCambiarModoIngreso);


  document
    .getElementById("btnReiniciar")
    .addEventListener("click", onReiniciarSorteo);

  document
    .getElementById("btnBorrar")
    .addEventListener("click", onBorrarListas);

  const addFriendBtn = document.getElementById("add-friend-btn");
  if (addFriendBtn) {
    addFriendBtn.addEventListener("click", onAgregarFriendRow);
  }

  const sortBtn = document.getElementById("sort-btn");
  if (sortBtn) {
    sortBtn.addEventListener("click", onSortearManual);
  }

  crearTextAreaOculto();
}

function onAleatorizar() {
  actualizarListasDesdeUI();

  if (personasDisponibles.length < 2) {
    alert("Se necesitan al menos 2 personas para aleatorizar.");
    return;
  }

  personasDisponibles = shuffleArray(personasDisponibles);
  renderListasDisponibles();
}

function onSorteoAuto() {
  onAleatorizar();
  actualizarListasDesdeUI();

  const addFriendBtn = document.getElementById("add-friend-btn");
  if (addFriendBtn) addFriendBtn.disabled = true;

  const textarea = document.getElementById("textareaNombres");
  if (textarea) textarea.disabled = true;

  while (personasDisponibles.length > 0 && amigosSecretosDisponibles.length > 0) {
    const success = sortearAmigo(); 
    if (!success) {
      alert("No se encontró una nueva pareja válida. Sorteo auto detenido.");
      break;
    }
  }

  renderResultados();
}


function onCambiarModoIngreso() {
  modoTexto = !modoTexto;

  const textarea = document.getElementById("textareaNombres");
  if (textarea) {
    textarea.style.display = modoTexto ? "block" : "none";
  }

  const friendsSection = document.querySelector(".friends-input");
  if (friendsSection) {
    const friendRows = friendsSection.querySelectorAll(".friend-row");
    const addBtn = document.getElementById("add-friend-btn");

    if (modoTexto) {
      friendRows.forEach((row) => (row.style.display = "none"));
      if (addBtn) addBtn.style.display = "none";
    } else {
      friendRows.forEach((row) => (row.style.display = "flex"));
      if (addBtn) addBtn.style.display = "inline-block";
    }
  }
}


function onReiniciarSorteo() {
  if (originalPersonas.length === 0 && originalAmigos.length === 0) {
    alert("No hay datos originales para restaurar. Ingresa nombres primero.");
    return;
  }

  personasDisponibles = [...originalPersonas];
  amigosSecretosDisponibles = [...originalAmigos];
  personasSorteadas = [];
  amigosSecretosSorteados = [];

  usedPairs.clear();

  const addFriendBtn = document.getElementById("add-friend-btn");
  if (addFriendBtn) addFriendBtn.disabled = false;

  const textarea = document.getElementById("textareaNombres");
  if (textarea) textarea.disabled = false;

  renderListasDisponibles();
  renderResultados();
  alert("Sorteo reiniciado.");
}

function onBorrarListas() {
  personasDisponibles = [];
  amigosSecretosDisponibles = [];
  personasSorteadas = [];
  amigosSecretosSorteados = [];
  originalPersonas = [];
  originalAmigos = [];

  usedPairs.clear();

  const addFriendBtn = document.getElementById("add-friend-btn");
  if (addFriendBtn) addFriendBtn.disabled = false;

  const textarea = document.getElementById("textareaNombres");
  if (textarea) textarea.disabled = false;

  const friendsSection = document.querySelector(".friends-input");
  if (friendsSection) {
    const rows = friendsSection.querySelectorAll(".friend-row");
    rows.forEach((r) => r.remove());
  }

  const textareaNombres = document.getElementById("textareaNombres");
  if (textareaNombres) {
    textareaNombres.value = "";
  }

  renderListasDisponibles();
  renderResultados();

  alert("Listas borradas.");
}

function onAgregarFriendRow() {
  const friendsSection = document.querySelector(".friends-input");
  if (!friendsSection) return;

  const currentRows = friendsSection.querySelectorAll(".friend-row");
  if (currentRows.length >= MAX_CAJITAS) {
    alert("Has alcanzado el límite de 15 cajitas.");
    return;
  }

  const row = document.createElement("div");
  row.classList.add("friend-row");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nuevo amigo";
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("circle-btn");
  btnEdit.textContent = "✎";
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("circle-btn");
  btnDelete.textContent = "✕";
  btnDelete.addEventListener("click", () => row.remove());

  row.appendChild(input);
  row.appendChild(btnEdit);
  row.appendChild(btnDelete);

  friendsSection.insertBefore(row, document.getElementById("add-friend-btn"));
}


function onSortearManual() {
  actualizarListasDesdeUI();

  if (personasDisponibles.length === 0) {
    alert("No hay más personas disponibles para sortear.");
    return;
  }
  if (amigosSecretosDisponibles.length === 0) {
    alert("No hay más amigos secretos disponibles.");
    return;
  }

  sortearAmigo();
  renderListasDisponibles();
  renderResultados();
}


function sortearAmigo() {
  if (personasDisponibles.length === 0) return false;
  if (amigosSecretosDisponibles.length === 0) return false;

  const MAX_ATTEMPTS = 50;
  let foundValidPair = false;
  let persona, amigo;
  let iPersona, iAmigo;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    iPersona = Math.floor(Math.random() * personasDisponibles.length);
    iAmigo = Math.floor(Math.random() * amigosSecretosDisponibles.length);
    persona = personasDisponibles[iPersona];
    amigo = amigosSecretosDisponibles[iAmigo];

    if (persona === amigo) continue;

    const pairKey = getPairKey(persona, amigo);

    if (usedPairs.has(pairKey)) continue;

    foundValidPair = true;
    break;
  }

  if (!foundValidPair) {
    return false;
  }
  personasSorteadas.push(persona);
  amigosSecretosSorteados.push(amigo);
  usedPairs.add(getPairKey(persona, amigo));
  personasDisponibles.splice(iPersona, 1);
  amigosSecretosDisponibles.splice(iAmigo, 1);
  renderListasDisponibles();
  renderResultados();

  return true; 
}


function actualizarListasDesdeUI() {
  const nombres = getNamesFromUI();

  if (nombres.length === 0) {
    alert("No hay nombres válidos en la lista.");
    return;
  }

  personasDisponibles = nombres;

  amigosSecretosDisponibles = shuffleArray([...personasDisponibles]);

  originalPersonas = [...personasDisponibles];
  originalAmigos = [...amigosSecretosDisponibles];

  renderListasDisponibles();
}

function getNamesFromUI() {
  let result = [];

  if (modoTexto) {
    const textarea = document.getElementById("textareaNombres");
    if (!textarea) return result;

    const lines = textarea.value.split("\n");
    for (let line of lines) {
      const clean = line.trim();
      if (clean && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(clean)) {
        if (!result.includes(clean)) {
          result.push(clean);
        }
      }
    }
    if (result.length > MAX_NOMBRES_TEXTO) {
      result = result.slice(0, MAX_NOMBRES_TEXTO);
    }
  } else {
    const friendRows = document.querySelectorAll(".friend-row");
    friendRows.forEach((row) => {
      const input = row.querySelector("input[type='text']");
      if (input) {
        const val = input.value.trim();
        // Ignorar vacío o símbolos raros
        if (val && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) {
          if (!result.includes(val)) {
            result.push(val);
          }
        }
      }
    });
  }

  return result;
}

function renderListasDisponibles() {
  const sortArea = document.querySelector(".sort-area");
  if (!sortArea) return;

  const boxes = sortArea.querySelectorAll(".box");
  if (boxes.length < 2) return;

  const boxPersonas = boxes[0];
  const boxAmigos = boxes[1];

  boxPersonas.innerHTML = "";
  boxAmigos.innerHTML = "";

  if (personasDisponibles.length > 0) {
    const ulP = document.createElement("ul");
    personasDisponibles.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      ulP.appendChild(li);
    });
    boxPersonas.appendChild(ulP);
  } else {
    boxPersonas.textContent = "No hay personas disponibles.";
  }
  if (amigosSecretosDisponibles.length > 0) {
    const ulA = document.createElement("ul");
    amigosSecretosDisponibles.forEach((a) => {
      const li = document.createElement("li");
      li.textContent = a;
      ulA.appendChild(li);
    });
    boxAmigos.appendChild(ulA);
  } else {
    boxAmigos.textContent = "No hay amigos secretos disponibles.";
  }
}




function renderResultados() {
  const resultArea = document.querySelector(".result-area");
  if (!resultArea) return;
  resultArea.innerHTML = "";

  if (personasSorteadas.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay resultados de sorteo todavía.";
    resultArea.appendChild(p);
    return;
  }

  personasSorteadas.forEach((persona, i) => {
    const amigo = amigosSecretosSorteados[i];
    const p = document.createElement("p");
    p.textContent = `${amigo} es el amigo secreto de ${persona}`;
    resultArea.appendChild(p);
  });
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



function crearTextAreaOculto() {
  if (document.getElementById("textareaNombres")) return;

  const friendsSection = document.querySelector(".friends-input");
  if (!friendsSection) return;

  const textarea = document.createElement("textarea");
  textarea.id = "textareaNombres";
  textarea.placeholder = "Escribe un nombre por línea...";
  textarea.style.display = "none"; 
  textarea.style.width = "100%";
  textarea.style.height = "100px";

  friendsSection.appendChild(textarea);
}
