const initialActivities = [
  { id: 1, ficha: "3409609", title: "Evidencia GA3-220501093-AA1: Modelo Relacional y Sentencias SQL DDL/DML", competence: "Bases de Datos y Almacenamiento", dueDate: "2026-08-14", complexity: "Alta", status: "pendiente", grade: "sin_calificar", pinned: true, description: "Diseñar el modelo ER y construir scripts SQL.", notes: "Revisar FKs.", supportMaterial: "Guia_GA3_BD.pdf", instructorObservation: "Incluir índices.", allowResubmit: true },
  { id: 2, ficha: "3409609", title: "Evidencia GA4-220501095-AA2: Prototipado UX/UI Móvil en Figma", competence: "Diseño y Construcción de Software", dueDate: "2026-08-10", complexity: "Media", status: "pendiente", grade: "sin_calificar", pinned: true, description: "Crear wireframes de alta fidelidad.", notes: "Usar verde SENA.", supportMaterial: "Manual_Identidad.pdf", instructorObservation: "", allowResubmit: true },
  { id: 3, ficha: "3409609", title: "Evidencia GA2-220501092-AA1: Documentación de Historias de Usuario (HU)", competence: "Análisis y Requisitos de Software", dueDate: "2026-08-05", complexity: "Fácil", status: "entregada", grade: "aprobado", pinned: false, description: "Redactar 30 historias de usuario.", notes: "Entregada a tiempo.", supportMaterial: "Plantilla_HU.pdf", instructorObservation: "Excelente redacción.", allowResubmit: true, submissionFile: "HU_Jonathan.pdf", submissionDate: "04/08/2026" },
  { id: 4, ficha: "3409609", title: "Evidencia GA5-220501096-AA1: API RESTful en Node.js, Express y JWT", competence: "Diseño y Construcción de Software", dueDate: "2026-08-07", complexity: "Alta", status: "retraso", grade: "no_aprobado", pinned: false, description: "Backend CRUD con Node.js.", notes: "Corregir JWT.", supportMaterial: "Backend_Doc.pdf", instructorObservation: "No aprobado. Falta autenticación. Puedes resubir.", allowResubmit: true, submissionFile: "API_Borrador.zip", submissionDate: "06/08/2026" },
  { id: 5, ficha: "3409610", title: "Evidencia GA6-220501097-AA1: Plan de Pruebas Unitarias con Jest", competence: "Pruebas y Calidad de Software", dueDate: "2026-08-18", complexity: "Media", status: "pendiente", grade: "sin_calificar", pinned: false, description: "Casos de prueba para Ficha 3409610.", notes: "", supportMaterial: "Pruebas_Doc.pdf", instructorObservation: "", allowResubmit: true },
  { id: 6, ficha: "3409611", title: "Evidencia GA1-240201501-AA3: Technical Documentation Reading Report", competence: "Inglés Técnico y Comunicativo", dueDate: "2026-08-20", complexity: "Fácil", status: "pendiente", grade: "sin_calificar", pinned: false, description: "Informe técnico en inglés Scrum.", notes: "", supportMaterial: "Scrum_Guide.pdf", instructorObservation: "", allowResubmit: true }
];

let activities = JSON.parse(localStorage.getItem('aulaConecta_activities')) || initialActivities;
const currentUser = JSON.parse(localStorage.getItem('aulaConecta_user')) || { email: 'jonathan_felipe@soy.sena.edu.co', role: 'aprendiz', name: 'Jonathan Felipe Cruz Saenz', subtitle: 'Aprendiz ADSO • Ficha 3409609', ficha: '3409609' };
const currentRole = currentUser.role;
let activeModalActivityId = null, selectedInstructorGrade = 'sin_calificar';

const $ = (id) => document.getElementById(id);
const formatDate = (s) => s ? s.split('-').reverse().join('/') : '--/--/----';
const saveState = () => localStorage.setItem('aulaConecta_activities', JSON.stringify(activities));

function initSession() {
  $('userNameDisplay').textContent = currentUser.name;
  $('userRoleSubtitle').textContent = currentUser.subtitle;
  $('userEmailDisplay').textContent = currentUser.email;
  if ($('sidebarFichaTag')) $('sidebarFichaTag').innerHTML = `<i class="fa-solid fa-id-card"></i> Ficha: ${currentUser.ficha || '3409609'}`;

  const isInst = currentRole === 'instructor';
  $('headerRoleBadge').innerHTML = `<i class="fa-solid ${isInst ? 'fa-chalkboard-user' : 'fa-user-graduate'}"></i> ${isInst ? 'Instructor' : 'Aprendiz'} ${currentUser.name}`;
  if (isInst) $('headerRoleBadge').classList.add('instructor-mode');

  $('instructorSidebarPanel').classList.toggle('hidden', !isInst);
  $('btnTopCreateActivity').classList.toggle('hidden', !isInst);
  if ($('headerFichaSubtitle')) $('headerFichaSubtitle').textContent = isInst ? 'Gestión por Fichas • Instructor SENA' : `Actividades • Ficha ${currentUser.ficha || '3409609'}`;

  render();
}

