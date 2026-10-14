<?php

use App\Core\Router;
use App\Controllers\HomeController;

/**
 * =====================================================================
 * REGISTRO DE RUTAS DE LA APLICACIÓN
 * =====================================================================
 * Soporta despachos hacia [Controlador::class, 'método'] y funciones Closure.
 * Los parámetros entre llaves tipo {id} se extraen y pasan como argumentos.
 */

// Vista principal (Dashboard del sistema)
Router::get('/', [HomeController::class, 'index']);

// Endpoint de verificación de salud (Health Check API)
Router::get('/api/health', [HomeController::class, 'health']);

// Ruta dinámica de ejemplo para visualizar o consultar un CV específico
Router::get('/cv/{id}', function (string $id) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'message' => "Detalle del currículum solicitado con ID: {$id}",
        'status'  => 'ready_for_database_query',
        'cv_id'   => (int)$id
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
});

// Endpoint preparado para recibir la solicitud de generación desde el Frontend
Router::post('/api/cv/{id}/generate', function (string $id) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'message' => "Procesando generación de documento ATS para CV ID: {$id}",
        'action'  => 'curl_to_python_microservice',
        'status'  => 'pending_microservice_call'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
});
