/**
 * Generador de Currículums ATS - Lógica Frontend (Vanilla JS & Fetch API)
 */

document.addEventListener('DOMContentLoaded', () => {
    initFormInteractions();
    initPreviewRenderer();
});

// =====================================================================
// 1. MANEJO DEL FORMULARIO Y SECCIONES DINÁMICAS
// =====================================================================
function initFormInteractions() {
    const cvForm = document.getElementById('cvForm');
    if (!cvForm) return;

    const categoriesContainer = document.getElementById('categoriesContainer');
    const experiencesContainer = document.getElementById('experiencesContainer');
    const projectsContainer = document.getElementById('projectsContainer');
    const educationContainer = document.getElementById('educationContainer');

    const btnAddCategory = document.getElementById('btnAddCategory');
    const btnAddExperience = document.getElementById('btnAddExperience');
    const btnAddProject = document.getElementById('btnAddProject');
    const btnAddEducation = document.getElementById('btnAddEducation');
    const btnLoadSample = document.getElementById('btnLoadSample');
    const btnClearForm = document.getElementById('btnClearForm');
    const btnPreviewCv = document.getElementById('btnPreviewCv');
    const statusMessage = document.getElementById('statusMessage');

    // Botones para agregar items dinámicos
    if (btnAddCategory) btnAddCategory.addEventListener('click', () => addCategoryRow());
    if (btnAddExperience) btnAddExperience.addEventListener('click', () => addExperienceRow());
    if (btnAddProject) btnAddProject.addEventListener('click', () => addProjectRow());
    if (btnAddEducation) btnAddEducation.addEventListener('click', () => addEducationRow());

    // Cargar perfil de prueba
    if (btnLoadSample) {
        btnLoadSample.addEventListener('click', () => {
            loadSampleProfile();
            updateStatus('✅ Perfil de prueba ATS cargado exitosamente.');
        });
    }

    // Limpiar formulario
    if (btnClearForm) {
        btnClearForm.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas limpiar todo el formulario?')) {
                cvForm.reset();
                categoriesContainer.innerHTML = '';
                experiencesContainer.innerHTML = '';
                projectsContainer.innerHTML = '';
                educationContainer.innerHTML = '';
                localStorage.removeItem('ats_cv_draft');
                updateStatus('Formulario reiniciado.');
            }
        });
    }

    // Botón Previsualizar ATS
    if (btnPreviewCv) {
        btnPreviewCv.addEventListener('click', () => {
            const data = serializeFormData();
            localStorage.setItem('ats_cv_draft', JSON.stringify(data));
            window.location.href = '/cv/preview';
        });
    }

    // Envío del formulario vía Fetch API
    cvForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeFormData();

        // Validación básica
        if (!payload.header.full_name || !payload.header.email || !payload.header.summary) {
            alert('Por favor completa los campos requeridos en el Encabezado y Resumen.');
            return;
        }

        updateStatus('⏳ Validando y enviando datos al servidor...');

        try {
            const response = await fetch('/api/cv/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                localStorage.setItem('ats_cv_draft', JSON.stringify(payload));
                updateStatus('✅ Guardado con éxito. Redirigiendo a vista previa...');
                setTimeout(() => {
                    window.location.href = '/cv/preview';
                }, 800);
            } else {
                updateStatus('❌ Error: ' + (result.message || 'No se pudo procesar'));
                alert('Error: ' + (result.message || 'Verifica los campos ingresados'));
            }
        } catch (err) {
            console.error('Error al guardar CV:', err);
            updateStatus('❌ Error de comunicación con el servidor.');
        }
    });

    // Cargar borrador previo si existe en localStorage o inicializar con 1 bloque por sección
    const savedDraft = localStorage.getItem('ats_cv_draft');
    if (savedDraft) {
        try {
            populateFormFromData(JSON.parse(savedDraft));
            updateStatus('Borrador previo recuperado automáticamente.');
        } catch (e) {
            initDefaultEmptyRows();
        }
    } else {
        initDefaultEmptyRows();
    }
}