window.togglePin = (id, e) => { e?.stopPropagation(); activities = activities.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a); saveState(); render(); };
window.changeComplexity = (id, val, e) => { e?.stopPropagation(); activities = activities.map(a => a.id === id ? { ...a, complexity: val } : a); saveState(); render(); };

function createCard(act) {
  const urgent = (act.status !== 'entregada' && Math.ceil((new Date(act.dueDate) - new Date().setHours(0,0,0,0)) / 86400000) <= 2) ? 'urgent' : '';
  const gradeTag = act.grade === 'aprobado' ? `<span class="badge-grade aprobado"><i class="fa-solid fa-check-double"></i> Aprobado (A)</span>` : act.grade === 'no_aprobado' ? `<span class="badge-grade no-aprobado"><i class="fa-solid fa-xmark"></i> No Aprobado (D)</span>` : '';

  return `
    <article class="activity-card ${act.pinned ? 'pinned' : ''}" data-id="${act.id}">
      <div class="card-top">
        <div class="badges-row">
          <span class="badge-ficha">Ficha ${act.ficha || '3409609'}</span>
          <span class="badge-competence">${act.competence}</span>
          ${gradeTag}
          <select class="badge-complexity-select ${act.complexity}" onchange="changeComplexity(${act.id}, this.value, event)">
            <option value="Fácil" ${act.complexity === 'Fácil' ? 'selected' : ''}>Fácil</option>
            <option value="Media" ${act.complexity === 'Media' ? 'selected' : ''}>Media</option>
            <option value="Alta" ${act.complexity === 'Alta' ? 'selected' : ''}>Alta</option>
          </select>
        </div>
        <button class="btn-pin ${act.pinned ? 'is-pinned' : ''}" onclick="togglePin(${act.id}, event)"><i class="fa-${act.pinned ? 'solid' : 'regular'} fa-thumbtack"></i></button>
      </div>
      <h3 class="card-title">${act.title}</h3>
      <div class="card-footer">
        <span class="due-date ${urgent}"><i class="fa-regular fa-clock"></i> Vence: ${formatDate(act.dueDate)}</span>
        <span class="badge-status ${act.status}"><i class="fa-solid ${act.status === 'entregada' ? 'fa-circle-check' : act.status === 'retraso' ? 'fa-circle-exclamation' : 'fa-circle'}"></i> ${act.status}</span>
      </div>
      <div class="card-actions">
        <button class="btn-card-action ${act.notes ? 'has-notes' : ''}" onclick="openActivityModal(${act.id})"><i class="fa-solid fa-eye"></i> ${currentRole === 'instructor' ? 'Revisar / Calificar' : 'Ver Detalle'}</button>
        ${currentRole === 'aprendiz' && (act.status !== 'entregada' || (act.grade === 'no_aprobado' && act.allowResubmit)) ? `<button class="btn-card-action btn-quick-deliver" onclick="openActivityModal(${act.id})"><i class="fa-solid fa-upload"></i> ${act.grade === 'no_aprobado' ? 'Resubir' : 'Entregar'}</button>` : ''}
      </div>
    </article>
  `;
}

function render() {
  const q = $('searchInput').value.toLowerCase().trim(), ficha = $('filterFicha')?.value || 'all', comp = $('filterCompetence').value, stat = $('filterStatus').value, compx = $('filterComplexity').value, sort = $('sortBy').value;

  let list = activities.filter(a => (ficha === 'all' || a.ficha === ficha) && (a.title.toLowerCase().includes(q) || a.competence.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) && (comp === 'all' || a.competence === comp) && (stat === 'all' || a.status === stat) && (compx === 'all' || a.complexity === compx));

  list.sort((a, b) => {
    if (sort === 'dueDateAsc') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sort === 'dueDateDesc') return new Date(b.dueDate) - new Date(a.dueDate);
    const w = { 'Alta': 3, 'Media': 2, 'Fácil': 1 };
    return sort === 'complexityDesc' ? w[b.complexity] - w[a.complexity] : w[a.complexity] - w[b.complexity];
  });

  const pinned = list.filter(a => a.pinned), unpinned = list.filter(a => !a.pinned);
  $('pinnedSection').classList.toggle('hidden', pinned.length === 0);
  $('pinnedContainer').innerHTML = pinned.map(createCard).join('');
  $('activitiesContainer').innerHTML = unpinned.map(createCard).join('');
  $('emptyState').classList.toggle('hidden', list.length > 0);

  $('countPending').textContent = activities.filter(a => a.status === 'pendiente').length;
  $('countCompleted').textContent = activities.filter(a => a.status === 'entregada').length;
  $('countLate').textContent = activities.filter(a => a.status === 'retraso').length;
}

