// Acción al hacer clic en el menú
document.getElementById('botonMenu').addEventListener('click', function() {
    alert('Menú abierto');
});

// Acción al hacer clic en "VER HORARIO COMPLETO"
document.getElementById('botonHorario').addEventListener('click', function() {
    alert('Cargando el horario completo del estudiante...');
});

// Acción básica para los botones cuadrantes de abajo
function abrirSeccion(nombreSeccion) {
    alert('Navegando a la sección: ' + nombreSeccion);
}