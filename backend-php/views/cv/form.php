<div class="container form-page-container">
    <div class="form-header-bar">
        <div>
            <h1 class="page-title">Editor de Currículum <span class="gradient-text">Estándar ATS</span></h1>
            <p class="page-subtitle">Construye un documento de marketing estratégico de alto impacto para superar los filtros ATS y captar la atención de reclutadores senior.</p>
        </div>
        <div class="quick-actions">
            <button type="button" id="btnLoadSample" class="btn btn-secondary">
                <span>🪄</span> Cargar Perfil de Prueba
            </button>
            <button type="button" id="btnClearForm" class="btn btn-outline">
                <span>🗑️</span> Limpiar
            </button>
        </div>
    </div>

    <!-- ================================================================== -->
    <!-- RECOMENDACIONES ANTES DE INICIAR (REGLAS DE ORO DEL RECLUTAMIENTO) -->
    <!-- ================================================================== -->
    <div class="tips-accordion-box">
        <div class="tips-accordion-header" id="tipsHeader" onclick="toggleTips()">
            <div class="flex-row align-center gap-2">
                <span class="badge-gold">💡 Recomendaciones antes de Iniciar</span>
                <span class="tips-title">Reglas de Oro del Reclutamiento Senior & Modelo Google XYZ</span>
            </div>
            <span class="tips-chevron" id="tipsChevron">▼</span>
        </div>
        <div class="tips-accordion-content" id="tipsContent" style="display: none;">
            <div class="tips-grid">
                <div class="tip-item">
                    <h5>🎯 Fórmula XYZ de Google</h5>
                    <p>Redacta tus logros como: <em>"Logré [X], medido por [Y], haciendo [Z]"</em>. Ej: <em>"Optimicé el backend reduciendo la latencia en 30% mediante refactorización de consultas SQL."</em></p>
                </div>
                <div class="tip-item">
                    <h5>⚡ Verbos de Acción Fuerte</h5>
                    <p>Inicia cada viñeta con ejecución: <strong>Dirigí, Diseñé, Optimicé, Implementé, Automaticé, Desplegué</strong>. Evita "apoyé en" o "responsable de".</p>
                </div>
                <div class="tip-item">
                    <h5>📊 Cuantificación Rigurosa</h5>
                    <p>Los números generan credibilidad. Añade porcentajes de mejora, volúmenes de tráfico/usuarios o tiempos de entrega optimizados.</p>
                </div>
                <div class="tip-item">
                    <h5>🚫 Cero Clichés en Resumen</h5>
                    <p>Prohibido: <em>"proactivo", "trabajador en equipo"</em>. Usa un Elevator Pitch de 3 a 4 líneas con tu especialidad y valor directo que aportas.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- ================================================================== -->
    <!-- MÓDULO IA: ADAPTAR CV A UNA OFERTA LABORAL (JOB DESCRIPTION MATCHER) -->
    <!-- ================================================================== -->
    <div class="ai-tailor-box">
        <div class="ai-tailor-header">
            <div class="ai-icon-badge">🤖</div>
            <div>
                <h3>Adaptar CV a una Oferta de Empleo con IA</h3>
                <p>Pega la descripción de la vacante para auditar tu compatibilidad ATS, extraer palabras clave y adaptar tu CV con la Fórmula XYZ de Google.</p>
            </div>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
            <label for="jobDescriptionInput" style="color: var(--text-primary); font-weight: 600;">
                Descripción de la Oferta de Trabajo (Job Posting)
            </label>
            <textarea id="jobDescriptionInput" rows="4" placeholder="Pega aquí el texto completo del aviso de empleo (responsabilidades, tecnologías requeridas, competencias buscadas)..."></textarea>
        </div>

        <div class="flex-between align-center flex-wrap gap-2" style="margin-top: 1rem;">
            <div class="flex-row gap-2">
                <button type="button" id="btnTailorCv" class="btn btn-primary">
                    <span>✨</span> Auditar y Adaptar CV con IA
                </button>
                <button type="button" id="btnTailorAndDownload" class="btn btn-secondary">
                    <span>⚡</span> Adaptar y Descargar Word Directo
                </button>
            </div>
            <span id="aiStatusText" class="save-status-text">Listo para auditar contra la vacante</span>
        </div>

        <!-- RESULTADOS DE LA AUDITORÍA IA -->
        <div id="aiResultsBox" class="ai-results-panel" style="display: none;">
            <div class="score-row">
                <div class="score-card">
                    <span class="score-label">Match ATS Inicial</span>
                    <span class="score-value initial" id="initialScoreVal">45%</span>
                </div>
                <div class="score-arrow">➔</div>
                <div class="score-card highlight">
                    <span class="score-label">Match ATS Optimizado</span>
                    <span class="score-value optimized" id="optimizedScoreVal">92%</span>
                </div>
            </div>

            <div class="keywords-cloud-box">
                <label>Palabras clave técnicas identificadas en la oferta:</label>
                <div id="extractedKeywordsCloud" class="tags-cloud"></div>
            </div>

            <div class="audit-notes-box">
                <label>Mejoras estratégicas aplicadas por la IA:</label>
                <ul id="auditNotesList" class="audit-list"></ul>
            </div>

            <div class="flex-row gap-2" style="margin-top: 1.25rem;">
                <button type="button" id="btnApplyAiChanges" class="btn btn-primary btn-sm">
                    <span>✅</span> Aplicar Cambios al Formulario en Pantalla
                </button>
                <button type="button" id="btnDownloadAiDocx" class="btn btn-secondary btn-sm">
                    <span>📄</span> Descargar DOCX Optimizado (.docx)
                </button>
            </div>
        </div>
    </div>

    <!-- ================================================================== -->
    <!-- FORMULARIO PRINCIPAL DE EDICIÓN -->
    <!-- ================================================================== -->
    <form id="cvForm" class="cv-form" novalidate>
        <!-- SECCIÓN 1: ENCABEZADO -->
        <section class="form-section-card">
            <div class="section-card-header">
                <div class="section-number-pill">01</div>
                <div>
                    <h2>Encabezado de Contacto</h2>
                    <p>Datos personales directos, sin fotos ni elementos gráficos incompatibles con ATS.</p>
                </div>
            </div>

            <div class="form-grid-2">
                <div class="form-group">
                    <label for="full_name">Nombre Completo <span class="required">*</span></label>
                    <input type="text" id="full_name" name="full_name" placeholder="Ej: Juan Pérez Morales" required>
                </div>
                <div class="form-group">
                    <label for="professional_title">Cargo Objetivo / Título Profesional <span class="required">*</span></label>
                    <input type="text" id="professional_title" name="professional_title" placeholder="Ej: Senior Full-Stack Developer" required>
                </div>
            </div>

            <div class="form-grid-4">
                <div class="form-group">
                    <label for="city">Ciudad <span class="required">*</span></label>
                    <input type="text" id="city" name="city" placeholder="Ej: Santiago" required>
                </div>
                <div class="form-group">
                    <label for="country">País <span class="required">*</span></label>
                    <input type="text" id="country" name="country" placeholder="Ej: Chile" required>
                </div>
                <div class="form-group">
                    <label for="phone">Teléfono Móvil <span class="required">*</span></label>
                    <input type="tel" id="phone" name="phone" placeholder="Ej: +56 9 1234 5678" required>
                </div>
                <div class="form-group">
                    <label for="email">Correo Electrónico <span class="required">*</span></label>
                    <input type="email" id="email" name="email" placeholder="Ej: juan.perez@email.com" required>
                </div>
            </div>

            <div class="form-grid-3">
                <div class="form-group">
                    <label for="linkedin_url">Perfil de LinkedIn <span class="badge-optional">Opcional</span></label>
                    <input type="url" id="linkedin_url" name="linkedin_url" placeholder="https://linkedin.com/in/usuario">
                </div>
                <div class="form-group">
                    <label for="github_url">Perfil de GitHub <span class="badge-optional">Opcional</span></label>
                    <input type="url" id="github_url" name="github_url" placeholder="https://github.com/usuario">
                </div>
                <div class="form-group">
                    <label for="portfolio_url">Portafolio Web / Blog <span class="badge-optional">Opcional</span></label>
                    <input type="url" id="portfolio_url" name="portfolio_url" placeholder="https://miportafolio.dev">
                </div>
            </div>
        </section>

        <!-- SECCIÓN 2: RESUMEN PROFESIONAL -->
        <section class="form-section-card">
            <div class="section-card-header">
                <div class="section-number-pill">02</div>
                <div>
                    <h2>Resumen Profesional (Elevator Pitch)</h2>
                    <p>Párrafo breve (3 a 4 líneas) orientado a hechos concretos y valor inmediato, sin clichés.</p>
                </div>
            </div>

            <div class="form-group">
                <label for="summary">Extracto / Perfil Profesional <span class="required">*</span></label>
                <textarea id="summary" name="summary" rows="4" placeholder="Ingeniero de Software con más de 6 años de experiencia en desarrollo backend y arquitecturas distribuidas con PHP y Python..." required></textarea>
                <span class="field-hint">💡 Consejo ATS: Describe qué problema técnico resuelves para la empresa evitando clichés como 'proactivo'.</span>
            </div>
        </section>

        <!-- SECCIÓN 3: COMPETENCIAS TÉCNICAS -->
        <section class="form-section-card">
            <div class="section-card-header flex-between">
                <div class="flex-row gap-3">
                    <div class="section-number-pill">03</div>
                    <div>
                        <h2>Competencias Técnicas</h2>
                        <p>Agrupadas por categorías para máxima legibilidad tanto por algoritmos ATS como reclutadores.</p>
                    </div>
                </div>
                <button type="button" id="btnAddCategory" class="btn btn-sm btn-outline">
                    <span>➕</span> Agregar Categoría
                </button>
            </div>

            <div id="categoriesContainer" class="dynamic-list-container"></div>
        </section>

        <!-- SECCIÓN 4: EXPERIENCIA PROFESIONAL -->
        <section class="form-section-card">
            <div class="section-card-header flex-between">
                <div class="flex-row gap-3">
                    <div class="section-number-pill">04</div>
                    <div>
                        <h2>Experiencia Profesional</h2>
                        <p>Orden cronológico inverso. Aplica el modelo Google XYZ: Logré [X], medido por [Y], haciendo [Z].</p>
                    </div>
                </div>
                <button type="button" id="btnAddExperience" class="btn btn-sm btn-outline">
                    <span>➕</span> Agregar Experiencia
                </button>
            </div>

            <div id="experiencesContainer" class="dynamic-list-container"></div>
        </section>

        <!-- SECCIÓN 5: PROYECTOS DESTACADOS -->
        <section class="form-section-card">
            <div class="section-card-header flex-between">
                <div class="flex-row gap-3">
                    <div class="section-number-pill">05</div>
                    <div>
                        <h2>Proyectos Destacados</h2>
                        <p>Proyectos de alto impacto que demuestren resolución de problemas técnicos complejos.</p>
                    </div>
                </div>
                <button type="button" id="btnAddProject" class="btn btn-sm btn-outline">
                    <span>➕</span> Agregar Proyecto
                </button>
            </div>

            <div id="projectsContainer" class="dynamic-list-container"></div>
        </section>

        <!-- SECCIÓN 6: EDUCACIÓN -->
        <section class="form-section-card">
            <div class="section-card-header flex-between">
                <div class="flex-row gap-3">
                    <div class="section-number-pill">06</div>
                    <div>
                        <h2>Educación y Formación Continua</h2>
                        <p>Títulos profesionales, grados universitarios o certificaciones oficiales relevantes.</p>
                    </div>
                </div>
                <button type="button" id="btnAddEducation" class="btn btn-sm btn-outline">
                    <span>➕</span> Agregar Educación
                </button>
            </div>

            <div id="educationContainer" class="dynamic-list-container"></div>
        </section>

        <!-- BARRA FLOTANTE -->
        <div class="floating-submit-bar">
            <div class="container flex-between align-center">
                <span class="save-status-text" id="statusMessage">Completa o carga datos para continuar</span>
                <div class="flex-row gap-2">
                    <button type="button" id="btnPreviewCv" class="btn btn-secondary">
                        <span>👁️</span> Previsualizar ATS
                    </button>
                    <button type="submit" id="btnSubmitForm" class="btn btn-primary">
                        <span>🚀</span> Guardar y Procesar
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>

<script>
function toggleTips() {
    const content = document.getElementById('tipsContent');
    const chevron = document.getElementById('tipsChevron');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        chevron.innerText = '▲';
    } else {
        content.style.display = 'none';
        chevron.innerText = '▼';
    }
}
</script>
