document.addEventListener('DOMContentLoaded', () => {
  const users = {
    'jonathan_felipe@soy.sena.edu.co': { pass: 'aprendiz', role: 'aprendiz', name: 'Jonathan Felipe Cruz Saenz', subtitle: 'Aprendiz ADSO • Ficha 3409609' },
    'cristian_tunaroza@sena.edu.co': { pass: 'instructor', role: 'instructor', name: 'Ing. Cristian Fabian Tunaroza', subtitle: 'Instructor Lider ADSO • Ficha 3409609' }
  };
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('correo').value.trim().toLowerCase();
    const pass = document.getElementById('contrasena').value.trim();
    const u = users[email], err = document.getElementById('loginErrorMessage');
    if (u && u.pass === pass) {
      if (err) err.style.display = 'none';
      localStorage.setItem('aulaConecta_user', JSON.stringify({ email, ...u }));
      localStorage.setItem('aulaConecta_role', u.role);
      window.location.href = 'listaActividades.html';
    } else if (err) {
      err.style.display = 'block';
      err.innerHTML = '⚠️ <strong>No se pudo iniciar sesión.</strong><br>El correo o la contraseña no corresponden.';
    }
  });
});
