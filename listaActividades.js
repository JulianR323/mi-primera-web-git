/* ==========================================================================
   AulaConecta - Lista de Actividades (SENA ADSO)
   Lógica JavaScript Interactiva
   ========================================================================== */

// 1. Datos iniciales de ejemplo (Actividades del programa ADSO)
const initialActivities = [
  {
    id: 1,
    title: "Evidencia GA3-220501093-AA1: Modelo relacional y sentencias SQL",
    competence: "Bases de Datos",
    dueDate: "2026-08-10",
    complexity: "Alta",
    status: "pendiente",
    pinned: true,
    description: "Diseñar el diagrama entidad-relación y construir los scripts DDL/DML para el sistema AulaConecta siguiendo la normalización 3FN.",
    notes: "Revisar claves foráneas y la restricción ON DELETE CASCADE antes de subir la entrega."
  },
  {
    id: 2,
    title: "Evidencia GA4-220501095-AA2: Prototipado UX/UI en Figma",
    competence: "Programación",
    dueDate: "2026-08-08",
    complexity: "Media",
    status: "pendiente",
    pinned: true,
    description: "Crear el wireframe de alta fidelidad para las 5 pantallas principales del sistema móvil AulaConecta.",
    notes: "Asegurar que los colores verde SENA (#39A900) y azul (#00324D) estén aplicados."
  },
  {
    id: 3,
    title: "Evidencia GA2-220501092-AA1: Documento de historias de usuario",
    competence: "Requisitos",
    dueDate: "2026-08-02",
    complexity: "Fácil",
    status: "entregada",
    pinned: false,
    description: "Redactar 30 historias de usuario con la estructura 'Como [rol], quiero [funcionalidad] para [beneficio]'.",
    notes: "Aprobada por el instructor con 100/100."
  },
  {
    id: 4,
    title: "Evidencia GA5-220501096-AA1: API RESTful en Node.js / Express",
    competence: "Programación",
    dueDate: "2026-08-04",
    complexity: "Alta",
    status: "retraso",
    pinned: false,
    description: "Implementación del CRUD de usuarios, comunicados y consulta de RAPs para la plataforma.",
    notes: "Falta corregir los middleware de autenticación con JWT."
  },
  {
    id: 5,
    title: "Evidencia GA1-240201501-AA3: Technical Reading Comprehension Report",
    competence: "Inglés",
    dueDate: "2026-08-15",
    complexity: "Fácil",
    status: "pendiente",
    pinned: false,
    description: "Elaborar un resumen de lectura técnica sobre metodologías ágiles Scrum en formato PDF en inglés.",
    notes: ""
  },
  {
    id: 6,
    title: "Evidencia GA4-220501095-AA3: Desarrollo Front-End HTML5, CSS3 y JS",
    competence: "Programación",
    dueDate: "2026-08-12",
    complexity: "Media",
    status: "pendiente",
    pinned: false,
    description: "Crear la interfaz responsiva de la pantalla Lista de Actividades con soporte para filtros dinámicos.",
    notes: "Fijar esta tarea para tener acceso rápido diario."
  }
];

// Estado global persisitido en LocalStorage
let activities = JSON.parse(localStorage.getItem('aulaConecta_activities')) || initialActivities;
let activeModalActivityId = null;

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const filterCompetence = document.getElementById('filterCompetence');
const filterStatus = document.getElementById('filterStatus');
const filterComplexity = document.getElementById('filterComplexity');
const sortBy = document.getElementById('sortBy');

const pinnedContainer = document.getElementById('pinnedContainer');
const activitiesContainer = document.getElementById('activitiesContainer');
const pinnedSection = document.getElementById('pinnedSection');
const emptyState = document.getElementById('emptyState');
const btnResetFilters = document.getElementById('btnResetFilters');

