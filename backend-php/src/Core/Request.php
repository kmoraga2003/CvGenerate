<?php

namespace App\Core;

/**
 * Abstracción de la petición HTTP (Request)
 * Encapsula $_SERVER, $_GET, $_POST y cuerpos JSON entrantes.
 */
class Request
{
    protected string $method;
    protected string $uri;
    protected array $queryParams;
    protected array $bodyParams;
    protected ?array $jsonParams = null;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->uri = $_SERVER['REQUEST_URI'] ?? '/';
        $this->queryParams = $_GET;
        $this->bodyParams = $_POST;
    }

    /**
     * Obtiene el método HTTP de la petición.
     */
    public function getMethod(): string
    {
        return $this->method;
    }

    /**
     * Obtiene la URI completa.
     */
    public function getUri(): string
    {
        return $this->uri;
    }

    /**
     * Obtiene el path limpio sin query string.
     */
    public function getPath(): string
    {
        $path = parse_url($this->uri, PHP_URL_PATH) ?? '/';
        $trimmed = trim($path, '/');
        return $trimmed === '' ? '/' : '/' . $trimmed;
    }

    /**
     * Comprueba si la petición envía un payload JSON en el body.
     */
    public function isJson(): bool
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        return stripos($contentType, 'application/json') !== false;
    }

    /**
     * Decodifica y obtiene el payload JSON del cuerpo de la petición.
     */
    public function getJson(): array
    {
        if ($this->jsonParams === null) {
            $rawInput = file_get_contents('php://input');
            $decoded = json_decode($rawInput, true);
            $this->jsonParams = is_array($decoded) ? $decoded : [];
        }
        return $this->jsonParams;
    }

    /**
     * Obtiene todos los parámetros unificados (POST/JSON + GET).
     */
    public function all(): array
    {
        $input = $this->isJson() ? $this->getJson() : $this->bodyParams;
        return array_merge($this->queryParams, $input);
    }

    /**
     * Obtiene un valor específico por clave con un valor por defecto.
     */
    public function input(string $key, $default = null)
    {
        $all = $this->all();
        return $all[$key] ?? $default;
    }
}