window.openActivityModal = (id) => {
  const act = activities.find(a => a.id === id);
  if (!act) return;

  activeModalActivityId = id;
  $('modalTitle').textContent = act.title;
  $('modalCompetence').textContent = act.competence;
  if ($('modalFichaBadge')) $('modalFichaBadge').textContent = `Ficha: ${act.ficha || '3409609'}`;
  $('modalDueDate').textContent = formatDate(act.dueDate);
  $('modalComplexitySelect').value = act.complexity;
  $('modalDescription').textContent = act.description;
  $('modalSupportMaterial').textContent = act.supportMaterial || 'Guia_ADSO.pdf';
  $('personalNotes').value = act.notes || '';
  $('notesStatusMsg').textContent = '';
  $('modalStatusBadge').textContent = act.status;
  $('modalStatusBadge').className = `badge-status ${act.status}`;

  const infoBox = $('submissionStatusInfo'), formBox = $('submissionForm');
  if (act.status === 'entregada' || act.submissionFile) {
    infoBox.innerHTML = `<p style="color:#15803d; font-weight:700; font-size:0.8rem;"><i class="fa-solid fa-circle-check"></i> Enviada el ${act.submissionDate || 'recientemente'}.</p><p style="font-size:0.75rem; color:#475569;">Archivo: <strong>${act.submissionFile || 'Evidencia.zip'}</strong></p>`;
    if (act.grade === 'no_aprobado' && !act.allowResubmit) {
      formBox.innerHTML = `<p style="font-size:0.75rem; color:#b91c1c; font-weight:700;"><i class="fa-solid fa-lock"></i> No Aprobado. Reenvío deshabilitado.</p>`;
    } else if (act.grade === 'aprobado') {
      formBox.innerHTML = `<p style="font-size:0.75rem; color:#15803d; font-weight:700;"><i class="fa-solid fa-check-double"></i> ¡APROBADA por el instructor!</p>`;
    } else {
      formBox.innerHTML = `<label for="submissionFileInput">Reemplazar evidencia:</label><input type="file" id="submissionFileInput" class="file-input"><button class="btn-submit-work" id="btnSubmitWork">Resubir Evidencia Corregida</button>`;
      $('btnSubmitWork').onclick = handleSubmission;
    }
  } else {
    infoBox.innerHTML = `<p style="color:#ef4444; font-weight:700; font-size:0.8rem;"><i class="fa-solid fa-clock"></i> Pendiente de entrega.</p>`;
    formBox.innerHTML = `<label for="submissionFileInput">Adjuntar evidencia (ZIP, PDF, DOCX):</label><input type="file" id="submissionFileInput" class="file-input"><button class="btn-submit-work" id="btnSubmitWork">Entregar Actividad</button>`;
    $('btnSubmitWork').onclick = handleSubmission;
  }

  if (currentRole === 'instructor') {
    $('observationView').classList.add('hidden');
    $('observationEditForm').classList.remove('hidden');
    $('instructorObsInput').value = act.instructorObservation || '';
    $('allowResubmitCheckbox').checked = act.allowResubmit !== false;
    setGradeOption(act.grade || 'sin_calificar');
  } else {
    $('observationEditForm').classList.add('hidden');
    $('observationView').classList.remove('hidden');
    const pill = $('gradeResultPill');
    pill.innerHTML = act.grade === 'aprobado' ? `<i class="fa-solid fa-circle-check"></i> Calificación: <strong>APROBADO (A)</strong>` : act.grade === 'no_aprobado' ? `<i class="fa-solid fa-circle-xmark"></i> Calificación: <strong>NO APROBADO (D)</strong>` : `<i class="fa-solid fa-hourglass-half"></i> Calificación: <strong>Sin Calificar</strong>`;
    pill.className = `grade-result-pill ${act.grade || 'sin-calificar'}`;
    $('observationText').textContent = act.instructorObservation || 'Sin observaciones del instructor aún.';
    $('resubmitStatusPill').textContent = act.allowResubmit !== false ? '✓ Reenvío Activo' : '✕ Sin Reenvío';
    $('resubmitStatusPill').className = `resubmit-status-pill ${act.allowResubmit !== false ? 'allowed' : 'blocked'}`;
  }
  $('modalOverlay').classList.remove('hidden');
};

function setGradeOption(val) {
  selectedInstructorGrade = val;
  $('btnGradeApproved').classList.toggle('selected', val === 'aprobado');
  $('btnGradeRejected').classList.toggle('selected', val === 'no_aprobado');
  if (val === 'aprobado') $('allowResubmitCheckbox').checked = false;
  if (val === 'no_aprobado') $('allowResubmitCheckbox').checked = true;
}

