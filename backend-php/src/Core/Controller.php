<?php

namespace App\Core;

/**
 * Clase base de Controladores.
 * Proporciona renderizado de vistas con layouts y respuestas estructuradas en formato JSON.
 */
abstract class Controller
{
    /**
     * Renderiza una vista PHP inyectando datos y envolviéndola opcionalmente en un layout.
     *
     * @param string $viewPath Ruta relativa a la carpeta views (ej: 'home/index' o 'cv/form')
     * @param array $data Variables disponibles en la vista
     * @param string|null $layout Nombre del layout contenedor o null para renderizar sin layout
     * @return void
     */
    protected function view(string $viewPath, array $data = [], ?string $layout = 'layouts/main'): void
    {
        // Extraer variables para hacerlas accesibles en las vistas
        extract($data);

        $viewsDir = dirname(__DIR__, 2) . '/views';
        $viewFile = $viewsDir . '/' . ltrim($viewPath, '/') . '.php';

        if (!file_exists($viewFile)) {
            throw new \RuntimeException("La vista no existe: {$viewFile}");
        }

        // Si se define un layout contenedor
        if ($layout !== null) {
            $layoutFile = $viewsDir . '/' . ltrim($layout, '/') . '.php';
            if (!file_exists($layoutFile)) {
                throw new \RuntimeException("El layout no existe: {$layoutFile}");
            }

            // Capturar el contenido de la vista hija
            ob_start();
            require $viewFile;
            $content = ob_get_clean();

            // Renderizar layout con la variable $content inyectada
            require $layoutFile;
            return;
        }

        // Renderizado directo sin layout
        require $viewFile;
    }

    /**
     * Envía una respuesta HTTP en formato JSON.
     *
     * @param mixed $data Datos serializables a JSON
     * @param int $statusCode Código de estado HTTP
     * @return void
     */
    protected function json($data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Redirige hacia una URL relativa o absoluta.
     *
     * @param string $url
     * @return void
     */
    protected function redirect(string $url): void
    {
        header("Location: {$url}");
        exit;
    }
}
