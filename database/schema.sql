-- =====================================================================
-- Sistema Generador de Currículums ATS - Esquema de Base de Datos
-- Motor: MySQL (InnoDB) | Codificación: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `cv_generator_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `cv_generator_db`;

-- Desactivar temporalmente revisión de claves foráneas para recreación segura
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `education`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `experience_achievements`;
DROP TABLE IF EXISTS `experiences`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `skill_categories`;
DROP TABLE IF EXISTS `resumes`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. Tabla Principal: Resumes (Encabezado y Resumen Profesional)
-- ---------------------------------------------------------------------
CREATE TABLE `resumes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL COMMENT 'Etiqueta interna del CV (ej: Full Stack 2026)',
    
    -- Sección: Encabezado (Master ATS Template)
    `full_name` VARCHAR(150) NOT NULL COMMENT 'Nombre completo del candidato',
    `professional_title` VARCHAR(150) NOT NULL COMMENT 'Cargo o especialidad principal',
    `city` VARCHAR(100) NOT NULL COMMENT 'Ciudad de residencia',
    `country` VARCHAR(100) NOT NULL COMMENT 'País de residencia',
    `phone` VARCHAR(30) NOT NULL COMMENT 'Teléfono de contacto con código internacional',
    `email` VARCHAR(150) NOT NULL COMMENT 'Correo electrónico profesional',
    `linkedin_url` VARCHAR(255) DEFAULT NULL COMMENT 'Enlace directo al perfil de LinkedIn',
    `github_url` VARCHAR(255) DEFAULT NULL COMMENT 'Enlace directo al perfil de GitHub',
    `portfolio_url` VARCHAR(255) DEFAULT NULL COMMENT 'Enlace al portafolio web personal',
    
    -- Sección: Resumen Profesional (Master ATS Template)
    `summary` TEXT NOT NULL COMMENT 'Extracto profesional breve enfocado en impacto y palabras clave',
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Sección: Competencias Técnicas (Agrupadas por Categorías)
-- ---------------------------------------------------------------------
CREATE TABLE `skill_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cv_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL COMMENT 'Ej: Lenguajes de Programación, Bases de Datos, Cloud & DevOps',
    `sort_order` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_skill_categories_cv`
        FOREIGN KEY (`cv_id`) REFERENCES `resumes` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_skill_categories_cv` ON `skill_categories` (`cv_id`);

CREATE TABLE `skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL COMMENT 'Ej: PHP, Python, MySQL, Docker, FastAPI',
    `sort_order` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_skills_category`
        FOREIGN KEY (`category_id`) REFERENCES `skill_categories` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_skills_category` ON `skills` (`category_id`);

-- ---------------------------------------------------------------------
-- 3. Sección: Experiencia Profesional
-- ---------------------------------------------------------------------
CREATE TABLE `experiences` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cv_id` INT NOT NULL,
    `job_title` VARCHAR(150) NOT NULL COMMENT 'Cargo ejercido',
    `company` VARCHAR(150) NOT NULL COMMENT 'Nombre de la empresa u organización',
    `location` VARCHAR(100) DEFAULT NULL COMMENT 'Ubicación física o modalidad remota',
    `start_date` VARCHAR(30) NOT NULL COMMENT 'Fecha inicio (ej: Ene 2022 o 2022-01)',
    `end_date` VARCHAR(30) DEFAULT NULL COMMENT 'Fecha término o NULL si es actual',
    `is_current` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 si es empleo actual, 0 en caso contrario',
    `sort_order` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_experiences_cv`
        FOREIGN KEY (`cv_id`) REFERENCES `resumes` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_experiences_cv` ON `experiences` (`cv_id`);

-- Viñetas de logros con métricas cuantificables (formato ATS)
CREATE TABLE `experience_achievements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `experience_id` INT NOT NULL,
    `bullet_text` TEXT NOT NULL COMMENT 'Logro estructurado: Acción + Contexto + Métrica/Resultado',
    `sort_order` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_achievements_experience`
        FOREIGN KEY (`experience_id`) REFERENCES `experiences` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_achievements_experience` ON `experience_achievements` (`experience_id`);

-- ---------------------------------------------------------------------
-- 4. Sección: Proyectos Destacados
-- ---------------------------------------------------------------------
CREATE TABLE `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cv_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL COMMENT 'Nombre del proyecto',
    `technologies` VARCHAR(255) NOT NULL COMMENT 'Stack tecnológico (ej: Python, FastAPI, MySQL, Docker)',
    `description` TEXT NOT NULL COMMENT 'Descripción concisa de la solución y del desarrollo',
    `project_url` VARCHAR(255) DEFAULT NULL COMMENT 'Enlace al repositorio o demo en vivo',
    `sort_order` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_projects_cv`
        FOREIGN KEY (`cv_id`) REFERENCES `resumes` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_projects_cv` ON `projects` (`cv_id`);

-- ---------------------------------------------------------------------
-- 5. Sección: Educación
-- ---------------------------------------------------------------------
CREATE TABLE `education` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cv_id` INT NOT NULL,
    `degree` VARCHAR(150) NOT NULL COMMENT 'Título universitario o técnico',
    `institution` VARCHAR(150) NOT NULL COMMENT 'Nombre de la casa de estudios / universidad',
    `graduation_year` VARCHAR(30) NOT NULL COMMENT 'Año o rango de titulación (ej: 2020 - 2024)',
    `sort_order` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_education_cv`
        FOREIGN KEY (`cv_id`) REFERENCES `resumes` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_education_cv` ON `education` (`cv_id`);

