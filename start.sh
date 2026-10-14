#!/bin/bash

# =====================================================================
# Script de inicio rápido para macOS - Generador de CV ATS
# =====================================================================

PORT=8000
HOST="127.0.0.1"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$DIR/backend-php/public"

echo "=========================================================="
echo "   🚀 Iniciando Generador de Currículums ATS (macOS)"
echo "=========================================================="

# 1. Verificar si PHP está instalado
if ! command -v php &> /dev/null; then
    echo "⚠️  PHP no fue encontrado en tu sistema."
    echo ""
    echo "En macOS puedes instalarlo fácilmente con Homebrew ejecutando:"
    echo "    brew install php"
    echo ""
    exit 1
fi

PHP_VER=$(php -r "echo PHP_VERSION;")
echo "✅ PHP detectado: versión $PHP_VER"
echo "📂 Carpeta pública: $PUBLIC_DIR"
echo "🌐 Servidor web iniciado en: http://$HOST:$PORT"
echo ""
echo "   👉 Editor y Formulario: http://$HOST:$PORT/cv/nuevo"
echo "   👉 Vista Previa ATS:    http://$HOST:$PORT/cv/preview"
echo "   👉 Dashboard:           http://$HOST:$PORT/"
echo ""
echo "Presiona Ctrl + C para detener el servidor."
echo "=========================================================="

# Iniciar servidor integrado de PHP
php -S "$HOST:$PORT" -t "$PUBLIC_DIR"
