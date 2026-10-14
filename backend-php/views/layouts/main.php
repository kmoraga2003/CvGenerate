<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title ?? 'Generador de CV ATS') ?></title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <header class="navbar">
        <div class="container nav-content">
            <a href="/" class="brand">
                <span class="brand-badge">ATS</span>
                <span class="brand-title">ResumeEngine</span>
            </a>
            <nav class="nav-links">
                <a href="/" class="nav-link">Inicio</a>
                <a href="/cv/nuevo" class="nav-link nav-btn-primary">⚡ Crear CV ATS</a>
                <a href="/cv/preview" class="nav-link">Vista Previa</a>
                <a href="/api/health" class="nav-link text-muted" target="_blank">Health API</a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <?= $content ?? '' ?>
    </main>

    <footer class="footer">
        <div class="container">
            <p>Generador de Currículums ATS v1.0.0 (MVP) &mdash; Arquitectura MVC PHP Nativo & Microservicio Python</p>
        </div>
    </footer>

    <script src="/js/app.js"></script>
</body>
</html>
