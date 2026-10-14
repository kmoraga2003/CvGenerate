/**
 * Generador de Currículums ATS - Lógica Frontend (Vanilla JS & Fetch API)
 * Incluye módulo de Auditoría y Adaptación con IA (Modelo Google XYZ)
 */

const PYTHON_API_URL = 'http://127.0.0.1:8001';

document.addEventListener('DOMContentLoaded', () => {
    initFormInteractions();
    initPreviewRenderer();
    initAiTailorModule();
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

    if (btnAddCategory) btnAddCategory.addEventListener('click', () => addCategoryRow());
    if (btnAddExperience) btnAddExperience.addEventListener('click', () => addExperienceRow());
    if (btnAddProject) btnAddProject.addEventListener('click', () => addProjectRow());
    if (btnAddEducation) btnAddEducation.addEventListener('click', () => addEducationRow());

    if (btnLoadSample) {
        btnLoadSample.addEventListener('click', () => {
            loadSampleProfile();
            updateStatus('✅ Perfil de prueba ATS cargado exitosamente.');
        });
    }

    if (btnClearForm) {
        btnClearForm.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas limpiar todo el formulario?')) {
                cvForm.reset();
                if (categoriesContainer) categoriesContainer.innerHTML = '';
                if (experiencesContainer) experiencesContainer.innerHTML = '';
                if (projectsContainer) projectsContainer.innerHTML = '';
                if (educationContainer) educationContainer.innerHTML = '';
                localStorage.removeItem('ats_cv_draft');
                updateStatus('Formulario reiniciado.');
            }
        });
    }

    if (btnPreviewCv) {
        btnPreviewCv.addEventListener('click', () => {
            const data = serializeFormData();
            localStorage.setItem('ats_cv_draft', JSON.stringify(data));
            window.location.href = '/cv/preview';
        });
    }

    cvForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeFormData();

        if (!payload.header.full_name || !payload.header.email || !payload.header.summary) {
            alert('Por favor completa los campos requeridos en el Encabezado y Resumen.');
            return;
        }

        updateStatus('⏳ Validando y enviando datos...');

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
                alert('Error: ' + (result.message || 'Verifica los campos'));
            }
        } catch (err) {
            console.error('Error al guardar CV:', err);
            updateStatus('❌ Error de comunicación con el servidor.');
        }
    });

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
// 2. MÓDULO IA: ADAPTACIÓN A OFERTA DE EMPLEO
// =====================================================================
window.lastTailoredCv = null;

