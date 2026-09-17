let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

const nombreInput = document.getElementById("nombre");
const lista = document.getElementById("listaEstudiantes");
const mensajeVacio = document.getElementById("mensajeVacio");

const totalTexto = document.getElementById("total");
const presentesTexto = document.getElementById("presentes");
const ausentesTexto = document.getElementById("ausentes");

const grupoInput = document.getElementById("grupo");
const fechaInput = document.getElementById("fecha");

document.getElementById("btnAgregar").addEventListener("click", agregarEstudiante);
document.getElementById("btnBorrar").addEventListener("click", borrarLista);

nombreInput.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        agregarEstudiante();
    }
});

// Cargar grupo guardado
grupoInput.value = localStorage.getItem("grupo") || "";

// Guardar grupo automáticamente
grupoInput.addEventListener("input", function() {
    localStorage.setItem("grupo", grupoInput.value);
});

// Fecha actual por defecto
const hoy = new Date();
fechaInput.value =
    hoy.getFullYear() +
    "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(hoy.getDate()).padStart(2, "0");


function agregarEstudiante() {

    const nombre = nombreInput.value.trim();

    if (nombre === "") {
        alert("Escribe el nombre del estudiante.");
        return;
    }

    estudiantes.push({
        id: Date.now(),
        nombre: nombre,
        estado: "sin-marcar"
    });

    nombreInput.value = "";
    nombreInput.focus();

    guardar();
    mostrarEstudiantes();
}


function cambiarEstado(id, estado) {

    const estudiante = estudiantes.find(e => e.id === id);

    if (estudiante) {
        estudiante.estado = estado;
    }

    guardar();
    mostrarEstudiantes();
}


function eliminarEstudiante(id) {

    estudiantes = estudiantes.filter(e => e.id !== id);

    guardar();
    mostrarEstudiantes();
}


function borrarLista() {

    if (estudiantes.length === 0) {
        return;
    }

    const confirmar = confirm(
        "¿Seguro que quieres borrar toda la lista de estudiantes?"
    );

    if (confirmar) {
        estudiantes = [];
        guardar();
        mostrarEstudiantes();
    }
}


function guardar() {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
}


function mostrarEstudiantes() {

    lista.innerHTML = "";

    if (estudiantes.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
    }

    estudiantes.forEach(estudiante => {

        const fila = document.createElement("div");
        fila.className = "estudiante";

        const nombre = document.createElement("div");
        nombre.className = "nombre-estudiante";
        nombre.textContent = estudiante.nombre;

        const acciones = document.createElement("div");
        acciones.className = "acciones";

        const presente = document.createElement("button");
        presente.textContent = "✓ Presente";
        presente.className = "btn-presente";

        if (estudiante.estado === "presente") {
            presente.classList.add("seleccionado");
        }

        presente.addEventListener("click", function() {
            cambiarEstado(estudiante.id, "presente");
        });


        const ausente = document.createElement("button");
        ausente.textContent = "✕ Ausente";
        ausente.className = "btn-ausente";

        if (estudiante.estado === "ausente") {
            ausente.classList.add("seleccionado");
        }

        ausente.addEventListener("click", function() {
            cambiarEstado(estudiante.id, "ausente");
        });


        const eliminar = document.createElement("button");
        eliminar.textContent = "🗑";
        eliminar.className = "btn-eliminar";

        eliminar.addEventListener("click", function() {
            eliminarEstudiante(estudiante.id);
        });


        acciones.appendChild(presente);
        acciones.appendChild(ausente);
        acciones.appendChild(eliminar);

        fila.appendChild(nombre);
        fila.appendChild(acciones);

        lista.appendChild(fila);
    });

    actualizarEstadisticas();
}


function actualizarEstadisticas() {

    const presentes = estudiantes.filter(
        e => e.estado === "presente"
    ).length;

    const ausentes = estudiantes.filter(
        e => e.estado === "ausente"
    ).length;

    totalTexto.textContent = estudiantes.length;
    presentesTexto.textContent = presentes;
    ausentesTexto.textContent = ausentes;
}


mostrarEstudiantes();