const countPending = document.getElementById('countPending');
const countCompleted = document.getElementById('countCompleted');
const countLate = document.getElementById('countLate');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const btnCloseModal = document.getElementById('btnCloseModal');
const modalTitle = document.getElementById('modalTitle');
const modalCompetence = document.getElementById('modalCompetence');
const modalDueDate = document.getElementById('modalDueDate');
const modalComplexity = document.getElementById('modalComplexity');
const modalDescription = document.getElementById('modalDescription');
const personalNotes = document.getElementById('personalNotes');
const btnSaveNotes = document.getElementById('btnSaveNotes');
const notesStatusMsg = document.getElementById('notesStatusMsg');
const btnBack = document.getElementById('btnBack');

// Persistir cambios en LocalStorage
function saveState() {
  localStorage.setItem('aulaConecta_activities', JSON.stringify(activities));
}

// Formatear Fecha (YYYY-MM-DD -> DD/MM/YYYY)
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Comprobar si falta poco tiempo para la entrega
function isUrgent(dueDateStr, status) {
  if (status === 'entregada') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diffDays <= 2;
}

// Construir HTML de la Tarjeta de Actividad
function createActivityCard(act) {
  const isPinned = act.pinned;
  const urgentClass = isUrgent(act.dueDate, act.status) ? 'urgent' : '';
  const hasNotesClass = act.notes && act.notes.trim() !== '' ? 'has-notes' : '';

  let statusLabel = 'Pendiente';
  let statusIcon = 'fa-circle';
  if (act.status === 'entregada') {
    statusLabel = 'Entregada';
    statusIcon = 'fa-circle-check';
  } else if (act.status === 'retraso') {
    statusLabel = 'En Retraso';
    statusIcon = 'fa-circle-exclamation';
  }

  return `
    <article class="activity-card ${isPinned ? 'pinned' : ''}" data-id="${act.id}">
      <div class="card-top">
        <div class="badges-row">
          <span class="badge-competence">${act.competence}</span>
          <span class="badge-complexity ${act.complexity}">${act.complexity}</span>
        </div>
        <button class="btn-pin ${isPinned ? 'is-pinned' : ''}" onclick="togglePin(${act.id}, event)" title="${isPinned ? 'Desfijar' : 'Fijar arriba (H15)'}">
          <i class="fa-${isPinned ? 'solid' : 'regular'} fa-thumbtack"></i>
        </button>
      </div>

      <h3 class="card-title">${act.title}</h3>

      <div class="card-footer">
        <span class="due-date ${urgentClass}">
          <i class="fa-regular fa-clock"></i> Vence: ${formatDate(act.dueDate)}
        </span>
        <span class="badge-status ${act.status}">
          <i class="fa-solid ${statusIcon}"></i> ${statusLabel}
        </span>
      </div>

      <div class="card-actions">
        <button class="btn-card-action ${hasNotesClass}" onclick="openActivityModal(${act.id})">
          <i class="fa-solid fa-pen-to-square"></i> ${act.notes ? 'Ver / Editar Anotación' : 'Añadir Anotación (H13)'}
        </button>
      </div>
    </article>
  `;
}

// Aplicar Búsqueda, Filtros y Ordenamiento
function getFilteredActivities() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCompetence = filterCompetence.value;
  const selectedStatus = filterStatus.value;
  const selectedComplexity = filterComplexity.value;
  const selectedSort = sortBy.value;

  let result = activities.filter(act => {
    // Búsqueda (H20)
    const matchesSearch = act.title.toLowerCase().includes(searchTerm) ||
                          act.competence.toLowerCase().includes(searchTerm) ||
                          act.description.toLowerCase().includes(searchTerm);

    // Filtros (H11, H21, H12)
    const matchesCompetence = selectedCompetence === 'all' || act.competence === selectedCompetence;
    const matchesStatus = selectedStatus === 'all' || act.status === selectedStatus;
    const matchesComplexity = selectedComplexity === 'all' || act.complexity === selectedComplexity;

    return matchesSearch && matchesCompetence && matchesStatus && matchesComplexity;
  });

  // Ordenamiento (H10)
  result.sort((a, b) => {
    if (selectedSort === 'dueDateAsc') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (selectedSort === 'dueDateDesc') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    } else if (selectedSort === 'complexityDesc') {
      const order = { 'Alta': 3, 'Media': 2, 'Fácil': 1 };
      return order[b.complexity] - order[a.complexity];
    } else if (selectedSort === 'complexityAsc') {
      const order = { 'Alta': 3, 'Media': 2, 'Fácil': 1 };
      return order[a.complexity] - order[b.complexity];
    }
    return 0;
  });

  return result;
}

