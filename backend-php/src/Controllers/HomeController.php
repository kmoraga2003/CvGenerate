<?php

namespace App\Controllers;

use App\Core\Controller;

/**
 * Controlador de Inicio / Dashboard del Generador de CVs.
 */
class HomeController extends Controller
{
    /**
     * Muestra la pantalla principal con el estado de la arquitectura y accesos directos.
     */
    public function index(): void
    {
        $this->view('home/index', [
            'appName'     => 'ATS Resume Generator System',
            'version'     => '1.0.0-MVP',
            'sections'    => [
                'Encabezado (Datos Personales y Enlaces)',
                'Resumen Profesional',
                'Competencias Técnicas (Agrupadas)',
                'Experiencia Profesional (Logros Cuantificables)',
                'Proyectos Destacados',
                'Educación y Certificaciones'
            ]
        ]);
    }

    /**
     * Endpoint API para verificación de salud de la plataforma (Healthcheck).
     */
    public function health(): void
    {
        $this->json([
            'status'    => 'ok',
            'timestamp' => date('c'),
            'php_version' => PHP_VERSION,
            'service'   => 'CvGenerate Core Backend (PHP MVC)'
        ]);
    }
}
