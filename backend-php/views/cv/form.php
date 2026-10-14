<div class="container form-page-container">
    <div class="form-header-bar">
        <div>
            <h1 class="page-title">Editor de Currículum <span class="gradient-text">Estándar ATS</span></h1>
            <p class="page-subtitle">Rellena las secciones estrictas del formato ATS. El orden y diseño están optimizados para superar los filtros de reclutamiento automatizado.</p>
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

    <form id="cvForm" class="cv-form" novalidate>
        <!-- ------------------------------------------------------------------ -->
        <!-- SECCIÓN 1: ENCABEZADO -->
        <!-- ------------------------------------------------------------------ -->
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

        <!-- ------------------------------------------------------------------ -->
        <!-- SECCIÓN 2: RESUMEN PROFESIONAL -->
        <!-- ------------------------------------------------------------------ -->
        <section class="form-section-card">
            <div class="section-card-header">
                <div class="section-number-pill">02</div>
                <div>
                    <h2>Resumen Profesional</h2>
                    <p>Párrafo breve (3 a 5 líneas) orientado a impacto, años de experiencia y tecnologías core.</p>
                </div>
            </div>

            <div class="form-group">
                <label for="summary">Extracto / Perfil Profesional <span class="required">*</span></label>
                <textarea id="summary" name="summary" rows="4" placeholder="Ingeniero de Software con más de 6 años de experiencia en desarrollo backend y arquitecturas distribuidas con PHP y Python..." required></textarea>
                <span class="field-hint">💡 Consejo ATS: Incluye palabras clave exactas de la oferta de trabajo a la que postulas.</span>
            </div>
        </section>

        <!-- ------------------------------------------------------------------ -->
        <!-- SECCIÓN 3: COMPETENCIAS TÉCNICAS (AGRUPADAS POR CATEGORÍAS) -->
        <!-- ------------------------------------------------------------------ -->
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

            <div id="categoriesContainer" class="dynamic-list-container">
                <!-- Se inyectan dinámicamente con JS -->
            </div>
        </section>

        <!-- ------------------------------------------------------------------ -->
        <!-- SECCIÓN 4: EXPERIENCIA PROFESIONAL -->
        <!-- ------------------------------------------------------------------ -->
        <section class="form-section-card">
            <div class="section-card-header flex-between">
                <div class="flex-row gap-3">
                    <div class="section-number-pill">04</div>
                    <div>
                        <h2>Experiencia Profesional</h2>
                        <p>Orden cronológico inverso. Cada experiencia debe incluir viñetas sólidas con métricas cuantificables.</p>
                    </div>
                </div>
                <button type="button" id="btnAddExperience" class="btn btn-sm btn-outline">
                    <span>➕</span> Agregar Experiencia
                </button>
            </div>

            <div id="experiencesContainer" class="dynamic-list-container">
                <!-- Se inyectan dinámicamente con JS -->
            </div>
        </section>

        <!-- ------------------------------------------------------------------ -->
        <!-- SECCIÓN 5: PROYECTOS DESTACADOS -->
        <!-- ------------------------------------------------------------------ -->
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

            <div id="projectsContainer" class="dynamic-list-container">
                <!-- Se inyectan dinámicamente con JS -->
            </div>
        </section>

        <!-- ------------------------------------------------------------------ -->
        <!-- SECCIÓN 6: EDUCACIÓN -->
        <!-- ------------------------------------------------------------------ -->
        <section class="form-section-card">
            <div class="section-card-header flex-between">
                <div class="flex-row gap-3">
                    <div class="section-number-pill">06</div>
                    <div>
                        <h2>Educación</h2>
                        <p>Títulos profesionales, grados universitarios o certificaciones oficiales relevantes.</p>
                    </div>
                </div>
                <button type="button" id="btnAddEducation" class="btn btn-sm btn-outline">
                    <span>➕</span> Agregar Educación
                </button>
            </div>

            <div id="educationContainer" class="dynamic-list-container">
                <!-- Se inyectan dinámicamente con JS -->
            </div>
        </section>

        <!-- BARRA FLOTANTE DE ACCIONES -->
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
