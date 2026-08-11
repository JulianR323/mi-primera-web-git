document.addEventListener('DOMContentLoaded', () => {

  
  const botonMenu = document.getElementById('botonMenu');
  const menuNavegacion = document.getElementById('menuNavegacion');

  if (botonMenu && menuNavegacion) {
    botonMenu.addEventListener('click', (evento) => {
      evento.stopPropagation();
      menuNavegacion.classList.toggle('oculto');
    });

}
});