function initAiTailorModule() {
    const btnTailorCv = document.getElementById('btnTailorCv');
    const btnTailorAndDownload = document.getElementById('btnTailorAndDownload');
    const btnApplyAiChanges = document.getElementById('btnApplyAiChanges');
    const btnDownloadAiDocx = document.getElementById('btnDownloadAiDocx');
    const jobDescriptionInput = document.getElementById('jobDescriptionInput');
    const aiStatusText = document.getElementById('aiStatusText');
    const aiResultsBox = document.getElementById('aiResultsBox');

    if (!btnTailorCv) return;

    // 2.1 Auditar y Adaptar CV con IA
    btnTailorCv.addEventListener('click', async () => {
        const jobDesc = jobDescriptionInput ? jobDescriptionInput.value.trim() : '';
        if (!jobDesc) {
            alert('Por favor pega la descripción o aviso de la vacante para realizar la auditoría.');
            if (jobDescriptionInput) jobDescriptionInput.focus();
            return;
        }

        const cvData = serializeFormData();
        if (!cvData.header.full_name) {
            alert('Por favor ingresa al menos tu nombre en el formulario antes de adaptar con IA.');
            return;
        }

        btnTailorCv.disabled = true;
        btnTailorCv.innerHTML = '<span>⏳</span> Auditando con IA...';
        if (aiStatusText) aiStatusText.innerText = 'Consultando motor de IA y calculando Match ATS...';

        try {
            const res = await fetch(`${PYTHON_API_URL}/api/tailor-cv`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cv_data: cvData,
                    job_description: jobDesc
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || 'Fallo en el microservicio Python');
            }

            const result = await res.json();
            window.lastTailoredCv = result.tailored_cv;

            // Mostrar resultados en la UI
            if (aiResultsBox) aiResultsBox.style.display = 'block';

            const initScoreEl = document.getElementById('initialScoreVal');
            const optScoreEl = document.getElementById('optimizedScoreVal');
            if (initScoreEl) initScoreEl.innerText = `${result.audit_report.initial_match_score}%`;
            if (optScoreEl) optScoreEl.innerText = `${result.audit_report.optimized_match_score}%`;

            // Palabras clave
            const cloud = document.getElementById('extractedKeywordsCloud');
            if (cloud) {
                cloud.innerHTML = '';
                result.audit_report.extracted_job_keywords.forEach(kw => {
                    const tag = document.createElement('span');
                    tag.className = 'tag-badge';
                    tag.innerText = kw;
                    cloud.appendChild(tag);
                });
            }

            // Notas de auditoría
            const notesList = document.getElementById('auditNotesList');
            if (notesList) {
                notesList.innerHTML = '';
                result.audit_report.audit_notes.forEach(note => {
                    const li = document.createElement('li');
                    li.innerText = note;
                    notesList.appendChild(li);
                });
            }

            if (aiStatusText) aiStatusText.innerText = '✅ Auditoría y optimización completada con éxito.';
            btnTailorCv.disabled = false;
            btnTailorCv.innerHTML = '<span>✨</span> Re-auditar con IA';

            // Scroll suave hacia los resultados
            aiResultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (err) {
            console.error('Error al adaptar CV:', err);
            alert(`No se pudo conectar con el microservicio de Python en ${PYTHON_API_URL}.\n\nAsegúrate de tener corriendo el microservicio (ej. en start.sh). Detalle: ${err.message}`);
            if (aiStatusText) aiStatusText.innerText = '❌ Error de comunicación con microservicio.';
            btnTailorCv.disabled = false;
            btnTailorCv.innerHTML = '<span>✨</span> Auditar y Adaptar CV con IA';
        }
    });

    // 2.2 Aplicar cambios al formulario
    if (btnApplyAiChanges) {
        btnApplyAiChanges.addEventListener('click', () => {
            if (!window.lastTailoredCv) return;
            populateFormFromData(window.lastTailoredCv);
            localStorage.setItem('ats_cv_draft', JSON.stringify(window.lastTailoredCv));
            alert('🎉 ¡Los cambios adaptados por la IA se han aplicado a tu formulario!');
        });
    }

    // 2.3 Descargar DOCX Optimizado desde el panel de IA
    if (btnDownloadAiDocx) {
        btnDownloadAiDocx.addEventListener('click', async () => {
            if (!window.lastTailoredCv) return;
            downloadDocxFromCvData(window.lastTailoredCv, btnDownloadAiDocx);
        });
    }

    // 2.4 Adaptar y Descargar directo
    if (btnTailorAndDownload) {
        btnTailorAndDownload.addEventListener('click', async () => {
            const jobDesc = jobDescriptionInput ? jobDescriptionInput.value.trim() : '';
            if (!jobDesc) {
                alert('Pega el aviso de trabajo para adaptar y descargar.');
                if (jobDescriptionInput) jobDescriptionInput.focus();
                return;
            }

            const cvData = serializeFormData();
            btnTailorAndDownload.disabled = true;
            btnTailorAndDownload.innerHTML = '<span>⏳</span> Generando Word con IA...';

            try {
                const response = await fetch(`${PYTHON_API_URL}/api/tailor-and-generate-docx`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cv_data: cvData,
                        job_description: jobDesc
                    })
                });

                if (!response.ok) throw new Error('Error al generar archivo');

                const blob = await response.blob();
                triggerFileDownload(blob, `CV_${cvData.header.full_name.replace(/\s+/g, '_')}_Tailored_ATS.docx`);
            } catch (err) {
                alert('Error al descargar archivo DOCX: ' + err.message);
            } finally {
                btnTailorAndDownload.disabled = false;
                btnTailorAndDownload.innerHTML = '<span>⚡</span> Adaptar y Descargar Word Directo';
            }
        });
    }
}

async function downloadDocxFromCvData(cvData, btnElement = null) {
    if (btnElement) {
        btnElement.disabled = true;
        btnElement.innerHTML = '<span>⏳</span> Descargando Word...';
    }

    try {
        const response = await fetch(`${PYTHON_API_URL}/api/generate-docx`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cvData)
        });

        if (!response.ok) throw new Error('Error al generar DOCX en el microservicio');

        const blob = await response.blob();
        const candidateName = (cvData.header && cvData.header.full_name) ? cvData.header.full_name.replace(/\s+/g, '_') : 'Candidato';
        triggerFileDownload(blob, `CV_${candidateName}_ATS.docx`);
    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        if (btnElement) {
            btnElement.disabled = false;
            btnElement.innerHTML = '<span>📄</span> Descargar DOCX Optimizado (.docx)';
        }
    }
}

function triggerFileDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

// =====================================================================
// 3. GENERACIÓN DINÁMICA DE ELEMENTOS DEL FORMULARIO
// =====================================================================

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
                <label style="font-weight: 600; color: var(--accent);">Logros Cuantificables (Modelo Google XYZ) <span class="required">*</span></label>
                <button type="button" class="btn btn-sm btn-outline" onclick="addBulletRow('${expId}')">➕ Agregar Viñeta</button>
            </div>
            <p class="field-hint" style="margin-bottom: 0.75rem;">
                📌 Fórmula Google XYZ: Inicia con Verbo Fuerte + Logré [X], medido por [Y], haciendo [Z] (métricas obligatorias: %, $, tiempo).
            </p>
            <div class="bullets-container" id="bullets_${expId}"></div>
        </div>
    `;

    container.appendChild(card);

    const bulletsContainer = document.getElementById(`bullets_${expId}`);
    if (data.bullets && data.bullets.length > 0) {
        data.bullets.forEach(b => addBulletRow(expId, b));
    } else {
        addBulletRow(expId, 'Optimicé la arquitectura del backend reduciendo la latencia de respuesta en un 38% mediante la migración a microservicios.');
        addBulletRow(expId, 'Diseñé e implementé un pipeline automatizado de procesamiento documental incrementando el throughput en un 65%.');
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
        <input type="text" class="bullet-text-input" placeholder="Ej: Automaticé procesos ETL reduciendo el tiempo de ejecución en un 40%..." value="${escapeHtml(text)}" required>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeItem('${bulletId}')">✕</button>
    `;
    bulletsContainer.appendChild(row);
}

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

window.removeItem = function (elementId) {
    const el = document.getElementById(elementId);
    if (el) el.remove();
};

// =====================================================================
// 4. SERIALIZACIÓN Y CARGA DE DATOS
// =====================================================================
function serializeFormData() {
    const header = {
        full_name: document.getElementById('full_name')?.value.trim() || '',
        professional_title: document.getElementById('professional_title')?.value.trim() || '',
        city: document.getElementById('city')?.value.trim() || '',
        country: document.getElementById('country')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        linkedin_url: document.getElementById('linkedin_url')?.value.trim() || '',
        github_url: document.getElementById('github_url')?.value.trim() || '',
        portfolio_url: document.getElementById('portfolio_url')?.value.trim() || '',
        summary: document.getElementById('summary')?.value.trim() || ''
    };

    const skill_categories = [];
    document.querySelectorAll('#categoriesContainer .dynamic-item-card').forEach((card, idx) => {
        const name = card.querySelector('.cat-name-input')?.value.trim() || '';
        const skills = card.querySelector('.cat-skills-input')?.value.trim() || '';
        if (name && skills) {
            skill_categories.push({ name, skills, sort_order: idx + 1 });
        }
    });

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
        setVal('github_url', data.header.github_url);
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
            github_url: 'https://github.com/alejandrosilva',
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
// 5. RENDERIZADOR DE LA VISTA PREVIA ATS
// =====================================================================
function initPreviewRenderer() {
    const paper = document.getElementById('atsDocumentPaper');
    if (!paper) return;

    const savedDraft = localStorage.getItem('ats_cv_draft');
    if (savedDraft) {
        try {
            renderPreviewFromData(JSON.parse(savedDraft));
        } catch (e) {
            console.error('Error al renderizar vista previa:', e);
        }
    }

    const btnGenerateDocx = document.getElementById('btnGenerateDocx');
    if (btnGenerateDocx) {
        btnGenerateDocx.addEventListener('click', async () => {
            const draft = JSON.parse(localStorage.getItem('ats_cv_draft') || '{}');
            if (!draft.header || !draft.header.full_name) {
                alert('No hay datos suficientes para generar el documento. Por favor regresa al editor.');
                return;
            }
            downloadDocxFromCvData(draft, btnGenerateDocx);
        });
    }
}

function renderPreviewFromData(data) {
    if (!data) return;

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

    const skillsContainer = document.getElementById('prevSkillsContainer');
    if (skillsContainer && data.skill_categories) {
        skillsContainer.innerHTML = '';
        data.skill_categories.forEach(cat => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${escapeHtml(cat.name)}:</strong> ${escapeHtml(cat.skills)}`;
            skillsContainer.appendChild(p);
        });
    }

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