-- =====================================================================
-- Datos de prueba iniciales (Semilla de ejemplo de CV ATS)
-- =====================================================================
INSERT INTO `resumes` (
    `id`, `title`, `full_name`, `professional_title`, `city`, `country`,
    `phone`, `email`, `linkedin_url`, `github_url`, `portfolio_url`, `summary`
) VALUES (
    1,
    'CV Senior Full-Stack Engineer',
    'Alejandro Silva Rivas',
    'Senior Full-Stack Developer & Software Architect',
    'Santiago',
    'Chile',
    '+56 9 1234 5678',
    'alejandro.silva@example.com',
    'https://linkedin.com/in/alejandrosilva',
    'https://github.com/alejandrosilva',
    'https://alejandrosilva.dev',
    'Ingeniero de Software con más de 7 años de experiencia diseñando arquitecturas escalables y APIs RESTful de alto rendimiento en PHP y Python. Especializado en optimización de bases de datos relacionales, microservicios y despliegues con Docker. Enfocado en código limpio, patrones de diseño y metodologías ágiles.'
);

-- Competencias Técnicas
INSERT INTO `skill_categories` (`id`, `cv_id`, `name`, `sort_order`) VALUES
(1, 1, 'Lenguajes de Programación', 1),
(2, 1, 'Frameworks & Librerías', 2),
(3, 1, 'Bases de Datos & Almacenamiento', 3),
(4, 1, 'DevOps, Cloud & Herramientas', 4);

INSERT INTO `skills` (`category_id`, `name`, `sort_order`) VALUES
(1, 'PHP 8.x, Python 3.11+, JavaScript (ES6+), SQL, Bash', 1),
(2, 'FastAPI, Laravel, Flask, React, Vanilla JS, python-docx', 2),
(3, 'MySQL, PostgreSQL, Redis, PDO, SQLAlchemy', 3),
(4, 'Docker, Git, CI/CD (GitHub Actions), Linux, Nginx, RESTful APIs', 4);

-- Experiencia Laboral
INSERT INTO `experiences` (`id`, `cv_id`, `job_title`, `company`, `location`, `start_date`, `end_date`, `is_current`, `sort_order`) VALUES
(1, 1, 'Tech Lead & Senior Software Engineer', 'CloudTech Solutions', 'Santiago, Chile (Híbrido)', 'Ene 2022', 'Presente', 1, 1),
(2, 1, 'Full-Stack Developer', 'Innova Software Labs', 'Santiago, Chile', 'Mar 2019', 'Dic 2021', 0, 2);

-- Logros en viñetas cuantificables (formato ATS)
INSERT INTO `experience_achievements` (`experience_id`, `bullet_text`, `sort_order`) VALUES
(1, 'Lideré la migración de un monolito legado hacia microservicios en Python y PHP, reduciendo la latencia de respuesta en un 38% para más de 500k usuarios activos mensuales.', 1),
(1, 'Diseñé e implementé un pipeline automatizado de procesamiento documental que incrementó el throughput en un 65% y redujo los errores de parsing a menos del 0.2%.', 2),
(1, 'Capacité y mentoreé a un equipo de 6 desarrolladores junior y mid-level en buenas prácticas de POO, arquitectura limpia y pruebas unitarias.', 3),
(2, 'Desarrollé más de 15 APIs RESTful con PHP y MySQL siguiendo el patrón MVC, manteniendo una tasa de disponibilidad del 99.9%.', 1),
(2, 'Optimicé índices y consultas complejas en MySQL reduciendo el tiempo de carga de reportes ejecutivos de 12 segundos a menos de 800 ms.', 2);

-- Proyectos Destacados
INSERT INTO `projects` (`cv_id`, `name`, `technologies`, `description`, `project_url`, `sort_order`) VALUES
(1, 'ATS Resume Engine', 'PHP 8, Python 3, FastAPI, python-docx, MySQL', 'Microservicio de alta fidelidad para generación automatizada de currículums en formato DOCX y PDF cumpliendo con la totalidad de normas de parseo de sistemas ATS.', 'https://github.com/alejandrosilva/ats-resume-engine', 1),
(1, 'E-Commerce Analytics Hub', 'Python, FastAPI, Redis, MySQL, Docker', 'Plataforma de métricas en tiempo real con ingesta de eventos distribuidos procesando más de 10,000 eventos por minuto.', 'https://github.com/alejandrosilva/ecommerce-analytics', 2);

-- Educación
INSERT INTO `education` (`cv_id`, `degree`, `institution`, `graduation_year`, `sort_order`) VALUES
(1, 'Ingeniería Civil en Informática', 'Universidad de Chile', '2014 - 2019', 1),
(1, 'Diplomado en Arquitectura de Software y Cloud Computing', 'Pontificia Universidad Católica de Chile', '2021', 2);
