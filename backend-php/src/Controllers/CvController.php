<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;

/**
 * Controlador de gestión y flujo de Currículums ATS.
 */
class CvController extends Controller
{
    /**
     * Muestra el formulario dinámico para la creación o edición de un CV.
     */
    public function create(): void
    {
        $this->view('cv/form', [
            'title' => 'Crear Currículum Optimizado para ATS'
        ]);
    }

    /**
     * Muestra la vista previa del documento simulando el renderizado ATS.
     */
    public function preview(): void
    {
        $this->view('cv/preview', [
            'title' => 'Vista Previa ATS (Estándar 1 Columna)'
        ]);
    }

    /**
     * Endpoint API para recibir el JSON estructurado desde el frontend (Fetch API).
     */
    public function save(): void
    {
        $request = new Request();
        $payload = $request->getJson();

        if (empty($payload)) {
            $payload = $request->all();
        }

        // Validación básica de campos obligatorios del Encabezado
        $requiredHeader = ['full_name', 'professional_title', 'city', 'country', 'phone', 'email', 'summary'];
        foreach ($requiredHeader as $field) {
            if (empty($payload['header'][$field])) {
                $this->json([
                    'status'  => 'error',
                    'message' => "El campo [{$field}] en el Encabezado o Resumen es obligatorio."
                ], 422);
            }
        }

        // github_url, linkedin_url y portfolio_url son OPCIONALES
        $githubUrl = $payload['header']['github_url'] ?? null;
        $linkedinUrl = $payload['header']['linkedin_url'] ?? null;
        $portfolioUrl = $payload['header']['portfolio_url'] ?? null;

        $this->json([
            'status'  => 'success',
            'message' => 'Datos del CV validados y estructurados correctamente para ATS.',
            'data'    => [
                'header'             => $payload['header'],
                'skill_categories'   => $payload['skill_categories'] ?? [],
                'experiences'        => $payload['experiences'] ?? [],
                'projects'           => $payload['projects'] ?? [],
                'education'          => $payload['education'] ?? []
            ]
        ], 200);
    }
}