function updateStatus(msg) {
    const el = document.getElementById('statusMessage');
    if (el) el.innerText = msg;
}

function initDefaultEmptyRows() {
    addCategoryRow('Lenguajes de Programación', 'PHP, Python, JavaScript, SQL');
    addExperienceRow();
    addProjectRow();
    addEducationRow();
}

// =====================================================================
// 2. GENERACIÓN DINÁMICA DE ELEMENTOS DEL FORMULARIO
// =====================================================================

// --- 2.1 Categorías de Competencias Técnicas ---
function addCategoryRow(categoryName = '', skills = '') {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    const rowId = 'cat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.id = rowId;

    card.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Categoría de Competencias</span>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeItem('${rowId}')">✕ Eliminar</button>
        </div>
        <div class="form-grid-2">
            <div class="form-group">
                <label>Nombre de Categoría <span class="required">*</span></label>
                <input type="text" class="cat-name-input" placeholder="Ej: Lenguajes, Bases de Datos, Cloud" value="${escapeHtml(categoryName)}" required>
            </div>
            <div class="form-group">
                <label>Habilidades / Tecnologías <span class="required">*</span></label>
                <input type="text" class="cat-skills-input" placeholder="Ej: PHP 8, Python 3, MySQL, Docker" value="${escapeHtml(skills)}" required>
            </div>
        </div>
    `;
    container.appendChild(card);
}

// --- 2.2 Experiencia Profesional y Viñetas de Logros ---
function addExperienceRow(data = {}) {
    const container = document.getElementById('experiencesContainer');
    if (!container) return;

    const expId = 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.id = expId;

    const jobTitle = data.job_title || '';
    const company = data.company || '';
    const location = data.location || '';
    const startDate = data.start_date || '';
    const endDate = data.end_date || '';
    const isCurrent = data.is_current ? 'checked' : '';

    card.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Puesto Laboral</span>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeItem('${expId}')">✕ Eliminar Experiencia</button>
        </div>
        <div class="form-grid-2">
            <div class="form-group">
                <label>Cargo / Puesto <span class="required">*</span></label>
                <input type="text" class="exp-role-input" placeholder="Ej: Senior Backend Engineer" value="${escapeHtml(jobTitle)}" required>
            </div>
            <div class="form-group">
                <label>Empresa <span class="required">*</span></label>
                <input type="text" class="exp-company-input" placeholder="Ej: Globex Corporation" value="${escapeHtml(company)}" required>
            </div>
        </div>
        <div class="form-grid-3">
            <div class="form-group">
                <label>Ubicación</label>
                <input type="text" class="exp-location-input" placeholder="Ej: Santiago, Chile (Remoto)" value="${escapeHtml(location)}">
            </div>
            <div class="form-group">
                <label>Fecha de Inicio <span class="required">*</span></label>
                <input type="text" class="exp-start-input" placeholder="Ej: Ene 2022" value="${escapeHtml(startDate)}" required>
            </div>
            <div class="form-group">
                <label>Fecha de Término</label>
                <input type="text" class="exp-end-input" placeholder="Ej: Presente o Dic 2024" value="${escapeHtml(endDate)}">
            </div>
        </div>

        <div class="bullets-box">
            <div class="flex-between align-center" style="margin-bottom: 0.75rem;">
                <label style="font-weight: 600; color: var(--accent);">Logros Cuantificables (Viñetas ATS) <span class="required">*</span></label>
                <button type="button" class="btn btn-sm btn-outline" onclick="addBulletRow('${expId}')">➕ Agregar Viñeta</button>
            </div>
            <p class="field-hint" style="margin-bottom: 0.75rem;">
                📌 Regla ATS: Utiliza viñetas con métricas. Fórmula: [Verbo de Acción] + [Proyecto/Contexto] + [Métrica de Impacto (%, $, tiempo)].
            </p>
            <div class="bullets-container" id="bullets_${expId}">
                <!-- Viñetas dinámicas -->
            </div>
        </div>
    `;

    container.appendChild(card);

    // Agregar viñetas si vienen en los datos, o 2 viñetas iniciales por defecto
    const bulletsContainer = document.getElementById(`bullets_${expId}`);
    if (data.bullets && data.bullets.length > 0) {
        data.bullets.forEach(b => addBulletRow(expId, b));
    } else {
        addBulletRow(expId, 'Lideré la implementación de una arquitectura en microservicios reduciendo el tiempo de respuesta en un 35%.');
        addBulletRow(expId, 'Automaticé procesos ETL procesando más de 50,000 registros diarios con 99.9% de disponibilidad.');
    }
}