// Renderizar la Interfaz
function render() {
  const filtered = getFilteredActivities();
  const pinnedList = filtered.filter(a => a.pinned);
  const unpinnedList = filtered.filter(a => !a.pinned);

  // Renderizar Fijadas (H15)
  if (pinnedList.length > 0) {
    pinnedSection.classList.remove('hidden');
    pinnedContainer.innerHTML = pinnedList.map(createActivityCard).join('');
  } else {
    pinnedSection.classList.add('hidden');
    pinnedContainer.innerHTML = '';
  }

  // Renderizar Restantes
  activitiesContainer.innerHTML = unpinnedList.map(createActivityCard).join('');

  // Manejar pantalla vacía
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Actualizar indicadores
  updateStats();
}

// Contadores de la parte superior
function updateStats() {
  countPending.textContent = activities.filter(a => a.status === 'pendiente').length;
  countCompleted.textContent = activities.filter(a => a.status === 'entregada').length;
  countLate.textContent = activities.filter(a => a.status === 'retraso').length;
}

// Fijar / Desfijar Tareas (H15)
window.togglePin = function(id, event) {
  event.stopPropagation();
  activities = activities.map(act => {
    if (act.id === id) return { ...act, pinned: !act.pinned };
    return act;
  });
  saveState();
  render();
};

// Abrir Modal de Anotaciones Personales (H13)
window.openActivityModal = function(id) {
  const act = activities.find(a => a.id === id);
  if (!act) return;

  activeModalActivityId = id;
  modalTitle.textContent = act.title;
  modalCompetence.textContent = act.competence;
  modalDueDate.textContent = formatDate(act.dueDate);
  modalComplexity.textContent = `Dificultad ${act.complexity}`;
  modalComplexity.className = `badge-complexity ${act.complexity}`;
  modalDescription.textContent = act.description;
  personalNotes.value = act.notes || '';
  notesStatusMsg.textContent = '';

  modalOverlay.classList.remove('hidden');
};

// Cerrar Modal
function closeModal() {
  modalOverlay.classList.add('hidden');
  activeModalActivityId = null;
}

// Guardar Anotaciones Personales (H13)
btnSaveNotes.addEventListener('click', () => {
  if (!activeModalActivityId) return;

  const noteText = personalNotes.value.trim();
  activities = activities.map(act => {
    if (act.id === activeModalActivityId) return { ...act, notes: noteText };
    return act;
  });

  saveState();
  render();

  notesStatusMsg.textContent = '✓ ¡Anotación guardada correctamente!';
  setTimeout(closeModal, 900);
});

// Eventos de Búsqueda y Filtros
searchInput.addEventListener('input', () => {
  btnClearSearch.hidden = searchInput.value.length === 0;
  render();
});

btnClearSearch.addEventListener('click', () => {
  searchInput.value = '';
  btnClearSearch.hidden = true;
  render();
});

filterCompetence.addEventListener('change', render);
filterStatus.addEventListener('change', render);
filterComplexity.addEventListener('change', render);
sortBy.addEventListener('change', render);

btnResetFilters.addEventListener('click', () => {
  searchInput.value = '';
  btnClearSearch.hidden = true;
  filterCompetence.value = 'all';
  filterStatus.value = 'all';
  filterComplexity.value = 'all';
  sortBy.value = 'dueDateAsc';
  render();
});

// Botón de Regreso (Navegación al Tablero)
btnBack.addEventListener('click', () => {
  alert("Navegando de regreso al Menú Principal / Tablero...");
});

btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', render);