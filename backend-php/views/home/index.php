<div class="container hero-section">
    <div class="badge-status">
        <span class="pulse-dot"></span>
        <span>Sistema Inicializado Correctamente</span>
    </div>

    <h1 class="hero-title">Generador de Currículums <span class="gradient-text">ATS-Friendly</span></h1>
    <p class="hero-subtitle">
        Arquitectura limpia desacoplada: Frontend y Núcleo Web en <strong>PHP Nativo (MVC POO)</strong> sincronizado vía API REST con un Microservicio de Generación en <strong>Python</strong>.
    </p>

    <div class="cards-grid">
        <div class="card">
            <div class="card-icon">🏗️</div>
            <h3>Arquitectura MVC Pura</h3>
            <p>Front Controller con despachador de rutas sin dependencias de frameworks externos, preparado para migración fluida a Laravel.</p>
        </div>

        <div class="card">
            <div class="card-icon">⚡</div>
            <h3>Microservicio Python</h3>
            <p>Motor de generación de documentos de alta fidelidad basado en python-docx para respetar el 100% de reglas de parseo ATS.</p>
        </div>

        <div class="card">
            <div class="card-icon">🗄️</div>
            <h3>Base de Datos Relacional</h3>
            <p>Esquema MySQL normalizado con InnoDB y claves foráneas en cascada para soportar todas las secciones maestras.</p>
        </div>
    </div>

    <div class="ats-standard-box">
        <h2>Plantilla Maestra ATS (Orden Estricto de Secciones)</h2>
        <ol class="ats-sections-list">
            <?php foreach ($sections as $index => $section): ?>
                <li>
                    <span class="section-number"><?= sprintf('%02d', $index + 1) ?></span>
                    <span class="section-name"><?= htmlspecialchars($section) ?></span>
                </li>
            <?php endforeach; ?>
        </ol>
    </div>

    <div class="endpoints-box">
        <h3>Rutas Activas en el Router PHP:</h3>
        <ul>
            <li><code>GET /</code> &mdash; Dashboard Principal</li>
            <li><code>GET /api/health</code> &mdash; Verificación de Salud del Servidor (JSON)</li>
            <li><code>GET /cv/{id}</code> &mdash; Detalle y Carga del CV en Base de Datos</li>
        </ul>
    </div>
</div>
