<?php

namespace App\Core;

/**
 * Enrutador HTTP puro orientado a objetos.
 * Soporta registro de métodos HTTP (GET, POST, etc.), rutas con parámetros dinámicos
 * tipo {id} o {slug}, y despacho a controladores [Controller::class, 'method'] o Closures.
 */
class Router
{
    /**
     * Lista de rutas registradas organizadas por método HTTP.
     * @var array<string, array<int, array{uri: string, pattern: string, action: mixed}>>
     */
    protected static array $routes = [
        'GET'    => [],
        'POST'   => [],
        'PUT'    => [],
        'DELETE' => []
    ];

    /**
     * Callback para rutas no encontradas (404).
     * @var callable|null
     */
    protected static $notFoundHandler = null;

    /**
     * Registra una ruta para el método GET.
     *
     * @param string $uri
     * @param mixed $action
     */
    public static function get(string $uri, $action): void
    {
        self::add('GET', $uri, $action);
    }

    /**
     * Registra una ruta para el método POST.
     *
     * @param string $uri
     * @param mixed $action
     */
    public static function post(string $uri, $action): void
    {
        self::add('POST', $uri, $action);
    }

    /**
     * Registra una ruta para el método PUT.
     *
     * @param string $uri
     * @param mixed $action
     */
    public static function put(string $uri, $action): void
    {
        self::add('PUT', $uri, $action);
    }

    /**
     * Registra una ruta para el método DELETE.
     *
     * @param string $uri
     * @param mixed $action
     */
    public static function delete(string $uri, $action): void
    {
        self::add('DELETE', $uri, $action);
    }

    /**
     * Registra una ruta genérica y compila su expresión regular para parámetros dinámicos.
     *
     * @param string $method
     * @param string $uri
     * @param mixed $action
     */
    public static function add(string $method, string $uri, $action): void
    {
        $method = strtoupper($method);
        $normalizedUri = self::normalizePath($uri);

        // Convertir {param} en grupos de captura regex: ([a-zA-Z0-9_\-]+)
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[a-zA-Z0-9_\-]+)', $normalizedUri);
        $pattern = '#^' . $pattern . '$#';

        self::$routes[$method][] = [
            'uri'     => $normalizedUri,
            'pattern' => $pattern,
            'action'  => $action
        ];
    }

    /**
     * Establece un manejador personalizado para rutas 404.
     *
     * @param callable $handler
     */
    public static function setNotFoundHandler(callable $handler): void
    {
        self::$notFoundHandler = $handler;
    }

    /**
     * Despacha la petición entrante hacia la acción o controlador correspondiente.
     *
     * @param string $requestUri
     * @param string $requestMethod
     * @return mixed
     */
    public static function dispatch(string $requestUri, string $requestMethod)
    {
        $method = strtoupper($requestMethod);
        $path = self::normalizePath(parse_url($requestUri, PHP_URL_PATH) ?? '/');

        if (!isset(self::$routes[$method])) {
            return self::handleNotFound("Método HTTP no soportado: $method");
        }

        foreach (self::$routes[$method] as $route) {
            if (preg_match($route['pattern'], $path, $matches)) {
                // Filtrar solo los parámetros con clave nominal
                $params = array_filter($matches, function ($key) {
                    return !is_numeric($key);
                }, ARRAY_FILTER_USE_KEY);

                return self::executeAction($route['action'], $params);
            }
        }

        return self::handleNotFound("Ruta no encontrada para [{$method}] {$path}");
    }

    /**
     * Ejecuta la acción asociada a la ruta (Closure o Controlador@método).
     *
     * @param mixed $action
     * @param array $params
     * @return mixed
     */
    protected static function executeAction($action, array $params = [])
    {
        // 1. Caso función anónima (Closure)
        if (is_callable($action)) {
            return call_user_func_array($action, $params);
        }

        // 2. Caso Array [Controller::class, 'method']
        if (is_array($action) && count($action) === 2) {
            [$controllerClass, $method] = $action;
            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                if (method_exists($controller, $method)) {
                    return call_user_func_array([$controller, $method], $params);
                }
                throw new \BadMethodCallException("El método {$method} no existe en la clase {$controllerClass}");
            }
            throw new \RuntimeException("El controlador {$controllerClass} no fue encontrado.");
        }

        // 3. Caso String 'Controller@method'
        if (is_string($action) && strpos($action, '@') !== false) {
            [$controllerName, $method] = explode('@', $action, 2);
            $fullClass = strpos($controllerName, '\\') !== false ? $controllerName : "App\\Controllers\\{$controllerName}";

            if (class_exists($fullClass)) {
                $controller = new $fullClass();
                if (method_exists($controller, $method)) {
                    return call_user_func_array([$controller, $method], $params);
                }
                throw new \BadMethodCallException("El método {$method} no existe en {$fullClass}");
            }
            throw new \RuntimeException("El controlador {$fullClass} no fue encontrado.");
        }

        throw new \InvalidArgumentException("Acción de ruta inválida.");
    }

    /**
     * Normaliza la ruta asegurando un slash inicial y eliminando slashes redundantes.
     *
     * @param string $path
     * @return string
     */
    protected static function normalizePath(string $path): string
    {
        $trimmed = trim($path, '/');
        return $trimmed === '' ? '/' : '/' . $trimmed;
    }

    /**
     * Dispara el manejador de 404 o renderiza una respuesta por defecto.
     *
     * @param string $message
     * @return void
     */
    protected static function handleNotFound(string $message): void
    {
        http_response_code(404);

        if (self::$notFoundHandler !== null && is_callable(self::$notFoundHandler)) {
            call_user_func(self::$notFoundHandler, $message);
            return;
        }

        // Si se espera respuesta JSON
        $isJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
        if ($isJson) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 404, 'message' => $message]);
            return;
        }

        header('Content-Type: text/html; charset=utf-8');
        echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>404 Not Found</title>';
        echo '<style>body{font-family:sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}';
        echo '.card{background:#1e293b;padding:2rem 3rem;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.3);text-align:center;}';
        echo 'h1{font-size:3rem;margin:0 0 1rem;color:#ef4444;}p{color:#94a3b8;font-size:1.1rem;}</style></head>';
        echo '<body><div class="card"><h1>404</h1><p>' . htmlspecialchars($message) . '</p></div></body></html>';
    }

    /**
     * Obtiene todas las rutas registradas (útil para depuración o listado de rutas).
     *
     * @return array
     */
    public static function getRoutes(): array
    {
        return self::$routes;
    }
}
