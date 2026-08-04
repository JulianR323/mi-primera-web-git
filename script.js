/*const boton = document.querySelector("#boton");
const mensaje = document.querySelector("#mensaje");

boton.addEventListener("click", () => {
    mensaje.textContent = "JavaScript funciona y el cambio puede versionarse.";
    boton.textContent = "Prueba completada";
});*/

//Prueba de diferentes mensajes
const boton = document.querySelector("#boton");
const mensaje = document.querySelector("#mensaje");

// Arreglo de mensajes/actividades de AulaConecta
const novedades = [
    "Tarea de Programación entregada a tiempo.",
    "Nuevo comunicado: Revisar el horario del trimestre.",
    "Alerta: Tarea de Base de Datos próxima a vencer.",
    "Observación del instructor: Excelente avance en el prototipo."
];

let indice = 0;

boton.addEventListener("click", () => {
    mensaje.textContent = novedades[indice];
    indice = (indice + 1) % novedades.length;
    boton.textContent = "Ver siguiente novedad";
});