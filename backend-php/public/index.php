<?php

/**
 * =====================================================================
 * FRONT CONTROLLER (index.php)
 * =====================================================================
 * Punto único de entrada para todas las peticiones HTTP de la aplicación web.
 * Inicializa constantes, autoloader PSR-4, carga rutas y despacha la petición.
 */

declare(strict_types=1);

// Configuración de errores para entorno de desarrollo
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Definición de rutas base del proyecto
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/src');
define('VIEWS_PATH', ROOT_PATH . '/views');
define('CONFIG_PATH', ROOT_PATH . '/config');

// ---------------------------------------------------------------------
// Autoloader PSR-4 Nativo (mapea App\ hacia src/)
// ---------------------------------------------------------------------
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = APP_PATH . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Core\Router;

try {
    // -----------------------------------------------------------------
    // Carga de Rutas del Sistema
    // -----------------------------------------------------------------
    $routesFile = ROOT_PATH . '/routes/web.php';
    if (!file_exists($routesFile)) {
        throw new RuntimeException("El archivo de rutas no existe en: {$routesFile}");
    }
    require_once $routesFile;

    // -----------------------------------------------------------------
    // Captura y normalización de la petición HTTP
    // -----------------------------------------------------------------
    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $rawUri = $_SERVER['REQUEST_URI'] ?? '/';

    // Despacho de la ruta mediante el Router POO
    Router::dispatch($rawUri, $requestMethod);

} catch (Throwable $e) {
    http_response_code(500);

    $isJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

    if ($isJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status'  => 'error',
            'code'    => 500,
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>500 Internal Error</title>';
    echo '<style>body{font-family:ui-monospace,Menlo,Monaco,monospace;background:#090d16;color:#e2e8f0;padding:2rem;}';
    echo '.card{background:#1e293b;border-left:5px solid #ef4444;padding:1.5rem;border-radius:8px;}';
    echo 'h1{color:#f87171;margin-top:0;}pre{background:#0f172a;padding:1rem;border-radius:6px;overflow-x:auto;color:#cbd5e1;}</style></head>';
    echo '<body><div class="card"><h1>Error 500: Fallo en el Servidor</h1>';
    echo '<p><strong>Excepción:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '<p><strong>Archivo:</strong> ' . htmlspecialchars($e->getFile()) . ':' . $e->getLine() . '</p>';
    echo '<pre>' . htmlspecialchars($e->getTraceAsString()) . '</pre></div></body></html>';
}
