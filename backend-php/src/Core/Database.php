<?php

namespace App\Core;

use PDO;
use PDOException;

/**
 * Gestor Singleton de conexión a Base de Datos mediante PDO.
 * Garantiza una única instancia de conexión durante el ciclo de vida de la petición.
 */
class Database
{
    private static ?PDO $instance = null;

    /**
     * Constructor privado para prevenir instanciación externa.
     */
    private function __construct() {}

    /**
     * Clonación privada para prevenir duplicación.
     */
    private function __clone() {}

    /**
     * Obtiene la instancia activa de PDO.
     *
     * @return PDO
     * @throws PDOException
     */
    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $configPath = dirname(__DIR__, 2) . '/config/database.php';

            if (!file_exists($configPath)) {
                throw new \RuntimeException("Archivo de configuración de base de datos no encontrado en: {$configPath}");
            }

            $config = require $configPath;

            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $config['host'],
                $config['port'],
                $config['database'],
                $config['charset']
            );

            try {
                self::$instance = new PDO(
                    $dsn,
                    $config['username'],
                    $config['password'],
                    $config['options']
                );
            } catch (PDOException $e) {
                // Registrar o propagar con mensaje limpio
                throw new PDOException("Error de conexión a la base de datos MySQL: " . $e->getMessage(), (int)$e->getCode());
            }
        }

        return self::$instance;
    }
}
