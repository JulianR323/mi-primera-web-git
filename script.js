const boton = document.querySelector("#boton");
const mensaje = document.querySelector("#mensaje");

boton.addEventListener("click", () => {
    mensaje.textContent = "JavaScript funciona y el cambio puede versionarse.";
    boton.textContent = "Prueba completada";
});