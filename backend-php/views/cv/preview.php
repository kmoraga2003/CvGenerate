<div class="container preview-page-container">
    <div class="preview-actions-bar">
        <div class="actions-left">
            <a href="/cv/nuevo" class="btn btn-secondary">
                <span>✏️</span> Volver al Editor
            </a>
            <span class="preview-badge">Estándar ATS: 1 Columna | Alineado a la Izquierda | Viñetas Sólidas</span>
        </div>
        <div class="actions-right">
            <button id="btnGenerateDocx" class="btn btn-primary">
                <span>📄</span> Generar DOCX (Word ATS)
            </button>
            <button id="btnGeneratePdf" class="btn btn-outline" onclick="window.print()">
                <span>🖨️</span> Imprimir / PDF
            </button>
        </div>
    </div>

    <!-- DOCUMENTO ATS SIMULADO (A4 / Hoja Estándar) -->
    <div class="ats-paper" id="atsDocumentPaper">
        <!-- 1. ENCABEZADO -->
        <header class="ats-header">
            <h1 class="ats-candidate-name" id="prevFullName">Alejandro Silva Rivas</h1>
            <p class="ats-candidate-title" id="prevProfessionalTitle">Senior Full-Stack Developer & Software Architect</p>
            <div class="ats-contact-line" id="prevContactLine">
                <span id="prevLocation">Santiago, Chile</span> &bull; 
                <span id="prevPhone">+56 9 1234 5678</span> &bull; 
                <span id="prevEmail">alejandro.silva@example.com</span>
            </div>
            <div class="ats-links-line" id="prevLinksLine">
                <!-- Se llenan dinámicamente si están presentes -->
            </div>
        </header>

        <!-- 2. RESUMEN PROFESIONAL -->
        <section class="ats-section">
            <h2 class="ats-section-title">RESUMEN PROFESIONAL</h2>
            <div class="ats-section-divider"></div>
            <p class="ats-summary-text" id="prevSummary">
                Ingeniero de Software con más de 7 años de experiencia diseñando arquitecturas escalables y APIs RESTful de alto rendimiento en PHP y Python. Especializado en optimización de bases de datos relacionales, microservicios y despliegues con Docker. Enfocado en código limpio, patrones de diseño y metodologías ágiles.
            </p>
        </section>

        <!-- 3. COMPETENCIAS TÉCNICAS -->
        <section class="ats-section">
            <h2 class="ats-section-title">COMPETENCIAS TÉCNICAS</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-skills-list" id="prevSkillsContainer">
                <p><strong>Lenguajes de Programación:</strong> PHP 8.x, Python 3.11+, JavaScript (ES6+), SQL, Bash</p>
                <p><strong>Frameworks & Librerías:</strong> FastAPI, Laravel, Flask, React, Vanilla JS, python-docx</p>
                <p><strong>Bases de Datos & Almacenamiento:</strong> MySQL, PostgreSQL, Redis, PDO, SQLAlchemy</p>
                <p><strong>DevOps, Cloud & Herramientas:</strong> Docker, Git, CI/CD (GitHub Actions), Linux, Nginx, RESTful APIs</p>
            </div>
        </section>

        <!-- 4. EXPERIENCIA PROFESIONAL -->
        <section class="ats-section">
            <h2 class="ats-section-title">EXPERIENCIA PROFESIONAL</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-experience-list" id="prevExperienceContainer">
                <div class="ats-exp-entry">
                    <div class="ats-entry-header">
                        <span class="ats-role">Tech Lead & Senior Software Engineer</span>
                        <span class="ats-dates">Ene 2022 &mdash; Presente</span>
                    </div>
                    <div class="ats-entry-sub">
                        <span class="ats-company">CloudTech Solutions</span> &bull; 
                        <span class="ats-location">Santiago, Chile</span>
                    </div>
                    <ul class="ats-bullet-list">
                        <li>Lideré la migración de un monolito legado hacia microservicios en Python y PHP, reduciendo la latencia de respuesta en un 38% para más de 500k usuarios activos mensuales.</li>
                        <li>Diseñé e implementé un pipeline automatizado de procesamiento documental que incrementó el throughput en un 65% y redujo los errores de parsing a menos del 0.2%.</li>
                        <li>Capacité y mentoreé a un equipo de 6 desarrolladores junior y mid-level en buenas prácticas de POO, arquitectura limpia y pruebas unitarias.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- 5. PROYECTOS DESTACADOS -->
        <section class="ats-section">
            <h2 class="ats-section-title">PROYECTOS DESTACADOS</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-projects-list" id="prevProjectsContainer">
                <div class="ats-project-entry">
                    <div class="ats-entry-header">
                        <span class="ats-role">ATS Resume Engine</span>
                        <span class="ats-tech">PHP 8, Python 3, FastAPI, python-docx, MySQL</span>
                    </div>
                    <p class="ats-project-desc">Microservicio de alta fidelidad para generación automatizada de currículums en formato DOCX y PDF cumpliendo con la totalidad de normas de parseo de sistemas ATS.</p>
                </div>
            </div>
        </section>

        <!-- 6. EDUCACIÓN -->
        <section class="ats-section">
            <h2 class="ats-section-title">EDUCACIÓN</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-education-list" id="prevEducationContainer">
                <div class="ats-edu-entry">
                    <div class="ats-entry-header">
                        <span class="ats-degree">Ingeniería Civil en Informática</span>
                        <span class="ats-dates">2014 &mdash; 2019</span>
                    </div>
                    <div class="ats-entry-sub">
                        <span class="ats-institution">Universidad de Chile</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
