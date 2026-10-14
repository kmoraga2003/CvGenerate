<?php

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\CvController;

/**
 * =====================================================================
 * REGISTRO DE RUTAS DE LA APLICACIÓN
 * =====================================================================
 */

// Vista principal (Dashboard)
Router::get('/', [HomeController::class, 'index']);

// Endpoint de verificación de salud
Router::get('/api/health', [HomeController::class, 'health']);

// Flujo de Creación y Edición del CV
Router::get('/cv/nuevo', [CvController::class, 'create']);
Router::get('/cv/preview', [CvController::class, 'preview']);

// Endpoints API REST para guardar y generar CV
Router::post('/api/cv/save', [CvController::class, 'save']);

// Ruta dinámica para consultar CV por ID
Router::get('/cv/{id}', function (string $id) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'message' => "Detalle del currículum solicitado con ID: {$id}",
        'status'  => 'ready_for_database_query',
        'cv_id'   => (int)$id
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
});