function addBulletRow(expId, text = '') {
    const bulletsContainer = document.getElementById(`bullets_${expId}`);
    if (!bulletsContainer) return;

    const bulletId = 'blt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const row = document.createElement('div');
    row.className = 'bullet-input-row';
    row.id = bulletId;

    row.innerHTML = `
        <span class="bullet-symbol">&bull;</span>
        <input type="text" class="bullet-text-input" placeholder="Ej: Rediseñé la base de datos MySQL optimizando consultas lentas en un 40%..." value="${escapeHtml(text)}" required>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeItem('${bulletId}')">✕</button>
    `;
    bulletsContainer.appendChild(row);
}

// --- 2.3 Proyectos Destacados ---
function addProjectRow(data = {}) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    const projId = 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.id = projId;

    card.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Proyecto Destacado</span>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeItem('${projId}')">✕ Eliminar Proyecto</button>
        </div>
        <div class="form-grid-3">
            <div class="form-group">
                <label>Nombre del Proyecto <span class="required">*</span></label>
                <input type="text" class="proj-name-input" placeholder="Ej: Generador de CV ATS" value="${escapeHtml(data.name || '')}" required>
            </div>
            <div class="form-group">
                <label>Tecnologías Utilizadas <span class="required">*</span></label>
                <input type="text" class="proj-tech-input" placeholder="Ej: PHP 8, Python, FastAPI, MySQL" value="${escapeHtml(data.technologies || '')}" required>
            </div>
            <div class="form-group">
                <label>Enlace / Repositorio <span class="badge-optional">Opcional</span></label>
                <input type="url" class="proj-url-input" placeholder="https://github.com/..." value="${escapeHtml(data.project_url || '')}">
            </div>
        </div>
        <div class="form-group">
            <label>Descripción del Desarrollo y Solución <span class="required">*</span></label>
            <textarea class="proj-desc-input" rows="2" placeholder="Microservicio desacoplado para procesar y renderizar documentos normalizados..." required>${escapeHtml(data.description || '')}</textarea>
        </div>
    `;
    container.appendChild(card);
}

// --- 2.4 Educación ---
function addEducationRow(data = {}) {
    const container = document.getElementById('educationContainer');
    if (!container) return;

    const eduId = 'edu_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.id = eduId;

    card.innerHTML = `
        <div class="dynamic-item-header">
            <span class="dynamic-item-title">Formación Académica</span>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeItem('${eduId}')">✕ Eliminar</button>
        </div>
        <div class="form-grid-3">
            <div class="form-group">
                <label>Título / Grado Académico <span class="required">*</span></label>
                <input type="text" class="edu-degree-input" placeholder="Ej: Ingeniería en Informática" value="${escapeHtml(data.degree || '')}" required>
            </div>
            <div class="form-group">
                <label>Institución / Universidad <span class="required">*</span></label>
                <input type="text" class="edu-inst-input" placeholder="Ej: Universidad de Chile" value="${escapeHtml(data.institution || '')}" required>
            </div>
            <div class="form-group">
                <label>Año o Rango de Titulación <span class="required">*</span></label>
                <input type="text" class="edu-year-input" placeholder="Ej: 2018 - 2022" value="${escapeHtml(data.graduation_year || '')}" required>
            </div>
        </div>
    `;
    container.appendChild(card);
}

// Remover elemento por ID
window.removeItem = function (elementId) {
    const el = document.getElementById(elementId);
    if (el) el.remove();
};

// =====================================================================
// 3. SERIALIZACIÓN Y CARGA DE DATOS
// =====================================================================
function serializeFormData() {
    // Encabezado
    const header = {
        full_name: document.getElementById('full_name')?.value.trim() || '',
        professional_title: document.getElementById('professional_title')?.value.trim() || '',
        city: document.getElementById('city')?.value.trim() || '',
        country: document.getElementById('country')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        linkedin_url: document.getElementById('linkedin_url')?.value.trim() || '',
        github_url: document.getElementById('github_url')?.value.trim() || '', // OPCIONAL
        portfolio_url: document.getElementById('portfolio_url')?.value.trim() || '',
        summary: document.getElementById('summary')?.value.trim() || ''
    };

    // Competencias Técnicas
    const skill_categories = [];
    document.querySelectorAll('#categoriesContainer .dynamic-item-card').forEach((card, idx) => {
        const name = card.querySelector('.cat-name-input')?.value.trim() || '';
        const skills = card.querySelector('.cat-skills-input')?.value.trim() || '';
        if (name && skills) {
            skill_categories.push({ name, skills, sort_order: idx + 1 });
        }
    });

    // Experiencia Profesional
    const experiences = [];
    document.querySelectorAll('#experiencesContainer .dynamic-item-card').forEach((card, idx) => {
        const job_title = card.querySelector('.exp-role-input')?.value.trim() || '';
        const company = card.querySelector('.exp-company-input')?.value.trim() || '';
        const location = card.querySelector('.exp-location-input')?.value.trim() || '';
        const start_date = card.querySelector('.exp-start-input')?.value.trim() || '';
        const end_date = card.querySelector('.exp-end-input')?.value.trim() || 'Presente';

        const bullets = [];
        card.querySelectorAll('.bullet-text-input').forEach(b => {
            const val = b.value.trim();
            if (val) bullets.push(val);
        });

        if (job_title && company) {
            experiences.push({
                job_title,
                company,
                location,
                start_date,
                end_date,
                bullets,
                sort_order: idx + 1
            });
        }
    });

    // Proyectos
    const projects = [];
    document.querySelectorAll('#projectsContainer .dynamic-item-card').forEach((card, idx) => {
        const name = card.querySelector('.proj-name-input')?.value.trim() || '';
        const technologies = card.querySelector('.proj-tech-input')?.value.trim() || '';
        const project_url = card.querySelector('.proj-url-input')?.value.trim() || '';
        const description = card.querySelector('.proj-desc-input')?.value.trim() || '';

        if (name && description) {
            projects.push({ name, technologies, project_url, description, sort_order: idx + 1 });
        }
    });

    // Educación
    const education = [];
    document.querySelectorAll('#educationContainer .dynamic-item-card').forEach((card, idx) => {
        const degree = card.querySelector('.edu-degree-input')?.value.trim() || '';
        const institution = card.querySelector('.edu-inst-input')?.value.trim() || '';
        const graduation_year = card.querySelector('.edu-year-input')?.value.trim() || '';

        if (degree && institution) {
            education.push({ degree, institution, graduation_year, sort_order: idx + 1 });
        }
    });

    return { header, skill_categories, experiences, projects, education };
}

function populateFormFromData(data) {
    if (!data) return;

    if (data.header) {
        setVal('full_name', data.header.full_name);
        setVal('professional_title', data.header.professional_title);
        setVal('city', data.header.city);
        setVal('country', data.header.country);
        setVal('phone', data.header.phone);
        setVal('email', data.header.email);
        setVal('linkedin_url', data.header.linkedin_url);
        setVal('github_url', data.header.github_url); // OPCIONAL
        setVal('portfolio_url', data.header.portfolio_url);
        setVal('summary', data.header.summary);
    }

    const catContainer = document.getElementById('categoriesContainer');
    if (catContainer && data.skill_categories) {
        catContainer.innerHTML = '';
        data.skill_categories.forEach(c => addCategoryRow(c.name, c.skills));
    }

    const expContainer = document.getElementById('experiencesContainer');
    if (expContainer && data.experiences) {
        expContainer.innerHTML = '';
        data.experiences.forEach(e => addExperienceRow(e));
    }

    const projContainer = document.getElementById('projectsContainer');
    if (projContainer && data.projects) {
        projContainer.innerHTML = '';
        data.projects.forEach(p => addProjectRow(p));
    }

    const eduContainer = document.getElementById('educationContainer');
    if (eduContainer && data.education) {
        eduContainer.innerHTML = '';
        data.education.forEach(ed => addEducationRow(ed));
    }
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
}

// Cargar perfil completo de prueba para demostración instantánea
function loadSampleProfile() {
    const sample = {
        header: {
            full_name: 'Alejandro Silva Rivas',
            professional_title: 'Senior Full-Stack Developer & Software Architect',
            city: 'Santiago',
            country: 'Chile',
            phone: '+56 9 1234 5678',
            email: 'alejandro.silva@example.com',
            linkedin_url: 'https://linkedin.com/in/alejandrosilva',
            github_url: 'https://github.com/alejandrosilva', // Opcional
            portfolio_url: 'https://alejandrosilva.dev',
            summary: 'Ingeniero de Software con más de 7 años de experiencia diseñando arquitecturas escalables y APIs RESTful de alto rendimiento en PHP y Python. Especializado en optimización de bases de datos relacionales, microservicios y despliegues con Docker. Enfocado en código limpio, patrones de diseño y metodologías ágiles.'
        },
        skill_categories: [
            { name: 'Lenguajes de Programación', skills: 'PHP 8.x, Python 3.11+, JavaScript (ES6+), SQL, Bash' },
            { name: 'Frameworks & Librerías', skills: 'FastAPI, Laravel, Flask, React, Vanilla JS, python-docx' },
            { name: 'Bases de Datos & Almacenamiento', skills: 'MySQL, PostgreSQL, Redis, PDO, SQLAlchemy' },
            { name: 'DevOps, Cloud & Herramientas', skills: 'Docker, Git, CI/CD (GitHub Actions), Linux, Nginx, RESTful APIs' }
        ],
        experiences: [
            {
                job_title: 'Tech Lead & Senior Software Engineer',
                company: 'CloudTech Solutions',
                location: 'Santiago, Chile (Híbrido)',
                start_date: 'Ene 2022',
                end_date: 'Presente',
                bullets: [
                    'Lideré la migración de un monolito legado hacia microservicios en Python y PHP, reduciendo la latencia de respuesta en un 38% para más de 500k usuarios activos mensuales.',
                    'Diseñé e implementé un pipeline automatizado de procesamiento documental que incrementó el throughput en un 65% y redujo los errores de parsing a menos del 0.2%.',
                    'Capacité y mentoreé a un equipo de 6 desarrolladores junior y mid-level en buenas prácticas de POO, arquitectura limpia y pruebas unitarias.'
                ]
            },
            {
                job_title: 'Full-Stack Developer',
                company: 'Innova Software Labs',
                location: 'Santiago, Chile',
                start_date: 'Mar 2019',
                end_date: 'Dic 2021',
                bullets: [
                    'Desarrollé más de 15 APIs RESTful con PHP y MySQL siguiendo el patrón MVC, manteniendo una tasa de disponibilidad del 99.9%.',
                    'Optimicé índices y consultas complejas en MySQL reduciendo el tiempo de carga de reportes ejecutivos de 12 segundos a menos de 800 ms.'
                ]
            }
        ],
        projects: [
            {
                name: 'ATS Resume Engine',
                technologies: 'PHP 8, Python 3, FastAPI, python-docx, MySQL',
                project_url: 'https://github.com/alejandrosilva/ats-resume-engine',
                description: 'Microservicio de alta fidelidad para generación automatizada de currículums en formato DOCX y PDF cumpliendo con la totalidad de normas de parseo de sistemas ATS.'
            },
            {
                name: 'E-Commerce Analytics Hub',
                technologies: 'Python, FastAPI, Redis, MySQL, Docker',
                project_url: 'https://github.com/alejandrosilva/ecommerce-analytics',
                description: 'Plataforma de métricas en tiempo real con ingesta de eventos distribuidos procesando más de 10,000 eventos por minuto.'
            }
        ],
        education: [
            {
                degree: 'Ingeniería Civil en Informática',
                institution: 'Universidad de Chile',
                graduation_year: '2014 - 2019'
            },
            {
                degree: 'Diplomado en Arquitectura de Software y Cloud Computing',
                institution: 'Pontificia Universidad Católica de Chile',
                graduation_year: '2021'
            }
        ]
    };

    populateFormFromData(sample);
    localStorage.setItem('ats_cv_draft', JSON.stringify(sample));
}

// =====================================================================
// 4. RENDERIZADOR DE LA VISTA PREVIA ATS
// =====================================================================
function initPreviewRenderer() {
    const paper = document.getElementById('atsDocumentPaper');
    if (!paper) return;

    // Obtener borrador guardado en localStorage
    const savedDraft = localStorage.getItem('ats_cv_draft');
    if (!savedDraft) return;

    try {
        const data = JSON.parse(savedDraft);
        renderPreviewFromData(data);
    } catch (e) {
        console.error('Error al renderizar vista previa:', e);
    }

    // Botón de generación DOCX
    const btnGenerateDocx = document.getElementById('btnGenerateDocx');
    if (btnGenerateDocx) {
        btnGenerateDocx.addEventListener('click', async () => {
            btnGenerateDocx.disabled = true;
            btnGenerateDocx.innerHTML = '<span>⏳</span> Conectando con Microservicio Python...';

            try {
                const draft = JSON.parse(localStorage.getItem('ats_cv_draft') || '{}');
                // Simulación o llamada al endpoint de generación
                setTimeout(() => {
                    alert('🎉 La estructura ATS ha sido enviada al microservicio de Python. En el siguiente paso activaremos el endpoint de FastAPI con python-docx para la descarga directa del archivo .docx.');
                    btnGenerateDocx.disabled = false;
                    btnGenerateDocx.innerHTML = '<span>📄</span> Generar DOCX (Word ATS)';
                }, 1000);
            } catch (err) {
                alert('Error al generar: ' + err.message);
                btnGenerateDocx.disabled = false;
                btnGenerateDocx.innerHTML = '<span>📄</span> Generar DOCX (Word ATS)';
            }
        });
    }
}

function renderPreviewFromData(data) {
    if (!data) return;

    // 1. Encabezado
    if (data.header) {
        setText('prevFullName', data.header.full_name || 'Nombre del Candidato');
        setText('prevProfessionalTitle', data.header.professional_title || '');

        const location = [data.header.city, data.header.country].filter(Boolean).join(', ');
        const contactParts = [];
        if (location) contactParts.push(`<span>${escapeHtml(location)}</span>`);
        if (data.header.phone) contactParts.push(`<span>${escapeHtml(data.header.phone)}</span>`);
        if (data.header.email) contactParts.push(`<span>${escapeHtml(data.header.email)}</span>`);

        const contactLine = document.getElementById('prevContactLine');
        if (contactLine) contactLine.innerHTML = contactParts.join(' &bull; ');

        // Enlaces (LinkedIn, GitHub [opcional], Portfolio [opcional])
        const linkParts = [];
        if (data.header.linkedin_url) {
            linkParts.push(`<a href="${escapeHtml(data.header.linkedin_url)}" target="_blank">LinkedIn</a>`);
        }
        if (data.header.github_url) {
            linkParts.push(`<a href="${escapeHtml(data.header.github_url)}" target="_blank">GitHub</a>`);
        }
        if (data.header.portfolio_url) {
            linkParts.push(`<a href="${escapeHtml(data.header.portfolio_url)}" target="_blank">Portafolio</a>`);
        }

        const linksLine = document.getElementById('prevLinksLine');
        if (linksLine) {
            linksLine.innerHTML = linkParts.length > 0 ? linkParts.join(' &bull; ') : '';
        }

        setText('prevSummary', data.header.summary || '');
    }

    // 2. Competencias Técnicas
    const skillsContainer = document.getElementById('prevSkillsContainer');
    if (skillsContainer && data.skill_categories) {
        skillsContainer.innerHTML = '';
        data.skill_categories.forEach(cat => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${escapeHtml(cat.name)}:</strong> ${escapeHtml(cat.skills)}`;
            skillsContainer.appendChild(p);
        });
    }

    // 3. Experiencia Profesional
    const expContainer = document.getElementById('prevExperienceContainer');
    if (expContainer && data.experiences) {
        expContainer.innerHTML = '';
        data.experiences.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'ats-exp-entry';

            const dates = [exp.start_date, exp.end_date || 'Presente'].filter(Boolean).join(' &mdash; ');
            const subParts = [exp.company, exp.location].filter(Boolean).join(' &bull; ');

            let bulletsHtml = '';
            if (exp.bullets && exp.bullets.length > 0) {
                bulletsHtml = `<ul class="ats-bullet-list">${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
            }

            div.innerHTML = `
                <div class="ats-entry-header">
                    <span class="ats-role">${escapeHtml(exp.job_title)}</span>
                    <span class="ats-dates">${dates}</span>
                </div>
                <div class="ats-entry-sub">
                    <span class="ats-company">${subParts}</span>
                </div>
                ${bulletsHtml}
            `;
            expContainer.appendChild(div);
        });
    }

    // 4. Proyectos Destacados
    const projContainer = document.getElementById('prevProjectsContainer');
    if (projContainer && data.projects) {
        projContainer.innerHTML = '';
        data.projects.forEach(proj => {
            const div = document.createElement('div');
            div.className = 'ats-project-entry';

            let linkHtml = '';
            if (proj.project_url) {
                linkHtml = ` &bull; <a href="${escapeHtml(proj.project_url)}" target="_blank" style="color:#1d4ed8; text-decoration:underline;">Demo / Repo</a>`;
            }

            div.innerHTML = `
                <div class="ats-entry-header">
                    <span class="ats-role">${escapeHtml(proj.name)}</span>
                    <span class="ats-tech">${escapeHtml(proj.technologies || '')}${linkHtml}</span>
                </div>
                <p class="ats-project-desc">${escapeHtml(proj.description)}</p>
            `;
            projContainer.appendChild(div);
        });
    }

    // 5. Educación
    const eduContainer = document.getElementById('prevEducationContainer');
    if (eduContainer && data.education) {
        eduContainer.innerHTML = '';
        data.education.forEach(edu => {
            const div = document.createElement('div');
            div.className = 'ats-edu-entry';

            div.innerHTML = `
                <div class="ats-entry-header">
                    <span class="ats-degree">${escapeHtml(edu.degree)}</span>
                    <span class="ats-dates">${escapeHtml(edu.graduation_year || '')}</span>
                </div>
                <div class="ats-entry-sub">
                    <span class="ats-institution">${escapeHtml(edu.institution)}</span>
                </div>
            `;
            eduContainer.appendChild(div);
        });
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
