/*const boton = document.querySelector("#boton");
const mensaje = document.querySelector("#mensaje");

boton.addEventListener("click", () => {
    mensaje.textContent = "JavaScript funciona y el cambio puede versionarse.";
    boton.textContent = "Prueba completada";
});*/

//Prueba de diferentes mensajes
/*const boton = document.querySelector("#boton");
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
});*/

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM principales
  const loginForm = document.getElementById('login-form');
  const btnGoogleLogin = document.getElementById('btn-google-login');
  const appHeader = document.getElementById('app-header');
  const sideMenu = document.getElementById('side-menu');
  const btnMenuToggle = document.getElementById('btn-menu-toggle');
  const closeMenu = document.getElementById('close-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const btnLogout = document.getElementById('btn-logout');

  // Evento Inicio de Sesión Formulario
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
  });

  // Evento Inicio de Sesión Google
  btnGoogleLogin.addEventListener('click', () => {
    loginUser();
  });

  // Función para autenticarse
  function loginUser() {
    document.getElementById('screen-login').classList.add('hidden');
    appHeader.classList.remove('hidden');
    navigateTo('screen-dashboard');
  }

  // Toggle Menú Lateral
  btnMenuToggle.addEventListener('click', () => {
    sideMenu.classList.remove('hidden');
  });

  closeMenu.addEventListener('click', () => {
    sideMenu.classList.add('hidden');
  });

  // Navegación desde el Menú Lateral
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScreen = link.getAttribute('data-target');
      navigateTo(targetScreen);
      sideMenu.classList.add('hidden');
    });
  });

  // Cerrar Sesión
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    sideMenu.classList.add('hidden');
    appHeader.classList.add('hidden');
    hideAllScreens();
    document.getElementById('screen-login').classList.remove('hidden');
  });
});

// Función Global para cambiar de pantallas
function navigateTo(screenId) {
  hideAllScreens();
  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) {
    selectedScreen.classList.remove('hidden');
  }
}

// Oculta todas las pantallas activas
function hideAllScreens() {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.add('hidden'));
}