$('btnGradeApproved').onclick = () => setGradeOption('aprobado');
$('btnGradeRejected').onclick = () => setGradeOption('no_aprobado');

function handleSubmission() {
  if (!activeModalActivityId) return;
  const fileInput = $('submissionFileInput');
  const fileName = (fileInput && fileInput.files.length > 0) ? fileInput.files[0].name : `Evidencia_${currentUser.name.replace(/\s+/g, '_')}.zip`;
  activities = activities.map(a => a.id === activeModalActivityId ? { ...a, status: 'entregada', grade: 'sin_calificar', submissionFile: fileName, submissionDate: new Date().toLocaleDateString('es-ES') } : a);
  saveState(); render(); openActivityModal(activeModalActivityId); alert("¡Evidencia entregada!");
}

$('btnSaveInstructorObs').onclick = () => {
  if (!activeModalActivityId) return;
  activities = activities.map(a => a.id === activeModalActivityId ? { ...a, grade: selectedInstructorGrade, instructorObservation: $('instructorObsInput').value.trim(), allowResubmit: $('allowResubmitCheckbox').checked } : a);
  saveState(); render(); alert("¡Calificación y observaciones guardadas!"); closeModal();
};

$('btnSaveNotes').onclick = () => {
  if (!activeModalActivityId) return;
  activities = activities.map(a => a.id === activeModalActivityId ? { ...a, notes: $('personalNotes').value.trim() } : a);
  saveState(); render(); $('notesStatusMsg').textContent = '✓ Guardado'; setTimeout(() => { $('notesStatusMsg').textContent = ''; }, 1200);
};

$('modalComplexitySelect').onchange = () => { if (activeModalActivityId) changeComplexity(activeModalActivityId, $('modalComplexitySelect').value); };
$('btnDownloadMaterial').onclick = () => alert(`Descargando: ${$('modalSupportMaterial').textContent}`);

const closeModal = () => { $('modalOverlay').classList.add('hidden'); activeModalActivityId = null; };
const closeCreateModal = () => $('modalCreateOverlay').classList.add('hidden');

$('btnCloseModal').onclick = closeModal;
$('btnCloseCreateModal').onclick = closeCreateModal;
$('btnOpenCreateModal').onclick = $('btnTopCreateActivity').onclick = () => { $('modalCreateOverlay').classList.remove('hidden'); toggleSidebar(false); };

$('createActivityForm').onsubmit = (e) => {
  e.preventDefault();
  const newAct = {
    id: Date.now(), ficha: $('newFicha').value, title: $('newTitle').value.trim(), competence: $('newCompetence').value, dueDate: $('newDueDate').value, complexity: $('newComplexity').value, status: 'pendiente', grade: 'sin_calificar', pinned: false, description: $('newDescription').value.trim(), notes: '', supportMaterial: $('newSupportMaterial').value.trim() || 'Guia.pdf', instructorObservation: '', allowResubmit: true
  };
  activities.unshift(newAct); saveState(); render(); $('createActivityForm').reset(); closeCreateModal(); alert(`¡Actividad publicada en la Ficha ${newAct.ficha}!`);
};

const toggleSidebar = (open) => { $('sidebarDrawer').classList.toggle('open', open); $('sidebarBackdrop').classList.toggle('hidden', !open); };
$('btnOpenSidebar').onclick = $('btnAvatar').onclick = () => toggleSidebar(true);
$('btnCloseSidebar').onclick = $('sidebarBackdrop').onclick = () => toggleSidebar(false);

const logout = () => { if (confirm("¿Cerrar sesión?")) { localStorage.removeItem('aulaConecta_user'); window.location.href = 'inicio.html'; } };
$('btnHeaderLogout').onclick = $('btnSidebarLogout').onclick = logout;

$('searchInput').oninput = () => { $('btnClearSearch').hidden = $('searchInput').value.length === 0; render(); };
$('btnClearSearch').onclick = () => { $('searchInput').value = ''; $('btnClearSearch').hidden = true; render(); };

if ($('filterFicha')) $('filterFicha').onchange = render;
$('filterCompetence').onchange = $('filterStatus').onchange = $('filterComplexity').onchange = $('sortBy').onchange = render;

$('btnResetFilters').onclick = () => {
  $('searchInput').value = ''; $('btnClearSearch').hidden = true;
  if ($('filterFicha')) $('filterFicha').value = 'all';
  $('filterCompetence').value = $('filterStatus').value = $('filterComplexity').value = 'all';
  $('sortBy').value = 'dueDateAsc'; render();
};

document.addEventListener('DOMContentLoaded', initSession);
